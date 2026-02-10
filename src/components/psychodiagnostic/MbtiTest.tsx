import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, CheckCircle2, ArrowRight, ArrowLeft, RotateCcw, Target, Shield, AlertTriangle, Lightbulb, Users, Briefcase, Building2 } from "lucide-react";
import { mbtiQuestions, mbtiDescriptions, mbtiPreferences, getPreferenceStrength, type MbtiQuestion } from "@/data/mbtiQuestions";
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
    const typeInfo = mbtiDescriptions[type];

    if (!typeInfo) {
      return (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <CardTitle>Tipo: {type}</CardTitle>
          </CardHeader>
        </Card>
      );
    }

    const dimensions = [
      { left: 'E', right: 'I', leftLabel: 'Extroversión', rightLabel: 'Introversión', leftScore: scores.E, rightScore: scores.I },
      { left: 'S', right: 'N', leftLabel: 'Sensación', rightLabel: 'Intuición', leftScore: scores.S, rightScore: scores.N },
      { left: 'T', right: 'F', leftLabel: 'Pensamiento', rightLabel: 'Sentimiento', leftScore: scores.T, rightScore: scores.F },
      { left: 'J', right: 'P', leftLabel: 'Juicio', rightLabel: 'Percepción', leftScore: scores.J, rightScore: scores.P },
    ];

    return (
      <div className="space-y-6">
        {/* Header Card */}
        <Card className="border-primary/20 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Tu tipo de personalidad</h2>
            <Badge variant="secondary" className="mt-2 text-2xl px-6 py-1.5 font-bold">
              {type}
            </Badge>
            <p className="text-xl font-semibold text-primary mt-2">{typeInfo.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{typeInfo.subtitle}</p>
          </div>
          <CardContent className="pt-4">
            <p className="text-muted-foreground leading-relaxed">{typeInfo.description}</p>
          </CardContent>
        </Card>

        {/* Scores Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-primary" />
              Perfil de Preferencias
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {dimensions.map((dim) => {
              const total = dim.leftScore + dim.rightScore;
              const leftPercent = total > 0 ? (dim.leftScore / total) * 100 : 50;
              const diff = Math.abs(dim.leftScore - dim.rightScore);
              const strength = getPreferenceStrength(diff);

              return (
                <div key={dim.left} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${dim.leftScore >= dim.rightScore ? 'text-primary' : 'text-muted-foreground'}`}>
                      {dim.leftLabel} ({dim.left}): {dim.leftScore}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <span className={strength.color}>{strength.label}</span>
                    </Badge>
                    <span className={`font-medium ${dim.rightScore > dim.leftScore ? 'text-primary' : 'text-muted-foreground'}`}>
                      {dim.rightLabel} ({dim.right}): {dim.rightScore}
                    </span>
                  </div>
                  <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-primary/70 transition-all"
                      style={{ width: `${leftPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Preference Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Tus Preferencias Dominantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {type.split('').map((letter) => {
                const pref = mbtiPreferences[letter as keyof typeof mbtiPreferences];
                if (!pref) return null;
                return (
                  <div key={letter} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="text-sm">{pref.letter}</Badge>
                      <span className="font-semibold">{pref.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                    <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                      {pref.characteristics.slice(0, 4).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Contributions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Contribución a la Organización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {typeInfo.contributions.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Leadership & Environment */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-primary" />
                Estilo de Mando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typeInfo.leadershipStyle.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">▸</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-primary" />
                Entorno de Trabajo Preferido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typeInfo.preferredEnvironment.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">▸</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Dangers & Suggestions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Peligros Potenciales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typeInfo.potentialDangers.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-destructive">⚠</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base text-primary">
                <Lightbulb className="h-4 w-4" />
                Sugerencias de Desarrollo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {typeInfo.developmentSuggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">💡</span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Button onClick={handleStartTest} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Realizar test nuevamente
        </Button>
      </div>
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
            <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
              <h4 className="font-medium mb-2 text-sm">Dimensiones que se evalúan</h4>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>• <strong>E/I</strong> – Extroversión vs Introversión</div>
                <div>• <strong>S/N</strong> – Sensación vs Intuición</div>
                <div>• <strong>T/F</strong> – Pensamiento vs Sentimiento</div>
                <div>• <strong>J/P</strong> – Juicio vs Percepción</div>
              </div>
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