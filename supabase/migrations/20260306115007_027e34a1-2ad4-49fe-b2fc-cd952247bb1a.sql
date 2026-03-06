
CREATE TABLE public.notebook_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  content text NOT NULL DEFAULT '',
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notebook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notebook entries"
  ON public.notebook_entries FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Deny anonymous access to notebook_entries"
  ON public.notebook_entries FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_notebook_entries_updated_at
  BEFORE UPDATE ON public.notebook_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
