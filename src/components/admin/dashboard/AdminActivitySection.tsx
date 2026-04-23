import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Trophy, ClipboardCheck, BookOpen } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface DayPoint { day: string; count: number }
interface ProRank { user_id: string; name: string; events: number }

export function AdminActivitySection() {
  const [loading, setLoading] = useState(true);
  const [journalData, setJournalData] = useState<DayPoint[]>([]);
  const [testsThisWeek, setTestsThisWeek] = useState(0);
  const [ranking, setRanking] = useState<ProRank[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1) Journaling últimos 14 días: contamos notebook_entries + emotional_records por día (solo cantidad, sin contenido)
      const days: DayPoint[] = [];
      for (let i = 13; i >= 0; i--) {
        const start = startOfDay(subDays(new Date(), i));
        const end = startOfDay(subDays(new Date(), i - 1));
        const [nb, em] = await Promise.all([
          supabase.from("notebook_entries").select("id", { count: "exact", head: true })
            .gte("created_at", start.toISOString()).lt("created_at", end.toISOString()),
          supabase.from("emotional_records").select("id", { count: "exact", head: true })
            .gte("created_at", start.toISOString()).lt("created_at", end.toISOString()),
        ]);
        days.push({
          day: format(start, "d MMM", { locale: es }),
          count: (nb.count || 0) + (em.count || 0),
        });
      }
      setJournalData(days);

      // 2) Evaluaciones completadas esta semana (test_complete en activity_log)
      const weekAgo = subDays(new Date(), 7).toISOString();
      const { count: testsCount } = await supabase
        .from("activity_log")
        .select("id", { count: "exact", head: true })
        .eq("event_type", "test_complete")
        .gte("created_at", weekAgo);
      setTestsThisWeek(testsCount || 0);

      // 3) Ranking de profesionales más activos (por eventos propios registrados en activity_log)
      const { data: pros } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .eq("account_type", "professional");
      const proIds = (pros || []).map((p: any) => p.user_id);
      const nameMap: Record<string, string> = {};
      (pros || []).forEach((p: any) => { nameMap[p.user_id] = p.full_name || "Profesional"; });

      if (proIds.length) {
        const { data: events } = await supabase
          .from("activity_log")
          .select("user_id")
          .in("user_id", proIds)
          .gte("created_at", subDays(new Date(), 30).toISOString());
        const counts: Record<string, number> = {};
        (events || []).forEach((e: any) => {
          counts[e.user_id] = (counts[e.user_id] || 0) + 1;
        });
        const rank = Object.entries(counts)
          .map(([user_id, events]) => ({ user_id, name: nameMap[user_id] || "Profesional", events }))
          .sort((a, b) => b.events - a.events)
          .slice(0, 10);
        setRanking(rank);
      }

      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="rounded-xl bg-purple-500/10 p-2.5"><ClipboardCheck className="h-5 w-5 text-purple-500" /></div>
            <div>
              <p className="text-2xl font-bold">{testsThisWeek}</p>
              <p className="text-xs text-muted-foreground">Evaluaciones completadas esta semana</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="rounded-xl bg-blue-500/10 p-2.5"><BookOpen className="h-5 w-5 text-blue-500" /></div>
            <div>
              <p className="text-2xl font-bold">
                {journalData.reduce((acc, d) => acc + d.count, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Sesiones de journaling (14 días)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Journaling — últimos 14 días</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={journalData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis allowDecimals={false} className="text-xs" />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2">
            Solo contadores agregados — nunca se muestra contenido clínico.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            Profesionales más activos (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ranking.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin actividad registrada.</p>
          ) : (
            ranking.map((r, i) => (
              <div key={r.user_id} className="flex items-center gap-3 rounded-md border border-border p-2">
                <span className="text-xs font-bold text-muted-foreground w-6">#{i + 1}</span>
                <span className="flex-1 text-sm font-medium truncate">{r.name}</span>
                <span className="text-xs text-muted-foreground">{r.events} eventos</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}