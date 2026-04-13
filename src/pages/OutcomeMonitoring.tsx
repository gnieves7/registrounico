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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, AlertTriangle, Info, Save, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Scale definitions
const SCALES: Record<string, { name: string; items: string[]; maxPerItem: number; cutoffs: { mild: number; moderate: number; severe: number }; description: string }> = {
  "PHQ-9": {
    name: "PHQ-9 (Depresión)",
    description: "Patient Health Questionnaire-9. Evalúa severidad de síntomas depresivos en las últimas 2 semanas.",
    maxPerItem: 3,
    cutoffs: { mild: 5, moderate: 10, severe: 15 },
    items: [
      "Poco interés o placer en hacer las cosas",
      "Sentirse desanimado/a, deprimido/a o sin esperanza",
      "Problemas para dormir o dormir demasiado",
      "Sentirse cansado/a o con poca energía",
      "Poco apetito o comer en exceso",
      "Sentirse mal consigo mismo/a",
      "Dificultad para concentrarse",
      "Moverse o hablar muy lento, o estar inquieto/a",
      "Pensamientos de hacerse daño",
    ],
  },
  "GAD-7": {
    name: "GAD-7 (Ansiedad)",
    description: "Generalized Anxiety Disorder-7. Evalúa severidad de síntomas de ansiedad en las últimas 2 semanas.",
    maxPerItem: 3,
    cutoffs: { mild: 5, moderate: 10, severe: 15 },
    items: [
      "Sentirse nervioso/a o con los nervios de punta",
      "No poder dejar de preocuparse",
      "Preocuparse demasiado por diferentes cosas",
      "Dificultad para relajarse",
      "Estar tan inquieto/a que es difícil quedarse quieto/a",
      "Irritarse o molestarse fácilmente",
      "Sentir miedo como si algo terrible fuera a pasar",
    ],
  },
  "ORS": {
    name: "ORS (Resultado)",
    description: "Outcome Rating Scale. Mide el bienestar general del paciente en 4 dimensiones: individual, interpersonal, social y general.",
    maxPerItem: 10,
    cutoffs: { mild: 25, moderate: 20, severe: 15 },
    items: [
      "Bienestar Individual (personalmente)",
      "Bienestar Interpersonal (familia, relaciones cercanas)",
      "Bienestar Social (trabajo, escuela, amistades)",
      "Bienestar General (en general)",
    ],
  },
  "SRS": {
    name: "SRS (Sesión)",
    description: "Session Rating Scale. Evalúa la calidad percibida de la sesión terapéutica actual.",
    maxPerItem: 10,
    cutoffs: { mild: 36, moderate: 28, severe: 20 },
    items: [
      "Relación (me sentí escuchado/a, comprendido/a y respetado/a)",
      "Metas y Temas (trabajamos en lo que yo quería)",
      "Enfoque o Método (el enfoque del terapeuta me resultó adecuado)",
      "En General (en general la sesión estuvo bien para mí)",
    ],
  },
};

const RESPONSE_LABELS_4 = ["Nunca (0)", "Varios días (1)", "Más de la mitad (2)", "Casi todos los días (3)"];

