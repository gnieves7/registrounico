-- 1) Promover ghnieves14@gmail.com como Admin Master profesional
UPDATE public.profiles
SET account_type='professional',
    is_approved=true,
    license_jurisdiction='Santa Fe',
    license_college=COALESCE(NULLIF(license_college,''),'Colegio de Psicólogos de Santa Fe'),
    license_number=COALESCE(NULLIF(license_number,''),'1889'),
    dni=COALESCE(NULLIF(dni,''),'00000000'),
    full_name=COALESCE(NULLIF(full_name,''),'Germán H. Nieves'),
    consent_accepted_at=COALESCE(consent_accepted_at, now()),
    consent_signature_name=COALESCE(consent_signature_name,'Germán H. Nieves'),
    approval_decision='approved',
    approval_reason='Administrador Master',
    approval_decided_at=now()
WHERE email='ghnieves14@gmail.com';

-- Garantizar suscripción "perpetua" para el admin (no caduca)
INSERT INTO public.professional_subscriptions (user_id, status, plan, paid_until, trial_started_at, trial_ends_at)
SELECT user_id, 'active', 'admin_master', now() + interval '100 years', now(), now() + interval '100 years'
FROM public.profiles WHERE email='ghnieves14@gmail.com'
ON CONFLICT (user_id) DO UPDATE
  SET status='active', plan='admin_master', paid_until=now() + interval '100 years';

-- Garantizar rol admin para el user_id correcto del perfil
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role FROM public.profiles WHERE email='ghnieves14@gmail.com'
ON CONFLICT DO NOTHING;

-- 2) Limpiar registros profesionales previos que no sean el admin
-- (mantener perfiles tipo 'patient' y el admin master)
DELETE FROM public.professional_consents
WHERE user_id IN (
  SELECT user_id FROM public.profiles
  WHERE account_type='professional' AND email <> 'ghnieves14@gmail.com'
);

UPDATE public.profiles
SET account_type='patient',
    is_approved=false,
    license_number=NULL,
    license_college=NULL,
    license_jurisdiction=NULL,
    consent_accepted_at=NULL,
    consent_signature_name=NULL,
    approval_decision=NULL,
    approval_reason=NULL,
    approval_decided_at=NULL,
    approval_decided_by=NULL
WHERE account_type='professional' AND email <> 'ghnieves14@gmail.com';

DELETE FROM public.professional_subscriptions
WHERE user_id NOT IN (SELECT user_id FROM public.profiles WHERE email='ghnieves14@gmail.com');