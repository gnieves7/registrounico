import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Clock, 
  Edit, 
  Shield,
  Calendar,
  Building2,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { mbtiDescriptions } from "@/data/mbtiQuestions";
import { Mmpi2ProfileAnalysis } from "./Mmpi2ProfileAnalysis";
import { Mmpi2ReportGenerator } from "./Mmpi2ReportGenerator";
import type { Json } from "@/integrations/supabase/types";

interface PatientPsychodiagnosticViewProps {
  patientId: string;
  patientName?: string;
}

interface MbtiTest {
  id: string;
  user_id: string;
  test_date: string;
  responses: number[];
  extraversion_score: number;
  introversion_score: number;
  sensing_score: number;
  intuition_score: number;
  thinking_score: number;
  feeling_score: number;
  judging_score: number;
  perceiving_score: number;
  personality_type: string | null;
  is_complete: boolean;
  clinical_notes: string | null;
  created_at: string;
}

interface Mmpi2Test {
  id: string;
  user_id: string;
  test_date: string;
  responses: { question_number: number; answer: 'V' | 'F' }[];
  total_questions_answered: number;
  is_complete: boolean;
  clinical_notes: string | null;
  clinical_interpretation: string | null;
  interpretation_date: string | null;
  created_at: string;
}

interface ForensicCase {
  id: string;
  user_id: string;
  case_number: string | null;
  court_name: string | null;
  intervening_actors: { name: string; role: string }[];
  defense_lawyer_name: string | null;
  hearing_date: string | null;
  reported_fact: string | null;
  case_status: string;
  created_at: string;
}

