-- Deny public/anonymous access to user_roles
CREATE POLICY "Deny anonymous access to user_roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Deny public/anonymous access to audit_logs
CREATE POLICY "Deny anonymous access to audit_logs"
  ON public.audit_logs
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
