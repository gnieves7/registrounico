-- =====================================================
-- 1. PROFILES: Restringir columnas actualizables
-- =====================================================

-- Eliminar políticas UPDATE existentes demasiado permisivas
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owner" ON public.profiles;

-- Función security definer para validar que las columnas sensibles no cambien
CREATE OR REPLACE FUNCTION public.profile_safe_update(
  _old public.profiles,
  _new public.profiles
) RETURNS boolean
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    _old.user_id IS NOT DISTINCT FROM _new.user_id
    AND _old.id IS NOT DISTINCT FROM _new.id
    AND _old.email IS NOT DISTINCT FROM _new.email
    AND _old.account_type IS NOT DISTINCT FROM _new.account_type
    AND _old.is_approved IS NOT DISTINCT FROM _new.is_approved
    AND _old.created_at IS NOT DISTINCT FROM _new.created_at
    AND _old.consent_accepted_at IS NOT DISTINCT FROM _new.consent_accepted_at
    AND _old.consent_signature_name IS NOT DISTINCT FROM _new.consent_signature_name;
$$;

-- Trigger que bloquea cambios en columnas sensibles si el usuario no es admin
CREATE OR REPLACE FUNCTION public.enforce_profile_column_restrictions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admins pueden modificar cualquier campo
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Usuarios comunes: revertir cambios en columnas sensibles
  NEW.user_id := OLD.user_id;
  NEW.id := OLD.id;
  NEW.email := OLD.email;
  NEW.account_type := OLD.account_type;
  NEW.is_approved := OLD.is_approved;
  NEW.created_at := OLD.created_at;
  -- El consentimiento solo se firma una vez y queda inmutable
  IF OLD.consent_accepted_at IS NOT NULL THEN
    NEW.consent_accepted_at := OLD.consent_accepted_at;
    NEW.consent_signature_name := OLD.consent_signature_name;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_enforce_column_restrictions ON public.profiles;
CREATE TRIGGER profiles_enforce_column_restrictions
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_profile_column_restrictions();

-- Política UPDATE restringida: solo el propietario puede actualizar su fila
CREATE POLICY "Users can update own profile (restricted columns)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 2. REALTIME: Restringir suscripciones por usuario
-- =====================================================

-- Habilitar RLS en realtime.messages
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si existen
DROP POLICY IF EXISTS "Users subscribe to own topics" ON realtime.messages;
DROP POLICY IF EXISTS "Admins subscribe to all topics" ON realtime.messages;
DROP POLICY IF EXISTS "Deny anon realtime" ON realtime.messages;

-- Bloquear todo acceso anónimo
CREATE POLICY "Deny anon realtime"
ON realtime.messages
AS RESTRICTIVE
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);

-- Admins: acceso a todos los topics (necesario para dashboards globales)
CREATE POLICY "Admins subscribe to all topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Usuarios: solo topics que contengan su propio user_id
-- Convención: los canales deben nombrarse incluyendo el user_id
-- Ej: "user:<uuid>", "notifications:<uuid>", "profile:<uuid>"
CREATE POLICY "Users subscribe to own topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() LIKE '%' || auth.uid()::text || '%'
);