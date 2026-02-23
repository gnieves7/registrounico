CREATE TABLE public.anxiety_abcde_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  situation TEXT,
  thought TEXT,
  emotion_conduct TEXT,
  debate TEXT,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.anxiety_abcde_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own anxiety records" ON public.anxiety_abcde_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own anxiety records" ON public.anxiety_abcde_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own anxiety records" ON public.anxiety_abcde_records
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own anxiety records" ON public.anxiety_abcde_records
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all anxiety records" ON public.anxiety_abcde_records
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );