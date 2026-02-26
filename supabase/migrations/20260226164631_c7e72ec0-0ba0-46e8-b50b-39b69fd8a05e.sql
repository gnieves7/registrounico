
-- Deny anonymous access to all sensitive patient data tables

CREATE POLICY "Deny anonymous access to profiles"
  ON public.profiles AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to psychobiographies"
  ON public.psychobiographies AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to forensic_cases"
  ON public.forensic_cases AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to mmpi2_tests"
  ON public.mmpi2_tests AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to sessions"
  ON public.sessions AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to documents"
  ON public.documents AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to laura_conversations"
  ON public.laura_conversations AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to dream_records"
  ON public.dream_records AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to anxiety_abcde_records"
  ON public.anxiety_abcde_records AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to emotional_records"
  ON public.emotional_records AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to mbti_tests"
  ON public.mbti_tests AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Deny anonymous access to forensic_documents"
  ON public.forensic_documents AS RESTRICTIVE FOR SELECT
  USING (auth.uid() IS NOT NULL);
