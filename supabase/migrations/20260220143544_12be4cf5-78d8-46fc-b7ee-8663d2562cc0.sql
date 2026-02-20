
-- Secure documents table: explicit policies for non-admin users

-- Patients cannot update documents (prevents payment bypass)
CREATE POLICY "Patients cannot update documents"
ON public.documents
FOR UPDATE
TO authenticated
USING (
  NOT has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = patient_id
  AND false
);

-- Only admins can insert documents
CREATE POLICY "Only admins can insert documents"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete documents
CREATE POLICY "Only admins can delete documents"
ON public.documents
FOR DELETE
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);
