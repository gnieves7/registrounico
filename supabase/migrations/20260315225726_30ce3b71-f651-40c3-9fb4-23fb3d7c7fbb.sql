-- Create table for symbolic therapeutic awards granted by administrators
CREATE TABLE public.symbolic_awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  granted_by UUID NOT NULL,
  category_key TEXT NOT NULL,
  award_key TEXT NOT NULL,
  award_title TEXT NOT NULL,
  award_description TEXT,
  therapeutic_objective TEXT,
  clinical_note TEXT,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_symbolic_awards_patient_id ON public.symbolic_awards(patient_id);
CREATE INDEX idx_symbolic_awards_awarded_at ON public.symbolic_awards(awarded_at DESC);
CREATE INDEX idx_symbolic_awards_patient_awarded_at ON public.symbolic_awards(patient_id, awarded_at DESC);

ALTER TABLE public.symbolic_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all symbolic awards"
ON public.symbolic_awards
FOR ALL
TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can view their own symbolic awards"
ON public.symbolic_awards
FOR SELECT
TO public
USING (auth.uid() = patient_id);

CREATE POLICY "Deny anonymous access to symbolic_awards"
ON public.symbolic_awards
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_symbolic_awards_updated_at
BEFORE UPDATE ON public.symbolic_awards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();