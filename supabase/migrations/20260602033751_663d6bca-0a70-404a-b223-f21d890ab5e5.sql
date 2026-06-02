-- 1) audit_logs INSERT: scope to authenticated + restrictive deny non-admins
DROP POLICY IF EXISTS "Only admins can insert audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Deny non-admin audit inserts" ON public.audit_logs;
CREATE POLICY "Deny non-admin audit inserts"
ON public.audit_logs
AS RESTRICTIVE
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) realtime.messages: exact prefix match (user_id followed by ':')
DROP POLICY IF EXISTS "Users subscribe to own topics" ON realtime.messages;
CREATE POLICY "Users subscribe to own topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE (auth.uid()::text || ':%')
  OR realtime.topic() LIKE ('%:' || auth.uid()::text)
  OR realtime.topic() LIKE ('%:' || auth.uid()::text || ':%')
);

-- 3) Revoke EXECUTE from anon/public on admin-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.revalidate_professional(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.expire_overdue_authorizations() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.revalidate_professional(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.expire_overdue_authorizations() TO authenticated;