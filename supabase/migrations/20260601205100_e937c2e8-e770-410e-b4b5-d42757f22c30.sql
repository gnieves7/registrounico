
-- 1. Add 'professional' value to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'professional';

-- 2. Audit log table
CREATE TABLE IF NOT EXISTS public.authorization_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_user_id uuid NOT NULL,
  decided_by uuid,
  decision text NOT NULL CHECK (decision IN ('approved','rejected','revoked')),
  reason text,
  consent_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.authorization_audit_log TO authenticated;
GRANT ALL ON public.authorization_audit_log TO service_role;

ALTER TABLE public.authorization_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage authorization audit log"
ON public.authorization_audit_log FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Professionals can view their own audit entries"
ON public.authorization_audit_log FOR SELECT TO authenticated
USING (auth.uid() = professional_user_id);

CREATE POLICY "Deny anon authorization_audit_log"
ON public.authorization_audit_log AS RESTRICTIVE FOR ALL TO public
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_auth_audit_pro ON public.authorization_audit_log(professional_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created ON public.authorization_audit_log(created_at DESC);
