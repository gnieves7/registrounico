import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CheckCircle2, UserPlus, Activity, Bell, FileText, BookOpen, Brain, Moon, Thermometer, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardMetrics {
  totalUsers: number;
  testsStartedToday: number;
  testsCompletedToday: number;
  newUsersToday: number;
}

const eventIcons: Record<string, string> = {
  login: "🟢",
  logout: "🔒",
  test_start: "📋",
  test_complete: "✅",
  profile_update: "📝",
  emotional_record: "🫶",
  dream_record: "🌙",
  notebook_entry: "📓",
  psychobiography_update: "👤",
  document_request: "📄",
  session_update: "📅",
  award_granted: "🏆",
};

const eventLabels: Record<string, string> = {
  login: "ingresó a la plataforma",
  logout: "cerró sesión",
  test_start: "inició un test",
  test_complete: "completó un test",
  profile_update: "actualizó su perfil",
  emotional_record: "registró su estado emocional",
  dream_record: "registró un sueño",
  notebook_entry: "escribió en su cuaderno",
  psychobiography_update: "actualizó su psicobiografía",
  document_request: "solicitó un informe",
  session_update: "actualizó notas de sesión",
  award_granted: "recibió un premio simbólico",
};

export function AdminDashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    testsStartedToday: 0,
    testsCompletedToday: 0,
    newUsersToday: 0,
  });
  const [weeklyData, setWeeklyData] = useState<{ day: string; tests: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ id: string; event_type: string; event_detail: any; created_at: string }[]>([]);
  const [patientAlerts, setPatientAlerts] = useState<{ id: string; type: string; patient: string; detail: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchWeeklyData();
    fetchRecentActivity();
    fetchPatientAlerts();

    // Real-time activity feed
    const channel = supabase
      .channel("admin-activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setRecentActivity((prev) => [payload.new as any, ...prev].slice(0, 30));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMetrics = async () => {
    try {
      const todayStart = startOfDay(new Date()).toISOString();

      const [profilesRes, activityTodayRes] = await Promise.all([
        supabase.from("profiles").select("id, created_at", { count: "exact" }),
        supabase.from("activity_log").select("event_type").gte("created_at", todayStart),
      ]);

      const totalUsers = profilesRes.count || 0;
      const newUsersToday = (profilesRes.data || []).filter(
        (p) => new Date(p.created_at) >= new Date(todayStart)
      ).length;

      const events = activityTodayRes.data || [];
      const testsStartedToday = events.filter((e) => e.event_type === "test_start").length;
      const testsCompletedToday = events.filter((e) => e.event_type === "test_complete").length;

      setMetrics({ totalUsers, testsStartedToday, testsCompletedToday, newUsersToday });
    } catch (e) {
      console.error("Error fetching metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const days: { day: string; tests: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStart = startOfDay(date).toISOString();
        const dayEnd = startOfDay(subDays(date, -1)).toISOString();

        const { count } = await supabase
          .from("activity_log")
          .select("*", { count: "exact", head: true })
          .eq("event_type", "test_complete")
          .gte("created_at", dayStart)
          .lt("created_at", dayEnd);

        days.push({ day: format(date, "EEE", { locale: es }), tests: count || 0 });
      }
      setWeeklyData(days);
    } catch (e) {
      console.error("Error fetching weekly data:", e);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      setRecentActivity(data || []);
    } catch (e) {
      console.error("Error fetching activity:", e);
    }
  };

  const fetchPatientAlerts = async () => {
    try {
      // Get recent patient contributions: emotional records, dreams, notebook, psychobiography updates
      const since = subDays(new Date(), 3).toISOString();

      const [emotionalRes, dreamsRes, notebookRes] = await Promise.all([
        supabase.from("emotional_records")
          .select("id, user_id, emoji, mood_score, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("dream_records")
          .select("id, user_id, title, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase.from("notebook_entries")
          .select("id, user_id, title, shared_with_therapist, created_at")
          .eq("shared_with_therapist", true)
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      // Get user names
      const userIds = new Set<string>();
      [...(emotionalRes.data || []), ...(dreamsRes.data || []), ...(notebookRes.data || [])].forEach(
        (r: any) => userIds.add(r.user_id)
      );

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", Array.from(userIds));

      const nameMap: Record<string, string> = {};
      (profiles || []).forEach((p) => { nameMap[p.user_id] = p.full_name || "Paciente"; });

      const alerts: typeof patientAlerts = [];

      (emotionalRes.data || []).forEach((r) => {
        const scoreLabel = (r.mood_score ?? 5) <= 3 ? " ⚠️ Puntuación baja" : "";
        alerts.push({
          id: r.id,
          type: "emotional",
          patient: nameMap[r.user_id] || "Paciente",
          detail: `Registró ${r.emoji}${scoreLabel}`,
          time: r.created_at,
        });
      });

      (dreamsRes.data || []).forEach((r) => {
        alerts.push({
          id: r.id,
          type: "dream",
          patient: nameMap[r.user_id] || "Paciente",
          detail: `Registró un sueño: "${r.title || "Sin título"}"`,
          time: r.created_at,
        });
      });

      (notebookRes.data || []).forEach((r) => {
        alerts.push({
          id: r.id,
          type: "notebook",
          patient: nameMap[r.user_id] || "Paciente",
          detail: `Compartió nota: "${r.title || "Sin título"}"`,
          time: r.created_at,
        });
      });

      alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setPatientAlerts(alerts.slice(0, 15));
    } catch (e) {
      console.error("Error fetching patient alerts:", e);
    }
  };

  const alertIcons: Record<string, typeof Thermometer> = {
    emotional: Thermometer,
    dream: Moon,
    notebook: BookOpen,
  };

  const metricCards = [
    { label: "Usuarios totales", value: metrics.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Tests iniciados hoy", value: metrics.testsStartedToday, icon: ClipboardList, color: "text-amber-500" },
    { label: "Tests completados hoy", value: metrics.testsCompletedToday, icon: CheckCircle2, color: "text-green-500" },
    { label: "Nuevos registros (24h)", value: metrics.newUsersToday, icon: UserPlus, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metricCards.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-center gap-3 py-5">
              <div className="rounded-xl bg-muted p-2.5">
                <m.icon className={`h-5 w-5 ${m.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {loading ? "—" : m.value}
                </p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient Contributions Alert Panel — PRIORITY */}
      {patientAlerts.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary animate-pulse" />
              Aportes recientes de pacientes
              <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {patientAlerts.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto space-y-2">
            {patientAlerts.map((alert) => {
              const AlertIcon = alertIcons[alert.type] || FileText;
              const isLowMood = alert.detail.includes("⚠️");
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                    isLowMood
                      ? "border-destructive/30 bg-destructive/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className={`mt-0.5 rounded-lg p-1.5 ${isLowMood ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <AlertIcon className={`h-4 w-4 ${isLowMood ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{alert.patient}</p>
                    <p className="text-xs text-muted-foreground">{alert.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(alert.time), "d MMM HH:mm", { locale: es })}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Weekly Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Actividad semanal — Tests completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis allowDecimals={false} className="text-xs" />
                <Tooltip />
                <Bar dataKey="tests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Feed de actividad</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[280px] overflow-y-auto space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin actividad reciente</p>
            ) : (
              recentActivity.map((a) => (
                <div key={a.id} className="flex items-start gap-2 rounded-md border border-border p-2 text-xs">
                  <span>{eventIcons[a.event_type] || "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">
                      {(a.event_detail as any)?.user_name || "Usuario"}
                    </span>
                    {" — "}
                    <span className="text-muted-foreground">
                      {eventLabels[a.event_type] || a.event_type}
                      {(a.event_detail as any)?.test_type ? ` (${(a.event_detail as any).test_type})` : ""}
                    </span>
                  </div>
                  <span className="text-muted-foreground whitespace-nowrap">
                    {format(new Date(a.created_at), "HH:mm")}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
