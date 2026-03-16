-- Notification archival support
ALTER TABLE public.app_notifications
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_app_notifications_recipient_archived_created
ON public.app_notifications (recipient_user_id, archived_at, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_app_notifications_type_created
ON public.app_notifications (notification_type, created_at DESC);

-- Telegram contact linking and audit tables
CREATE TABLE IF NOT EXISTS public.telegram_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  chat_id BIGINT NOT NULL UNIQUE,
  telegram_username TEXT,
  telegram_first_name TEXT,
  telegram_last_name TEXT,
  phone_number TEXT,
  chat_type TEXT NOT NULL DEFAULT 'private',
  notify_sessions BOOLEAN NOT NULL DEFAULT true,
  notify_micro_tasks BOOLEAN NOT NULL DEFAULT true,
  notify_symbolic_awards BOOLEAN NOT NULL DEFAULT true,
  notify_documents BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  linked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_incoming_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, chat_id)
);

ALTER TABLE public.telegram_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all telegram contacts"
ON public.telegram_contacts
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anonymous access to telegram_contacts"
ON public.telegram_contacts
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own telegram contacts"
ON public.telegram_contacts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own telegram contact preferences"
ON public.telegram_contacts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_telegram_contacts_user_id ON public.telegram_contacts (user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_contacts_chat_id ON public.telegram_contacts (chat_id);

CREATE TABLE IF NOT EXISTS public.telegram_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_link_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all telegram link tokens"
ON public.telegram_link_tokens
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anonymous access to telegram_link_tokens"
ON public.telegram_link_tokens
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own telegram link tokens"
ON public.telegram_link_tokens
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_telegram_link_tokens_user_id ON public.telegram_link_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_telegram_link_tokens_token ON public.telegram_link_tokens (token);
CREATE INDEX IF NOT EXISTS idx_telegram_link_tokens_active ON public.telegram_link_tokens (user_id, expires_at)
WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS public.telegram_bot_state (
  id INTEGER PRIMARY KEY,
  update_offset BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT telegram_bot_state_singleton CHECK (id = 1)
);

ALTER TABLE public.telegram_bot_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view telegram bot state"
ON public.telegram_bot_state
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage telegram bot state"
ON public.telegram_bot_state
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.telegram_bot_state (id, update_offset)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.telegram_messages (
  update_id BIGINT PRIMARY KEY,
  user_id UUID,
  chat_id BIGINT NOT NULL,
  message_id BIGINT,
  direction TEXT NOT NULL DEFAULT 'incoming',
  message_text TEXT,
  raw_update JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all telegram messages"
ON public.telegram_messages
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anonymous access to telegram_messages"
ON public.telegram_messages
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own telegram messages"
ON public.telegram_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_telegram_messages_user_id ON public.telegram_messages (user_id, received_at DESC);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_chat_id ON public.telegram_messages (chat_id, received_at DESC);

CREATE TABLE IF NOT EXISTS public.telegram_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  chat_id BIGINT,
  event_type TEXT NOT NULL,
  title TEXT,
  message_text TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.telegram_delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all telegram delivery logs"
ON public.telegram_delivery_logs
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Deny anonymous access to telegram_delivery_logs"
ON public.telegram_delivery_logs
AS RESTRICTIVE
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own telegram delivery logs"
ON public.telegram_delivery_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_telegram_delivery_logs_user_id ON public.telegram_delivery_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_telegram_delivery_logs_event_type ON public.telegram_delivery_logs (event_type, created_at DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_app_notifications_updated_at'
  ) THEN
    CREATE TRIGGER update_app_notifications_updated_at
    BEFORE UPDATE ON public.app_notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_telegram_contacts_updated_at'
  ) THEN
    CREATE TRIGGER update_telegram_contacts_updated_at
    BEFORE UPDATE ON public.telegram_contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'update_telegram_link_tokens_updated_at'
  ) THEN
    CREATE TRIGGER update_telegram_link_tokens_updated_at
    BEFORE UPDATE ON public.telegram_link_tokens
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END
$$;