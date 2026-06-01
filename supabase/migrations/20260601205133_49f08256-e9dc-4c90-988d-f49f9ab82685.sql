
-- approve_professional
CREATE OR REPLACE FUNCTION public.approve_professional(_user_id uuid, _reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _consent_id uuid;
  _full_name text;
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

  SELECT full_name INTO _full_name FROM public.profiles WHERE user_id = _user_id;

  UPDATE public.profiles
  SET is_approved = true,
      approval_decision = 'approved',
      approval_reason = _reason,
      approval_decided_at = now(),
      approval_decided_by = auth.uid(),
      account_type = 'professional'
  WHERE user_id = _user_id;

  -- Remove patient default role and assign professional
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
    'Ya podés acceder al panel profesional y comenzar a operar en la plataforma.',
    '/dashboard',
    jsonb_build_object('decision','approved','reason',_reason,'consent_id',_consent_id)
  );
END;
$$;

-- reject_professional
CREATE OR REPLACE FUNCTION public.reject_professional(_user_id uuid, _reason text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _consent_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden rechazar profesionales';
  END IF;

  SELECT id INTO _consent_id
  FROM public.professional_consents
  WHERE user_id = _user_id
  ORDER BY accepted_at DESC
  LIMIT 1;

  UPDATE public.profiles
  SET is_approved = false,
      approval_decision = 'rejected',
      approval_reason = _reason,
      approval_decided_at = now(),
      approval_decided_by = auth.uid()
  WHERE user_id = _user_id;

  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND role = 'professional'::app_role;

  INSERT INTO public.authorization_audit_log (professional_user_id, decided_by, decision, reason, consent_id)
  VALUES (_user_id, auth.uid(), 'rejected', _reason, _consent_id);

  INSERT INTO public.app_notifications (
    recipient_user_id, notification_type, title, message, route, metadata
  ) VALUES (
    _user_id,
    'professional_status',
    'Solicitud de acceso profesional no aprobada',
    COALESCE('Motivo: ' || _reason, 'Tu solicitud fue revisada y no fue aprobada. Contactá al administrador para más información.'),
    '/pending-approval',
    jsonb_build_object('decision','rejected','reason',_reason)
  );
END;
$$;

-- revoke_professional
CREATE OR REPLACE FUNCTION public.revoke_professional(_user_id uuid, _reason text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Solo administradores pueden revocar acceso';
  END IF;

  IF _reason IS NULL OR length(trim(_reason)) = 0 THEN
    RAISE EXCEPTION 'Debe indicarse un motivo para revocar el acceso';
  END IF;

  UPDATE public.profiles
  SET is_approved = false,
      approval_decision = 'rejected',
      approval_reason = _reason,
      approval_decided_at = now(),
      approval_decided_by = auth.uid()
  WHERE user_id = _user_id;

  DELETE FROM public.user_roles
   WHERE user_id = _user_id AND role = 'professional'::app_role;

  INSERT INTO public.authorization_audit_log (professional_user_id, decided_by, decision, reason)
  VALUES (_user_id, auth.uid(), 'revoked', _reason);

  INSERT INTO public.app_notifications (
    recipient_user_id, notification_type, title, message, route, metadata
  ) VALUES (
    _user_id,
    'professional_status',
    'Tu acceso profesional fue revocado',
    'Motivo: ' || _reason,
    '/pending-approval',
    jsonb_build_object('decision','revoked','reason',_reason)
  );
END;
$$;

-- get_my_authorization_status (used in PendingApproval)
CREATE OR REPLACE FUNCTION public.get_my_authorization_status()
RETURNS TABLE(decision text, reason text, decided_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT decision, reason, created_at AS decided_at
  FROM public.authorization_audit_log
  WHERE professional_user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Backfill: every already-approved professional gets the new role
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'professional'::app_role
FROM public.profiles
WHERE account_type = 'professional' AND is_approved = true
ON CONFLICT (user_id, role) DO NOTHING;

-- And remove the default patient role for them (only if a professional role exists)
DELETE FROM public.user_roles ur
WHERE ur.role = 'patient'::app_role
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur2
    WHERE ur2.user_id = ur.user_id AND ur2.role = 'professional'::app_role
  );
