-- Tabla de configuración global (clave/valor)
CREATE TABLE IF NOT EXISTS public.app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier usuario autenticado
DROP POLICY IF EXISTS "Authenticated can read app_settings" ON public.app_settings;
CREATE POLICY "Authenticated can read app_settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Escritura: solo admins
DROP POLICY IF EXISTS "Admins manage app_settings" ON public.app_settings;
CREATE POLICY "Admins manage app_settings"
ON public.app_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Bloquear acceso anónimo
DROP POLICY IF EXISTS "Deny anon app_settings" ON public.app_settings;
CREATE POLICY "Deny anon app_settings"
ON public.app_settings
AS RESTRICTIVE
FOR ALL
TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Semilla: tipo de cambio USD→ARS
INSERT INTO public.app_settings (key, value)
VALUES ('usd_to_ars_rate', '1200')
ON CONFLICT (key) DO NOTHING;

-- Asegurar rol admin + profesional aprobado de Santa Fe para ghnieves14@gmail.com
DO $$
DECLARE
  _uid uuid;
BEGIN
  SELECT user_id INTO _uid FROM public.profiles WHERE email = 'ghnieves14@gmail.com' LIMIT 1;
  IF _uid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_uid, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;

    ALTER TABLE public.profiles DISABLE TRIGGER profiles_enforce_column_restrictions;
    UPDATE public.profiles
    SET account_type = 'professional',
        is_approved = true,
        license_jurisdiction = COALESCE(NULLIF(license_jurisdiction, ''), 'Santa Fe'),
        consent_accepted_at = COALESCE(consent_accepted_at, now()),
        consent_signature_name = COALESCE(consent_signature_name, full_name, 'Germán Nieves')
    WHERE user_id = _uid;
    ALTER TABLE public.profiles ENABLE TRIGGER profiles_enforce_column_restrictions;
  END IF;
END $$;