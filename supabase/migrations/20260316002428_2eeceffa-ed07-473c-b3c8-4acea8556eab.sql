-- Fix audit_logs exposure by removing permissive grant-like policy and recreating it as restrictive
DROP POLICY IF EXISTS "Deny anonymous access to audit_logs" ON public.audit_logs;

CREATE POLICY "Deny anonymous access to audit_logs"
ON public.audit_logs
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Recreate documents_patient_view with the same column order and security_invoker enabled
DROP VIEW IF EXISTS public.documents_patient_view;

CREATE VIEW public.documents_patient_view
WITH (security_invoker = true)
AS
SELECT
  d.code_generated_at,
  d.created_at,
  d.description,
  d.document_type,
  d.file_url,
  d.id,
  d.is_paid,
  d.patient_id,
  d.payment_date,
  d.payment_id,
  d.price,
  d.title,
  d.updated_at
FROM public.documents d;