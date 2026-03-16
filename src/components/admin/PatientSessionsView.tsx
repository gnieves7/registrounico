import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { notifyPatientAndAdmin } from "@/lib/telegramNotifications";
import { 
  Plus, 
  Calendar,
  Trash2, 
  Edit,
  Loader2,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Session {
  id: string;
  patient_id: string;
  session_date: string;
  topic: string | null;
  patient_notes: string | null;
  patient_questions: string | null;
  clinical_notes: string | null;
  is_editable_by_patient: boolean | null;
  calendar_link: string | null;
  created_at: string;
}

interface PatientSessionsViewProps {
  userId: string;
  patientName: string;
}

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";

export function PatientSessionsView({ userId, patientName }: PatientSessionsViewProps) {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    session_date: "",
    session_time: "",
    topic: "",
    clinical_notes: "",
    is_editable_by_patient: true,
  });

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("patient_id", userId)
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

  const resetForm = () => {
    setFormData({
      session_date: "",
      session_time: "",
      topic: "",
      clinical_notes: "",
      is_editable_by_patient: true,
    });
    setEditingSession(null);
  };

  const openEditDialog = (session: Session) => {
    const date = new Date(session.session_date);
    setEditingSession(session);
    setFormData({
      session_date: format(date, "yyyy-MM-dd"),
      session_time: format(date, "HH:mm"),
      topic: session.topic || "",
      clinical_notes: session.clinical_notes || "",
      is_editable_by_patient: session.is_editable_by_patient ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.session_date || !formData.session_time) {
      toast({
        title: "Error",
        description: "La fecha y hora son obligatorias",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const sessionDateTime = `${formData.session_date}T${formData.session_time}:00`;

      if (editingSession) {
        // Update existing session
        const { error } = await supabase
          .from("sessions")
          .update({
            session_date: sessionDateTime,
            topic: formData.topic.trim() || null,
            clinical_notes: formData.clinical_notes.trim() || null,
            is_editable_by_patient: formData.is_editable_by_patient,
          })
          .eq("id", editingSession.id);

        if (error) throw error;

        toast({
          title: "Sesión actualizada",
          description: "La sesión se ha modificado correctamente",
        });
      } else {
        // Create new session
        const { error } = await supabase.from("sessions").insert({
          patient_id: userId,
          session_date: sessionDateTime,
          topic: formData.topic.trim() || null,
          clinical_notes: formData.clinical_notes.trim() || null,
          is_editable_by_patient: formData.is_editable_by_patient,
          calendar_link: CALENDAR_LINK,
        });

        if (error) throw error;

        toast({
          title: "Sesión creada",
          description: "La sesión se ha agendado correctamente",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchSessions();
    } catch (error) {
      console.error("Error saving session:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la sesión",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm("¿Estás seguro de eliminar esta sesión?")) return;

    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Sesión eliminada",
        description: "La sesión se ha eliminado correctamente",
      });

      fetchSessions();
    } catch (error) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la sesión",
        variant: "destructive",
      });
    }
  };

  const toggleEditable = async (session: Session) => {
    try {
      const { error } = await supabase
        .from("sessions")
        .update({ is_editable_by_patient: !session.is_editable_by_patient })
        .eq("id", session.id);

      if (error) throw error;

      toast({
        title: session.is_editable_by_patient ? "Edición desactivada" : "Edición activada",
        description: session.is_editable_by_patient 
          ? "El paciente ya no puede editar esta sesión"
          : "El paciente ahora puede editar esta sesión",
      });

      fetchSessions();
    } catch (error) {
      console.error("Error toggling editable:", error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el permiso",
        variant: "destructive",
      });
    }
  };

  const isUpcoming = (date: string) => new Date(date) > new Date();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sesiones</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona las citas de {patientName}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Sesión
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingSession ? "Editar Sesión" : "Nueva Sesión"}
              </DialogTitle>
              <DialogDescription>
                {editingSession 
                  ? "Modifica los datos de la sesión"
                  : `Agenda una nueva sesión para ${patientName}`
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.session_date}
                    onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.session_time}
                    onChange={(e) => setFormData({ ...formData, session_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Tema de la sesión</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Ej: Seguimiento de ansiedad"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinical_notes">Notas clínicas (privadas)</Label>
                <Textarea
                  id="clinical_notes"
                  value={formData.clinical_notes}
                  onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                  placeholder="Notas privadas para el profesional..."
                  rows={4}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground">
                  Estas notas solo son visibles para ti
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Permitir edición del paciente</Label>
                  <p className="text-xs text-muted-foreground">
                    El paciente podrá escribir notas y preguntas
                  </p>
                </div>
                <Switch
                  checked={formData.is_editable_by_patient}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_editable_by_patient: checked })
                  }
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4" />
                      {editingSession ? "Actualizar" : "Crear"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay sesiones para este paciente</p>
            <p className="text-sm">Haz clic en "Nueva Sesión" para agendar una</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const upcoming = isUpcoming(session.session_date);
            return (
              <Card key={session.id} className={upcoming ? "border-primary/30" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-2 ${upcoming ? "bg-primary/10" : "bg-muted"}`}>
                      <Calendar className={`h-5 w-5 ${upcoming ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-foreground">
                          {format(new Date(session.session_date), "EEEE d 'de' MMMM", { locale: es })}
                        </span>
                        <Badge variant={upcoming ? "default" : "secondary"} className="shrink-0">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(session.session_date), "HH:mm")}
                        </Badge>
                        {upcoming && (
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            Próxima
                          </Badge>
                        )}
                      </div>
                      
                      {session.topic && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Tema:</strong> {session.topic}
                        </p>
                      )}

                      {/* Patient inputs */}
                      {(session.patient_notes || session.patient_questions) && (
                        <div className="mt-3 p-3 rounded-md bg-muted/50 space-y-2">
                          {session.patient_questions && (
                            <div className="flex gap-2 text-sm">
                              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">Preguntas:</span>
                                <p className="text-muted-foreground">{session.patient_questions}</p>
                              </div>
                            </div>
                          )}
                          {session.patient_notes && (
                            <div className="flex gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div>
                                <span className="font-medium">Notas del paciente:</span>
                                <p className="text-muted-foreground">{session.patient_notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Clinical notes (admin only) */}
                      {session.clinical_notes && (
                        <div className="mt-3 p-3 rounded-md bg-primary/5 border border-primary/10">
                          <p className="text-xs font-medium text-primary mb-1">Notas clínicas (privadas):</p>
                          <p className="text-sm text-muted-foreground">{session.clinical_notes}</p>
                        </div>
                      )}

                      {/* Editable toggle */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`editable-${session.id}`}
                            checked={session.is_editable_by_patient ?? false}
                            onCheckedChange={() => toggleEditable(session)}
                          />
                          <Label htmlFor={`editable-${session.id}`} className="text-xs text-muted-foreground">
                            {session.is_editable_by_patient 
                              ? "Paciente puede editar" 
                              : "Solo lectura para paciente"
                            }
                          </Label>
                        </div>
                        {session.calendar_link && (
                          <a
                            href={session.calendar_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Ver en calendario
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEditDialog(session)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(session.id)}
                        className="text-destructive hover:text-destructive"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
