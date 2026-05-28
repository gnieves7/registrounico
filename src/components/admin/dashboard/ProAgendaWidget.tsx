import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ExternalLink, Video, Clock, MapPin } from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location: string | null;
  hangoutLink: string | null;
  status: string;
}

const BOOKING_URL = "https://calendar.app.google/4Locar4CbcTB45zv9";

function groupLabel(date: Date) {
  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";
  if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, "EEEE", { locale: es });
  return format(date, "EEE d MMM", { locale: es });
}

export function ProAgendaWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("list-calendar-events", {
          body: { days: 14 },
        });
        if (cancelled) return;
        if (error) throw error;
        if (data?.connected === false) {
          setConnected(false);
        } else {
          setEvents((data?.events || []) as CalendarEvent[]);
        }
      } catch (e) {
        if (!cancelled) setConnected(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Group by day label
  const groups: Record<string, CalendarEvent[]> = {};
  events.forEach((e) => {
    const k = groupLabel(new Date(e.start));
    groups[k] = groups[k] || [];
    groups[k].push(e);
  });
  const orderedKeys = Object.keys(groups);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4 text-primary" />
          Agenda · próximos 14 días
        </CardTitle>
        <Button asChild size="sm" variant="ghost" className="h-7 text-xs gap-1">
          <a href={BOOKING_URL} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Calendar
          </a>
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[480px] space-y-4 pr-2">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !connected ? (
          <div className="text-xs text-muted-foreground space-y-2">
            <p>Conectá Google Calendar para ver tu agenda aquí.</p>
            <Button asChild size="sm" variant="outline" className="h-7 text-xs">
              <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                Abrir Calendar
              </a>
            </Button>
          </div>
        ) : events.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">
            Sin eventos programados en los próximos 14 días.
          </p>
        ) : (
          orderedKeys.map((k) => (
            <div key={k}>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 sticky top-0 bg-card/95 backdrop-blur py-0.5">
                {k}
              </p>
              <div className="space-y-1.5">
                {groups[k].map((ev) => {
                  const start = new Date(ev.start);
                  return (
                    <div
                      key={ev.id}
                      className="flex items-start gap-2 rounded-md border border-border bg-background/50 px-2.5 py-2 text-xs hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex flex-col items-center min-w-[44px] pt-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          {format(start, "HH:mm")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-foreground">{ev.summary}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                          {ev.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ev.location}
                            </span>
                          )}
                          {ev.hangoutLink && (
                            <a
                              href={ev.hangoutLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                              <Video className="h-3 w-3" />
                              Meet
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}