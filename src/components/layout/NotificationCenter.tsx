import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Award, Bell, BellDot, CheckCheck, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

const getNotificationIcon = (notificationType: string) => {
  switch (notificationType) {
    case "symbolic_award":
      return Award;
    case "micro_task":
      return ClipboardList;
    default:
      return Bell;
  }
};

const getNotificationLabel = (notificationType: string) => {
  switch (notificationType) {
    case "symbolic_award":
      return "Premio simbólico";
    case "micro_task":
      return "Micro-tarea";
    default:
      return "Notificación";
  }
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.route) {
      navigate(notification.route);
    }

    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-8 w-8 shrink-0 rounded-full md:h-9 md:w-9">
          {unreadCount > 0 ? <BellDot className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
          {unreadCount > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 text-[10px] font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Abrir notificaciones</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-full flex-col gap-4 sm:max-w-lg">
        <SheetHeader className="pr-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <SheetTitle>Notificaciones</SheetTitle>
              <SheetDescription>Alertas internas sobre premios simbólicos y micro-tareas.</SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Marcar todas
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3 pb-4">
            {isLoading ? (
              <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">
                Cargando notificaciones...
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">Todavía no hay notificaciones</p>
                <p className="mt-1 text-sm text-muted-foreground">Cuando se asignen micro-tareas o se otorguen premios, aparecerán acá.</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.notification_type);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-colors hover:bg-accent/40",
                      notification.is_read ? "border-border/70 bg-card" : "border-primary/20 bg-primary/5",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-accent p-2 text-accent-foreground">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{notification.title}</p>
                          {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{getNotificationLabel(notification.notification_type)}</Badge>
                          <span>
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
