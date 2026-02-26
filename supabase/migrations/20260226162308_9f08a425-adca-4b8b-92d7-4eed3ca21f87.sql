-- Fix 1: Make avatars bucket private again
UPDATE storage.buckets SET public = false WHERE id = 'avatars';

-- Ensure RLS policies exist for authenticated avatar access
-- Drop existing policies first to avoid conflicts
DO $$
BEGIN
  -- Drop if exists to be safe
  DROP POLICY IF EXISTS "Users can view own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Admins can view all avatars" ON storage.objects;
END $$;

CREATE POLICY "Users can view own avatar"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));

-- Fix 2: Create a secure view for patient document access (excludes download_code)
CREATE OR REPLACE VIEW public.documents_patient_view AS
SELECT id, patient_id, title, description, document_type, 
       file_url, price, is_paid, payment_date, payment_id,
       created_at, updated_at, code_generated_at
FROM public.documents;

-- Grant access to the view
GRANT SELECT ON public.documents_patient_view TO authenticated;
GRANT SELECT ON public.documents_patient_view TO anon;