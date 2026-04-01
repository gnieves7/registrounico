
-- Check if tables exist, if not create them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'activity_log') THEN
    CREATE TABLE public.activity_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      event_type TEXT NOT NULL,
      event_detail JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'informes_pdf') THEN
    CREATE TABLE public.informes_pdf (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      test_type TEXT NOT NULL,
      test_record_id UUID,
      storage_path TEXT,
      generated_by UUID NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    ALTER TABLE public.informes_pdf ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage all activity logs" ON public.activity_log;
DROP POLICY IF EXISTS "Deny anonymous access to activity_log" ON public.activity_log;
DROP POLICY IF EXISTS "Users can view their own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Users can insert their own activity" ON public.activity_log;
DROP POLICY IF EXISTS "Admins can manage all informes_pdf" ON public.informes_pdf;
DROP POLICY IF EXISTS "Deny anonymous access to informes_pdf" ON public.informes_pdf;

-- Activity log policies
CREATE POLICY "Admins can manage all activity logs" ON public.activity_log FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anon activity_log" ON public.activity_log AS RESTRICTIVE FOR SELECT TO public USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Informes PDF policies
CREATE POLICY "Admins can manage all informes_pdf" ON public.informes_pdf FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anon informes_pdf" ON public.informes_pdf AS RESTRICTIVE FOR SELECT TO public USING (auth.uid() IS NOT NULL);

-- Enable realtime for activity_log
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;
