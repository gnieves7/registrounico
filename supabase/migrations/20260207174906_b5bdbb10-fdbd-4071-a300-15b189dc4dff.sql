-- ==========================================
-- REGISTRO PSICODIAGNÓSTICO - SECCIÓN CLÍNICA
-- ==========================================

-- Tabla para resultados del test MBTI
CREATE TABLE public.mbti_tests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Resultados por dimensión
    extraversion_score INTEGER DEFAULT 0,
    introversion_score INTEGER DEFAULT 0,
    sensing_score INTEGER DEFAULT 0,
    intuition_score INTEGER DEFAULT 0,
    thinking_score INTEGER DEFAULT 0,
    feeling_score INTEGER DEFAULT 0,
    judging_score INTEGER DEFAULT 0,
    perceiving_score INTEGER DEFAULT 0,
    -- Tipo de personalidad resultante (ej: INTJ, ENFP)
    personality_type VARCHAR(4),
    is_complete BOOLEAN DEFAULT FALSE,
    clinical_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para resultados del MMPI-2 (567 items)
CREATE TABLE public.mmpi2_tests (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Respuestas: array de objetos {question_number, answer: 'V' o 'F'}
    responses JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_questions_answered INTEGER DEFAULT 0,
    is_complete BOOLEAN DEFAULT FALSE,
    -- Notas clínicas solo para el profesional
    clinical_notes TEXT,
    clinical_interpretation TEXT,
    interpretation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- REGISTRO PSICODIAGNÓSTICO - SECCIÓN FORENSE
-- ==========================================

-- Tabla para casos forenses (información altamente sensible)
CREATE TABLE public.forensic_cases (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    -- Datos del expediente
    case_number VARCHAR(100),
    court_name TEXT,
    -- Actores intervinientes
    intervening_actors JSONB DEFAULT '[]'::jsonb,
    -- Abogado defensor
    defense_lawyer_name TEXT,
    defense_lawyer_phone TEXT,
    defense_lawyer_email TEXT,
    -- Fechas importantes
    hearing_date TIMESTAMP WITH TIME ZONE,
    next_hearing_date TIMESTAMP WITH TIME ZONE,
    -- Hecho denunciado
    reported_fact TEXT,
    complaint_date DATE,
    complainant_name TEXT,
    complainant_relationship TEXT,
    -- Información adicional relevante
    additional_info TEXT,
    case_status VARCHAR(50) DEFAULT 'activo',
    -- Control de confidencialidad
    confidentiality_notice TEXT DEFAULT 'Este registro contiene información confidencial protegida por el secreto profesional según el Código de Ética del Psicólogo. Su divulgación no autorizada está prohibida por ley.',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla para documentos del legajo judicial
CREATE TABLE public.forensic_documents (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES public.forensic_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    document_name TEXT NOT NULL,
    document_type VARCHAR(50),
    file_url TEXT,
    description TEXT,
    upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ==========================================
-- HABILITAR ROW LEVEL SECURITY
-- ==========================================

ALTER TABLE public.mbti_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mmpi2_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forensic_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forensic_documents ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLÍTICAS RLS - MBTI TESTS
-- ==========================================

CREATE POLICY "Users can manage their own MBTI tests"
ON public.mbti_tests
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all MBTI tests"
ON public.mbti_tests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update MBTI tests"
ON public.mbti_tests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ==========================================
-- POLÍTICAS RLS - MMPI-2 TESTS
-- ==========================================

CREATE POLICY "Users can manage their own MMPI-2 tests"
ON public.mmpi2_tests
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all MMPI-2 tests"
ON public.mmpi2_tests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update MMPI-2 tests"
ON public.mmpi2_tests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ==========================================
-- POLÍTICAS RLS - CASOS FORENSES (MÁS RESTRICTIVAS)
-- ==========================================

CREATE POLICY "Users can manage their own forensic cases"
ON public.forensic_cases
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all forensic cases"
ON public.forensic_cases
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update forensic cases"
ON public.forensic_cases
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ==========================================
-- POLÍTICAS RLS - DOCUMENTOS FORENSES
-- ==========================================

CREATE POLICY "Users can manage their own forensic documents"
ON public.forensic_documents
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all forensic documents"
ON public.forensic_documents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- ==========================================
-- TRIGGERS PARA UPDATED_AT
-- ==========================================

CREATE TRIGGER update_mbti_tests_updated_at
BEFORE UPDATE ON public.mbti_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mmpi2_tests_updated_at
BEFORE UPDATE ON public.mmpi2_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forensic_cases_updated_at
BEFORE UPDATE ON public.forensic_cases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- BUCKET DE ALMACENAMIENTO PARA DOCUMENTOS FORENSES
-- ==========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('forensic-documents', 'forensic-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para documentos forenses (privados)
CREATE POLICY "Users can view their own forensic documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'forensic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own forensic documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'forensic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own forensic documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'forensic-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all forensic documents in storage"
ON storage.objects
FOR SELECT
USING (bucket_id = 'forensic-documents' AND has_role(auth.uid(), 'admin'::app_role));