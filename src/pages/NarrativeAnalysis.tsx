import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Sparkles, History, Brain, MessageSquare } from "lucide-react";

export default function NarrativeAnalysis() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [sessionText, setSessionText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("analyze");

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedPatient) loadHistory();
  }, [selectedPatient]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("narrative_analyses")
      .select("*")
      .eq("patient_id", selectedPatient)
      .order("created_at", { ascending: false });
    setHistory(data || []);
  };

  const analyzeText = async () => {
    if (!sessionText.trim() || !selectedPatient) return;
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("narrative-analysis", {
        body: {
          sessionText,
          patientId: selectedPatient,
        },
      });
      if (error) throw error;

      setCurrentAnalysis(data.analysis);
      toast({ title: "Análisis completado" });
      loadHistory();
    } catch (e: any) {
      toast({ title: "Error en el análisis", description: e.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="container mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Detector de Patrones Narrativos</h1>
        </div>
        <p className="text-sm text-muted-foreground">Análisis con IA de notas de sesión clínica</p>
      </div>

      {/* Patient Selector */}
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

      {selectedPatient && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-2">
            <TabsTrigger value="analyze"><Sparkles className="h-4 w-4 mr-1" /> Analizar</TabsTrigger>
            <TabsTrigger value="history"><History className="h-4 w-4 mr-1" /> Historial ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notas de Sesión</CardTitle>
                <CardDescription>Pegá o escribí las notas de la sesión para analizar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Escribí aquí las notas clínicas de la sesión..."
                  value={sessionText}
                  onChange={(e) => setSessionText(e.target.value)}
                  rows={8}
                />
                <Button onClick={analyzeText} disabled={isAnalyzing || !sessionText.trim()}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isAnalyzing ? "Analizando con IA..." : "Analizar Patrones"}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {currentAnalysis && <AnalysisCard analysis={currentAnalysis} />}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">No hay análisis previos para este paciente.</CardContent></Card>
            ) : (
              history.map((h) => (
                <div key={h.id}>
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(h.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <AnalysisCard analysis={{
                    distortions: h.distortions,
                    languageRatio: h.language_ratio,
                    themes: h.themes,
                    emotionalVocabulary: h.emotional_vocabulary,
                    summary: h.summary,
                  }} />
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function AnalysisCard({ analysis }: { analysis: any }) {
  return (
    <div className="space-y-4">
      {/* Summary */}
      {analysis.summary && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Resumen Clínico</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground whitespace-pre-line">{analysis.summary}</p></CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Distortions */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4" /> Distorsiones Cognitivas</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(analysis.distortions || []).length > 0
                ? analysis.distortions.map((d: any, i: number) => (
                    <Badge key={i} variant="secondary">{typeof d === 'string' ? d : d.name || d.type}</Badge>
                  ))
                : <p className="text-sm text-muted-foreground">No se detectaron distorsiones.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Language Ratio */}
        <Card>
          <CardHeader><CardTitle className="text-base">Ratio Víctima/Agente</CardTitle></CardHeader>
          <CardContent>
            {analysis.languageRatio ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Lenguaje de víctima</span>
                  <span className="font-bold">{analysis.languageRatio.victim || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-destructive h-2.5 rounded-full" style={{ width: `${analysis.languageRatio.victim || 0}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Lenguaje agente</span>
                  <span className="font-bold">{analysis.languageRatio.agent || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${analysis.languageRatio.agent || 0}%` }} />
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground">Sin datos.</p>}
          </CardContent>
        </Card>

        {/* Themes */}
        <Card>
          <CardHeader><CardTitle className="text-base">Temas de Autoconcepto</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(analysis.themes || []).length > 0
                ? analysis.themes.map((t: string, i: number) => <Badge key={i} variant="outline">{t}</Badge>)
                : <p className="text-sm text-muted-foreground">Sin temas detectados.</p>}
            </div>
          </CardContent>
        </Card>

        {/* Emotional Vocabulary */}
        <Card>
          <CardHeader><CardTitle className="text-base">Densidad Emocional</CardTitle></CardHeader>
          <CardContent>
            {analysis.emotionalVocabulary ? (
              <div className="space-y-1">
                <p className="text-sm">Palabras emocionales: <span className="font-bold">{analysis.emotionalVocabulary.count || 0}</span></p>
                <p className="text-sm">Densidad: <span className="font-bold">{analysis.emotionalVocabulary.density || "0"}%</span></p>
                {analysis.emotionalVocabulary.topEmotions && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {analysis.emotionalVocabulary.topEmotions.map((e: string, i: number) => <Badge key={i} variant="secondary">{e}</Badge>)}
                  </div>
                )}
              </div>
            ) : <p className="text-sm text-muted-foreground">Sin datos.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
