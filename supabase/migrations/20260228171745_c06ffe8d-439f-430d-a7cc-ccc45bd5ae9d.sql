ALTER TABLE public.profiles ALTER COLUMN is_approved SET DEFAULT false;
UPDATE public.profiles SET is_approved = false WHERE is_approved IS NULL;