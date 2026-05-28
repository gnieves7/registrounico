import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CheckCircle2, UserPlus, Activity, Bell, FileText, BookOpen, Moon, Thermometer, ShieldAlert } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import {
  demoPatients,
  demoAdminActivity,
  demoAdminAlerts,
} from "@/data/demoData";
import { ProNextSessionCard } from "./ProNextSessionCard";
import { ProAgendaWidget } from "./ProAgendaWidget";

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
  const { isDemoMode } = useDemoMode();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    testsStartedToday: 0,
    testsCompletedToday: 0,
    newUsersToday: 0,
  });
  const [recentActivity, setRecentActivity] = useState<{ id: string; event_type: string; event_detail: any; created_at: string }[]>([]);
  const [patientAlerts, setPatientAlerts] = useState<{ id: string; type: string; patient: string; detail: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      setMetrics({ totalUsers: demoPatients.length, testsStartedToday: 2, testsCompletedToday: 1, newUsersToday: 1 });
      setRecentActivity(demoAdminActivity);
      setPatientAlerts(demoAdminAlerts);
      setLoading(false);
      return;
    }

    fetchMetrics();
    fetchRecentActivity();
    fetchPatientAlerts();

    const channel = supabase
      .channel("admin-activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setRecentActivity((prev) => [payload.new as any, ...prev].slice(0, 30));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isDemoMode]);

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
      setMetrics({
        totalUsers,
        testsStartedToday: events.filter((e) => e.event_type === "test_start").length,
        testsCompletedToday: events.filter((e) => e.event_type === "test_complete").length,
        newUsersToday,
      });
    } catch (e) {
      console.error("Error fetching metrics:", e);
    } finally {
      setLoading(false);
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
      const since = subDays(new Date(), 3).toISOString();
      const [emotionalRes, dreamsRes, notebookRes] = await Promise.all([
        supabase.from("emotional_records").select("id, user_id, emoji, mood_score, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(10),
        supabase.from("dream_records").select("id, user_id, title, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(10),
        supabase.from("notebook_entries").select("id, user_id, title, shared_with_therapist, created_at").eq("shared_with_therapist", true).gte("created_at", since).order("created_at", { ascending: false }).limit(10),
      ]);
      const userIds = new Set<string>();
      [...(emotionalRes.data || []), ...(dreamsRes.data || []), ...(notebookRes.data || [])].forEach((r: any) => userIds.add(r.user_id));
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", Array.from(userIds));
      const nameMap: Record<string, string> = {};
      (profiles || []).forEach((p) => { nameMap[p.user_id] = p.full_name || "Paciente"; });
      const alerts: typeof patientAlerts = [];
      (emotionalRes.data || []).forEach((r) => {
        const scoreLabel = (r.mood_score ?? 5) <= 3 ? " ⚠️ Puntuación baja" : "";
        alerts.push({ id: r.id, type: "emotional", patient: nameMap[r.user_id] || "Paciente", detail: `Registró ${r.emoji}${scoreLabel}`, time: r.created_at });
      });
      (dreamsRes.data || []).forEach((r) => {
        alerts.push({ id: r.id, type: "dream", patient: nameMap[r.user_id] || "Paciente", detail: `Registró un sueño: "${r.title || "Sin título"}"`, time: r.created_at });
      });
      (notebookRes.data || []).forEach((r) => {
        alerts.push({ id: r.id, type: "notebook", patient: nameMap[r.user_id] || "Paciente", detail: `Compartió nota: "${r.title || "Sin título"}"`, time: r.created_at });
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
    { label: "Usuarios totales", value: metrics.totalUsers, icon: Users },
    { label: "Tests iniciados hoy", value: metrics.testsStartedToday, icon: ClipboardList },
    { label: "Completados hoy", value: metrics.testsCompletedToday, icon: CheckCircle2 },
    { label: "Nuevos hoy", value: metrics.newUsersToday, icon: UserPlus },
  ];

  return (
    <div className="space-y-5">
      {/* Compact KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metricCards.map((m) => (
          <Card key={m.label} className="border-border/60">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <div className="rounded-md bg-muted p-1.5">
                <m.icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight text-foreground">
                  {loading ? "—" : m.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main 3-column workspace */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <ProNextSessionCard />

          {/* Clinical alerts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                Alertas clínicas
                {patientAlerts.length > 0 && (
                  <span className="ml-auto rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                    {patientAlerts.length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[260px] overflow-y-auto space-y-1.5">
              {patientAlerts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Sin alertas activas.
                </p>
              ) : (
                patientAlerts.map((alert) => {
                  const AlertIcon = alertIcons[alert.type] || FileText;
                  const isLowMood = alert.detail.includes("⚠️");
                  return (
                    <div
                      key={alert.id}
                      className={`flex items-start gap-2.5 rounded-md border px-2.5 py-2 text-xs transition-colors ${
                        isLowMood
                          ? "border-destructive/30 bg-destructive/5"
                          : "border-border bg-background/50"
                      }`}
                    >
                      <AlertIcon
                        className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${
                          isLowMood ? "text-destructive" : "text-muted-foreground"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{alert.patient}</p>
                        <p className="text-[11px] text-muted-foreground">{alert.detail}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(new Date(alert.time), "d MMM HH:mm", { locale: es })}
                      </span>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Activity feed */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Actividad reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[260px] overflow-y-auto space-y-1">
              {recentActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Sin actividad reciente
                </p>
              ) : (
                recentActivity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{eventIcons[a.event_type] || "·"}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">
                        {(a.event_detail as any)?.user_name || "Usuario"}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {eventLabels[a.event_type] || a.event_type}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {format(new Date(a.created_at), "HH:mm")}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column — agenda always visible */}
        <div className="lg:col-span-1">
          <ProAgendaWidget />
        </div>
      </div>
    </div>
  );
}
