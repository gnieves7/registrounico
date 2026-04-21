-- 1. Suggestions table
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  category text NOT NULL DEFAULT 'mejora',
  status text NOT NULL DEFAULT 'nueva',
  admin_response text,
  responded_at timestamp with time zone,
  responded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny anon suggestions" ON public.suggestions AS RESTRICTIVE FOR ALL TO public
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users manage own suggestions" ON public.suggestions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage all suggestions" ON public.suggestions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER suggestions_updated_at BEFORE UPDATE ON public.suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Extend professional_consents
ALTER TABLE public.professional_consents
  ADD COLUMN IF NOT EXISTS document_text text,
  ADD COLUMN IF NOT EXISTS inactivity_clause_accepted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS auth_method text;

-- 3. Inactivity tracking
ALTER TABLE public.professional_subscriptions
  ADD COLUMN IF NOT EXISTS last_activity_at timestamp with time zone NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.mark_professional_active()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.professional_subscriptions
  SET last_activity_at = now()
  WHERE user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.suspend_inactive_professionals()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  affected integer;
BEGIN
  UPDATE public.professional_subscriptions
  SET status = 'suspended', updated_at = now()
  WHERE status IN ('trial', 'active')
    AND last_activity_at < (now() - interval '90 days');
  GET DIAGNOSTICS affected = ROW_COUNT;
  RETURN affected;
END;
$$;