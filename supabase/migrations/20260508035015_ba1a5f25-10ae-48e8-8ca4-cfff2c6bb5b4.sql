
-- Reemplazar para que use auth.email() en vez de aceptar emails arbitrarios
DROP FUNCTION IF EXISTS public.is_email_authorized(TEXT);

CREATE OR REPLACE FUNCTION public.is_current_email_authorized()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    public.has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.authorized_emails
      WHERE lower(email) = lower(coalesce(auth.email(), ''))
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_current_email_authorized() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_current_email_authorized() TO authenticated;
