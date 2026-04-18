
-- Tabla de recursos profesionales (Centro de Recursos / Biblioteca Clínico-Forense)
CREATE TABLE public.professional_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL CHECK (section IN ('protocols','gender_violence','psychological_damage','sexual_abuse','report_models')),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf','link','template')),
  url TEXT,
  storage_path TEXT,
  author TEXT,
  source TEXT,
  role_tag TEXT NOT NULL DEFAULT 'both' CHECK (role_tag IN ('clinical','forensic','both','institutional')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_resources ENABLE ROW LEVEL SECURITY;

-- Acceso: admin + cualquier profile con is_approved = true
CREATE POLICY "Approved professionals and admins can read resources"
ON public.professional_resources
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_approved = true)
);

CREATE POLICY "Admins manage resources"
ON public.professional_resources
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anonymous resources access"
ON public.professional_resources
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);

CREATE TRIGGER trg_professional_resources_updated_at
BEFORE UPDATE ON public.professional_resources
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Métricas de descarga
CREATE TABLE public.resource_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES public.professional_resources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own downloads"
ON public.resource_downloads FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own downloads"
ON public.resource_downloads FOR SELECT TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anonymous downloads access"
ON public.resource_downloads
AS RESTRICTIVE FOR SELECT TO public
USING (auth.uid() IS NOT NULL);

-- Bucket privado para PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('recursos-profesionales', 'recursos-profesionales', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: leer si admin o profesional aprobado
CREATE POLICY "Approved pros can read recursos-profesionales"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'recursos-profesionales'
  AND (
    has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_approved = true)
  )
);

CREATE POLICY "Admins write recursos-profesionales"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'recursos-profesionales' AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'recursos-profesionales' AND has_role(auth.uid(), 'admin'::app_role));
