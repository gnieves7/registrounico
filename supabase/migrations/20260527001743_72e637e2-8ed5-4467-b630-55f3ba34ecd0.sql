-- Add explicit RESTRICTIVE non-admin denial policies on sensitive admin-only tables
-- authorized_emails: access control list — only admins should ever read/write
CREATE POLICY "Only admins access authorized_emails"
ON public.authorized_emails
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- telegram_bot_state: internal bot state — only admins
CREATE POLICY "Only admins access telegram_bot_state"
ON public.telegram_bot_state
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));