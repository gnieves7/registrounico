import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Scale, FileText, Clock, CheckCircle2 } from "lucide-react";
import { MbtiTest } from "@/components/psychodiagnostic/MbtiTest";
import { Mmpi2Test } from "@/components/psychodiagnostic/Mmpi2Test";
import { ForensicSection } from "@/components/psychodiagnostic/ForensicSection";
import { usePsychodiagnostic } from "@/hooks/usePsychodiagnostic";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Psychodiagnostic = () => {
  const { mbtiTests, mmpi2Tests, mbtiLoading, mmpi2Loading } = usePsychodiagnostic();
  const [selectedMbtiTest, setSelectedMbtiTest] = useState<string | null>(null);
  const [selectedMmpi2Test, setSelectedMmpi2Test] = useState<string | null>(null);

  const latestMbti = mbtiTests[0];
  const latestMmpi2 = mmpi2Tests[0];

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registro Psicodiagnóstico</h1>
        <p className="text-muted-foreground">
          Evaluaciones psicológicas y registro de casos forenses
        </p>
      </div>

      <Tabs defaultValue="clinical" className="space-y-6">
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

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* MBTI Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Test MBTI
                </CardTitle>
                <CardDescription>
                  Indicador de Tipo Myers-Briggs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mbtiLoading ? (
                  <p className="text-muted-foreground">Cargando...</p>
                ) : latestMbti ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Último resultado:</span>
                      {latestMbti.is_complete ? (
                        <Badge variant="default" className="text-lg px-3">
                          {latestMbti.personality_type}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          En progreso
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(latestMbti.test_date), "PPP", { locale: es })}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedMbtiTest(latestMbti.id)}
                    >
                      {latestMbti.is_complete ? "Ver Resultados" : "Continuar Test"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">No has realizado este test</p>
                    <Button onClick={() => setSelectedMbtiTest("new")}>
                      Comenzar Test
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MMPI-2 Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  MMPI-2
                </CardTitle>
                <CardDescription>
                  Inventario Multifásico de Personalidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mmpi2Loading ? (
                  <p className="text-muted-foreground">Cargando...</p>
                ) : latestMmpi2 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progreso:</span>
                      {latestMmpi2.is_complete ? (
                        <Badge variant="default">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          {latestMmpi2.total_questions_answered}/567
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(latestMmpi2.test_date), "PPP", { locale: es })}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedMmpi2Test(latestMmpi2.id)}
                    >
                      {latestMmpi2.is_complete ? "Ver Respuestas" : "Continuar"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-3">No has realizado este inventario</p>
                    <Button onClick={() => setSelectedMmpi2Test("new")}>
                      Comenzar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Test Components */}
          {selectedMbtiTest && (
            <MbtiTest 
              existingTest={selectedMbtiTest === "new" ? undefined : mbtiTests.find(t => t.id === selectedMbtiTest)}
              onComplete={() => setSelectedMbtiTest(null)}
            />
          )}

          {selectedMmpi2Test && (
            <Mmpi2Test 
              existingTest={selectedMmpi2Test === "new" ? undefined : mmpi2Tests.find(t => t.id === selectedMmpi2Test)}
              onComplete={() => setSelectedMmpi2Test(null)}
            />
          )}

          {/* Test History */}
          {mbtiTests.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Tests MBTI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mbtiTests.slice(1).map(test => (
                    <div 
                      key={test.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => setSelectedMbtiTest(test.id)}
                    >
                      <div>
                        <span className="font-medium">{test.personality_type || "Incompleto"}</span>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(test.test_date), "PP", { locale: es })}
                        </p>
                      </div>
                      <Badge variant={test.is_complete ? "default" : "secondary"}>
                        {test.is_complete ? "Completado" : "En progreso"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="forensic">
          <ForensicSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Psychodiagnostic;
