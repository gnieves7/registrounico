-- Drop the existing constraint
ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_document_type_check;

-- Add new constraint with Spanish values
ALTER TABLE public.documents ADD CONSTRAINT documents_document_type_check 
CHECK (document_type = ANY (ARRAY['constancia', 'informe', 'certificado', 'resumen', 'otro']));