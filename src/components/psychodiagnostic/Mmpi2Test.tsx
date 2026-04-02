import { useState, useEffect, useMemo } from "react";
import { logTestComplete } from "@/lib/activityLogger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, CheckCircle2, ArrowRight, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import { usePsychodiagnostic, type Mmpi2Test as Mmpi2TestType } from "@/hooks/usePsychodiagnostic";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Mmpi2TestProps {
  existingTest?: Mmpi2TestType;
  onComplete?: () => void;
}

const TOTAL_QUESTIONS = 567;
const QUESTIONS_PER_PAGE = 60;

export const Mmpi2Test = ({ existingTest, onComplete }: Mmpi2TestProps) => {
  const { createMmpi2Test, updateMmpi2Test } = usePsychodiagnostic();
  const [currentTest, setCurrentTest] = useState<Mmpi2TestType | null>(existingTest || null);
  const [responses, setResponses] = useState<Map<number, 'V' | 'F'>>(new Map());
  const [currentPage, setCurrentPage] = useState(0);
  const [visitedPages, setVisitedPages] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (existingTest?.responses) {
      const map = new Map<number, 'V' | 'F'>();
      existingTest.responses.forEach(r => map.set(r.question_number, r.answer));
      setResponses(map);
    }
  }, [existingTest]);

  // Track visited pages
  useEffect(() => {
    setVisitedPages(prev => new Set(prev).add(currentPage));
  }, [currentPage]);

  const totalPages = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);
  const startQuestion = currentPage * QUESTIONS_PER_PAGE + 1;
  const endQuestion = Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);

  const progress = (responses.size / TOTAL_QUESTIONS) * 100;

  // Count omissions on visited pages
  const omittedCount = useMemo(() => {
    let count = 0;
    visitedPages.forEach(page => {
      const start = page * QUESTIONS_PER_PAGE + 1;
      const end = Math.min((page + 1) * QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
      for (let q = start; q <= end; q++) {
        if (!responses.has(q)) count++;
      }
    });
    return count;
  }, [responses, visitedPages]);

  const handleStartTest = async () => {
    const result = await createMmpi2Test.mutateAsync();
    setCurrentTest(result as unknown as Mmpi2TestType);
    setResponses(new Map());
    setCurrentPage(0);
    setVisitedPages(new Set([0]));
  };

  const setAnswer = (questionNumber: number, answer: 'V' | 'F') => {
    setResponses(prev => {
      const newMap = new Map(prev);
      if (newMap.get(questionNumber) === answer) {
        newMap.delete(questionNumber);
      } else {
        newMap.set(questionNumber, answer);
      }
      return newMap;
    });
  };

  const handleSaveProgress = async () => {
    if (!currentTest) return;

    const responsesArray = Array.from(responses.entries()).map(([question_number, answer]) => ({
      question_number,
      answer
    }));

    await updateMmpi2Test.mutateAsync({
      id: currentTest.id,
      responses: responsesArray as unknown as { question_number: number; answer: 'V' | 'F' }[],
      total_questions_answered: responses.size,
      is_complete: responses.size === TOTAL_QUESTIONS,
    });
  };

  const handleFinishTest = async () => {
    await handleSaveProgress();
    onComplete?.();
  };

  if (!currentTest) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            MMPI-2 - Inventario Multifásico de Personalidad
          </CardTitle>
          <CardDescription>
            Hoja de respuestas para el Inventario Multifásico de Personalidad de Minnesota - 2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Este inventario consta de 567 afirmaciones. Para cada una, debes indicar si es 
                <strong> Verdadero (V)</strong> o <strong>Falso (F)</strong> según se aplique a ti.
                Tus respuestas serán analizadas por el profesional.
              </AlertDescription>
            </Alert>
            
            <div className="rounded-lg bg-muted/50 p-4">
              <h4 className="font-medium mb-2">Instrucciones</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Lee cada afirmación cuidadosamente</li>
                <li>Marca V (Verdadero) si la afirmación se aplica a ti</li>
                <li>Marca F (Falso) si la afirmación no se aplica a ti</li>
                <li>Responde a todas las afirmaciones de manera honesta</li>
                <li>Las preguntas sin responder aparecerán en rojo al cambiar de página</li>
                <li>Puedes guardar tu progreso y continuar después</li>
              </ul>
            </div>
            
            <Button onClick={handleStartTest} className="w-full" disabled={createMmpi2Test.isPending}>
              Comenzar Inventario
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
            <FileText className="h-5 w-5 text-primary" />
            MMPI-2 - Hoja de Respuestas
          </CardTitle>
          <Badge variant="outline">
            Página {currentPage + 1} de {totalPages}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Respondidas: {responses.size} de {TOTAL_QUESTIONS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
          {omittedCount > 0 && (
            <p className="text-xs text-destructive">
              ⚠ {omittedCount} pregunta(s) sin responder en páginas visitadas
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
            {Array.from({ length: endQuestion - startQuestion + 1 }, (_, i) => {
              const questionNumber = startQuestion + i;
              const answer = responses.get(questionNumber);
              const isOmitted = !answer && visitedPages.has(currentPage) && currentPage < Math.ceil(questionNumber / QUESTIONS_PER_PAGE);
              // Show as omitted (red) only if this page was previously visited and user left without answering
              const showOmission = !answer && visitedPages.size > 1 && visitedPages.has(currentPage);
              
              return (
                <div key={questionNumber} className="text-center">
                  <div className={`text-[10px] mb-0.5 font-mono ${showOmission ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    {questionNumber}
                  </div>
                  <div className="flex gap-0.5 justify-center">
                    <Button
                      variant={answer === 'V' ? "default" : showOmission ? "destructive" : "outline"}
                      size="sm"
                      className={`h-7 w-7 p-0 text-[10px] ${
                        answer === 'V' ? '' : showOmission ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''
                      }`}
                      onClick={() => setAnswer(questionNumber, 'V')}
                    >
                      V
                    </Button>
                    <Button
                      variant={answer === 'F' ? "default" : showOmission ? "destructive" : "outline"}
                      size="sm"
                      className={`h-7 w-7 p-0 text-[10px] ${
                        answer === 'F' ? '' : showOmission ? 'border-destructive/50 text-destructive hover:bg-destructive/10' : ''
                      }`}
                      onClick={() => setAnswer(questionNumber, 'F')}
                    >
                      F
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Page navigation buttons */}
        <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t justify-center">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageStart = i * QUESTIONS_PER_PAGE + 1;
            const pageEnd = Math.min((i + 1) * QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
            const answeredOnPage = Array.from({ length: pageEnd - pageStart + 1 }, (_, j) => pageStart + j)
              .filter(q => responses.has(q)).length;
            const totalOnPage = pageEnd - pageStart + 1;
            const isComplete = answeredOnPage === totalOnPage;
            const hasOmissions = visitedPages.has(i) && !isComplete;

            return (
              <Button
                key={i}
                variant={i === currentPage ? "default" : isComplete ? "secondary" : hasOmissions ? "destructive" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 text-[10px]"
                onClick={() => setCurrentPage(i)}
              >
                {i + 1}
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-between gap-2 mt-4 pt-3 border-t">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {currentPage < totalPages - 1 && (
              <Button onClick={() => setCurrentPage(p => p + 1)}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleSaveProgress}
              disabled={updateMmpi2Test.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar
            </Button>

            {currentPage === totalPages - 1 && (
              <Button 
                onClick={handleFinishTest} 
                disabled={updateMmpi2Test.isPending || responses.size < TOTAL_QUESTIONS}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Finalizar
              </Button>
            )}
          </div>
        </div>

        {responses.size < TOTAL_QUESTIONS && currentPage === totalPages - 1 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Faltan {TOTAL_QUESTIONS - responses.size} respuestas para completar el inventario
          </p>
        )}
      </CardContent>
    </Card>
  );
};
