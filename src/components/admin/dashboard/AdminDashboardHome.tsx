import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, CheckCircle2, UserPlus, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardMetrics {
  totalUsers: number;
  testsStartedToday: number;
  testsCompletedToday: number;
  newUsersToday: number;
}

export function AdminDashboardHome() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    testsStartedToday: 0,
    testsCompletedToday: 0,
    newUsersToday: 0,
  });
  const [weeklyData, setWeeklyData] = useState<{ day: string; tests: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<{ id: string; event_type: string; event_detail: any; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    fetchWeeklyData();
    fetchRecentActivity();

    // Real-time activity feed
    const channel = supabase
      .channel("admin-activity-feed")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "activity_log" }, (payload) => {
        setRecentActivity((prev) => [payload.new as any, ...prev].slice(0, 20));
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
        .limit(20);
      setRecentActivity(data || []);
    } catch (e) {
      console.error("Error fetching activity:", e);
    }
  };

  const metricCards = [
    { label: "Usuarios totales", value: metrics.totalUsers, icon: Users, color: "text-blue-500" },
    { label: "Tests iniciados hoy", value: metrics.testsStartedToday, icon: ClipboardList, color: "text-amber-500" },
    { label: "Tests completados hoy", value: metrics.testsCompletedToday, icon: CheckCircle2, color: "text-green-500" },
    { label: "Nuevos registros (24h)", value: metrics.newUsersToday, icon: UserPlus, color: "text-purple-500" },
  ];

  const eventIcons: Record<string, string> = {
    login: "🟢",
    logout: "🔒",
    test_start: "📋",
    test_complete: "✅",
    profile_update: "📝",
  };

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
                      {a.event_type === "login" && "ingresó a la plataforma"}
                      {a.event_type === "logout" && "cerró sesión"}
                      {a.event_type === "test_start" && `inició ${(a.event_detail as any)?.test_type || "un test"}`}
                      {a.event_type === "test_complete" && `completó ${(a.event_detail as any)?.test_type || "un test"}`}
                      {a.event_type === "profile_update" && "actualizó su perfil"}
                      {!["login","logout","test_start","test_complete","profile_update"].includes(a.event_type) && a.event_type}
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
