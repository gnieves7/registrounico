import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { supabase } from "@/integrations/supabase/client";
import { EmotionalRecordWidget } from "@/components/emotional/EmotionalRecordWidget";
import { UpcomingSession } from "@/components/dashboard/UpcomingSession";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { getStoredSystemArea, setStoredSystemArea, applySystemTheme, systemBranding, type SystemArea } from "@/lib/systemBranding";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  User, MessageCircle, FileText, Thermometer, BookOpen, Brain, Scale, Eye,
  Briefcase, ShieldCheck, Calendar, Moon, ClipboardList, Award, Handshake, BarChart3,
  TrendingUp, Activity, RefreshCw
} from "lucide-react";
import { EmotionalEvolutionChart } from "@/components/dashboard/EmotionalEvolutionChart";
import { demoSessions, demoEmotionalRecords } from "@/data/demoData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TodayRecord {
  id: string;
  emoji: string;
  reflection: string | null;
}

interface UpcomingSessionData {
  id: string;
  session_date: string;
  topic: string | null;
  calendar_link: string | null;
}

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";

const quickActionsBySystem: Record<SystemArea, { title: string; description: string; icon: typeof User; href: string }[]> = {
  reflexionar: [
    { title: "Mi Psicobiografía", description: "Tu historia personal", icon: User, href: "/psychobiography" },
    { title: "Termómetro Emocional", description: "Registrá cómo te sentís", icon: Thermometer, href: "/emotional-thermometer" },
    { title: "Alianza Terapéutica", description: "Tu vínculo con el terapeuta", icon: Handshake, href: "/therapeutic-alliance" },
    { title: "Micro-Tareas", description: "Actividades entre sesiones", icon: ClipboardList, href: "/micro-tasks" },
    { title: "Mi Cuaderno", description: "Tu espacio privado", icon: BookOpen, href: "/notebook" },
    { title: "Acompañante Virtual", description: "Laura, tu acompañante IA", icon: MessageCircle, href: "/laura" },
  ],
  evaluar: [
    { title: "Personalidad", description: "Tests psicodiagnósticos", icon: Brain, href: "/psychodiagnostic" },
    { title: "Apto Psicológico", description: "Evaluación de aptitud", icon: ShieldCheck, href: "/apto-psicologico" },
    { title: "Junta Médica Laboral", description: "Documentación médica", icon: Briefcase, href: "/junta-medica" },
    { title: "Mis Informes", description: "Constancias y resultados", icon: FileText, href: "/documents" },
    { title: "Mis Turnos", description: "Gestión de citas", icon: Calendar, href: "/sessions" },
  ],
  acompanar: [
    { title: "Mi Psicobiografía", description: "Tu historia personal", icon: User, href: "/psychobiography" },
    { title: "Expediente Forense", description: "Tu causa judicial", icon: Scale, href: "/forensic" },
    { title: "Cámara Gesell", description: "Análisis del testimonio", icon: Eye, href: "/camara-gesell" },
    { title: "Mi Cuaderno", description: "Tu espacio privado", icon: BookOpen, href: "/notebook" },
    { title: "Mis Informes", description: "Constancias e informes", icon: FileText, href: "/documents" },
    { title: "Mis Turnos", description: "Gestión de citas", icon: Calendar, href: "/sessions" },
  ],
};

