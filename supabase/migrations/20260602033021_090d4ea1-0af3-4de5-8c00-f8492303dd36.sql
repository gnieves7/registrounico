
-- Add expiration / revalidation columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approval_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revalidation_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_revalidated_at timestamptz;

-- Update approve_professional to set expiration
CREATE OR REPLACE FUNCTION public.approve_professional(_user_id uuid, _reason text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _consent_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden aprobar profesionales';
  END IF;

  SELECT id INTO _consent_id
  FROM public.professional_consents
  WHERE user_id = _user_id
  ORDER BY accepted_at DESC
  LIMIT 1;

  IF _consent_id IS NULL THEN
    RAISE EXCEPTION 'El profesional no ha firmado el consentimiento informado';
  END IF;

  UPDATE public.profiles
  SET is_approved = true,
      approval_decision = 'approved',
      approval_reason = _reason,
      approval_decided_at = now(),
      approval_decided_by = auth.uid(),
      approval_expires_at = now() + interval '365 days',
      revalidation_required = false,
      last_revalidated_at = now(),
      account_type = 'professional'
  WHERE user_id = _user_id;

  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND role = 'patient'::app_role;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'professional'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.authorization_audit_log (professional_user_id, decided_by, decision, reason, consent_id)
  VALUES (_user_id, auth.uid(), 'approved', _reason, _consent_id);

  INSERT INTO public.app_notifications (
    recipient_user_id, notification_type, title, message, route, metadata
  ) VALUES (
    _user_id,
    'professional_status',
    'Tu cuenta profesional fue aprobada',
    'Tu autorización es válida por 12 meses. Recibirás un recordatorio antes del vencimiento.',
    '/dashboard',
    jsonb_build_object('decision','approved','reason',_reason,'consent_id',_consent_id,'expires_in_days',365)
  );
END;
$function$;

-- RPC: admin extends authorization 365 days
CREATE OR REPLACE FUNCTION public.revalidate_professional(_user_id uuid, _reason text DEFAULT NULL)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden revalidar autorizaciones';
  END IF;

  UPDATE public.profiles
  SET approval_expires_at = GREATEST(COALESCE(approval_expires_at, now()), now()) + interval '365 days',
      revalidation_required = false,
      last_revalidated_at = now(),
      is_approved = true,
      approval_decision = 'approved',
      approval_decided_at = now(),
      approval_decided_by = auth.uid()
  WHERE user_id = _user_id;

  -- Make sure professional role exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'professional'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.authorization_audit_log (professional_user_id, decided_by, decision, reason)
  VALUES (_user_id, auth.uid(), 'revalidated', _reason);

  INSERT INTO public.app_notifications (
    recipient_user_id, notification_type, title, message, route, metadata
  ) VALUES (
    _user_id,
    'professional_status',
    'Tu autorización fue revalidada',
    'Tu acceso profesional se renovó por otros 12 meses.',
    '/dashboard',
    jsonb_build_object('decision','revalidated','reason',_reason)
  );
END;
$function$;

-- RPC: admin (or cron) flags due-soon / expired authorizations
CREATE OR REPLACE FUNCTION public.expire_overdue_authorizations()
 RETURNS TABLE(warned int, revoked int)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _warned int := 0;
  _revoked int := 0;
  _row record;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden ejecutar verificación';
  END IF;

  -- Warn (30 days before expiry)
  FOR _row IN
    SELECT user_id FROM public.profiles
    WHERE account_type = 'professional'
      AND is_approved = true
      AND revalidation_required = false
      AND approval_expires_at IS NOT NULL
      AND approval_expires_at <= now() + interval '30 days'
      AND approval_expires_at > now()
  LOOP
    UPDATE public.profiles SET revalidation_required = true WHERE user_id = _row.user_id;
    INSERT INTO public.app_notifications (recipient_user_id, notification_type, title, message, route, metadata)
    VALUES (
      _row.user_id, 'professional_status',
      'Tu autorización vence pronto',
      'Tenés menos de 30 días para revalidar tu acceso profesional. Contactá al administrador.',
      '/dashboard',
      jsonb_build_object('decision','revalidation_required')
    );
    _warned := _warned + 1;
  END LOOP;

  -- Revoke expired
  FOR _row IN
    SELECT user_id FROM public.profiles
    WHERE account_type = 'professional'
      AND is_approved = true
      AND approval_expires_at IS NOT NULL
      AND approval_expires_at < now()
  LOOP
    UPDATE public.profiles
    SET is_approved = false,
        approval_decision = 'rejected',
        approval_reason = 'Autorización vencida automáticamente',
        approval_decided_at = now(),
        approval_decided_by = auth.uid(),
        revalidation_required = true
    WHERE user_id = _row.user_id;

    DELETE FROM public.user_roles WHERE user_id = _row.user_id AND role = 'professional'::app_role;

    INSERT INTO public.authorization_audit_log (professional_user_id, decided_by, decision, reason)
    VALUES (_row.user_id, auth.uid(), 'revoked', 'Autorización vencida automáticamente');

    INSERT INTO public.app_notifications (recipient_user_id, notification_type, title, message, route, metadata)
    VALUES (
      _row.user_id, 'professional_status',
      'Tu autorización profesional venció',
      'Para recuperar el acceso, solicitá una revalidación al administrador.',
      '/pending-approval',
      jsonb_build_object('decision','revoked','reason','expired')
    );
    _revoked := _revoked + 1;
  END LOOP;

  RETURN QUERY SELECT _warned, _revoked;
END;
$function$;
