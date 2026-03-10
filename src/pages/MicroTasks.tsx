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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ClipboardList, Plus, Users, CheckCircle2, Clock, Info, Send, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES: Record<string, { label: string; emoji: string }> = {
  behavioral_activation: { label: "Activación Conductual", emoji: "🏃" },
  thought_records: { label: "Registro de Pensamientos", emoji: "💭" },
  mindfulness: { label: "Mindfulness", emoji: "🧘" },
  exposure: { label: "Tareas de Exposición", emoji: "🎯" },
  gratitude: { label: "Diario de Gratitud", emoji: "🙏" },
};

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  completed: { label: "Completada", variant: "default" },
  skipped: { label: "Omitida", variant: "destructive" },
};

export default function MicroTasks() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [respondingTask, setRespondingTask] = useState<any>(null);
  const [response, setResponse] = useState("");
  const [editingTask, setEditingTask] = useState<any>(null);

  // Form
  const [category, setCategory] = useState("behavioral_activation");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (pid) loadTasks(pid);
  }, [selectedPatient, isAdmin, user]);

  const loadTasks = async (patientId: string) => {
    const { data } = await supabase
      .from("micro_tasks")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });
    setTasks(data || []);
  };

  const assignTask = async () => {
    if (!selectedPatient || !title.trim()) return;
    setIsSaving(true);
    try {
      if (editingTask) {
        // Update existing task
        const { error } = await supabase.from("micro_tasks")
          .update({
            category,
            title: title.trim(),
            instructions: instructions.trim() || null,
            due_date: dueDate || null,
            status: "pending",
            response: null,
            completed_at: null,
          })
          .eq("id", editingTask.id);
        if (error) throw error;
        toast({ title: "Tarea actualizada y reenviada" });
      } else {
        const { error } = await supabase.from("micro_tasks").insert({
          patient_id: selectedPatient,
          category,
          title: title.trim(),
          instructions: instructions.trim() || null,
          due_date: dueDate || null,
        });
        if (error) throw error;
        toast({ title: "Tarea asignada" });
      }
      setShowAdd(false);
      setEditingTask(null);
      setTitle("");
      setInstructions("");
      setDueDate("");
      loadTasks(selectedPatient);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const openEditTask = (task: any) => {
    setEditingTask(task);
    setCategory(task.category);
    setTitle(task.title);
    setInstructions(task.instructions || "");
    setDueDate(task.due_date || "");
    setShowAdd(true);
  };

  const submitResponse = async () => {
    if (!respondingTask) return;
    try {
      const { error } = await supabase.from("micro_tasks")
        .update({
          status: "completed",
          response: response.trim() || null,
          completed_at: new Date().toISOString(),
        })
        .eq("id", respondingTask.id);
      if (error) throw error;
      toast({ title: "Tarea completada" });
      setRespondingTask(null);
      setResponse("");
      const pid = isAdmin ? selectedPatient : user?.id;
      if (pid) loadTasks(pid);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  // Compliance rate
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const complianceRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Weekly summary (tasks due this week)
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekTasks = tasks.filter((t) => {
    if (!t.due_date) return false;
    const d = new Date(t.due_date);
    return d >= weekStart && d <= now;
  });

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;

  const patientId = isAdmin ? selectedPatient : user?.id;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Micro-Tareas Entre Sesiones</h1>
          <Tooltip>
            <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">¿Qué mide esto? Sistema de tareas terapéuticas basado en evidencia. El cumplimiento de tareas entre sesiones es uno de los mejores predictores de resultados positivos en psicoterapia.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">Asignación y seguimiento de tareas terapéuticas</p>
      </div>

      {/* Patient selector (admin) */}
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
                  <Plus className="h-4 w-4 mr-1" /> Asignar Tarea
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Stats */}
      {patientId && totalCount > 0 && (
        <div className="grid gap-3 mb-4 grid-cols-2 md:grid-cols-3">
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold text-primary">{complianceRate}%</p>
              <p className="text-xs text-muted-foreground">Tasa de Cumplimiento</p>
              <Progress value={complianceRate} className="mt-2 h-1.5" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-bold text-foreground">{completedCount}/{totalCount}</p>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
          {isAdmin && (
            <Card>
              <CardContent className="py-3 text-center">
                <p className="text-2xl font-bold text-foreground">{weekTasks.filter(t => t.status === "completed").length}/{weekTasks.length}</p>
                <p className="text-xs text-muted-foreground">Esta Semana</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Task List */}
      {patientId && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => {
            const cat = CATEGORIES[task.category] || { label: task.category, emoji: "📋" };
            const status = STATUS_LABELS[task.status] || STATUS_LABELS.pending;
            return (
              <Card key={task.id} className={task.status === "completed" ? "opacity-75" : ""}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span>{cat.emoji}</span>
                        <Badge variant="outline" className="text-xs">{cat.label}</Badge>
                        <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(task.due_date), "dd/MM/yyyy")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{task.title}</p>
                      {task.instructions && <p className="text-xs text-muted-foreground mt-1">{task.instructions}</p>}
                      {task.response && (
                        <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                          <CheckCircle2 className="h-3 w-3 inline mr-1 text-primary" />
                          {task.response}
                          {task.completed_at && (
                            <span className="text-muted-foreground ml-2">
                              — {format(new Date(task.completed_at), "dd/MM HH:mm", { locale: es })}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {isPatient && task.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setRespondingTask(task); setResponse(""); }}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" /> Completar
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditTask(task)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : patientId ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {isPatient ? "No tenés tareas asignadas por el momento." : "No hay tareas asignadas a este paciente."}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Seleccioná un paciente para gestionar sus tareas.
          </CardContent>
        </Card>
      )}

      {/* Assign Task Dialog */}
      <Dialog open={showAdd} onOpenChange={(open) => { setShowAdd(open); if (!open) setEditingTask(null); }}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar y Reenviar Tarea" : "Asignar Tarea Terapéutica"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.emoji} {val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Título</Label>
              <Input placeholder="Ej: Caminata de 20 minutos" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Instrucciones</Label>
              <Textarea placeholder="Instrucciones detalladas..." value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Fecha límite</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={assignTask} disabled={!title.trim() || isSaving}>
              {isSaving ? "Guardando..." : "Asignar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Task Dialog */}
      <Dialog open={!!respondingTask} onOpenChange={() => setRespondingTask(null)}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Completar Tarea</DialogTitle>
          </DialogHeader>
          {respondingTask && (
            <div className="space-y-3">
              <p className="text-sm font-medium">{respondingTask.title}</p>
              {respondingTask.instructions && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{respondingTask.instructions}</p>
              )}
              <Textarea
                placeholder="¿Cómo te fue? Contá tu experiencia..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={submitResponse}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Marcar como Completada
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
