import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { EmotionalRecordWidget } from "@/components/emotional/EmotionalRecordWidget";
import { UpcomingSession } from "@/components/dashboard/UpcomingSession";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";

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

const DashboardHome = () => {
  const { user, profile } = useAuth();
  const [todayRecord, setTodayRecord] = useState<TodayRecord | null>(null);
  const [upcomingSession, setUpcomingSession] = useState<UpcomingSessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Fetch today's emotional record
      const { data: emotionalData } = await supabase
        .from("emotional_records")
        .select("id, emoji, reflection")
        .eq("user_id", user.id)
        .eq("record_date", today)
        .maybeSingle();

      setTodayRecord(emotionalData);

      // Fetch upcoming session
      const { data: sessionData } = await supabase
        .from("sessions")
        .select("id, session_date, topic, calendar_link")
        .eq("patient_id", user.id)
        .gte("session_date", new Date().toISOString())
        .order("session_date", { ascending: true })
        .limit(1)
        .maybeSingle();

      setUpcomingSession(sessionData);
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

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      {/* Welcome Section */}
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

      <div className="space-y-4 md:space-y-6">
        {/* Emotional Record Section */}
        <section>
          <EmotionalRecordWidget
            todayRecord={todayRecord}
            onRecordSaved={fetchData}
            compact={!!todayRecord}
          />
        </section>

        {/* Two Column Layout */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          {/* Upcoming Session */}
          <section>
            <UpcomingSession session={upcomingSession} />
          </section>

          {/* Quick Actions */}
          <section className="space-y-3">
            <h2 className="font-medium text-foreground">Accesos Rápidos</h2>
            <QuickActions />
          </section>
        </div>

        {/* Ethical Notice */}
        <div className="rounded-lg bg-muted/50 p-4 text-center">
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
