-- 1) Autorizar e inmediatamente aprobar a Jimena
INSERT INTO public.authorized_emails (email, notes)
VALUES ('psico.jimenabenegas@gmail.com', 'Profesional autorizada por admin')
ON CONFLICT (email) DO NOTHING;

UPDATE public.profiles
SET is_approved = true
WHERE lower(email) = 'psico.jimenabenegas@gmail.com';

-- 2) Simplificar el flujo: si el email está en authorized_emails, el profesional queda aprobado al registrarse
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

-- 3) Aprobar retroactivamente a todos los profesionales cuyo email ya está en la allowlist
UPDATE public.profiles p
SET is_approved = true
WHERE p.is_approved = false
  AND p.account_type = 'professional'
  AND EXISTS (
    SELECT 1 FROM public.authorized_emails a
    WHERE lower(a.email) = lower(p.email)
  );