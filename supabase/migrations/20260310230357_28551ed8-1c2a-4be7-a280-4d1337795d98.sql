ALTER TABLE public.notebook_entries ADD COLUMN shared_with_therapist boolean NOT NULL DEFAULT false;

CREATE POLICY "Admins can view shared notebook entries"
ON public.notebook_entries
FOR SELECT
TO authenticated
USING (
  shared_with_therapist = true AND has_role(auth.uid(), 'admin'::app_role)
);