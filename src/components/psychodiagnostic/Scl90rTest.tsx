import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { scl90rQuestions, scl90rResponseOptions } from "@/data/scl90rQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, CheckCircle2 } from "lucide-react";

interface Scl90rTestProps {
  existingTest?: {
    id: string;
    responses: { question_number: number; answer: number }[];
    total_questions_answered: number | null;
    is_complete: boolean | null;
  };
  onComplete: () => void;
}

const ITEMS_PER_PAGE = 10;
const TOTAL_QUESTIONS = 90;

export function Scl90rTest({ existingTest, onComplete }: Scl90rTestProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingTest?.responses && Array.isArray(existingTest.responses)) {
      const map: Record<number, number> = {};
      existingTest.responses.forEach((r) => {
        map[r.question_number] = r.answer;
      });
      setResponses(map);
    }
  }, [existingTest]);

  const totalPages = Math.ceil(TOTAL_QUESTIONS / ITEMS_PER_PAGE);
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, TOTAL_QUESTIONS);
  const currentQuestions = scl90rQuestions.slice(startIdx, endIdx);
  const answeredCount = Object.keys(responses).length;
  const progress = (answeredCount / TOTAL_QUESTIONS) * 100;

  const handleAnswer = (questionNum: number, value: number) => {
    setResponses((prev) => ({ ...prev, [questionNum]: value }));
  };

  const saveProgress = async () => {
    if (!user || !existingTest) return;
    setSaving(true);
    try {
      const responsesArray = Object.entries(responses).map(([k, v]) => ({
        question_number: parseInt(k),
        answer: v,
      }));
      const isComplete = answeredCount >= TOTAL_QUESTIONS;
      const { error } = await supabase
        .from("scl90r_tests")
        .update({
          responses: responsesArray,
          total_questions_answered: answeredCount,
          is_complete: isComplete,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingTest.id);
      if (error) throw error;
      toast({ title: isComplete ? "Test completado" : "Progreso guardado" });
      if (isComplete) onComplete();
    } catch (error) {
      console.error(error);
      toast({ title: "Error al guardar", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>SCL-90-R — Listado de Síntomas</CardTitle>
            <CardDescription className="mt-1">
              Indique en qué medida cada problema le ha preocupado o molestado durante la última semana.
            </CardDescription>
          </div>
          <Badge variant="secondary">{answeredCount}/{TOTAL_QUESTIONS}</Badge>
        </div>
        <Progress value={progress} className="mt-3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {currentQuestions.map((question, idx) => {
          const questionNum = startIdx + idx + 1;
          const answer = responses[questionNum];
          return (
            <div
              key={questionNum}
              className={`rounded-lg border p-3 transition-all duration-200 ${
                answer !== undefined ? "border-primary/30 bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                  {questionNum}
                </span>
                <p className="flex-1 text-sm leading-relaxed">{question}</p>
              </div>
              <div className="flex gap-2 flex-wrap pl-10">
                {scl90rResponseOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={answer === option.value ? "default" : "outline"}
                    className="h-8 text-xs transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={() => handleAnswer(questionNum, option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
          </span>
          {currentPage === totalPages - 1 ? (
            <Button onClick={saveProgress} disabled={saving} className="transition-all duration-200 hover:scale-105 active:scale-95">
              {answeredCount >= TOTAL_QUESTIONS ? (
                <><CheckCircle2 className="h-4 w-4 mr-1" /> Finalizar</>
              ) : (
                <><Save className="h-4 w-4 mr-1" /> Guardar</>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
                saveProgress();
              }}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Siguiente <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
