
REVOKE ALL ON FUNCTION public.approve_professional(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.reject_professional(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.revoke_professional(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_my_authorization_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.approve_professional(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_professional(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_professional(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_authorization_status() TO authenticated;
