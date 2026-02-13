
-- Table for editable text content sections (bio, expertise, affiliations)
CREATE TABLE public.professional_profile_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_profile_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view profile content"
ON public.professional_profile_content FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update profile content"
ON public.professional_profile_content FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert profile content"
ON public.professional_profile_content FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial content
INSERT INTO public.professional_profile_content (section_key, content) VALUES
('biography', '{"paragraphs": ["<strong class=\"text-foreground\">Licenciado en Psicología</strong> egresado de la Universidad Católica de Santa Fe y <strong class=\"text-foreground\">Especialista en Psicología Forense</strong> por la Universidad Nacional de Rosario.", "Su práctica profesional se centra en la evaluación psicológica forense con sentido crítico y perspectiva evolutiva, aplicando técnicas especializadas de psicodiagnóstico en contextos judiciales civiles, penales y de familia.", "Cuenta con formación complementaria en criminología, pericias judiciales y protocolos especializados para la evaluación de víctimas de abuso sexual y violencia de género."]}'),
('expertise', '{"items": ["Pericias Psicológicas Forenses", "Evaluación en Cámara Gesell", "Psicodiagnóstico Rorschach", "Evaluación de Competencias Parentales", "Análisis de Daño Psíquico", "Asesoría Técnica a Abogados"]}'),
('affiliations', '{"items": ["Colegio de Psicólogos de Santa Fe", "APFRA - Asociación de Psicólogos Forenses de la República Argentina", "ALPJF - Asociación Latinoamericana de Psicología Jurídica y Forense"]}');
