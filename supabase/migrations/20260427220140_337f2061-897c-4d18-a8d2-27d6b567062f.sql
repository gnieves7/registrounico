-- Defense-in-depth: RESTRICTIVE policies that block role mutations unless admin
DROP POLICY IF EXISTS "Restrict role mutations to admins" ON public.user_roles;
CREATE POLICY "Restrict role mutations to admins"
  ON public.user_roles AS RESTRICTIVE
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- But authenticated users still need to SELECT their own row (for has_role evaluation
-- via the SECURITY DEFINER function — the function itself bypasses RLS, but client-side
-- self-read uses the existing permissive "Users can view their own roles" policy).
-- The RESTRICTIVE above blocks SELECT for non-admins; we must scope it to write commands only.
DROP POLICY IF EXISTS "Restrict role mutations to admins" ON public.user_roles;

CREATE POLICY "Restrict role inserts to admins"
  ON public.user_roles AS RESTRICTIVE
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict role updates to admins"
  ON public.user_roles AS RESTRICTIVE
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Restrict role deletes to admins"
  ON public.user_roles AS RESTRICTIVE
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));