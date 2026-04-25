ALTER TABLE public.suggestions
  ADD COLUMN IF NOT EXISTS section_key text,
  ADD COLUMN IF NOT EXISTS section_label text;

CREATE INDEX IF NOT EXISTS idx_suggestions_category_section
  ON public.suggestions (category, section_key);