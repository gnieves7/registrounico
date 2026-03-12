
-- Create MCMI-III tests table
CREATE TABLE public.mcmi3_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_questions_answered INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,
  consent_accepted BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  clinical_notes TEXT,
  clinical_interpretation TEXT,
  interpretation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SCL-90-R tests table
CREATE TABLE public.scl90r_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_questions_answered INTEGER DEFAULT 0,
  is_complete BOOLEAN DEFAULT false,
  consent_accepted BOOLEAN DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE,
  clinical_notes TEXT,
  clinical_interpretation TEXT,
  interpretation_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mcmi3_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scl90r_tests ENABLE ROW LEVEL SECURITY;

-- RLS policies for mcmi3_tests
CREATE POLICY "Users can view own mcmi3 tests" ON public.mcmi3_tests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mcmi3 tests" ON public.mcmi3_tests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mcmi3 tests" ON public.mcmi3_tests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all mcmi3 tests" ON public.mcmi3_tests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for scl90r_tests
CREATE POLICY "Users can view own scl90r tests" ON public.scl90r_tests
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scl90r tests" ON public.scl90r_tests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scl90r tests" ON public.scl90r_tests
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all scl90r tests" ON public.scl90r_tests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
