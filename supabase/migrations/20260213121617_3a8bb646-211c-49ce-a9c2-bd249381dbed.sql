
-- Table for professional profile data (education & services)
CREATE TABLE public.professional_profile_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('education', 'service')),
  title TEXT NOT NULL,
  subtitle TEXT,
  institution TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  icon_name TEXT,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_profile_items ENABLE ROW LEVEL SECURITY;

-- Everyone authenticated can read
CREATE POLICY "Authenticated users can view profile items"
ON public.professional_profile_items FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert profile items"
ON public.professional_profile_items FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update profile items"
ON public.professional_profile_items FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete profile items"
ON public.professional_profile_items FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Seed initial education data
INSERT INTO public.professional_profile_items (item_type, title, institution, subtitle, sort_order) VALUES
('education', 'Licenciado en Psicología', 'Universidad Católica de Santa Fe', 'Título de Grado', 1),
('education', 'Especialista en Psicología Forense', 'Universidad Nacional de Rosario', 'Posgrado', 2),
('education', 'Diplomatura en Psicodiagnóstico Rorschach', 'Universidad Católica de Santa Fe', 'Formación Especializada', 3),
('education', 'Diplomado en Pericias Judiciales', 'Centro de Capacitación del Poder Judicial de Santa Fe', 'Certificación Oficial', 4),
('education', 'Diplomatura en Criminología', 'Asociación Argentina de Salud Mental', 'Formación Complementaria', 5),
('education', 'Diplomatura en Violencia de Género', 'Intervención interdisciplinaria en el sistema penal', 'Especialización', 6);

-- Seed initial services data
INSERT INTO public.professional_profile_items (item_type, title, subtitle, icon_name, description, features, is_popular, sort_order) VALUES
('service', 'Pericias Psicológicas', 'Civil & Penal', 'Scale', 'Elaboración de informes psicológicos forenses para procesos judiciales en ámbitos civil (capacidad, cuidado personal) y penal (imputabilidad, credibilidad testimonial).', '["Evaluación integral con técnicas validadas", "Informe técnico detallado con argumentos, teorías y normativas", "Ratificación en audiencia judicial"]', true, 1),
('service', 'Cámara Gesell', 'Especializado', 'Users', 'Participación como perito psicológico en entrevistas a menores y adultos en casos de violencia de género, abuso sexual y delitos contra la integridad personal.', '["Protocolos especializados validados", "Análisis psicolingüístico del relato", "Informe pericial completo y fundamentado"]', false, 2),
('service', 'Psicodiagnóstico', 'Clínico & Forense', 'BookOpen', 'Evaluaciones psicológicas integrales utilizando técnicas proyectivas (Rorschach, TAT), psicométricas (MMPI-2, MMCI III) y entrevistas estructuradas.', '["Técnicas proyectivas especializadas", "Evaluación psicométrica estandarizada", "Diagnóstico diferencial fundamentado"]', false, 3),
('service', 'Daño Psíquico', 'Evaluación', 'HeartPulse', 'Análisis exhaustivo de secuelas psicológicas por accidentes, delitos o situaciones traumáticas para procesos indemnizatorios y de reparación.', '["Evaluación multiaxial completa", "Diagnóstico con perfil de personalidad", "Informe completo para juicio"]', false, 4),
('service', 'Competencias Parentales', 'Familia', 'Users', 'Valoración de competencias parentales en procesos de familia, adopción, tutelas y regímenes de visita para determinar capacidades de cuidado.', '["Evaluación integral de capacidades", "Observación directa de interacciones", "Recomendaciones específicas fundamentadas"]', false, 5),
('service', 'Asesoría Técnica', 'Abogados', 'Briefcase', 'Acompañamiento profesional para la construcción de estrategias, análisis de pruebas periciales y asesoramiento en procesos judiciales.', '["Análisis crítico de pericias", "Elaboración de estrategias procesales", "Asesoramiento en audiencias"]', false, 6);
