
-- Fix: Make professional_profile_content and professional_profile_items publicly readable
-- These tables feed the public landing page alongside professional_stats

-- Drop the existing authenticated-only SELECT policies
DROP POLICY IF EXISTS "Authenticated users can view profile content" ON public.professional_profile_content;
DROP POLICY IF EXISTS "Authenticated users can view profile items" ON public.professional_profile_items;

-- Create public SELECT policies (matching professional_stats pattern)
CREATE POLICY "Profile content is publicly readable"
ON public.professional_profile_content
FOR SELECT
USING (true);

CREATE POLICY "Profile items are publicly readable"
ON public.professional_profile_items
FOR SELECT
USING (true);
