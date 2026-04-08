
CREATE TABLE public.report_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'clinical',
  current_step INTEGER NOT NULL DEFAULT 1,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  cuij TEXT,
  court_name TEXT,
  court_division TEXT,
  case_caption TEXT,
  report_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_report_type CHECK (report_type IN ('clinical', 'forensic', 'corporate')),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'completed', 'generated'))
);

ALTER TABLE public.report_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all report drafts"
ON public.report_drafts
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anonymous access to report_drafts"
ON public.report_drafts
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_report_drafts_updated_at
BEFORE UPDATE ON public.report_drafts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
