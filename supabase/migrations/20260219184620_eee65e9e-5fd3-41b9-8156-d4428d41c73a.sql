-- Make avatars bucket private
UPDATE storage.buckets SET public = false WHERE id = 'avatars';

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

-- Allow users to view their own avatar
CREATE POLICY "Users can view own avatar"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all avatars
CREATE POLICY "Admins can view all avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars' AND public.has_role(auth.uid(), 'admin'));