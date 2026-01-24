-- Enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('admin', 'patient');

-- Tabla de roles de usuario (separada de perfiles para seguridad)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS en user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función para verificar roles (SECURITY DEFINER para evitar recursión)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de perfiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Tabla de psicobiografía
CREATE TABLE public.psychobiographies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    -- Datos personales
    birth_date DATE,
    birth_place TEXT,
    nationality TEXT,
    marital_status TEXT,
    occupation TEXT,
    education_level TEXT,
    address TEXT,
    -- Familia
    family_data JSONB DEFAULT '{}',
    -- Amigos y actividades
    social_data JSONB DEFAULT '{}',
    -- Historia laboral
    work_history JSONB DEFAULT '[]',
    -- Historia médica
    medical_history JSONB DEFAULT '{}',
    -- Alimentación y consumos
    lifestyle_data JSONB DEFAULT '{}',
    -- Valores personales
    personal_values JSONB DEFAULT '{}',
    -- Historia psicológica
    psychological_history JSONB DEFAULT '{}',
    -- Eventos traumáticos
    traumatic_events JSONB DEFAULT '[]',
    -- Historia legal
    legal_history JSONB DEFAULT '{}',
    -- Metadata
    is_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.psychobiographies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own psychobiography"
ON public.psychobiographies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all psychobiographies"
ON public.psychobiographies FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own psychobiography"
ON public.psychobiographies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own psychobiography"
ON public.psychobiographies FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Tabla de sesiones
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    topic TEXT,
    clinical_notes TEXT,
    patient_notes TEXT,
    patient_questions TEXT,
    is_editable_by_patient BOOLEAN DEFAULT false,
    calendar_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own sessions"
ON public.sessions FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Admins can manage all sessions"
ON public.sessions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Patients can update editable sessions"
ON public.sessions FOR UPDATE
USING (auth.uid() = patient_id AND is_editable_by_patient = true);

-- Tabla de registro emocional diario
CREATE TABLE public.emotional_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    emoji TEXT NOT NULL,
    mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
    reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, record_date)
);

ALTER TABLE public.emotional_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own emotional records"
ON public.emotional_records FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all emotional records"
ON public.emotional_records FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de documentos
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('certificate', 'clinical_report', 'other')),
    file_url TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_paid BOOLEAN DEFAULT false,
    payment_id TEXT,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view their own documents"
ON public.documents FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Admins can manage all documents"
ON public.documents FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Tabla de conversaciones con Laura (IA)
CREATE TABLE public.laura_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.laura_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations"
ON public.laura_conversations FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations"
ON public.laura_conversations FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_psychobiographies_updated_at
    BEFORE UPDATE ON public.psychobiographies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_laura_conversations_updated_at
    BEFORE UPDATE ON public.laura_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil y rol al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Crear perfil
    INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Crear rol de paciente por defecto
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'patient');
    
    -- Crear psicobiografía vacía
    INSERT INTO public.psychobiographies (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket para avatares y documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Políticas de storage para avatares (públicos)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas de storage para documentos (privados)
CREATE POLICY "Patients can view their own documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all document files"
ON storage.objects FOR ALL
USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));