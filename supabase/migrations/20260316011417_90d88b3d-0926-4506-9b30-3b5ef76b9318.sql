drop view if exists public.documents_patient_view;

create view public.documents_patient_view
with (security_invoker = true)
as
select
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
from public.documents as d;