
-- Fix: Payment information should not be publicly accessible
-- Replace the broad public SELECT policy with a filtered one that excludes payment_info

DROP POLICY IF EXISTS "Profile content is publicly readable" ON public.professional_profile_content;

-- Public can read everything EXCEPT payment_info
CREATE POLICY "Public profile content readable except payment"
ON public.professional_profile_content FOR SELECT
USING (section_key != 'payment_info');

-- Only authenticated patients can read payment_info (they need it to pay)
CREATE POLICY "Authenticated users can view payment info"
ON public.professional_profile_content FOR SELECT
TO authenticated
USING (section_key = 'payment_info');
