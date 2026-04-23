-- 1. Asegurar función helper para registrar consumo PDF (lo usan las edge functions vía service_role)
-- 2. Mejorar RLS de suggestion_comments para visibilidad estricta autor/admin

-- Recrear políticas de suggestion_comments con criterios estrictos
DROP POLICY IF EXISTS "Authors view own thread comments" ON public.suggestion_comments;
DROP POLICY IF EXISTS "Authors insert own thread comments" ON public.suggestion_comments;

-- El profesional ve solo comentarios de sus propios tickets
CREATE POLICY "Authors view own thread comments"
  ON public.suggestion_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.suggestions s
      WHERE s.id = suggestion_comments.suggestion_id
        AND s.user_id = auth.uid()
    )
  );

-- El profesional inserta comentarios solo en sus propios tickets, marcados como "professional"
CREATE POLICY "Authors insert own thread comments"
  ON public.suggestion_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND author_role = 'professional'
    AND EXISTS (
      SELECT 1 FROM public.suggestions s
      WHERE s.id = suggestion_comments.suggestion_id
        AND s.user_id = auth.uid()
    )
  );

-- 3. Función para consumir códigos PDF de forma atómica (evita race conditions)
CREATE OR REPLACE FUNCTION public.consume_pdf_code(_code text, _ip text DEFAULT NULL)
RETURNS TABLE (
  storage_bucket text,
  storage_path text,
  resource_type text,
  status text,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec public.secure_pdf_codes;
BEGIN
  SELECT * INTO rec FROM public.secure_pdf_codes
  WHERE code = _code
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::text, NULL::text, NULL::text, 'not_found'::text, 'Código inválido. Verifica los 6 dígitos.'::text;
    RETURN;
  END IF;

  IF rec.consumed_at IS NOT NULL THEN
    RETURN QUERY SELECT NULL::text, NULL::text, NULL::text, 'consumed'::text, 'Este código ya fue utilizado. Solicita uno nuevo.'::text;
    RETURN;
  END IF;

  IF rec.expires_at < now() THEN
    RETURN QUERY SELECT NULL::text, NULL::text, NULL::text, 'expired'::text, 'El código ha expirado. Solicita uno nuevo al profesional.'::text;
    RETURN;
  END IF;

  UPDATE public.secure_pdf_codes
  SET consumed_at = now(), consumed_ip = _ip
  WHERE id = rec.id;

  -- Registrar consumo en activity_log
  INSERT INTO public.activity_log (user_id, event_type, event_detail)
  VALUES (
    rec.issued_by,
    'pdf_code_consumed',
    jsonb_build_object(
      'code_id', rec.id,
      'resource_type', rec.resource_type,
      'storage_path', rec.storage_path,
      'consumed_ip', _ip
    )
  );

  RETURN QUERY SELECT rec.storage_bucket, rec.storage_path, rec.resource_type, 'ok'::text, 'Código válido'::text;
END;
$$;

-- 4. Función para emitir códigos PDF (la usan profesionales/admin desde edge function)
CREATE OR REPLACE FUNCTION public.issue_pdf_code(
  _resource_type text,
  _storage_bucket text,
  _storage_path text,
  _patient_id uuid DEFAULT NULL,
  _hours_valid int DEFAULT 24
)
RETURNS TABLE (code text, expires_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code text;
  new_expires timestamptz;
BEGIN
  -- Solo profesionales aprobados o admins
  IF NOT (
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND p.account_type = 'professional'
        AND p.is_approved = true
    )
  ) THEN
    RAISE EXCEPTION 'No autorizado para emitir códigos';
  END IF;

  -- Generar código único de 6 dígitos
  LOOP
    new_code := lpad((floor(random() * 1000000))::int::text, 6, '0');
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.secure_pdf_codes
      WHERE code = new_code AND consumed_at IS NULL AND expires_at > now()
    );
  END LOOP;

  new_expires := now() + (_hours_valid || ' hours')::interval;

  INSERT INTO public.secure_pdf_codes (
    code, resource_type, storage_bucket, storage_path,
    patient_id, issued_by, expires_at
  ) VALUES (
    new_code, _resource_type, _storage_bucket, _storage_path,
    _patient_id, auth.uid(), new_expires
  );

  -- Registrar emisión
  INSERT INTO public.activity_log (user_id, event_type, event_detail)
  VALUES (
    auth.uid(),
    'pdf_code_issued',
    jsonb_build_object(
      'resource_type', _resource_type,
      'storage_path', _storage_path,
      'expires_at', new_expires,
      'patient_id', _patient_id
    )
  );

  RETURN QUERY SELECT new_code, new_expires;
END;
$$;

-- 5. Asegurar que el admin existente tenga account_type='professional' y is_approved=true
UPDATE public.profiles
SET account_type = 'professional', is_approved = true, consent_accepted_at = COALESCE(consent_accepted_at, now())
WHERE email = 'ghnieves14@gmail.com';