const welcomeMessages: Record<SystemArea, { greeting: string; subtitle: string }> = {
  reflexionar: {
    greeting: "Bienvenido a tu espacio clínico",
    subtitle: "Seguimiento de tratamiento, acompañamiento y herramientas para tu bienestar emocional.",
  },
  evaluar: {
    greeting: "Bienvenido al área de evaluación",
    subtitle: "Tests de personalidad, psicodiagnósticos y estudios de aptitud psíquica.",
  },
  acompanar: {
    greeting: "Bienvenido al área forense",
    subtitle: "Acompañamiento en tu causa judicial con herramientas especializadas.",
  },
};

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const [todayRecord, setTodayRecord] = useState<TodayRecord | null>(null);
  const [upcomingSession, setUpcomingSession] = useState<UpcomingSessionData | null>(null);
  const [sessionsCount, setSessionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentArea = getStoredSystemArea();
  const currentSystem = currentArea ? systemBranding[currentArea] : null;
  const welcome = currentArea ? welcomeMessages[currentArea] : null;
  const quickActions = currentArea ? quickActionsBySystem[currentArea] : quickActionsBySystem.reflexionar;

  const fetchData = async () => {
    if (!user) return;
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data: emotionalData } = await supabase
        .from("emotional_records")
        .select("id, emoji, reflection")
        .eq("user_id", user.id)
        .eq("record_date", today)
        .maybeSingle();
      setTodayRecord(emotionalData);

      const { data: sessionData } = await supabase
        .from("sessions")
        .select("id, session_date, topic, calendar_link")
        .eq("patient_id", user.id)
        .gte("session_date", new Date().toISOString())
        .order("session_date", { ascending: true })
        .limit(1)
        .maybeSingle();
      setUpcomingSession(sessionData);

      // Count total sessions for reflexionar
      const { count } = await supabase
        .from("sessions")
        .select("id", { count: "exact", head: true })
        .eq("patient_id", user.id);
      setSessionsCount(count || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  const isReflexionar = currentArea === "reflexionar" || !currentArea;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      {/* System Welcome Banner */}
      {currentSystem && welcome && (
        <div className="system-welcome mb-6 flex items-center gap-4 rounded-2xl p-5 shadow-lg md:p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 overflow-hidden md:h-16 md:w-16">
            <img
              src={currentSystem.logo}
              alt={currentSystem.label}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold md:text-xl">
              {getGreeting()}, {profile?.full_name?.split(" ")[0] || "bienvenido"}
            </h1>
            <p className="text-sm opacity-90">{welcome.greeting}</p>
            <p className="mt-0.5 text-xs opacity-75">{welcome.subtitle}</p>
          </div>
          <div className="ml-auto hidden md:block">
            <AvatarUpload />
          </div>
        </div>
      )}

      {/* Fallback welcome if no system */}
      {!currentSystem && (
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
              {getGreeting()}, {profile?.full_name?.split(" ")[0] || "bienvenido"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Tu espacio de reflexión y acompañamiento terapéutico
            </p>
          </div>
          <AvatarUpload />
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        {/* ═══ REFLEXIONAR: Treatment tracking + Appointment request ═══ */}
        {isReflexionar && (
          <>
            {/* Treatment tracking summary */}
            <section className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Card className="border-primary/20">
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{sessionsCount}</span>
                  <span className="text-xs text-muted-foreground text-center">Sesiones totales</span>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{todayRecord ? "✓" : "—"}</span>
                  <span className="text-xs text-muted-foreground text-center">Registro hoy</span>
                </CardContent>
              </Card>
              <Card className="border-primary/20">
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">{upcomingSession ? "1" : "0"}</span>
                  <span className="text-xs text-muted-foreground text-center">Turno próximo</span>
                </CardContent>
              </Card>
              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="h-full border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center gap-2 p-4 h-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-primary text-center">Solicitar Turno</span>
                  </CardContent>
                </Card>
              </a>
            </section>

            {/* Emotional Record */}
            <section>
              <EmotionalRecordWidget
                todayRecord={todayRecord}
                onRecordSaved={fetchData}
                compact={!!todayRecord}
              />
            </section>
            {/* Emotional Evolution Chart */}
            <section>
              <EmotionalEvolutionChart />
            </section>
          </>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* Upcoming Session */}
          <section>
            <UpcomingSession session={upcomingSession} />
          </section>

          {/* Quick Actions — system-specific */}
          <section className="space-y-3">
            <h2 className="font-medium text-foreground">Accesos Rápidos</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link key={action.href} to={action.href}>
                  <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98]">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{action.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Ethical Notice */}
        <div className="system-alert rounded-lg border p-4 text-center">
          <p className="text-sm text-muted-foreground italic">
            Esta plataforma acompaña tu proceso terapéutico pero no sustituye la atención profesional.
            Ante cualquier urgencia, contacta directamente a tu terapeuta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