export default function OutcomeMonitoring() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [measures, setMeasures] = useState<any[]>([]);
  const [activeScale, setActiveScale] = useState("PHQ-9");
  const [responses, setResponses] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const scale = SCALES[activeScale];

  useEffect(() => {
    setResponses(new Array(scale.items.length).fill(0));
  }, [activeScale]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (pid) loadMeasures(pid);
  }, [selectedPatient, isAdmin, user]);

  const loadMeasures = async (patientId: string) => {
    const { data } = await supabase
      .from("outcome_measures")
      .select("*")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: true });
    setMeasures(data || []);
  };

  const submitMeasure = async () => {
    const pid = isAdmin ? selectedPatient : user?.id;
    if (!pid) return;
    setIsSaving(true);
    try {
      const totalScore = responses.reduce((a, b) => a + b, 0);
      const { error } = await supabase.from("outcome_measures").insert({
        patient_id: pid,
        scale_type: activeScale,
        responses: responses as any,
        total_score: totalScore,
        session_date: new Date().toISOString().split("T")[0],
      });
      if (error) throw error;
      toast({ title: "Escala guardada", description: `${activeScale}: ${totalScore} puntos` });
      setResponses(new Array(scale.items.length).fill(0));
      loadMeasures(pid);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const totalScore = responses.reduce((a, b) => a + b, 0);

  // Severity for PHQ-9/GAD-7
  const getSeverity = (score: number, cutoffs: typeof scale.cutoffs) => {
    if (score >= cutoffs.severe) return { label: "Severo", variant: "destructive" as const };
    if (score >= cutoffs.moderate) return { label: "Moderado", variant: "default" as const };
    if (score >= cutoffs.mild) return { label: "Leve", variant: "secondary" as const };
    return { label: "Mínimo", variant: "outline" as const };
  };

  // Chart data per scale
  const chartData = (scaleType: string) =>
    measures
      .filter((m) => m.scale_type === scaleType)
      .map((m) => ({
        date: m.session_date ? format(new Date(m.session_date), "dd/MM", { locale: es }) : "?",
        score: m.total_score,
      }));

  // Non-response alert: no improvement after 4+ sessions for PHQ-9 or GAD-7
  const nonResponseAlert = (() => {
    const alerts: string[] = [];
    ["PHQ-9", "GAD-7"].forEach((st) => {
      const data = measures.filter((m) => m.scale_type === st);
      if (data.length >= 4) {
        const first = data[0].total_score;
        const last = data[data.length - 1].total_score;
        if (last >= first) {
          alerts.push(st);
        }
      }
    });
    return alerts;
  })();

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;

  const patientId = isAdmin ? selectedPatient : user?.id;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Monitoreo de Resultados</h1>
          <Tooltip>
            <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground" /></TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">¿Qué mide esto? Administra escalas validadas (PHQ-9, GAD-7, ORS, SRS) para monitorear la evolución clínica del paciente sesión a sesión.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground">Escalas validadas y curvas de evolución clínica</p>
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Non-response Alert */}
      {nonResponseAlert.length > 0 && (
        <Card className="mb-4 border-destructive/30">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base text-destructive">Alerta de No-Respuesta</CardTitle>
            </div>
            <CardDescription>Sin mejoría después de 4+ administraciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-3">
              {nonResponseAlert.map((s) => (
                <Badge key={s} variant="destructive">{s}</Badge>
              ))}
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium">Árbol de decisión clínica sugerido:</p>
              <ol className="list-decimal list-inside text-muted-foreground text-xs space-y-1">
                <li>Revisar la alianza terapéutica y adherencia al tratamiento</li>
                <li>Considerar cambiar la técnica o enfoque terapéutico</li>
                <li>Evaluar comorbilidades no detectadas</li>
                <li>Consultar con un colega o supervisor</li>
                <li>Considerar derivación a otro profesional o nivel de atención</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {patientId ? (
        <Tabs value={activeScale} onValueChange={setActiveScale}>
          <TabsList className="mb-4 flex flex-wrap h-auto gap-1">
            {Object.entries(SCALES).map(([key, s]) => (
              <TabsTrigger key={key} value={key} className="text-xs px-3 py-1.5">{key}</TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(SCALES).map(([key, s]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              {/* Description */}
              <Card>
                <CardContent className="py-3">
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </CardContent>
              </Card>

              {/* Scale Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{s.name}</CardTitle>
                  <CardDescription>
                    Puntuación actual: <span className="font-bold text-primary">{totalScore}</span>
                    {" — "}
                    <Badge variant={getSeverity(totalScore, s.cutoffs).variant}>
                      {getSeverity(totalScore, s.cutoffs).label}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {s.items.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <Label className="text-sm">{idx + 1}. {item}</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {Array.from({ length: s.maxPerItem + 1 }, (_, v) => (
                          <Button
                            key={v}
                            variant={responses[idx] === v ? "default" : "outline"}
                            size="sm"
                            className="text-xs h-8 px-2.5"
                            onClick={() => {
                              const newR = [...responses];
                              newR[idx] = v;
                              setResponses(newR);
                            }}
                          >
                            {s.maxPerItem <= 3 ? (RESPONSE_LABELS_4[v] || v) : v}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={submitMeasure} disabled={isSaving} className="w-full sm:w-auto">
                    <Save className="h-4 w-4 mr-2" /> {isSaving ? "Guardando..." : "Guardar Resultado"}
                  </Button>
                </CardContent>
              </Card>

              {/* Evolution Chart */}
              {chartData(key).length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evolución {key}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData(key)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <RechartsTooltip />
                          <ReferenceLine y={s.cutoffs.moderate} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Moderado", fill: "#ef4444", fontSize: 11 }} />
                          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              {chartData(key).length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground text-sm">
                    No hay administraciones previas de {key}.
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Seleccioná un paciente para administrar escalas.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
