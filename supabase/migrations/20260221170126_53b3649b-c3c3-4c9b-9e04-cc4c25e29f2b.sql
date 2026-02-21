DROP POLICY IF EXISTS "Authenticated users can view payment info" ON public.professional_profile_content;

CREATE POLICY "Only admins can view payment info"
ON public.professional_profile_content FOR SELECT
USING (section_key = 'payment_info' AND has_role(auth.uid(), 'admin'::app_role));