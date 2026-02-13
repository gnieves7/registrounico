
-- Add consultation_reason and referred_by to psychobiographies
ALTER TABLE public.psychobiographies
ADD COLUMN IF NOT EXISTS consultation_reason text,
ADD COLUMN IF NOT EXISTS referred_by text;
