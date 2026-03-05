import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Plus, Users, AlertTriangle, Info, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EVENT_TYPES: Record<string, { label: string; color: string; emoji: string }> = {
  trauma: { label: "Trauma", color: "hsl(0, 84%, 60%)", emoji: "💔" },
  milestone: { label: "Hito", color: "hsl(142, 71%, 45%)", emoji: "🎯" },
  relationship: { label: "Relación", color: "hsl(262, 83%, 58%)", emoji: "💞" },
  loss: { label: "Pérdida", color: "hsl(220, 14%, 46%)", emoji: "🕊️" },
  resource: { label: "Recurso", color: "hsl(47, 96%, 53%)", emoji: "⭐" },
};

const VALENCE_LABELS: Record<string, string> = {
  positive: "Positivo",
  negative: "Negativo",
  mixed: "Mixto",
};

export default function LifeTimeline() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [annotatingEvent, setAnnotatingEvent] = useState<any>(null);
  const [annotation, setAnnotation] = useState("");

  // Form
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("milestone");
  const [valence, setValence] = useState("mixed");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (pid) loadEvents(pid);
  }, [selectedPatient, isAdmin, user]);

  const loadEvents = async (patientId: string) => {
    const { data } = await supabase
      .from("life_events")
      .select("*")
      .eq("patient_id", patientId)
      .order("event_date", { ascending: true });
    setEvents(data || []);
  };

  const addEvent = async () => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (!pid || !eventDate || !description.trim()) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("life_events").insert({
        patient_id: pid,
        event_date: eventDate,
        event_type: eventType,
        valence,
        description: description.trim(),
        created_by: isAdmin ? "therapist" : "patient",
      });
      if (error) throw error;
      toast({ title: "Evento agregado" });
      setShowAdd(false);
      setEventDate("");
      setDescription("");
      loadEvents(pid);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const saveAnnotation = async () => {
    if (!annotatingEvent) return;
    try {
      const { error } = await supabase.from("life_events")
        .update({ patient_annotation: annotation })
        .eq("id", annotatingEvent.id);
      if (error) throw error;
      toast({ title: "Anotación guardada" });
      setAnnotatingEvent(null);
      const pid = isAdmin ? selectedPatient : user?.id;
      if (pid) loadEvents(pid);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  // Vulnerability windows: clusters of 3+ negative events within 365 days
  const vulnerabilityWindows = (() => {
    const negEvents = events.filter((e) => e.valence === "negative");
    if (negEvents.length < 3) return [];
    const windows: { start: string; end: string; count: number }[] = [];
    for (let i = 0; i < negEvents.length - 2; i++) {
      const start = new Date(negEvents[i].event_date);
      const cluster = [negEvents[i]];
      for (let j = i + 1; j < negEvents.length; j++) {
        const d = new Date(negEvents[j].event_date);
        if ((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) <= 365) {
          cluster.push(negEvents[j]);
        }
      }
      if (cluster.length >= 3) {
        windows.push({
          start: cluster[0].event_date,
          end: cluster[cluster.length - 1].event_date,
          count: cluster.length,
        });
      }
    }
    // Deduplicate overlapping windows
    const unique = windows.filter((w, i) => i === 0 || w.start !== windows[i - 1].start);
    return unique;
  })();

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;

  const patientId = isAdmin ? selectedPatient : user?.id;

  return (
    <div className="container mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Línea de Vida</h1>
          <Tooltip>
            <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">¿Qué mide esto? Mapea eventos significativos en la vida del paciente para identificar patrones, ventanas de vulnerabilidad y recursos de resiliencia.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">Cronología interactiva de eventos vitales del paciente</p>
      </div>

      {/* Patient selector */}
      {isAdmin && (
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Users className="h-5 w-5 text-muted-foreground shrink-0" />
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Seleccionar paciente..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || "Sin nombre"}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPatient && (
                <Button size="sm" onClick={() => setShowAdd(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Evento
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {isPatient && (
        <div className="mb-4">
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4 mr-1" /> Agregar Evento
          </Button>
        </div>
      )}

      {/* Vulnerability Alerts */}
      {vulnerabilityWindows.length > 0 && (
        <Card className="mb-4 border-destructive/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Ventanas de Vulnerabilidad</CardTitle>
            </div>
            <CardDescription>Clusters de {">"}=3 eventos negativos en 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vulnerabilityWindows.map((w, i) => (
                <Badge key={i} variant="destructive">
                  {format(new Date(w.start), "yyyy")} – {format(new Date(w.end), "yyyy")}: {w.count} eventos
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(EVENT_TYPES).map(([key, val]) => (
          <Badge key={key} variant="outline" style={{ borderColor: val.color, color: val.color }}>
            {val.emoji} {val.label}
          </Badge>
        ))}
      </div>

      {/* Timeline */}
      {patientId && events.length > 0 ? (
        <div className="relative ml-4 border-l-2 border-muted pl-6 space-y-6">
          {events.map((event) => {
            const type = EVENT_TYPES[event.event_type] || EVENT_TYPES.milestone;
            return (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div
                  className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background"
                  style={{ backgroundColor: type.color }}
                />
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-lg">{type.emoji}</span>
                          <Badge variant="outline" className="text-xs" style={{ borderColor: type.color, color: type.color }}>
                            {type.label}
                          </Badge>
                          <Badge variant={event.valence === "negative" ? "destructive" : event.valence === "positive" ? "default" : "secondary"} className="text-xs">
                            {VALENCE_LABELS[event.valence]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(event.event_date), "dd MMM yyyy", { locale: es })}
                          </span>
                        </div>
                        <p className="text-sm">{event.description}</p>
                        {event.patient_annotation && (
                          <div className="mt-2 rounded bg-muted/50 p-2 text-xs text-muted-foreground italic">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {event.patient_annotation}
                          </div>
                        )}
                      </div>
                      {isPatient && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7"
                          onClick={() => { setAnnotatingEvent(event); setAnnotation(event.patient_annotation || ""); }}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      ) : patientId ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay eventos registrados aún.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Seleccioná un paciente para ver su línea de vida.
          </CardContent>
        </Card>
      )}

      {/* Add Event Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Evento Vital</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Evento</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPES).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valencia Emocional</Label>
              <Select value={valence} onValueChange={setValence}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                  <SelectItem value="mixed">Mixto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea placeholder="Descripción breve del evento..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addEvent} disabled={!eventDate || !description.trim() || isSaving}>
              {isSaving ? "Guardando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Annotation Dialog */}
      <Dialog open={!!annotatingEvent} onOpenChange={() => setAnnotatingEvent(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tu Perspectiva Actual</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="¿Cómo ves este evento desde hoy?"
            value={annotation}
            onChange={(e) => setAnnotation(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button onClick={saveAnnotation}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
