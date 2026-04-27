-- Revocar de PUBLIC (que es de donde anon hereda)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.consume_pdf_code(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.issue_pdf_code(text, text, text, uuid, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.patient_update_session(uuid, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.mark_professional_active() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.suspend_inactive_professionals() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.profile_safe_update(public.profiles, public.profiles) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.protect_dream_interpretation() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_symbolic_award_notification() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.create_micro_task_notification() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.log_profile_approval_decision() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_column_restrictions() FROM PUBLIC;

-- Otorgar EXECUTE solo a authenticated en las que SÍ se invocan desde el cliente
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_pdf_code(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.issue_pdf_code(text, text, text, uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.patient_update_session(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_professional_active() TO authenticated;
GRANT EXECUTE ON FUNCTION public.profile_safe_update(public.profiles, public.profiles) TO authenticated;