import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const notificationsTable = "app_notifications" as any;

export interface AppNotification {
  id: string;
  recipient_user_id: string;
  notification_type: string;
  title: string;
  message: string;
  related_table: string | null;
  related_record_id: string | null;
  route: string | null;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadNotifications = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from(notificationsTable)
        .select("*")
        .eq("recipient_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (!isActive) return;

      if (error) {
        console.error("Error loading notifications:", error);
        setNotifications([]);
        setIsLoading(false);
        return;
      }

      setNotifications((((data ?? []) as unknown) as AppNotification[]) ?? []);
      setIsLoading(false);
    };

    void loadNotifications();

    const channel = supabase
      .channel(`app-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "app_notifications",
          filter: `recipient_user_id=eq.${user.id}`,
        },
        (payload) => {
          if (!isActive) return;

          if (payload.eventType === "INSERT") {
            const nextNotification = payload.new as AppNotification;
            setNotifications((prev) => [nextNotification, ...prev.filter((item) => item.id !== nextNotification.id)]);
            if (!nextNotification.archived_at) {
              toast({ title: nextNotification.title, description: nextNotification.message });
            }
            return;
          }

          if (payload.eventType === "UPDATE") {
            const updatedNotification = payload.new as AppNotification;
            setNotifications((prev) => prev.map((item) => (item.id === updatedNotification.id ? updatedNotification : item)));
            return;
          }

          if (payload.eventType === "DELETE") {
            const deletedNotification = payload.old as Pick<AppNotification, "id">;
            setNotifications((prev) => prev.filter((item) => item.id !== deletedNotification.id));
          }
        },
      )
      .subscribe();

    return () => {
      isActive = false;
      supabase.removeChannel(channel);
    };
  }, [toast, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read && !notification.archived_at).length,
    [notifications],
  );

  const markAsRead = async (id: string) => {
    const readAt = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, is_read: true, read_at: notification.read_at ?? readAt } : notification,
      ),
    );

    const { error } = await supabase
      .from(notificationsTable)
      .update({ is_read: true, read_at: readAt })
      .eq("id", id)
      .eq("recipient_user_id", user?.id);

    if (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || unreadCount === 0) return;

    const readAt = new Date().toISOString();
    setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true, read_at: notification.read_at ?? readAt })));

    const { error } = await supabase
      .from(notificationsTable)
      .update({ is_read: true, read_at: readAt })
      .eq("recipient_user_id", user.id)
      .eq("is_read", false)
      .is("archived_at", null);

    if (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const archiveRead = async () => {
    if (!user?.id) return;

    const archivedAt = new Date().toISOString();
    setNotifications((prev) => prev.map((notification) => (notification.is_read ? { ...notification, archived_at: archivedAt } : notification)));

    const { error } = await supabase
      .from(notificationsTable)
      .update({ archived_at: archivedAt })
      .eq("recipient_user_id", user.id)
      .eq("is_read", true)
      .is("archived_at", null);

    if (error) {
      console.error("Error archiving notifications:", error);
    }
  };

  const toggleArchive = async (notification: AppNotification) => {
    const nextArchivedAt = notification.archived_at ? null : new Date().toISOString();
    setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, archived_at: nextArchivedAt } : item)));

    const { error } = await supabase
      .from(notificationsTable)
      .update({ archived_at: nextArchivedAt })
      .eq("id", notification.id)
      .eq("recipient_user_id", user?.id);

    if (error) {
      console.error("Error toggling archive:", error);
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    archiveRead,
    toggleArchive,
  };
}
