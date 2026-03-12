DROP POLICY "Patients can insert their own alliance ratings" ON public.alliance_ratings;
CREATE POLICY "Patients can insert their own alliance ratings"
  ON public.alliance_ratings FOR INSERT
  WITH CHECK (
    auth.uid() = patient_id
    AND rater_type = 'patient'
  );