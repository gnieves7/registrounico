
-- =============================================
-- MODULE 1: Case Formulation Maps
-- =============================================
CREATE TABLE public.case_formulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  title TEXT DEFAULT 'Formulación de Caso',
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_formulations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all case formulations" ON public.case_formulations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to case_formulations" ON public.case_formulations AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own formulations" ON public.case_formulations FOR SELECT USING (auth.uid() = patient_id);

CREATE TRIGGER update_case_formulations_updated_at BEFORE UPDATE ON public.case_formulations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MODULE 2: EMA (Ecological Momentary Assessment)
-- =============================================
CREATE TABLE public.ema_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  access_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id)
);

ALTER TABLE public.ema_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all EMA configs" ON public.ema_configs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to ema_configs" ON public.ema_configs AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own EMA config" ON public.ema_configs FOR SELECT USING (auth.uid() = patient_id);

CREATE TABLE public.ema_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  emotion TEXT NOT NULL,
  note TEXT,
  responded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ema_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all EMA responses" ON public.ema_responses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to ema_responses" ON public.ema_responses AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own EMA responses" ON public.ema_responses FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own EMA responses" ON public.ema_responses FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE TRIGGER update_ema_configs_updated_at BEFORE UPDATE ON public.ema_configs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- MODULE 3: Narrative Pattern Analyses
-- =============================================
CREATE TABLE public.narrative_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  session_date DATE,
  distortions JSONB NOT NULL DEFAULT '[]'::jsonb,
  language_ratio JSONB NOT NULL DEFAULT '{}'::jsonb,
  themes JSONB NOT NULL DEFAULT '[]'::jsonb,
  emotional_vocabulary JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT,
  source_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.narrative_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all narrative analyses" ON public.narrative_analyses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to narrative_analyses" ON public.narrative_analyses AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);

-- =============================================
-- MODULE 4: Symptom Networks
-- =============================================
CREATE TABLE public.symptom_networks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  bridge_symptom TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id)
);

ALTER TABLE public.symptom_networks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all symptom networks" ON public.symptom_networks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to symptom_networks" ON public.symptom_networks AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own symptom network" ON public.symptom_networks FOR SELECT USING (auth.uid() = patient_id);

CREATE TRIGGER update_symptom_networks_updated_at BEFORE UPDATE ON public.symptom_networks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
