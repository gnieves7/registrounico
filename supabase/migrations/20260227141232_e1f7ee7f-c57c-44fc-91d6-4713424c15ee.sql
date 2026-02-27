
-- =====================================================
-- GRANT ABSOLUTE ADMIN CONTROL ON ALL PATIENT TABLES
-- =====================================================

-- 1. anxiety_abcde_records: Add admin ALL policy
CREATE POLICY "Admins can manage all anxiety records"
  ON public.anxiety_abcde_records FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. emotional_records: Add admin ALL policy
CREATE POLICY "Admins can manage all emotional records"
  ON public.emotional_records FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. psychobiographies: Add admin UPDATE and DELETE
CREATE POLICY "Admins can update all psychobiographies"
  ON public.psychobiographies FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete psychobiographies"
  ON public.psychobiographies FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. dream_records: Add admin INSERT and DELETE
CREATE POLICY "Admins can insert dream records"
  ON public.dream_records FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete dream records"
  ON public.dream_records FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. laura_conversations: Add admin ALL policy
CREATE POLICY "Admins can manage all conversations"
  ON public.laura_conversations FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. forensic_documents: Add admin ALL policy
CREATE POLICY "Admins can manage all forensic documents"
  ON public.forensic_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 7. forensic_cases: Add admin INSERT and DELETE
CREATE POLICY "Admins can insert forensic cases"
  ON public.forensic_cases FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete forensic cases"
  ON public.forensic_cases FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. mmpi2_tests: Add admin INSERT and DELETE
CREATE POLICY "Admins can insert MMPI-2 tests"
  ON public.mmpi2_tests FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete MMPI-2 tests"
  ON public.mmpi2_tests FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 9. mbti_tests: Add admin INSERT and DELETE
CREATE POLICY "Admins can insert MBTI tests"
  ON public.mbti_tests FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete MBTI tests"
  ON public.mbti_tests FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 10. profiles: Add admin DELETE capability
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 11. documents: Add admin UPDATE override (replace restrictive one)
DROP POLICY IF EXISTS "Patients cannot update documents" ON public.documents;
CREATE POLICY "Only admins can update documents"
  ON public.documents FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 12. sessions: ensure admin has full ALL including DELETE
-- Already has "Admins can manage all sessions" ALL policy

-- 13. user_roles: Allow admin to manage roles (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can insert user roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update user roles"
  ON public.user_roles FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete user roles"
  ON public.user_roles FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 14. audit_logs: Allow admin to manage (UPDATE, DELETE for maintenance)
CREATE POLICY "Admins can update audit logs"
  ON public.audit_logs FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete audit logs"
  ON public.audit_logs FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role / admin to insert audit logs
DROP POLICY IF EXISTS "No user inserts on audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
