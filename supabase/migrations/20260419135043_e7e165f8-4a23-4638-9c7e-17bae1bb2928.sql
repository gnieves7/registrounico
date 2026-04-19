-- 1. Add professional fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'patient',
  ADD COLUMN IF NOT EXISTS dni text,
  ADD COLUMN IF NOT EXISTS license_number text,
  ADD COLUMN IF NOT EXISTS license_college text,
  ADD COLUMN IF NOT EXISTS license_jurisdiction text,
  ADD COLUMN IF NOT EXISTS consent_accepted_at timestamptz,
  ADD COLUMN IF NOT EXISTS consent_signature_name text;

-- 2. professional_subscriptions
CREATE TABLE IF NOT EXISTS public.professional_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  trial_started_at timestamptz NOT NULL DEFAULT now(),
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '3 months'),
  plan text,
  status text NOT NULL DEFAULT 'trial',
  paid_until timestamptz,
  last_payment_id text,
  last_payment_at timestamptz,
  amount_usd numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscription"
  ON public.professional_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own subscription"
  ON public.professional_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all subscriptions"
  ON public.professional_subscriptions FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anon prof_subs"
  ON public.professional_subscriptions AS RESTRICTIVE FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE TRIGGER trg_prof_subs_updated
  BEFORE UPDATE ON public.professional_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. professional_consents
CREATE TABLE IF NOT EXISTS public.professional_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  dni text NOT NULL,
  license_number text NOT NULL,
  license_college text NOT NULL,
  signature_typed text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  pdf_storage_path text,
  document_version text NOT NULL DEFAULT '1.0',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own consent"
  ON public.professional_consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own consent"
  ON public.professional_consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all consents"
  ON public.professional_consents FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Deny anon prof_consents"
  ON public.professional_consents AS RESTRICTIVE FOR ALL
  TO public
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('consentimientos-profesionales', 'consentimientos-profesionales', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users upload own consent pdf"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'consentimientos-profesionales'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users read own consent pdf"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'consentimientos-profesionales'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

CREATE POLICY "Admins manage consent pdf"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'consentimientos-profesionales'
    AND has_role(auth.uid(), 'admin'::app_role)
  )
  WITH CHECK (
    bucket_id = 'consentimientos-profesionales'
    AND has_role(auth.uid(), 'admin'::app_role)
  );

-- 5. Update handle_new_user to also create subscription row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );

    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');

    INSERT INTO public.psychobiographies (user_id)
    VALUES (NEW.id);

    INSERT INTO public.professional_subscriptions (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$function$;