import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, AlertTriangle, Brain, Heart, Shield, TrendingUp, User, Zap
} from "lucide-react";
import {
  VALIDITY_SCALES, CLINICAL_SCALES, CONTENT_SCALES, SUPPLEMENTARY_SCALES,
  SCALE_INTERPRETATIONS, SCALE_NORMS,
  calculateRawScore, calculateTScore,
  analyzeValidityPattern, analyzeClinicalPatterns,
  getTScoreLevel, getScaleInterpretation,
} from "@/data/mmpi2ScoringData";
import { Mmpi2ProfileChart } from "./Mmpi2ProfileChart";

interface Mmpi2Response {
  question_number: number;
  answer: 'V' | 'F';
}

interface Mmpi2ProfileAnalysisProps {
  responses: Mmpi2Response[];
  totalAnswered: number;
  isComplete: boolean;
  gender?: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
}

const SCALE_ICONS: Record<string, typeof Activity> = {
  Hs: Heart, D: TrendingUp, Hy: Activity, Pd: Shield, Mf: User,
  Pa: AlertTriangle, Pt: Zap, Sc: Brain, Ma: Activity, Si: User,
};

export const Mmpi2ProfileAnalysis = ({ responses, totalAnswered, isComplete, gender: externalGender, onGenderChange }: Mmpi2ProfileAnalysisProps) => {
  const [internalGender, setInternalGender] = useState<'male' | 'female'>('male');
  const gender = externalGender ?? internalGender;
  const handleGenderChange = (v: string) => {
    const g = v as 'male' | 'female';
    if (onGenderChange) onGenderChange(g);
    else setInternalGender(g);
  };

  const analysis = useMemo(() => {
    if (responses.length < 100) return null;

    const responseMap = new Map<number, 'V' | 'F'>(
      responses.map(r => [r.question_number, r.answer])
    );

    // Calculate K raw score first (needed for K-correction)
    const kScale = VALIDITY_SCALES.find(s => s.code === 'K')!;
    const kRaw = calculateRawScore(responseMap, kScale);

    // Calculate raw and T scores for all scales
    const rawScores: Record<string, number> = {};
    const tScores: Record<string, number> = {};

    // Validity scales
    for (const scale of VALIDITY_SCALES) {
      rawScores[scale.code] = calculateRawScore(responseMap, scale);
      tScores[scale.code] = calculateTScore(rawScores[scale.code], scale.code, gender);
    }

    // Clinical scales
    for (const scale of CLINICAL_SCALES) {
      rawScores[scale.code] = calculateRawScore(responseMap, scale);
      tScores[scale.code] = calculateTScore(
        rawScores[scale.code], scale.code, gender,
        scale.kCorrection ? kRaw : undefined,
        scale.kCorrection
      );
    }

    // Content scales
    for (const scale of CONTENT_SCALES) {
      rawScores[scale.code] = calculateRawScore(responseMap, scale);
      tScores[scale.code] = calculateTScore(rawScores[scale.code], scale.code, gender);
    }

    // Supplementary scales
    for (const scale of SUPPLEMENTARY_SCALES) {
      rawScores[scale.code] = calculateRawScore(responseMap, scale);
      tScores[scale.code] = calculateTScore(rawScores[scale.code], scale.code, gender);
    }

    // Omissions count
    const omissions = 567 - totalAnswered;

    // Analysis
    const validityFindings = analyzeValidityPattern(tScores);
    const clinicalFindings = analyzeClinicalPatterns(tScores);

    return { rawScores, tScores, validityFindings, clinicalFindings, omissions, kRaw };
  }, [responses, gender, totalAnswered]);

  if (!analysis) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Análisis no disponible</AlertTitle>
        <AlertDescription>
          Se requieren al menos 100 respuestas para generar un perfil preliminar.
          Actualmente hay {responses.length} respuestas registradas.
        </AlertDescription>
      </Alert>
    );
  }

  const { rawScores, tScores, validityFindings, clinicalFindings, omissions } = analysis;

  const renderScaleBar = (code: string, name: string, icon?: typeof Activity) => {
    const tScore = tScores[code] || 50;
    const raw = rawScores[code] || 0;
    const { level, severity } = getTScoreLevel(tScore);
    const Icon = icon || Activity;
    const barColor = severity === 'very_elevated' ? '[&>div]:bg-destructive' :
                     severity === 'elevated' ? '[&>div]:bg-orange-500' : '';
    const badgeVariant = severity === 'very_elevated' ? 'destructive' as const :
                         severity === 'elevated' ? 'secondary' as const : 'outline' as const;

    return (
      <div key={code} className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-muted-foreground" />
            {name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">PD={raw}</span>
            <span className="font-mono text-xs">T={tScore}</span>
            <Badge variant={badgeVariant} className="text-[10px] px-1.5">
              {level}
            </Badge>
          </div>
        </div>
        <Progress value={Math.min((tScore - 30) * 1.2, 100)} className={`h-1.5 ${barColor}`} />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Alert className="border-primary/30 bg-primary/5">
        <Brain className="h-4 w-4" />
        <AlertTitle>Perfil MMPI-2 - Análisis Basado en Claves de Corrección</AlertTitle>
        <AlertDescription>
          Corrección basada en las claves estándar del MMPI-2. La interpretación final debe ser realizada por el profesional.
          {!isComplete && (
            <span className="block mt-1 text-destructive font-medium">
              ⚠️ Inventario incompleto ({totalAnswered}/567) - Resultados preliminares
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Gender selection for norms - only show if not controlled externally */}
      {!onGenderChange && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Baremos:</span>
          <Select value={gender} onValueChange={(v) => handleGenderChange(v as 'male' | 'female')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Hombres</SelectItem>
              <SelectItem value="female">Mujeres</SelectItem>
            </SelectContent>
          </Select>
          {omissions > 0 && (
            <Badge variant="secondary" className="text-xs">
              ? (Omisiones): {omissions}
            </Badge>
          )}
        </div>
      )}
      {onGenderChange && omissions > 0 && (
        <Badge variant="secondary" className="text-xs">
          ? (Omisiones): {omissions}
        </Badge>
      )}

      <Tabs defaultValue="chart" className="space-y-3">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="chart" className="text-xs">Gráfico</TabsTrigger>
          <TabsTrigger value="validity" className="text-xs">Validez</TabsTrigger>
          <TabsTrigger value="clinical" className="text-xs">Clínicas</TabsTrigger>
          <TabsTrigger value="content" className="text-xs">Contenido</TabsTrigger>
          <TabsTrigger value="supplementary" className="text-xs">Suplem.</TabsTrigger>
          <TabsTrigger value="findings" className="text-xs">Hallazgos</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Mmpi2ProfileChart
            responses={responses}
            totalAnswered={totalAnswered}
            gender={gender}
            onGenderChange={handleGenderChange as (gender: 'male' | 'female') => void}
          />
        </TabsContent>

        <TabsContent value="validity">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Escalas de Validez
              </CardTitle>
              <CardDescription className="text-xs">
                Evalúan la actitud del examinado ante la prueba
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {VALIDITY_SCALES.map(scale => renderScaleBar(scale.code, `${scale.code} - ${scale.name}`))}
              
              <Separator className="my-3" />
              <div className="space-y-2">
                <h4 className="text-xs font-semibold">Configuración de Validez:</h4>
                {validityFindings.map((f, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-primary mt-0.5">•</span>{f}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinical">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Escalas Clínicas Básicas
              </CardTitle>
              <CardDescription className="text-xs">
                T≥65 indica elevación clínica | T≥76 muy marcada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {CLINICAL_SCALES.map(scale => 
                renderScaleBar(scale.code, `${scale.code} - ${scale.name}`, SCALE_ICONS[scale.code])
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Escalas de Contenido
              </CardTitle>
              <CardDescription className="text-xs">
                Evalúan áreas específicas de funcionamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {CONTENT_SCALES.map(scale => renderScaleBar(scale.code, `${scale.code} - ${scale.name}`))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplementary">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Escalas Suplementarias
              </CardTitle>
              <CardDescription className="text-xs">
                A, R, Es, MAC-R, O-H, Do, Re
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {SUPPLEMENTARY_SCALES.map(scale => renderScaleBar(scale.code, `${scale.code} - ${scale.name}`))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings">
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Hallazgos Clínicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {clinicalFindings.map((finding, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5 shrink-0">•</span>
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              {/* Content scale highlights */}
              {CONTENT_SCALES.filter(s => (tScores[s.code] || 50) >= 65).length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-semibold">Escalas de Contenido Elevadas:</h4>
                  {CONTENT_SCALES.filter(s => (tScores[s.code] || 50) >= 65).map(scale => {
                    const interp = getScaleInterpretation(scale.code, tScores[scale.code]);
                    return (
                      <div key={scale.code} className="text-sm">
                        <span className="font-medium">{scale.name} (T={tScores[scale.code]}):</span>
                        <span className="text-muted-foreground ml-1">{interp}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground italic">
                Nota: Este perfil utiliza las claves de corrección estándar del MMPI-2 con baremos normativos.
                La interpretación clínica debe ser contextualizada por el profesional considerando la historia del paciente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
