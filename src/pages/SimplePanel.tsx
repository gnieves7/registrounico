import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CalendarDays, CalendarRange, BookOpen, ExternalLink, RefreshCw, Plug } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type CalEvent = {
  id: string;
  summary: string;
  start: string;
  end: string;
  location: string | null;
  hangoutLink: string | null;
  status: string;
};

const mockPatients = [
  { id: "1", name: "Paciente A.", lastSession: "Hace 3 días", tag: "TCC" },
  { id: "2", name: "Paciente B.", lastSession: "Hace 1 semana", tag: "Sistémico" },
  { id: "3", name: "Paciente C.", lastSession: "Hoy", tag: "Humanista" },
];

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-AR", {
      weekday: "short", day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function groupByDay(events: CalEvent[]) {
  const map = new Map<string, CalEvent[]>();
  for (const e of events) {
    const key = new Date(e.start).toLocaleDateString("es-AR", {
      weekday: "long", day: "2-digit", month: "long",
    });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return [...map.entries()];
}

export default function SimplePanel() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Panel Profesional</h1>
        <p className="text-sm text-muted-foreground">
          Vista simple: pacientes, agenda, semana y cuaderno.
        </p>
      </header>

      <Tabs defaultValue="pacientes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="pacientes"><Users className="mr-1 h-4 w-4" />Pacientes</TabsTrigger>
          <TabsTrigger value="agenda"><CalendarDays className="mr-1 h-4 w-4" />Agenda</TabsTrigger>
          <TabsTrigger value="semana"><CalendarRange className="mr-1 h-4 w-4" />Semana</TabsTrigger>
          <TabsTrigger value="cuaderno"><BookOpen className="mr-1 h-4 w-4" />Cuaderno</TabsTrigger>
        </TabsList>

        <TabsContent value="pacientes" className="mt-4">
          <PatientsTab />
        </TabsContent>
        <TabsContent value="agenda" className="mt-4">
          <AgendaTab />
        </TabsContent>
        <TabsContent value="semana" className="mt-4">
          <WeekTab />
        </TabsContent>
        <TabsContent value="cuaderno" className="mt-4">
          <NotebookTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Pacientes (mock hasta unificar backend) ----------------- */
function PatientsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Pacientes</CardTitle>
        <CardDescription>
          Listado provisorio. Se conectará a <code>psi-autoregistro</code> una vez unificada la base.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockPatients.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-md border border-border bg-card p-3">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">Última sesión: {p.lastSession}</p>
            </div>
            <Badge variant="secondary">{p.tag}</Badge>
          </div>
        ))}
        <p className="pt-2 text-xs text-muted-foreground">
          Datos de ejemplo · sin información clínica real.
        </p>
      </CardContent>
    </Card>
  );
}

/* ---------------- Agenda (Google Calendar via edge function) -------------- */
function AgendaTab() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("list-calendar-events", {
        body: {},
      });
      if (error) throw error;
      setConnected(Boolean(data?.connected));
      setEvents(data?.events ?? []);
      if (!data?.connected && data?.error) setError(data.error);
    } catch (e: any) {
      setConnected(false);
      setError(e?.message ?? "Error al cargar la agenda");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />Próximos turnos</CardTitle>
          <CardDescription>Tu calendario de Google, sin datos sensibles.</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading && <div className="space-y-2"><Skeleton className="h-14 w-full" /><Skeleton className="h-14 w-full" /></div>}

        {!loading && connected === false && (
          <div className="rounded-md border border-dashed border-border bg-muted/40 p-4 text-sm">
            <p className="mb-2 flex items-center gap-2 font-medium"><Plug className="h-4 w-4" />Google Calendar no conectado</p>
            <p className="text-muted-foreground">
              Pedile al administrador que vincule la cuenta de Google Calendar en
              Conectores (Lovable Cloud). Mientras tanto, la agenda no muestra eventos.
            </p>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>
        )}

        {!loading && connected && events.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay turnos próximos en los siguientes 14 días.</p>
        )}

        {!loading && connected && events.length > 0 && (
          <ul className="space-y-2">
            {events.map((e) => (
              <li key={e.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e.summary}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(e.start)} → {fmtDate(e.end)}</p>
                    {e.location && <p className="mt-0.5 truncate text-xs text-muted-foreground">📍 {e.location}</p>}
                  </div>
                  {e.hangoutLink && (
                    <a href={e.hangoutLink} target="_blank" rel="noreferrer" className="shrink-0 text-xs text-primary inline-flex items-center gap-1">
                      Meet <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ---------------- Semana (vista 7 días sobre los mismos eventos) --------- */
function WeekTab() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("list-calendar-events", { body: {} });
        setConnected(Boolean(data?.connected));
        setEvents((data?.events ?? []).filter((e: CalEvent) => {
          const t = new Date(e.start).getTime();
          return t >= Date.now() && t <= Date.now() + 7 * 86400_000;
        }));
      } finally { setLoading(false); }
    })();
  }, []);

  const grouped = groupByDay(events);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><CalendarRange className="h-5 w-5" />Vista semanal</CardTitle>
        <CardDescription>Próximos 7 días, agrupados por día.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <Skeleton className="h-24 w-full" />}
        {!loading && connected === false && (
          <p className="text-sm text-muted-foreground">Conectá Google Calendar para ver la semana.</p>
        )}
        {!loading && connected && grouped.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay turnos esta semana.</p>
        )}
        {!loading && grouped.map(([day, items]) => (
          <div key={day}>
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{day}</p>
            <ul className="space-y-1">
              {items.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-md border border-border bg-card p-2 text-sm">
                  <span className="truncate">{e.summary}</span>
                  <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                    {new Date(e.start).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------------- Cuaderno (real: notebook_entries del usuario actual) --- */
function NotebookTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("notebook_entries")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) toast.error("No se pudieron cargar las entradas");
      setEntries(data ?? []);
      setLoading(false);
    })();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Cuaderno</CardTitle>
        <CardDescription>Últimas entradas (tuyas o compartidas según RLS).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading && <Skeleton className="h-20 w-full" />}
        {!loading && entries.length === 0 && (
          <p className="text-sm text-muted-foreground">Aún no hay entradas.</p>
        )}
        {!loading && entries.map((e) => (
          <div key={e.id} className="rounded-md border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{e.title || "Sin título"}</p>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(e.created_at).toLocaleDateString("es-AR")}
              </span>
            </div>
            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground whitespace-pre-wrap">{e.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}