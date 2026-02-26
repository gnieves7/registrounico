
-- 1. Create a secure function for patient session updates
-- This restricts patients to only updating patient_notes and patient_questions
CREATE OR REPLACE FUNCTION public.patient_update_session(
  _session_id uuid,
  _patient_notes text DEFAULT NULL,
  _patient_questions text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.sessions
  SET
    patient_notes = COALESCE(_patient_notes, patient_notes),
    patient_questions = COALESCE(_patient_questions, patient_questions),
    updated_at = now()
  WHERE id = _session_id
    AND patient_id = auth.uid()
    AND is_editable_by_patient = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Session not found or not editable';
  END IF;
END;
$$;

-- 2. Drop the overly permissive patient update policy on sessions
DROP POLICY IF EXISTS "Patients can update editable sessions" ON public.sessions;

-- 3. Create a restrictive policy that blocks direct patient updates
-- Patients must use the patient_update_session function instead
CREATE POLICY "Patients cannot directly update sessions"
  ON public.sessions AS RESTRICTIVE FOR UPDATE
  USING (
    -- Only admins can do direct UPDATE; patients must use the function
    has_role(auth.uid(), 'admin'::app_role)
    OR auth.uid() != auth.uid() -- always false for non-admin, forcing function usage
  );

-- 4. Fix dream_records: replace ALL policy with granular ones
DROP POLICY IF EXISTS "Users can manage their own dream records" ON public.dream_records;

-- Allow patients to INSERT their own dream records
CREATE POLICY "Users can insert own dream records"
  ON public.dream_records AS RESTRICTIVE FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow patients to SELECT their own dream records
CREATE POLICY "Users can view own dream records"
  ON public.dream_records AS RESTRICTIVE FOR SELECT
  USING (auth.uid() = user_id);

-- Allow patients to UPDATE their own dream records BUT NOT the interpretation fields
-- We use a trigger to enforce field-level protection
CREATE POLICY "Users can update own dream records"
  ON public.dream_records AS RESTRICTIVE FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow patients to DELETE their own dream records
CREATE POLICY "Users can delete own dream records"
  ON public.dream_records AS RESTRICTIVE FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Create trigger to protect interpretation fields from patient modification
CREATE OR REPLACE FUNCTION public.protect_dream_interpretation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is not admin, prevent modification of interpretation fields
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    NEW.interpretation := OLD.interpretation;
    NEW.interpretation_date := OLD.interpretation_date;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_dream_interpretation_trigger
  BEFORE UPDATE ON public.dream_records
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_dream_interpretation();
