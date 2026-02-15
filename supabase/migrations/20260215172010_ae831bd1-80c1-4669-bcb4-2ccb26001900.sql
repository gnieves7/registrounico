
-- Table to store professional activity stats (editable by admin)
CREATE TABLE public.professional_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value INTEGER NOT NULL DEFAULT 0,
  stat_label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.professional_stats ENABLE ROW LEVEL SECURITY;

-- Everyone can read stats (public landing page)
CREATE POLICY "Stats are publicly readable"
ON public.professional_stats
FOR SELECT
USING (true);

-- Only admins can modify stats
CREATE POLICY "Admins can insert stats"
ON public.professional_stats
FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update stats"
ON public.professional_stats
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete stats"
ON public.professional_stats
FOR DELETE
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_professional_stats_updated_at
BEFORE UPDATE ON public.professional_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.professional_stats (stat_key, stat_value, stat_label, sort_order) VALUES
  ('camara_gesell', 51, 'Cámara Gesell', 1),
  ('pericias', 73, 'Pericias Psicológicas', 2),
  ('informes', 485, 'Informes Técnicos Psicológicos', 3),
  ('psicodiagnosticos', 370, 'Psicodiagnósticos', 4);
