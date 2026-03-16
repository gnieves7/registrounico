import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Archive, ArrowRight, Award, Bell, BellDot, CheckCheck, ClipboardList, Inbox, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";

const notificationGroups = [
  { value: "all", label: "Todas" },
  { value: "symbolic_award", label: "Premios" },
  { value: "micro_task", label: "Micro-tareas" },
  { value: "telegram_message", label: "Telegram" },
];

const getNotificationIcon = (notificationType: string) => {
  switch (notificationType) {
    case "symbolic_award":
      return Award;
    case "micro_task":
      return ClipboardList;
    case "telegram_message":
      return MessageCircle;
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
    case "telegram_message":
      return "Telegram";
    default:
      return "Notificación";
  }
};

export function NotificationCenter() {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, archiveRead, toggleArchive } = useNotifications();
  const [open, setOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [boxFilter, setBoxFilter] = useState<"active" | "archived">("active");
  const [search, setSearch] = useState("");

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesBox = boxFilter === "archived" ? Boolean(notification.archived_at) : !notification.archived_at;
      const matchesType = typeFilter === "all" || notification.notification_type === typeFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [notification.title, notification.message, getNotificationLabel(notification.notification_type)]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesBox && matchesType && matchesSearch;
    });
  }, [boxFilter, notifications, search, typeFilter]);

  const handleNotificationClick = async (notification: AppNotification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    if (notification.route) {
      navigate(notification.route);
    }

    setOpen(false);
  };

  const canArchiveRead = notifications.some((notification) => notification.is_read && !notification.archived_at);

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
              <SheetDescription>Separá premios, micro-tareas y mensajes, y archivá alertas leídas.</SheetDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="gap-2">
                <CheckCheck className="h-4 w-4" />
                Marcar
              </Button>
              <Button variant="ghost" size="sm" onClick={archiveRead} disabled={!canArchiveRead} className="gap-2">
                <Archive className="h-4 w-4" />
                Archivar
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-3">
          <Tabs value={boxFilter} onValueChange={(value) => setBoxFilter(value as "active" | "archived")}> 
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Activas</TabsTrigger>
              <TabsTrigger value="archived">Archivadas</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar alerta..." className="pl-10" />
          </div>

          <div className="flex flex-wrap gap-2">
            {notificationGroups.map((group) => (
              <Button
                key={group.value}
                type="button"
                size="sm"
                variant={typeFilter === group.value ? "default" : "outline"}
                onClick={() => setTypeFilter(group.value)}
              >
                {group.label}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 pr-2">
          <div className="space-y-3 pb-4">
            {isLoading ? (
              <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">Cargando notificaciones...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
                <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 font-medium text-foreground">No hay alertas para esos filtros</p>
                <p className="mt-1 text-sm text-muted-foreground">Probá cambiar el tipo, la búsqueda o la bandeja visible.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.notification_type);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "rounded-2xl border p-4 transition-colors",
                      notification.is_read ? "border-border/70 bg-card" : "border-primary/20 bg-primary/5",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <button type="button" onClick={() => handleNotificationClick(notification)} className="flex min-w-0 flex-1 items-start gap-3 text-left">
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
                      </button>
                      {notification.is_read && (
                        <Button type="button" size="icon" variant="ghost" onClick={() => toggleArchive(notification)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