export const PatientPsychodiagnosticView = ({ patientId, patientName }: PatientPsychodiagnosticViewProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMbti, setSelectedMbti] = useState<MbtiTest | null>(null);
  const [selectedMmpi2, setSelectedMmpi2] = useState<Mmpi2Test | null>(null);
  const [selectedCase, setSelectedCase] = useState<ForensicCase | null>(null);
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [interpretation, setInterpretation] = useState("");

  // Query MBTI tests
  const mbtiQuery = useQuery({
    queryKey: ["admin-mbti-tests", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mbti_tests")
        .select("*")
        .eq("user_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(test => ({
        ...test,
        responses: (test.responses as Json) as number[]
      })) as MbtiTest[];
    },
  });

  // Query MMPI-2 tests
  const mmpi2Query = useQuery({
    queryKey: ["admin-mmpi2-tests", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mmpi2_tests")
        .select("*")
        .eq("user_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(test => ({
        ...test,
        responses: (test.responses as Json) as { question_number: number; answer: 'V' | 'F' }[]
      })) as Mmpi2Test[];
    },
  });

  // Query Forensic cases
  const forensicQuery = useQuery({
    queryKey: ["admin-forensic-cases", patientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("forensic_cases")
        .select("*")
        .eq("user_id", patientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map(c => ({
        ...c,
        intervening_actors: (c.intervening_actors as Json) as { name: string; role: string }[]
      })) as ForensicCase[];
    },
  });

  // Update MBTI clinical notes
  const updateMbtiNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from("mbti_tests")
        .update({ clinical_notes: notes })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mbti-tests", patientId] });
      toast({ title: "Notas clínicas guardadas" });
      setSelectedMbti(null);
    },
  });

  // Update MMPI-2 interpretation
  const updateMmpi2Interpretation = useMutation({
    mutationFn: async ({ id, interpretation, notes }: { id: string; interpretation: string; notes: string }) => {
      const { error } = await supabase
        .from("mmpi2_tests")
        .update({ 
          clinical_interpretation: interpretation,
          clinical_notes: notes,
          interpretation_date: new Date().toISOString()
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mmpi2-tests", patientId] });
      toast({ title: "Interpretación guardada" });
      setSelectedMmpi2(null);
    },
  });

  const mbtiTests = mbtiQuery.data || [];
  const mmpi2Tests = mmpi2Query.data || [];
  const forensicCases = forensicQuery.data || [];

  const openMbtiDialog = (test: MbtiTest) => {
    setSelectedMbti(test);
    setClinicalNotes(test.clinical_notes || "");
  };

  const openMmpi2Dialog = (test: Mmpi2Test) => {
    setSelectedMmpi2(test);
    setInterpretation(test.clinical_interpretation || "");
    setClinicalNotes(test.clinical_notes || "");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="clinical" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clinical" className="gap-2">
            <Brain className="h-4 w-4" />
            Sección Clínica
          </TabsTrigger>
          <TabsTrigger value="forensic" className="gap-2">
            <Scale className="h-4 w-4" />
            Sección Forense
          </TabsTrigger>
        </TabsList>

        {/* Clinical Section */}
        <TabsContent value="clinical" className="space-y-4">
          {/* MBTI Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Tests MBTI
              </CardTitle>
              <CardDescription>Indicador de Tipo Myers-Briggs</CardDescription>
            </CardHeader>
            <CardContent>
              {mbtiQuery.isLoading ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : mbtiTests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  El paciente no ha realizado tests MBTI
                </p>
              ) : (
                <div className="space-y-3">
                  {mbtiTests.map((test) => {
                    const typeInfo = test.personality_type ? mbtiDescriptions[test.personality_type] : null;
                    
                    return (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => openMbtiDialog(test)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            {test.personality_type ? (
                              <span className="font-bold text-primary">{test.personality_type}</span>
                            ) : (
                              <Clock className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {typeInfo?.title || (test.is_complete ? test.personality_type : "En progreso")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(test.test_date), "PP", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={test.is_complete ? "default" : "secondary"}>
                            {test.is_complete ? "Completado" : "En progreso"}
                          </Badge>
                          {test.clinical_notes && (
                            <Badge variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Notas
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* MMPI-2 Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Inventarios MMPI-2
              </CardTitle>
              <CardDescription>Inventario Multifásico de Personalidad de Minnesota</CardDescription>
            </CardHeader>
            <CardContent>
              {mmpi2Query.isLoading ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : mmpi2Tests.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  El paciente no ha realizado inventarios MMPI-2
                </p>
              ) : (
                <div className="space-y-3">
                  {mmpi2Tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => openMmpi2Dialog(test)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <span className="text-2xl font-bold text-primary">
                            {test.total_questions_answered}
                          </span>
                          <span className="text-xs text-muted-foreground">/567</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {test.is_complete ? "Inventario Completado" : "En progreso"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(test.test_date), "PP", { locale: es })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={test.is_complete ? "default" : "secondary"}>
                          {Math.round((test.total_questions_answered / 567) * 100)}%
                        </Badge>
                        {test.clinical_interpretation && (
                          <Badge variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Interpretado
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forensic Section */}
        <TabsContent value="forensic" className="space-y-4">
          <Alert className="border-destructive/30">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Información confidencial protegida por el secreto profesional. Solo lectura.
            </AlertDescription>
          </Alert>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-destructive" />
                Casos Forenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              {forensicQuery.isLoading ? (
                <p className="text-muted-foreground">Cargando...</p>
              ) : forensicCases.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  El paciente no tiene casos forenses registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {forensicCases.map((forensicCase) => (
                    <div
                      key={forensicCase.id}
                      className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedCase(forensicCase)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                          <Scale className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Exp: {forensicCase.case_number || "Sin número"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {forensicCase.court_name || "Tribunal no especificado"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={forensicCase.case_status === "activo" ? "default" : "secondary"}>
                          {forensicCase.case_status}
                        </Badge>
                        {forensicCase.hearing_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {format(new Date(forensicCase.hearing_date), "PP", { locale: es })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MBTI Dialog */}
      <Dialog open={!!selectedMbti} onOpenChange={() => setSelectedMbti(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Test MBTI - {selectedMbti?.personality_type || "En progreso"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedMbti && (
            <div className="space-y-4">
              {selectedMbti.is_complete && selectedMbti.personality_type && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Extroversión (E) vs Introversión (I)</Label>
                    <Progress 
                      value={(selectedMbti.extraversion_score / (selectedMbti.extraversion_score + selectedMbti.introversion_score)) * 100} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>E: {selectedMbti.extraversion_score}</span>
                      <span>I: {selectedMbti.introversion_score}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sensación (S) vs Intuición (N)</Label>
                    <Progress 
                      value={(selectedMbti.sensing_score / (selectedMbti.sensing_score + selectedMbti.intuition_score)) * 100} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>S: {selectedMbti.sensing_score}</span>
                      <span>N: {selectedMbti.intuition_score}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pensamiento (T) vs Sentimiento (F)</Label>
                    <Progress 
                      value={(selectedMbti.thinking_score / (selectedMbti.thinking_score + selectedMbti.feeling_score)) * 100} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>T: {selectedMbti.thinking_score}</span>
                      <span>F: {selectedMbti.feeling_score}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Juicio (J) vs Percepción (P)</Label>
                    <Progress 
                      value={(selectedMbti.judging_score / (selectedMbti.judging_score + selectedMbti.perceiving_score)) * 100} 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>J: {selectedMbti.judging_score}</span>
                      <span>P: {selectedMbti.perceiving_score}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label>Notas Clínicas</Label>
                <Textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Escriba sus observaciones clínicas sobre este resultado..."
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMbti(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedMbti && updateMbtiNotes.mutate({ 
                id: selectedMbti.id, 
                notes: clinicalNotes 
              })}
              disabled={updateMbtiNotes.isPending}
            >
              Guardar Notas
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MMPI-2 Dialog */}
      <Dialog open={!!selectedMmpi2} onOpenChange={() => setSelectedMmpi2(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              MMPI-2 - Interpretación Clínica
            </DialogTitle>
          </DialogHeader>
          
          {selectedMmpi2 && (
            <ScrollArea className="max-h-[70vh]">
              <div className="space-y-4 pr-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>Respuestas completadas</span>
                  <Badge>{selectedMmpi2.total_questions_answered}/567</Badge>
                </div>

                {/* Perfil Psicológico Automático */}
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profile" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Perfil Automático
                    </TabsTrigger>
                    <TabsTrigger value="interpretation" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Interpretación Manual
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profile" className="mt-4">
                    <Mmpi2ProfileAnalysis 
                      responses={selectedMmpi2.responses}
                      totalAnswered={selectedMmpi2.total_questions_answered}
                      isComplete={selectedMmpi2.is_complete}
                    />
                  </TabsContent>
                  
                  <TabsContent value="interpretation" className="mt-4 space-y-4">
                    <div>
                      <Label>Interpretación Clínica</Label>
                      <Textarea
                        value={interpretation}
                        onChange={(e) => setInterpretation(e.target.value)}
                        placeholder="Escriba la interpretación clínica del MMPI-2..."
                        rows={6}
                      />
                    </div>

                    <div>
                      <Label>Notas Adicionales</Label>
                      <Textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="Notas adicionales..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedMmpi2 && (
              <Mmpi2ReportGenerator
                testId={selectedMmpi2.id}
                patientId={patientId}
                patientName={patientName}
                responses={selectedMmpi2.responses}
                totalAnswered={selectedMmpi2.total_questions_answered}
                isComplete={selectedMmpi2.is_complete}
                testDate={selectedMmpi2.test_date}
                clinicalInterpretation={selectedMmpi2.clinical_interpretation}
                clinicalNotes={selectedMmpi2.clinical_notes}
              />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedMmpi2(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => selectedMmpi2 && updateMmpi2Interpretation.mutate({ 
                  id: selectedMmpi2.id, 
                  interpretation,
                  notes: clinicalNotes
                })}
                disabled={updateMmpi2Interpretation.isPending}
              >
                Guardar Interpretación
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forensic Case Dialog */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-destructive" />
              Caso Forense - {selectedCase?.case_number || "Sin número"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCase && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 pr-4">
                <Alert variant="destructive">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Información confidencial - Solo lectura
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Expediente</Label>
                    <p className="font-medium">{selectedCase.case_number || "No especificado"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tribunal</Label>
                    <p className="font-medium">{selectedCase.court_name || "No especificado"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Abogado Defensor</Label>
                    <p className="font-medium">{selectedCase.defense_lawyer_name || "No especificado"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Próxima Audiencia</Label>
                    <p className="font-medium">
                      {selectedCase.hearing_date 
                        ? format(new Date(selectedCase.hearing_date), "PPpp", { locale: es })
                        : "No programada"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Hecho Denunciado</Label>
                  <p className="font-medium p-3 bg-muted/50 rounded-lg">
                    {selectedCase.reported_fact || "No especificado"}
                  </p>
                </div>

                {selectedCase.intervening_actors.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Actores Intervinientes</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCase.intervening_actors.map((actor, index) => (
                        <Badge key={index} variant="outline">
                          {actor.name} - {actor.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedCase(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
