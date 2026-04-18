-- ============================================================
-- EXPEDIENTE JUDICIAL: Tabla principal + Adjuntos + Storage
-- Confidencialidad estricta: solo admin + profesionales aprobados.
-- ============================================================

-- 1) Tabla principal: expediente judicial
CREATE TABLE public.judicial_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL,                 -- profesional dueño del expediente
  
  -- Identificación de la causa
  case_title text NOT NULL,                    -- carátula
  cuij text,                                   -- Código Único de Identificación Judicial
  legajo_number text,                          -- Nº de legajo interno
  jurisdiction text NOT NULL DEFAULT 'penal',  -- 'civil' | 'penal' | 'familia' | 'laboral'
  court_name text,                             -- juzgado / tribunal
  court_division text,                         -- sala / secretaría
  case_status text NOT NULL DEFAULT 'activo',  -- 'activo' | 'archivado' | 'sentencia' | 'apelacion'
  
  -- Denuncia
  complainant_name text,
  complainant_dni text,
  complainant_relationship text,               -- relación con la víctima/imputado
  complaint_date date,
  complaint_place text,                        -- lugar / dependencia donde se realizó
  reported_facts text,                         -- hechos denunciados
  
  -- Representación legal
  defense_lawyer_name text,
  defense_lawyer_matricula text,
  defense_lawyer_phone text,
  defense_lawyer_email text,
  prosecutor_name text,                        -- fiscalía interviniente
  
  -- Cámara Gesell
  gesell_chamber_date date,
  gesell_chamber_notes text,
  
  -- Audiencias / sentencia
  next_hearing_date timestamptz,
  sentence_date date,
  sentence_summary text,
  
  -- Confidencialidad
  confidentiality_notice text DEFAULT 'Información estrictamente confidencial. Protegida por secreto profesional (Código de Ética FePRA, Ley 26.657, Ley 25.326 de Protección de Datos Personales). Su divulgación no autorizada constituye infracción ética y legal.',
  additional_notes text,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_judicial_cases_owner ON public.judicial_cases(owner_user_id);
CREATE INDEX idx_judicial_cases_status ON public.judicial_cases(case_status);

ALTER TABLE public.judicial_cases ENABLE ROW LEVEL SECURITY;

-- RLS: dueños y admin
CREATE POLICY "Owners manage own judicial cases"
  ON public.judicial_cases
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

CREATE POLICY "Admins manage all judicial cases"
  ON public.judicial_cases
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Bloqueo explícito a anónimos
CREATE POLICY "Deny anon judicial_cases"
  ON public.judicial_cases
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER update_judicial_cases_updated_at
  BEFORE UPDATE ON public.judicial_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2) Adjuntos: PDFs del expediente (informes, sentencia, fundamentos, gesell, etc.)
-- ============================================================
CREATE TABLE public.judicial_case_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.judicial_cases(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  attachment_type text NOT NULL,               -- 'informe_pericial' | 'gesell' | 'sentencia' | 'fundamentos' | 'denuncia' | 'otro'
  title text NOT NULL,
  description text,
  storage_path text NOT NULL,                  -- ruta en bucket expedientes-judiciales
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_judicial_attachments_case ON public.judicial_case_attachments(case_id);

ALTER TABLE public.judicial_case_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage own case attachments"
  ON public.judicial_case_attachments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.judicial_cases jc
      WHERE jc.id = judicial_case_attachments.case_id
        AND jc.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.judicial_cases jc
      WHERE jc.id = judicial_case_attachments.case_id
        AND jc.owner_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all case attachments"
  ON public.judicial_case_attachments
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anon judicial_case_attachments"
  ON public.judicial_case_attachments
  AS RESTRICTIVE
  FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 3) Bucket privado para expedientes judiciales
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('expedientes-judiciales', 'expedientes-judiciales', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: profesionales aprobados sólo a sus propios archivos (carpeta = case_id)
-- Path convention: {case_id}/{filename}
CREATE POLICY "Owners can read their case files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'expedientes-judiciales'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.judicial_cases jc
        WHERE jc.id::text = (storage.foldername(name))[1]
          AND jc.owner_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Owners can upload to their case folders"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'expedientes-judiciales'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.judicial_cases jc
        WHERE jc.id::text = (storage.foldername(name))[1]
          AND jc.owner_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Owners can update their case files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'expedientes-judiciales'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.judicial_cases jc
        WHERE jc.id::text = (storage.foldername(name))[1]
          AND jc.owner_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Owners can delete their case files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'expedientes-judiciales'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR EXISTS (
        SELECT 1 FROM public.judicial_cases jc
        WHERE jc.id::text = (storage.foldername(name))[1]
          AND jc.owner_user_id = auth.uid()
      )
    )
  );