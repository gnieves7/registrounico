-- 1) Reescribir policy tautológica en sessions (UPDATE)
DROP POLICY IF EXISTS "Patients cannot directly update sessions" ON public.sessions;
CREATE POLICY "Only admins can update sessions directly"
  ON public.sessions
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) informes_pdf: permitir al sujeto y al generador leer SUS metadatos
CREATE POLICY "Subject can view own informes_pdf"
  ON public.informes_pdf
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = generated_by);

-- 3) narrative_analyses: permitir al paciente leer SUS análisis
CREATE POLICY "Patients can view their own narrative analyses"
  ON public.narrative_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

-- 4) storage forensic-documents: agregar UPDATE owner-scoped
CREATE POLICY "Users can update their own forensic documents"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'forensic-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'forensic-documents'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 5) Revocar EXECUTE a anon en SECURITY DEFINER que requieren sesión.
--    Mantener EXECUTE a authenticated (lo necesitan para operar).
--    handle_new_user es trigger interno → revocar a ambos (auth interna lo invoca).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.consume_pdf_code(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.issue_pdf_code(text, text, text, uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.patient_update_session(uuid, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.mark_professional_active() FROM anon;
REVOKE EXECUTE ON FUNCTION public.suspend_inactive_professionals() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profile_safe_update(public.profiles, public.profiles) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_dream_interpretation() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_symbolic_award_notification() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_micro_task_notification() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_profile_approval_decision() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_column_restrictions() FROM anon, authenticated;