-- Create table for dream records (Registro del Inconsciente)
CREATE TABLE public.dream_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dream_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title TEXT,
  dream_content TEXT NOT NULL,
  dream_emojis JSONB DEFAULT '[]'::jsonb,
  interpretation TEXT,
  interpretation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dream_records ENABLE ROW LEVEL SECURITY;

-- Patients can manage their own dream records
CREATE POLICY "Users can manage their own dream records"
ON public.dream_records
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can view all dream records
CREATE POLICY "Admins can view all dream records"
ON public.dream_records
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update interpretations
CREATE POLICY "Admins can update dream records"
ON public.dream_records
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_dream_records_updated_at
BEFORE UPDATE ON public.dream_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();