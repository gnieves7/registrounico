
-- 1) Migrar pacientes existentes a profesional pendiente de aprobación
UPDATE public.profiles
SET account_type = 'professional',
    is_approved = false,
    updated_at = now()
WHERE account_type = 'patient';

-- 2) Tabla de allowlist de emails autorizados
CREATE TABLE IF NOT EXISTS public.authorized_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  notes TEXT,
  authorized_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_authorized_emails_email_lower
  ON public.authorized_emails (lower(email));

ALTER TABLE public.authorized_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage authorized emails" ON public.authorized_emails;
CREATE POLICY "Admins manage authorized emails"
  ON public.authorized_emails
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Función para que cualquier usuario autenticado verifique SU PROPIO email
CREATE OR REPLACE FUNCTION public.is_email_authorized(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.authorized_emails
    WHERE lower(email) = lower(_email)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_email_authorized(TEXT) TO authenticated, anon;

-- 4) Pre-autorizar al administrador y a todos los profesionales/pacientes ya migrados
INSERT INTO public.authorized_emails (email, notes)
SELECT DISTINCT lower(email), 'Migración inicial — usuario existente'
FROM public.profiles
WHERE email IS NOT NULL
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.authorized_emails (email, notes)
VALUES ('ghnieves14@gmail.com', 'Administrador del sistema')
ON CONFLICT (email) DO NOTHING;
