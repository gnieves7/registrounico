-- 1. Suggestions: nuevos estados + tabla de comentarios bidireccionales
ALTER TABLE public.suggestions
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS decision_reason text;

CREATE TABLE IF NOT EXISTS public.suggestion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid NOT NULL REFERENCES public.suggestions(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  author_role text NOT NULL CHECK (author_role IN ('professional','admin')),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sc_suggestion ON public.suggestion_comments(suggestion_id, created_at);
ALTER TABLE public.suggestion_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon sc" ON public.suggestion_comments AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage all comments" ON public.suggestion_comments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Authors view own thread comments" ON public.suggestion_comments FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id AND s.user_id = auth.uid()));
CREATE POLICY "Authors insert own thread comments" ON public.suggestion_comments FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND author_role = 'professional'
    AND EXISTS (SELECT 1 FROM public.suggestions s WHERE s.id = suggestion_id AND s.user_id = auth.uid())
  );

-- 2. Consentimiento profesional: campos de firma adicionales
ALTER TABLE public.professional_consents
  ADD COLUMN IF NOT EXISTS signature_hash text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS review_decision text CHECK (review_decision IN ('approved','rejected') OR review_decision IS NULL),
  ADD COLUMN IF NOT EXISTS review_reason text;

-- 3. Profile: motivo de aprobación / rechazo registrado por admin
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS approval_decision text CHECK (approval_decision IN ('approved','rejected') OR approval_decision IS NULL),
  ADD COLUMN IF NOT EXISTS approval_reason text,
  ADD COLUMN IF NOT EXISTS approval_decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS approval_decided_by uuid;

-- 4. Códigos numéricos de un solo uso para descarga de PDFs clínicos
CREATE TABLE IF NOT EXISTS public.secure_pdf_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  resource_type text NOT NULL,
  storage_bucket text NOT NULL,
  storage_path text NOT NULL,
  patient_id uuid,
  issued_by uuid NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  consumed_at timestamptz,
  consumed_ip text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_spc_code ON public.secure_pdf_codes(code) WHERE consumed_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_spc_issuer ON public.secure_pdf_codes(issued_by, created_at DESC);
ALTER TABLE public.secure_pdf_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon spc" ON public.secure_pdf_codes AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins manage codes" ON public.secure_pdf_codes FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Issuer view own codes" ON public.secure_pdf_codes FOR SELECT TO authenticated
  USING (issued_by = auth.uid());
CREATE POLICY "Issuer insert codes" ON public.secure_pdf_codes FOR INSERT TO authenticated
  WITH CHECK (issued_by = auth.uid());

-- 5. Trigger: registrar decisión de admin sobre profesionales en activity_log
CREATE OR REPLACE FUNCTION public.log_profile_approval_decision()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved
     OR NEW.approval_decision IS DISTINCT FROM OLD.approval_decision THEN
    INSERT INTO public.activity_log (user_id, event_type, event_detail)
    VALUES (
      NEW.user_id,
      CASE WHEN NEW.is_approved THEN 'professional_approved' ELSE 'professional_rejected' END,
      jsonb_build_object(
        'reason', NEW.approval_reason,
        'decided_by', auth.uid(),
        'decision', NEW.approval_decision
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profile_approval_decision ON public.profiles;
CREATE TRIGGER trg_profile_approval_decision
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.log_profile_approval_decision();