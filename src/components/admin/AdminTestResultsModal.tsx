import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Brain, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mmpi2ProfileAnalysis } from "./Mmpi2ProfileAnalysis";
import { Mmpi2ReportGenerator } from "./Mmpi2ReportGenerator";
import { MbtiReportGenerator } from "./MbtiReportGenerator";
import { mbtiDescriptions } from "@/data/mbtiQuestions";
import type { Json } from "@/integrations/supabase/types";

interface AdminTestResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testId: string;
  testType: string;
  userId: string;
  userName?: string;
}

export function AdminTestResultsModal({
  open, onOpenChange, testId, testType, userId, userName
}: AdminTestResultsModalProps) {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !testId) return;
    setLoading(true);
    const tableName = testType === "MMPI-2" ? "mmpi2_tests"
      : testType === "MBTI" ? "mbti_tests"
      : testType === "MCMI-III" ? "mcmi3_tests"
      : "scl90r_tests";

    supabase.from(tableName).select("*").eq("id", testId).maybeSingle()
      .then(({ data }) => {
        setTestData(data);
        setLoading(false);
      });
  }, [open, testId, testType]);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resultados — {testType}
            {userName && <span className="text-muted-foreground font-normal text-sm ml-2">({userName})</span>}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          {loading ? (
            <p className="text-center py-12 text-muted-foreground">Cargando resultados…</p>
          ) : !testData ? (
            <p className="text-center py-12 text-muted-foreground">No se encontraron datos del test.</p>
          ) : (
            <div className="space-y-4 pr-4">
              {/* Test Info Header */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="outline">{testType}</Badge>
                <span className="text-muted-foreground">
                  {format(new Date(testData.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                </span>
                <Badge variant={testData.is_complete ? "default" : "secondary"}>
                  {testData.is_complete ? "Completado" : "En progreso"}
                </Badge>
              </div>

              <Separator />

              {/* MMPI-2 Results */}
              {testType === "MMPI-2" && (() => {
                const responses = (testData.responses as Json) as { question_number: number; answer: 'V' | 'F' }[];
                return (
                  <Tabs defaultValue="analysis" className="space-y-3">
                    <TabsList>
                      <TabsTrigger value="analysis" className="gap-1">
                        <Brain className="h-3.5 w-3.5" />
                        Análisis
                      </TabsTrigger>
                      <TabsTrigger value="report" className="gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        Informe PDF
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="analysis">
                      <Mmpi2ProfileAnalysis
                        responses={responses}
                        totalAnswered={testData.total_questions_answered || 0}
                        isComplete={testData.is_complete || false}
                      />
                    </TabsContent>
                    <TabsContent value="report">
                      <Mmpi2ReportGenerator
                        testId={testId}
                        patientId={userId}
                        patientName={userName}
                        responses={responses}
                        totalAnswered={testData.total_questions_answered || 0}
                        isComplete={testData.is_complete || false}
                        testDate={testData.test_date || testData.created_at}
                        clinicalInterpretation={testData.clinical_interpretation}
                        clinicalNotes={testData.clinical_notes}
                      />
                    </TabsContent>
                  </Tabs>
                );
              })()}

              {/* MBTI Results */}
              {testType === "MBTI" && testData.is_complete && testData.personality_type && (() => {
                const typeInfo = mbtiDescriptions[testData.personality_type];
                const scores = {
                  E: testData.extraversion_score || 0,
                  I: testData.introversion_score || 0,
                  S: testData.sensing_score || 0,
                  N: testData.intuition_score || 0,
                  T: testData.thinking_score || 0,
                  F: testData.feeling_score || 0,
                  J: testData.judging_score || 0,
                  P: testData.perceiving_score || 0,
                };

                const dims = [
                  { left: 'E', right: 'I', leftLabel: 'Extroversión', rightLabel: 'Introversión', leftScore: scores.E, rightScore: scores.I },
                  { left: 'S', right: 'N', leftLabel: 'Sensación', rightLabel: 'Intuición', leftScore: scores.S, rightScore: scores.N },
                  { left: 'T', right: 'F', leftLabel: 'Pensamiento', rightLabel: 'Sentimiento', leftScore: scores.T, rightScore: scores.F },
                  { left: 'J', right: 'P', leftLabel: 'Juicio', rightLabel: 'Percepción', leftScore: scores.J, rightScore: scores.P },
                ];

                return (
                  <div className="space-y-4">
                    {/* Type Hero */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary text-xl">{testData.personality_type}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{typeInfo?.title || testData.personality_type}</p>
                        <p className="text-sm text-muted-foreground">{typeInfo?.subtitle || ""}</p>
                      </div>
                    </div>

                    {/* Dimension Bars */}
                    <div className="space-y-3">
                      {dims.map((dim, i) => {
                        const total = dim.leftScore + dim.rightScore;
                        const leftPct = total > 0 ? Math.round((dim.leftScore / total) * 100) : 50;
                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className={dim.leftScore >= dim.rightScore ? "font-semibold" : "text-muted-foreground"}>
                                {dim.leftLabel} ({dim.left}): {dim.leftScore}
                              </span>
                              <span className={dim.rightScore > dim.leftScore ? "font-semibold" : "text-muted-foreground"}>
                                {dim.rightLabel} ({dim.right}): {dim.rightScore}
                              </span>
                            </div>
                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${leftPct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    {/* Report Generator */}
                    <MbtiReportGenerator
                      testId={testId}
                      patientId={userId}
                      patientName={userName}
                      testDate={testData.test_date || testData.created_at}
                      personalityType={testData.personality_type}
                      scores={scores}
                      clinicalNotes={testData.clinical_notes}
                    />
                  </div>
                );
              })()}

              {/* MCMI-III Results (basic view) */}
              {testType === "MCMI-III" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-2">Resumen MCMI-III</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Preguntas respondidas:</span>{" "}
                        <strong>{testData.total_questions_answered || 0}/175</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estado:</span>{" "}
                        <Badge variant={testData.is_complete ? "default" : "secondary"}>
                          {testData.is_complete ? "Completado" : "En progreso"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {testData.clinical_interpretation && (
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm font-medium mb-1">Interpretación Clínica</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{testData.clinical_interpretation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SCL-90-R Results (basic view) */}
              {testType === "SCL-90-R" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm font-medium mb-2">Resumen SCL-90-R</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Preguntas respondidas:</span>{" "}
                        <strong>{testData.total_questions_answered || 0}/90</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Estado:</span>{" "}
                        <Badge variant={testData.is_complete ? "default" : "secondary"}>
                          {testData.is_complete ? "Completado" : "En progreso"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {testData.clinical_interpretation && (
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm font-medium mb-1">Interpretación Clínica</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{testData.clinical_interpretation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* MBTI not complete */}
              {testType === "MBTI" && (!testData.is_complete || !testData.personality_type) && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>El test MBTI aún no fue completado por el paciente.</p>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
