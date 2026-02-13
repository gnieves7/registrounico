import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, UserCheck, UserX, Clock, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Psychobiography, PsychobiographyUpdate } from "@/hooks/usePsychobiography";

interface SessionItem {
  id: string;
  session_date: string;
  topic: string | null;
}

interface TreatmentSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function TreatmentSection({ data }: TreatmentSectionProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    const { data: sessionData } = await supabase
      .from("sessions")
      .select("id, session_date, topic")
      .eq("patient_id", user.id)
      .order("session_date", { ascending: false });

    setSessions(sessionData || []);
  };

  const treatmentStartDate = (data as any)?.treatment_start_date;
  const consultationReason = (data as any)?.consultation_reason;
  const referredBy = (data as any)?.referred_by;
  const sessionsAttended = (data as any)?.sessions_attended || 0;
  const sessionsAbsent = (data as any)?.sessions_absent || 0;
  const totalSessions = sessionsAttended + sessionsAbsent;
  const attendanceRate = totalSessions > 0
    ? Math.round((sessionsAttended / totalSessions) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Seguimiento del Tratamiento
        </CardTitle>
        <CardDescription>
          Información de tu proceso terapéutico. Esta información es gestionada por tu profesional.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Treatment Info */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1 rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Inicio de Tratamiento</p>
            <p className="text-sm font-semibold text-foreground">
              {treatmentStartDate
                ? format(new Date(treatmentStartDate + "T12:00:00"), "dd/MM/yyyy")
                : "No definido"}
            </p>
          </div>
          <div className="space-y-1 rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Motivo de Consulta</p>
            <p className="text-sm text-foreground">
              {consultationReason || "No registrado"}
            </p>
          </div>
          <div className="space-y-1 rounded-lg border p-4">
            <p className="text-xs font-medium text-muted-foreground">Derivado por</p>
            <p className="text-sm text-foreground">
              {referredBy || "No registrado"}
            </p>
          </div>
        </div>

        {/* Attendance Stats */}
        <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <UserCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-primary">{sessionsAttended}</p>
            <p className="text-xs text-muted-foreground">Asistencias</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <UserX className="h-4 w-4 text-destructive" />
            </div>
            <p className="text-2xl font-bold text-destructive">{sessionsAbsent}</p>
            <p className="text-xs text-muted-foreground">Ausencias</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CalendarDays className="h-4 w-4 text-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{attendanceRate}%</p>
            <p className="text-xs text-muted-foreground">Asistencia</p>
          </div>
        </div>

        {/* Session List */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Historial de Sesiones
          </h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4 text-center">
              Aún no hay sesiones registradas
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {format(new Date(session.session_date), "dd/MM/yyyy", { locale: es })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {session.topic && (
                      <>
                        <Target className="h-3 w-3" />
                        <span className="max-w-[200px] truncate">{session.topic}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
