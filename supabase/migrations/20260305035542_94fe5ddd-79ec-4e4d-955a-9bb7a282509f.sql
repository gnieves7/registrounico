
-- MODULE 5: Therapeutic Alliance Index
CREATE TABLE public.alliance_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid NOT NULL,
  rater_type text NOT NULL CHECK (rater_type IN ('therapist', 'patient')),
  goal_agreement integer NOT NULL CHECK (goal_agreement BETWEEN 1 AND 7),
  task_agreement integer NOT NULL CHECK (task_agreement BETWEEN 1 AND 7),
  bond_quality integer NOT NULL CHECK (bond_quality BETWEEN 1 AND 7),
  access_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.alliance_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all alliance ratings" ON public.alliance_ratings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to alliance_ratings" ON public.alliance_ratings AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own alliance ratings" ON public.alliance_ratings FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own alliance ratings" ON public.alliance_ratings FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- MODULE 6: Patient Life Timeline
CREATE TABLE public.life_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  event_date date NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('trauma', 'milestone', 'relationship', 'loss', 'resource')),
  valence text NOT NULL DEFAULT 'mixed' CHECK (valence IN ('positive', 'negative', 'mixed')),
  description text NOT NULL,
  patient_annotation text,
  created_by text NOT NULL DEFAULT 'therapist' CHECK (created_by IN ('therapist', 'patient')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.life_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all life events" ON public.life_events FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to life_events" ON public.life_events AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own life events" ON public.life_events FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can update annotations on their events" ON public.life_events FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own life events" ON public.life_events FOR INSERT WITH CHECK (auth.uid() = patient_id AND created_by = 'patient');

-- MODULE 7: Between-Session Micro-Tasks
CREATE TABLE public.micro_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  category text NOT NULL CHECK (category IN ('behavioral_activation', 'thought_records', 'mindfulness', 'exposure', 'gratitude')),
  title text NOT NULL,
  instructions text,
  due_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  response text,
  completed_at timestamptz,
  access_token text DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.micro_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all micro tasks" ON public.micro_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to micro_tasks" ON public.micro_tasks AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own micro tasks" ON public.micro_tasks FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can update their own micro tasks" ON public.micro_tasks FOR UPDATE USING (auth.uid() = patient_id);

-- MODULE 8: Outcome Monitoring Dashboard
CREATE TABLE public.outcome_measures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  scale_type text NOT NULL CHECK (scale_type IN ('PHQ-9', 'GAD-7', 'ORS', 'SRS')),
  responses jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_score integer NOT NULL DEFAULT 0,
  session_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outcome_measures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all outcome measures" ON public.outcome_measures FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Deny anonymous access to outcome_measures" ON public.outcome_measures AS RESTRICTIVE FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Patients can view their own outcome measures" ON public.outcome_measures FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients can insert their own outcome measures" ON public.outcome_measures FOR INSERT WITH CHECK (auth.uid() = patient_id);
