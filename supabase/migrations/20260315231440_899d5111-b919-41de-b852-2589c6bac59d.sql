-- Notifications table for in-app alerts
CREATE TABLE IF NOT EXISTS public.app_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_table TEXT,
  related_record_id UUID,
  route TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_app_notifications_recipient_created_at
ON public.app_notifications (recipient_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_app_notifications_unread
ON public.app_notifications (recipient_user_id, is_read)
WHERE is_read = false;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'app_notifications'
      AND policyname = 'Admins can manage all app notifications'
  ) THEN
    CREATE POLICY "Admins can manage all app notifications"
    ON public.app_notifications
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'app_notifications'
      AND policyname = 'Deny anonymous access to app_notifications'
  ) THEN
    CREATE POLICY "Deny anonymous access to app_notifications"
    ON public.app_notifications
    AS RESTRICTIVE
    FOR SELECT
    USING (auth.uid() IS NOT NULL);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'app_notifications'
      AND policyname = 'Users can view their own notifications'
  ) THEN
    CREATE POLICY "Users can view their own notifications"
    ON public.app_notifications
    FOR SELECT
    USING (auth.uid() = recipient_user_id);
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'app_notifications'
      AND policyname = 'Users can update their own notifications'
  ) THEN
    CREATE POLICY "Users can update their own notifications"
    ON public.app_notifications
    FOR UPDATE
    USING (auth.uid() = recipient_user_id)
    WITH CHECK (auth.uid() = recipient_user_id);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.create_symbolic_award_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.app_notifications (
    recipient_user_id,
    notification_type,
    title,
    message,
    related_table,
    related_record_id,
    route,
    metadata
  )
  VALUES (
    NEW.patient_id,
    'symbolic_award',
    'Nuevo premio simbólico',
    format('Recibiste "%s" en tu pasaporte terapéutico.', NEW.award_title),
    'symbolic_awards',
    NEW.id,
    '/symbolic-awards',
    jsonb_build_object(
      'award_title', NEW.award_title,
      'category_key', NEW.category_key,
      'award_key', NEW.award_key,
      'awarded_at', NEW.awarded_at
    )
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_micro_task_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT'
     OR (
       NEW.status = 'pending'
       AND (
         OLD.status IS DISTINCT FROM NEW.status
         OR OLD.title IS DISTINCT FROM NEW.title
         OR OLD.category IS DISTINCT FROM NEW.category
         OR OLD.due_date IS DISTINCT FROM NEW.due_date
       )
     ) THEN
    INSERT INTO public.app_notifications (
      recipient_user_id,
      notification_type,
      title,
      message,
      related_table,
      related_record_id,
      route,
      metadata
    )
    VALUES (
      NEW.patient_id,
      'micro_task',
      'Nueva micro-tarea asignada',
      format('Se te asignó la tarea "%s".', NEW.title),
      'micro_tasks',
      NEW.id,
      '/micro-tasks',
      jsonb_build_object(
        'category', NEW.category,
        'due_date', NEW.due_date,
        'status', NEW.status
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_app_notifications_updated_at ON public.app_notifications;
CREATE TRIGGER trigger_app_notifications_updated_at
BEFORE UPDATE ON public.app_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_symbolic_awards_notification ON public.symbolic_awards;
CREATE TRIGGER trigger_symbolic_awards_notification
AFTER INSERT ON public.symbolic_awards
FOR EACH ROW
EXECUTE FUNCTION public.create_symbolic_award_notification();

DROP TRIGGER IF EXISTS trigger_micro_tasks_notification ON public.micro_tasks;
CREATE TRIGGER trigger_micro_tasks_notification
AFTER INSERT OR UPDATE OF title, category, due_date, status ON public.micro_tasks
FOR EACH ROW
EXECUTE FUNCTION public.create_micro_task_notification();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'app_notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_notifications;
  END IF;
END
$$;