-- Fix the security definer view issue - use SECURITY INVOKER so RLS applies to the querying user
CREATE OR REPLACE VIEW public.documents_patient_view
WITH (security_invoker = true) AS
SELECT id, patient_id, title, description, document_type, 
       file_url, price, is_paid, payment_date, payment_id,
       created_at, updated_at, code_generated_at
FROM public.documents;