import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Clock, CheckCircle2, Activity, UserCheck } from "lucide-react";
import { MbtiTest } from "@/components/psychodiagnostic/MbtiTest";
import { Mmpi2Test } from "@/components/psychodiagnostic/Mmpi2Test";
import { Mcmi3Test } from "@/components/psychodiagnostic/Mcmi3Test";
import { Scl90rTest } from "@/components/psychodiagnostic/Scl90rTest";
import { InformedConsent } from "@/components/psychodiagnostic/InformedConsent";
import { usePsychodiagnostic } from "@/hooks/usePsychodiagnostic";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Psychodiagnostic = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    mbtiTests, mmpi2Tests, mcmi3Tests, scl90rTests,
    mbtiLoading, mmpi2Loading, mcmi3Loading, scl90rLoading,
    refetchMbti, refetchMmpi2, refetchMcmi3, refetchScl90r
  } = usePsychodiagnostic();
  const [selectedMbtiTest, setSelectedMbtiTest] = useState<string | null>(null);
  const [selectedMmpi2Test, setSelectedMmpi2Test] = useState<string | null>(null);
  const [selectedMcmi3Test, setSelectedMcmi3Test] = useState<string | null>(null);
  const [selectedScl90rTest, setSelectedScl90rTest] = useState<string | null>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingTestAction, setPendingTestAction] = useState<{ type: 'mbti' | 'mmpi2' | 'mcmi3' | 'scl90r'; testId: string } | null>(null);

  const latestMbti = mbtiTests[0];
  const latestMmpi2 = mmpi2Tests[0];
  const latestMcmi3 = mcmi3Tests[0];
  const latestScl90r = scl90rTests[0];

  const hasAcceptedConsent = (test: any) => test?.consent_accepted === true;

  const handleStartTest = (type: 'mbti' | 'mmpi2' | 'mcmi3' | 'scl90r', testId: string) => {
    const testMap = { mbti: mbtiTests, mmpi2: mmpi2Tests, mcmi3: mcmi3Tests, scl90r: scl90rTests };
    const test = testId === "new" ? null : testMap[type].find((t: any) => t.id === testId);
    if (test && hasAcceptedConsent(test)) {
      const setterMap = { mbti: setSelectedMbtiTest, mmpi2: setSelectedMmpi2Test, mcmi3: setSelectedMcmi3Test, scl90r: setSelectedScl90rTest };
      setterMap[type](testId);
    } else {
      setPendingTestAction({ type, testId });
      setShowConsent(true);
    }
  };

  const handleConsentAccept = async () => {
    if (!user || !pendingTestAction) return;
    const { type, testId } = pendingTestAction;
    const tableMap = { mbti: "mbti_tests", mmpi2: "mmpi2_tests", mcmi3: "mcmi3_tests", scl90r: "scl90r_tests" } as const;
    const refetchMap = { mbti: refetchMbti, mmpi2: refetchMmpi2, mcmi3: refetchMcmi3, scl90r: refetchScl90r };
    const setterMap = { mbti: setSelectedMbtiTest, mmpi2: setSelectedMmpi2Test, mcmi3: setSelectedMcmi3Test, scl90r: setSelectedScl90rTest };
    
    try {
      if (testId === "new") {
        const { data, error } = await supabase
          .from(tableMap[type])
          .insert({ user_id: user.id, consent_accepted: true, consent_date: new Date().toISOString() } as any)
          .select()
          .single();
        if (error) throw error;
        await refetchMap[type]();
        setterMap[type]((data as any).id);
      } else {
        await supabase
          .from(tableMap[type])
          .update({ consent_accepted: true, consent_date: new Date().toISOString() } as any)
          .eq("id", testId);
        setterMap[type](testId);
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "No se pudo guardar el consentimiento", variant: "destructive" });
    }
    setShowConsent(false);
    setPendingTestAction(null);
  };

  const handleConsentDecline = () => {
    setShowConsent(false);
    setPendingTestAction(null);
  };

  const testNameMap: Record<string, string> = {
    mbti: "Test MBTI",
    mmpi2: "MMPI-2",
    mcmi3: "MCMI-III",
    scl90r: "SCL-90-R",
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-3xl">Evaluación Psicodiagnóstica</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Evaluaciones psicológicas estandarizadas
        </p>
      </div>

      <Tabs defaultValue="personalidad" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personalidad" className="transition-all duration-200 hover:scale-105 active:scale-95">
            <UserCheck className="h-4 w-4 mr-2" />
            Personalidad
          </TabsTrigger>
          <TabsTrigger value="sintomas" className="transition-all duration-200 hover:scale-105 active:scale-95">
            <Activity className="h-4 w-4 mr-2" />
            Síntomas
          </TabsTrigger>
        </TabsList>

        {/* ========== PERSONALIDAD TAB ========== */}
        <TabsContent value="personalidad" className="space-y-6 mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* MBTI Card */}
            <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-5 w-5 text-primary" />
                  Test MBTI
                </CardTitle>
                <CardDescription className="text-xs">Indicador de Tipo Myers-Briggs</CardDescription>
              </CardHeader>
              <CardContent>
                {mbtiLoading ? <p className="text-muted-foreground text-sm">Cargando...</p> : latestMbti ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {latestMbti.is_complete ? (
                        <Badge variant="default" className="text-sm px-2">{latestMbti.personality_type}</Badge>
                      ) : (
                        <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En progreso</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{format(new Date(latestMbti.test_date), "PP", { locale: es })}</p>
                    <Button variant="outline" className="w-full text-sm transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => handleStartTest('mbti', latestMbti.id)}>
                      {latestMbti.is_complete ? "Ver Resultados" : "Continuar"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted-foreground text-sm mb-2">No realizado</p>
                    <Button size="sm" onClick={() => handleStartTest('mbti', "new")} className="transition-all duration-200 hover:scale-105 active:scale-95">Comenzar</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MMPI-2 Card */}
            <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-5 w-5 text-primary" />
                  MMPI-2
                </CardTitle>
                <CardDescription className="text-xs">Inventario Multifásico de Personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                {mmpi2Loading ? <p className="text-muted-foreground text-sm">Cargando...</p> : latestMmpi2 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {latestMmpi2.is_complete ? (
                        <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>
                      ) : (
                        <Badge variant="secondary">{latestMmpi2.total_questions_answered}/567</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{format(new Date(latestMmpi2.test_date), "PP", { locale: es })}</p>
                    <Button variant="outline" className="w-full text-sm transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => handleStartTest('mmpi2', latestMmpi2.id)}>
                      {latestMmpi2.is_complete ? "Ver Respuestas" : "Continuar"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted-foreground text-sm mb-2">No realizado</p>
                    <Button size="sm" onClick={() => handleStartTest('mmpi2', "new")} className="transition-all duration-200 hover:scale-105 active:scale-95">Comenzar</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* MCMI-III Card */}
            <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCheck className="h-5 w-5 text-primary" />
                  MCMI-III
                </CardTitle>
                <CardDescription className="text-xs">Inventario Clínico Multiaxial de Millon</CardDescription>
              </CardHeader>
              <CardContent>
                {mcmi3Loading ? <p className="text-muted-foreground text-sm">Cargando...</p> : latestMcmi3 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {latestMcmi3.is_complete ? (
                        <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>
                      ) : (
                        <Badge variant="secondary">{latestMcmi3.total_questions_answered}/175</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{format(new Date(latestMcmi3.test_date), "PP", { locale: es })}</p>
                    <Button variant="outline" className="w-full text-sm transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => handleStartTest('mcmi3', latestMcmi3.id)}>
                      {latestMcmi3.is_complete ? "Ver Respuestas" : "Continuar"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-muted-foreground text-sm mb-2">No realizado</p>
                    <Button size="sm" onClick={() => handleStartTest('mcmi3', "new")} className="transition-all duration-200 hover:scale-105 active:scale-95">Comenzar</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Active Test Components */}
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
          {selectedMcmi3Test && (
            <Mcmi3Test 
              existingTest={selectedMcmi3Test === "new" ? undefined : mcmi3Tests.find(t => t.id === selectedMcmi3Test) as any}
              onComplete={() => setSelectedMcmi3Test(null)}
            />
          )}
        </TabsContent>

        {/* ========== SÍNTOMAS TAB ========== */}
        <TabsContent value="sintomas" className="space-y-6 mt-4">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                SCL-90-R
              </CardTitle>
              <CardDescription>
                Listado de Síntomas — L. R. Derogatis (Adaptación UBA, 1999)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scl90rLoading ? <p className="text-muted-foreground">Cargando...</p> : latestScl90r ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progreso:</span>
                    {latestScl90r.is_complete ? (
                      <Badge variant="default"><CheckCircle2 className="h-3 w-3 mr-1" />Completado</Badge>
                    ) : (
                      <Badge variant="secondary">{latestScl90r.total_questions_answered}/90</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{format(new Date(latestScl90r.test_date), "PP", { locale: es })}</p>
                  <Button variant="outline" className="w-full transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => handleStartTest('scl90r', latestScl90r.id)}>
                    {latestScl90r.is_complete ? "Ver Respuestas" : "Continuar"}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No has realizado este test</p>
                  <Button onClick={() => handleStartTest('scl90r', "new")} className="transition-all duration-200 hover:scale-105 active:scale-95">Comenzar SCL-90-R</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedScl90rTest && (
            <Scl90rTest 
              existingTest={selectedScl90rTest === "new" ? undefined : scl90rTests.find(t => t.id === selectedScl90rTest) as any}
              onComplete={() => setSelectedScl90rTest(null)}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Informed Consent Dialog */}
      <InformedConsent
        open={showConsent}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
        testName={pendingTestAction ? testNameMap[pendingTestAction.type] : ""}
      />
    </div>
  );
};

export default Psychodiagnostic;
