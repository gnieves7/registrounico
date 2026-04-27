-- 1) Revoke EXECUTE on internal helper function (no client usage)
REVOKE EXECUTE ON FUNCTION public.profile_safe_update(public.profiles, public.profiles) FROM PUBLIC, anon, authenticated;

-- 2) DELETE policies for owner on mcmi3_tests
CREATE POLICY "Users can delete own mcmi3 tests"
  ON public.mcmi3_tests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3) DELETE policies for owner on scl90r_tests (idempotent)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polrelid = 'public.scl90r_tests'::regclass
      AND polname = 'Users can delete own scl90r tests'
  ) THEN
    EXECUTE $p$
      CREATE POLICY "Users can delete own scl90r tests"
        ON public.scl90r_tests FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id)
    $p$;
  END IF;
END $$;

-- 4) Explicit admin-only policies for report_drafts (clarify intent; no patient access)
-- The existing "Admins can manage all report drafts" already covers all commands.
-- We add an explicit RESTRICTIVE policy to deny anonymous on every command (defense in depth).
DROP POLICY IF EXISTS "Deny anon on report_drafts" ON public.report_drafts;
CREATE POLICY "Deny anon on report_drafts"
  ON public.report_drafts AS RESTRICTIVE
  FOR ALL TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);