-- Revocar EXECUTE de funciones SECURITY DEFINER que no deben ser invocadas por usuarios.
-- Las funciones de tipo trigger se ejecutan automáticamente por el motor, no necesitan EXECUTE público.
-- suspend_inactive_professionals corre vía cron/admin, no debe exponerse.

REVOKE EXECUTE ON FUNCTION public.protect_dream_interpretation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_symbolic_award_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_micro_task_notification() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_profile_approval_decision() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_profile_column_restrictions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.suspend_inactive_professionals() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profile_safe_update(public.profiles, public.profiles) FROM PUBLIC, anon, authenticated;