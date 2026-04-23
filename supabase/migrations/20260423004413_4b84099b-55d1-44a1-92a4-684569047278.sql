ALTER TABLE public.profiles DISABLE TRIGGER profiles_enforce_column_restrictions;

UPDATE public.profiles
SET account_type='professional',
    is_approved=true,
    license_jurisdiction='Santa Fe',
    license_college=COALESCE(NULLIF(license_college,''),'Colegio de Psicólogos de Santa Fe'),
    license_number=COALESCE(NULLIF(license_number,''),'1889'),
    dni=COALESCE(NULLIF(dni,''),'00000000'),
    full_name=COALESCE(NULLIF(full_name,''),'Germán H. Nieves'),
    consent_accepted_at=COALESCE(consent_accepted_at, now()),
    consent_signature_name=COALESCE(consent_signature_name,'Germán H. Nieves')
WHERE email='ghnieves14@gmail.com';

ALTER TABLE public.profiles ENABLE TRIGGER profiles_enforce_column_restrictions;