DROP POLICY IF EXISTS "Deny anonymous access to notebook_entries" ON public.notebook_entries;
CREATE POLICY "Deny anonymous access to notebook_entries"
  ON public.notebook_entries
  AS RESTRICTIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Deny anonymous access to user_roles" ON public.user_roles;
CREATE POLICY "Deny anonymous access to user_roles"
  ON public.user_roles
  AS RESTRICTIVE
  FOR SELECT
  TO public
  USING (auth.uid() IS NOT NULL);