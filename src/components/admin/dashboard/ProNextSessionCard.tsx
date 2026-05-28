import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Video, ExternalLink, ArrowRight } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  hangoutLink: string | null;
}

export function ProNextSessionCard() {
  const [event, setEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("list-calendar-events", {
          body: { days: 7 },
        });
        if (cancelled) return;
        const events = (data?.events || []) as CalendarEvent[];
        const upcoming = events
          .filter((e) => new Date(e.start).getTime() > Date.now())
          .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())[0];
        setEvent(upcoming || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <Calendar className="h-3.5 w-3.5" />
          Próxima sesión
        </div>

        {loading ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : event ? (
          <>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              {event.summary}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {format(new Date(event.start), "EEEE d 'de' MMMM · HH:mm", { locale: es })}
              </span>
              <span className="text-primary font-medium">
                en {formatDistanceToNowStrict(new Date(event.start), { locale: es })}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {event.hangoutLink && (
                <Button asChild size="sm" className="gap-1.5 h-8">
                  <a href={event.hangoutLink} target="_blank" rel="noreferrer">
                    <Video className="h-3.5 w-3.5" />
                    Iniciar Meet
                  </a>
                </Button>
              )}
              <Button asChild size="sm" variant="outline" className="gap-1.5 h-8">
                <a
                  href="https://calendar.app.google/4Locar4CbcTB45zv9"
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver en Calendar
                </a>
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Sin sesiones próximas
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu agenda no tiene eventos en los próximos 7 días.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3 gap-1.5 h-8">
              <a
                href="https://calendar.app.google/4Locar4CbcTB45zv9"
                target="_blank"
                rel="noreferrer"
              >
                Abrir Google Calendar
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}