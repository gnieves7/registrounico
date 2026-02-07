-- Add treatment tracking fields to psychobiographies
ALTER TABLE public.psychobiographies
ADD COLUMN IF NOT EXISTS treatment_start_date date,
ADD COLUMN IF NOT EXISTS sessions_attended integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS sessions_absent integer DEFAULT 0;

-- Add download_code for document access
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS download_code text UNIQUE,
ADD COLUMN IF NOT EXISTS code_generated_at timestamp with time zone;

-- Add consent_accepted fields to test tables for psychodiagnostic consent
ALTER TABLE public.mbti_tests
ADD COLUMN IF NOT EXISTS consent_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_date timestamp with time zone;

ALTER TABLE public.mmpi2_tests
ADD COLUMN IF NOT EXISTS consent_accepted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_date timestamp with time zone;