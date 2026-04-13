import { useState, useEffect } from "react";
import { useSchoolContent } from "@/hooks/useSchoolContent";
import SchoolSectionRenderer from "@/components/school/SchoolSectionRenderer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Handshake, Users, AlertTriangle, TrendingUp, Info, Save } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const REPAIR_STRATEGIES = [
  "Explorar directamente la experiencia del paciente sobre la ruptura.",
  "Validar la perspectiva del paciente sin ponerse a la defensiva.",
  "Renegociar las metas terapéuticas de manera colaborativa.",
  "Ajustar las tareas para que se alineen mejor con las necesidades del paciente.",
  "Explorar patrones relacionales que podrían estar replicándose en la terapia.",
  "Aumentar la transparencia sobre el proceso terapéutico.",
];

const ITEMS = [
  { key: "goal_agreement", label: "Acuerdo en Metas", desc: "¿Qué tan de acuerdo están terapeuta y paciente sobre los objetivos?" },
  { key: "task_agreement", label: "Acuerdo en Tareas", desc: "¿Qué tan de acuerdo están sobre las actividades/métodos de la terapia?" },
  { key: "bond_quality", label: "Calidad del Vínculo", desc: "¿Cuál es la calidad de la relación de confianza y respeto mutuo?" },
];

export default function TherapeuticAlliance() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [ratings, setRatings] = useState<any[]>([]);

  // Rating form
  const [goalAgreement, setGoalAgreement] = useState([4]);
  const [taskAgreement, setTaskAgreement] = useState([4]);
  const [bondQuality, setBondQuality] = useState([4]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (pid) {
      loadSessions(pid);
      loadRatings(pid);
    }
  }, [selectedPatient, isAdmin, user]);

  const loadSessions = async (patientId: string) => {
    const { data } = await supabase
      .from("sessions")
      .select("id, session_date, topic")
      .eq("patient_id", patientId)
      .order("session_date", { ascending: false });
    setSessions(data || []);
  };

  const loadRatings = async (patientId: string) => {
    const { data } = await supabase
      .from("alliance_ratings")
      .select("*, sessions(session_date)")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: true });
    setRatings(data || []);
  };

  const submitRating = async () => {
    if (!selectedSession) return;
    const pid = isAdmin ? selectedPatient : user?.id;
    if (!pid) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from("alliance_ratings").insert({
        session_id: selectedSession,
        patient_id: pid,
        rater_type: isAdmin ? "therapist" : "patient",
        goal_agreement: goalAgreement[0],
        task_agreement: taskAgreement[0],
        bond_quality: bondQuality[0],
      });
      if (error) throw error;
      toast({ title: "Valoración guardada" });
      loadRatings(pid);
      setGoalAgreement([4]);
      setTaskAgreement([4]);
      setBondQuality([4]);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Build chart data grouped by session
  const chartData = (() => {
    const bySession: Record<string, any> = {};
    ratings.forEach((r) => {
      const dateStr = r.sessions?.session_date
        ? format(new Date(r.sessions.session_date), "dd/MM", { locale: es })
        : "?";
      const key = r.session_id + "_" + dateStr;
      if (!bySession[key]) bySession[key] = { date: dateStr };
      const prefix = r.rater_type === "therapist" ? "t_" : "p_";
      bySession[key][prefix + "goal"] = r.goal_agreement;
      bySession[key][prefix + "task"] = r.task_agreement;
      bySession[key][prefix + "bond"] = r.bond_quality;
    });
    return Object.values(bySession);
  })();

  // Detect ruptures (discrepancy > 2 on any item)
  const ruptures = (() => {
    const bySession: Record<string, { therapist?: any; patient?: any }> = {};
    ratings.forEach((r) => {
      if (!bySession[r.session_id]) bySession[r.session_id] = {};
      bySession[r.session_id][r.rater_type as "therapist" | "patient"] = r;
    });
    const alerts: { sessionDate: string; item: string; diff: number }[] = [];
    Object.values(bySession).forEach(({ therapist, patient }) => {
      if (!therapist || !patient) return;
      const date = therapist.sessions?.session_date
        ? format(new Date(therapist.sessions.session_date), "dd/MM/yyyy", { locale: es })
        : "?";
      ITEMS.forEach(({ key, label }) => {
        const diff = Math.abs((therapist as any)[key] - (patient as any)[key]);
        if (diff > 2) alerts.push({ sessionDate: date, item: label, diff });
      });
    });
    return alerts;
  })();

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;

  const patientId = isAdmin ? selectedPatient : user?.id;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Handshake className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Índice de Alianza Terapéutica</h1>
          <Tooltip>
            <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">¿Qué mide esto? Evalúa la calidad de la relación terapéutica según el modelo de Bordin (1979): acuerdo en metas, tareas y vínculo emocional.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">Evaluación dual terapeuta-paciente de la alianza de trabajo</p>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Form */}
      {patientId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {isAdmin ? "Valoración del Terapeuta" : "Tu Valoración de la Sesión"}
            </CardTitle>
            <CardDescription>Seleccioná la sesión y puntuá cada dimensión (1-7)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sesión..." />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {format(new Date(s.session_date), "dd/MM/yyyy", { locale: es })} — {s.topic || "Sin tema"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {ITEMS.map(({ key, label, desc }) => {
              const value = key === "goal_agreement" ? goalAgreement : key === "task_agreement" ? taskAgreement : bondQuality;
              const setter = key === "goal_agreement" ? setGoalAgreement : key === "task_agreement" ? setTaskAgreement : setBondQuality;
              return (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">{label}: <span className="text-primary font-bold">{value[0]}/7</span></span>
                    <Tooltip>
                      <TooltipTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                      <TooltipContent><p className="text-xs max-w-xs">{desc}</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <Slider value={value} onValueChange={setter} min={1} max={7} step={1} />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Bajo</span><span>Alto</span>
                  </div>
                </div>
              );
            })}

            <Button onClick={submitRating} disabled={!selectedSession || isSaving} className="w-full sm:w-auto">
              <Save className="h-4 w-4 mr-2" /> {isSaving ? "Guardando..." : "Guardar Valoración"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Rupture Alerts */}
      {ruptures.length > 0 && (
        <Card className="mb-4 border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg text-destructive">Alertas de Ruptura</CardTitle>
            </div>
            <CardDescription>Discrepancia &gt;2 puntos entre terapeuta y paciente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ruptures.map((r, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <Badge variant="destructive">{r.sessionDate}</Badge>
                <span className="text-sm">{r.item} — diferencia de <strong>{r.diff}</strong> puntos</span>
              </div>
            ))}
            <div className="mt-4 border-t pt-3">
              <p className="text-sm font-medium mb-2">Estrategias de reparación sugeridas:</p>
              <ul className="space-y-1">
                {REPAIR_STRATEGIES.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alliance Trend Chart */}
      {patientId && chartData.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Tendencia de Alianza</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 7]} tick={{ fontSize: 11 }} />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="t_goal" name="T-Metas" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="t_bond" name="T-Vínculo" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="p_goal" name="P-Metas" stroke="hsl(var(--primary))" strokeDasharray="5 5" />
                  <Line type="monotone" dataKey="p_bond" name="P-Vínculo" stroke="#22c55e" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2">T = Terapeuta, P = Paciente. Líneas punteadas = paciente.</p>
          </CardContent>
        </Card>
      )}

      {patientId && chartData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay valoraciones aún. Completá la primera para comenzar el seguimiento.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
