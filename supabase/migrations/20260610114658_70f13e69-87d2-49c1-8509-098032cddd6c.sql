CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _preauth boolean;
BEGIN
    SELECT EXISTS (
      SELECT 1 FROM public.authorized_emails
      WHERE lower(email) = lower(NEW.email)
    ) INTO _preauth;

    INSERT INTO public.profiles (user_id, email, full_name, avatar_url, account_type, is_approved)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url',
        'professional',
        COALESCE(_preauth, false)
    );

    INSERT INTO public.professional_subscriptions (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$function$;