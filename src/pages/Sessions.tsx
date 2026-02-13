import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Calendar, ExternalLink, Clock, MessageSquare, Target, Lightbulb, Save, CalendarPlus } from "lucide-react";
import { format, isPast, isFuture, isToday } from "date-fns";
import { es } from "date-fns/locale";

const GOOGLE_CALENDAR_BOOKING_URL = "https://calendar.app.google/6NNrsduq25F2hCeV9";

interface Session {
  id: string;
  session_date: string;
  topic: string | null;
  patient_notes: string | null;
  patient_questions: string | null;
  is_editable_by_patient: boolean | null;
  calendar_link: string | null;
}

interface EditingState {
  [sessionId: string]: {
    notes: string;
    questions: string;
  };
}

const Sessions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<EditingState>({});
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("sessions")
        .select("id, session_date, topic, patient_notes, patient_questions, is_editable_by_patient, calendar_link")
        .eq("patient_id", user.id)
        .order("session_date", { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las sesiones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (session: Session) => {
    setEditing(prev => ({
      ...prev,
      [session.id]: {
        notes: session.patient_notes || "",
        questions: session.patient_questions || "",
      }
    }));
  };

  const cancelEditing = (sessionId: string) => {
    setEditing(prev => {
      const newState = { ...prev };
      delete newState[sessionId];
      return newState;
    });
  };

  const saveSession = async (sessionId: string) => {
    const editData = editing[sessionId];
    if (!editData) return;

    setSavingIds(prev => new Set(prev).add(sessionId));

    try {
      const { error } = await supabase
        .from("sessions")
        .update({
          patient_notes: editData.notes || null,
          patient_questions: editData.questions || null,
        })
        .eq("id", sessionId);

      if (error) throw error;

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, patient_notes: editData.notes, patient_questions: editData.questions }
            : s
        )
      );

      cancelEditing(sessionId);

      toast({
        title: "Guardado",
        description: "Tus notas se guardaron correctamente",
      });
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    } finally {
      setSavingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const upcomingSessions = sessions.filter(s => isFuture(new Date(s.session_date)) || isToday(new Date(s.session_date)));
  const pastSessions = sessions.filter(s => isPast(new Date(s.session_date)) && !isToday(new Date(s.session_date)));

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: format(date, "EEEE d 'de' MMMM", { locale: es }),
      time: format(date, "HH:mm"),
      relative: isToday(date) ? "Hoy" : format(date, "d MMM yyyy", { locale: es }),
    };
  };

  const SessionCard = ({ session, isPast = false }: { session: Session; isPast?: boolean }) => {
    const dateInfo = formatSessionDate(session.session_date);
    const isEditing = editing[session.id] !== undefined;
    const isSaving = savingIds.has(session.id);
    const canEdit = session.is_editable_by_patient && !isPast;

    return (
      <Card className={isPast ? "opacity-80" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium capitalize">{dateInfo.day}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{dateInfo.time} hs</span>
              </div>
            </div>
            <Badge variant={isPast ? "secondary" : "default"}>
              {isPast ? "Realizada" : isToday(new Date(session.session_date)) ? "Hoy" : "Próxima"}
            </Badge>
          </div>
          {session.topic && (
            <CardDescription className="mt-2 flex items-center gap-2">
              <Target className="h-3 w-3" />
              Tema: {session.topic}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Preguntas para la sesión
                </label>
                <Textarea
                  placeholder="¿Qué te gustaría preguntarle a tu terapeuta?"
                  value={editing[session.id].questions}
                  onChange={(e) =>
                    setEditing(prev => ({
                      ...prev,
                      [session.id]: { ...prev[session.id], questions: e.target.value }
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Ideas y objetivos
                </label>
                <Textarea
                  placeholder="Ideas que quieras explorar, objetivos para la sesión..."
                  value={editing[session.id].notes}
                  onChange={(e) =>
                    setEditing(prev => ({
                      ...prev,
                      [session.id]: { ...prev[session.id], notes: e.target.value }
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => saveSession(session.id)}
                  disabled={isSaving}
                  size="sm"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => cancelEditing(session.id)}
                  disabled={isSaving}
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              {(session.patient_questions || session.patient_notes) ? (
                <div className="space-y-3">
                  {session.patient_questions && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        Mis preguntas
                      </p>
                      <p className="text-sm">{session.patient_questions}</p>
                    </div>
                  )}
                  {session.patient_notes && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Lightbulb className="h-3 w-3" />
                        Ideas y objetivos
                      </p>
                      <p className="text-sm">{session.patient_notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {canEdit
                    ? "Aún no has agregado notas para esta sesión"
                    : "Sin notas registradas"}
                </p>
              )}

              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing(session)}
                >
                  {session.patient_questions || session.patient_notes ? "Editar notas" : "Agregar notas"}
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          Mis Turnos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona tus turnos y prepárate para cada sesión
        </p>
      </div>

      {/* Request Appointment Card */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-foreground">¿Necesitas agendar una cita?</h3>
            <p className="text-sm text-muted-foreground">
              Solicita un turno directamente en el calendario del profesional
            </p>
          </div>
          <Button asChild>
            <a href={GOOGLE_CALENDAR_BOOKING_URL} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Solicitar turno
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Sessions Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Próximas ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Historial ({pastSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="font-medium text-foreground">No tienes sesiones programadas</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solicita un turno para agendar tu próxima cita
                </p>
                <Button asChild className="mt-4">
                  <a href={GOOGLE_CALENDAR_BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Solicitar turno
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="font-medium text-foreground">Sin historial de sesiones</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aquí aparecerán tus sesiones pasadas
                </p>
              </CardContent>
            </Card>
          ) : (
            pastSessions.map(session => (
              <SessionCard key={session.id} session={session} isPast />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sessions;
