import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, CheckCheck, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  route: string | null;
}

export function AdminNotificationsSection() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await supabase
        .from("app_notifications")
        .select("id, notification_type, title, message, is_read, created_at, route")
        .eq("recipient_user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(100);
      setNotifications(data || []);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id: string) => {
    await supabase.from("app_notifications").update({ is_read: true, read_at: new Date().toISOString() }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from("app_notifications").update({ is_read: true, read_at: new Date().toISOString() }).in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications.filter((n) => n.notification_type === filter);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const typeColors: Record<string, string> = {
    symbolic_award: "bg-amber-100 text-amber-800",
    micro_task: "bg-blue-100 text-blue-800",
    document: "bg-green-100 text-green-800",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="unread">No leídas</SelectItem>
            <SelectItem value="symbolic_award">Premios</SelectItem>
            <SelectItem value="micro_task">Micro-tareas</SelectItem>
          </SelectContent>
        </Select>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" className="gap-1" onClick={markAllRead}>
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como leídas ({unreadCount})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Centro de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Cargando…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">Sin notificaciones</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => (
                <div key={n.id} className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${n.is_read ? "bg-background" : "bg-primary/5 border-primary/20"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <Badge variant="outline" className={`text-[10px] ${typeColors[n.notification_type] || ""}`}>
                        {n.notification_type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {format(new Date(n.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                    </p>
                  </div>
                  {!n.is_read && (
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => markRead(n.id)}>
                      <Check className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
