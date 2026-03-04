import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Thermometer, Users, TrendingDown, Copy, Send } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const EMOTIONS = [
  "Alegría", "Tristeza", "Ira", "Miedo", "Sorpresa", "Asco",
  "Ansiedad", "Vergüenza", "Culpa", "Esperanza", "Gratitud", "Calma",
];

export default function EmotionalThermometer() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  // Admin state
  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [emaConfig, setEmaConfig] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);

  // Patient state (self-report)
  const [moodScore, setMoodScore] = useState([5]);
  const [emotion, setEmotion] = useState("");
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && selectedPatient) {
      loadEmaData(selectedPatient);
    } else if (isPatient && user) {
      loadEmaData(user.id);
    }
  }, [selectedPatient, isAdmin, user]);

  const loadEmaData = async (patientId: string) => {
    const [configRes, responsesRes] = await Promise.all([
      supabase.from("ema_configs").select("*").eq("patient_id", patientId).maybeSingle(),
      supabase.from("ema_responses").select("*").eq("patient_id", patientId).order("responded_at", { ascending: true }),
    ]);
    setEmaConfig(configRes.data);
    setResponses(responsesRes.data || []);
  };

  const toggleEma = async (active: boolean) => {
    if (!selectedPatient) return;
    try {
      if (emaConfig) {
        await supabase.from("ema_configs").update({ is_active: active }).eq("id", emaConfig.id);
      } else {
        await supabase.from("ema_configs").insert({ patient_id: selectedPatient, is_active: active });
      }
      loadEmaData(selectedPatient);
      toast({ title: active ? "EMA activado" : "EMA desactivado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const submitResponse = async () => {
    if (!user || !emotion) return;
    setIsSending(true);
    try {
      const { error } = await supabase.from("ema_responses").insert({
        patient_id: user.id,
        mood_score: moodScore[0],
        emotion,
        note: note || null,
      });
      if (error) throw error;
      toast({ title: "Registro guardado", description: "Tu estado emocional fue registrado." });
      setMoodScore([5]);
      setEmotion("");
      setNote("");
      loadEmaData(user.id);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  // Chart data
  const chartData = responses.map((r) => ({
    date: format(new Date(r.responded_at), "dd/MM HH:mm", { locale: es }),
    score: r.mood_score,
    emotion: r.emotion,
  }));

  // Pattern detection: find hours/days with consistently low scores
  const lowPatterns = (() => {
    if (responses.length < 3) return null;
    const byHour: Record<number, number[]> = {};
    const byDay: Record<number, number[]> = {};
    responses.forEach((r) => {
      const d = new Date(r.responded_at);
      const hour = d.getHours();
      const day = d.getDay();
      if (!byHour[hour]) byHour[hour] = [];
      if (!byDay[day]) byDay[day] = [];
      byHour[hour].push(r.mood_score);
      byDay[day].push(r.mood_score);
    });
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const lowHours = Object.entries(byHour)
      .filter(([, scores]) => scores.length >= 2 && scores.reduce((a, b) => a + b, 0) / scores.length <= 4)
      .map(([h]) => `${h}:00hs`);
    const lowDays = Object.entries(byDay)
      .filter(([, scores]) => scores.length >= 2 && scores.reduce((a, b) => a + b, 0) / scores.length <= 4)
      .map(([d]) => dayNames[parseInt(d)]);
    return lowHours.length > 0 || lowDays.length > 0 ? { lowHours, lowDays } : null;
  })();

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Termómetro Emocional</h1>
        </div>
        <p className="text-sm text-muted-foreground">Evaluación Momentánea Ecológica (EMA)</p>
      </div>

      {/* Admin: Patient selector + config */}
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
                <div className="flex items-center gap-2">
                  <Switch
                    checked={emaConfig?.is_active || false}
                    onCheckedChange={toggleEma}
                  />
                  <Label className="text-sm">Check-ins activos</Label>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient self-report form */}
      {isPatient && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">¿Cómo te sentís ahora?</CardTitle>
            <CardDescription>Registrá tu estado emocional actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2 block">Estado de ánimo: <span className="font-bold text-primary">{moodScore[0]}/10</span></Label>
              <Slider value={moodScore} onValueChange={setMoodScore} min={1} max={10} step={1} className="mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Muy bajo</span><span>Muy alto</span>
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Emoción predominante</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger><SelectValue placeholder="Seleccioná una emoción..." /></SelectTrigger>
                <SelectContent>
                  {EMOTIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Nota breve (opcional)</Label>
              <Textarea placeholder="¿Qué está pasando?" value={note} onChange={(e) => setNote(e.target.value)} rows={2} />
            </div>
            <Button onClick={submitResponse} disabled={!emotion || isSending} className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-2" /> {isSending ? "Enviando..." : "Registrar"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      {((isAdmin && selectedPatient) || isPatient) && chartData.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Fluctuación Emocional</CardTitle>
            <CardDescription>{responses.length} registros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md text-sm">
                          <p className="font-medium">{d.date}</p>
                          <p>Ánimo: <span className="font-bold">{d.score}/10</span></p>
                          <p>Emoción: {d.emotion}</p>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Umbral bajo", fill: "#ef4444", fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pattern Detection */}
      {lowPatterns && (
        <Card className="border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-destructive" />
              <CardTitle className="text-lg text-destructive">Patrones Detectados</CardTitle>
            </div>
            <CardDescription>Momentos con puntuaciones consistentemente bajas (≤4/10)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowPatterns.lowHours.map((h) => (
                <Badge key={h} variant="destructive">{h}</Badge>
              ))}
              {lowPatterns.lowDays.map((d) => (
                <Badge key={d} variant="destructive">{d}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {((isAdmin && selectedPatient) || isPatient) && responses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay registros aún. {isPatient ? "Completá tu primer check-in arriba." : "El paciente aún no registró datos."}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
