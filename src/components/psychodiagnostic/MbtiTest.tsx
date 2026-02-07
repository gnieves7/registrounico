import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { mbtiQuestions, mbtiDescriptions, type MbtiQuestion } from "@/data/mbtiQuestions";
import { usePsychodiagnostic, type MbtiTest as MbtiTestType } from "@/hooks/usePsychodiagnostic";

interface MbtiTestProps {
  existingTest?: MbtiTestType;
  onComplete?: () => void;
}

const QUESTIONS_PER_PAGE = 10;

export const MbtiTest = ({ existingTest, onComplete }: MbtiTestProps) => {
  const { createMbtiTest, updateMbtiTest } = usePsychodiagnostic();
  const [currentTest, setCurrentTest] = useState<MbtiTestType | null>(existingTest || null);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(existingTest?.responses || []);
  const [currentPage, setCurrentPage] = useState(0);
  const [showResults, setShowResults] = useState(existingTest?.is_complete || false);

  const totalPages = Math.ceil(mbtiQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = mbtiQuestions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const progress = (selectedQuestions.length / mbtiQuestions.length) * 100;

  const handleStartTest = async () => {
    const result = await createMbtiTest.mutateAsync();
    setCurrentTest(result as unknown as MbtiTestType);
    setSelectedQuestions([]);
    setShowResults(false);
    setCurrentPage(0);
  };

  const toggleQuestion = (questionId: number) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const calculateResults = () => {
    const scores = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
    };

    selectedQuestions.forEach(qId => {
      const question = mbtiQuestions.find(q => q.id === qId);
      if (question) {
        scores[question.dimension]++;
      }
    });

    const type = 
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    return { scores, type };
  };

  const handleFinishTest = async () => {
    if (!currentTest) return;

    const { scores, type } = calculateResults();

    await updateMbtiTest.mutateAsync({
      id: currentTest.id,
      responses: selectedQuestions as unknown as number[],
      extraversion_score: scores.E,
      introversion_score: scores.I,
      sensing_score: scores.S,
      intuition_score: scores.N,
      thinking_score: scores.T,
      feeling_score: scores.F,
      judging_score: scores.J,
      perceiving_score: scores.P,
      personality_type: type,
      is_complete: true,
    });

    setShowResults(true);
    onComplete?.();
  };

  if (showResults && currentTest?.personality_type) {
    const { scores, type } = calculateResults();
    const typeInfo = mbtiDescriptions[type] || { title: type, description: "" };

    return (
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Tu tipo de personalidad</CardTitle>
          <Badge variant="secondary" className="mx-auto mt-2 text-xl px-4 py-1">
            {type}
          </Badge>
          <CardDescription className="text-lg mt-2">{typeInfo.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">{typeInfo.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Extroversión (E)</span>
                <span>{scores.E}</span>
              </div>
              <Progress value={(scores.E / (scores.E + scores.I)) * 100} />
              <div className="flex justify-between text-sm">
                <span>Introversión (I)</span>
                <span>{scores.I}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sensación (S)</span>
                <span>{scores.S}</span>
              </div>
              <Progress value={(scores.S / (scores.S + scores.N)) * 100} />
              <div className="flex justify-between text-sm">
                <span>Intuición (N)</span>
                <span>{scores.N}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pensamiento (T)</span>
                <span>{scores.T}</span>
              </div>
              <Progress value={(scores.T / (scores.T + scores.F)) * 100} />
              <div className="flex justify-between text-sm">
                <span>Sentimiento (F)</span>
                <span>{scores.F}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Juicio (J)</span>
                <span>{scores.J}</span>
              </div>
              <Progress value={(scores.J / (scores.J + scores.P)) * 100} />
              <div className="flex justify-between text-sm">
                <span>Percepción (P)</span>
                <span>{scores.P}</span>
              </div>
            </div>
          </div>

          <Button onClick={handleStartTest} variant="outline" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Realizar test nuevamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!currentTest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Test MBTI (Myers-Briggs)
          </CardTitle>
          <CardDescription>
            Descubre tu tipo de personalidad respondiendo 72 preguntas sobre tus preferencias y comportamientos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Instrucciones</h4>
              <p className="text-sm text-muted-foreground">
                Marca con una X las frases que reflejen algún aspecto de tu personalidad o se identifiquen 
                con tus preferencias ante las situaciones que se plantean. No hay respuestas correctas o incorrectas.
              </p>
            </div>
            <Button onClick={handleStartTest} className="w-full" disabled={createMbtiTest.isPending}>
              Comenzar Test
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Test MBTI
          </CardTitle>
          <Badge variant="outline">
            Página {currentPage + 1} de {totalPages}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progreso: {selectedQuestions.length} de {mbtiQuestions.length} preguntas</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {currentQuestions.map((question) => (
              <div
                key={question.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                  selectedQuestions.includes(question.id)
                    ? "bg-primary/5 border-primary/30"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => toggleQuestion(question.id)}
              >
                <Checkbox
                  checked={selectedQuestions.includes(question.id)}
                  onCheckedChange={() => toggleQuestion(question.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-xs text-muted-foreground mr-2">#{question.id}</span>
                  <span className="text-sm">{question.text}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentPage === totalPages - 1 ? (
            <Button onClick={handleFinishTest} disabled={updateMbtiTest.isPending}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Finalizar Test
            </Button>
          ) : (
            <Button onClick={() => setCurrentPage(p => p + 1)}>
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
