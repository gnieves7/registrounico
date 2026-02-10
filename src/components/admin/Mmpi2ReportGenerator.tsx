import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Download, Edit, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  VALIDITY_SCALES, CLINICAL_SCALES, CONTENT_SCALES,
  SCALE_INTERPRETATIONS,
  calculateRawScore, calculateTScore,
  analyzeValidityPattern, analyzeClinicalPatterns,
  getTScoreLevel, getScaleInterpretation,
} from "@/data/mmpi2ScoringData";

interface Mmpi2Response {
  question_number: number;
  answer: 'V' | 'F';
}

interface Mmpi2ReportGeneratorProps {
  testId: string;
  patientId: string;
  responses: Mmpi2Response[];
  totalAnswered: number;
  isComplete: boolean;
  testDate: string;
  clinicalInterpretation?: string | null;
  clinicalNotes?: string | null;
}

export const Mmpi2ReportGenerator = ({
  testId, patientId, responses, totalAnswered, isComplete,
  testDate, clinicalInterpretation, clinicalNotes,
}: Mmpi2ReportGeneratorProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [price, setPrice] = useState("0");
  const [additionalNotes, setAdditionalNotes] = useState(clinicalInterpretation || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportContent = useMemo(() => {
    if (responses.length < 100) return null;

    const responseMap = new Map<number, 'V' | 'F'>(
      responses.map(r => [r.question_number, r.answer])
    );

    const kScale = VALIDITY_SCALES.find(s => s.code === 'K')!;
    const kRaw = calculateRawScore(responseMap, kScale);

    const scores: { code: string; name: string; type: string; raw: number; tScore: number; level: string; interpretation: string }[] = [];

    // Validity
    for (const scale of VALIDITY_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Validez", raw, tScore: t, level, interpretation: interp });
    }

    // Clinical
    for (const scale of CLINICAL_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender, scale.kCorrection ? kRaw : undefined, scale.kCorrection);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Clínica", raw, tScore: t, level, interpretation: interp });
    }

    // Content
    for (const scale of CONTENT_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Contenido", raw, tScore: t, level, interpretation: interp });
    }

    const tScores: Record<string, number> = {};
    scores.forEach(s => { tScores[s.code] = s.tScore; });

    const validityFindings = analyzeValidityPattern(tScores);
    const clinicalFindings = analyzeClinicalPatterns(tScores);

    return { scores, validityFindings, clinicalFindings, omissions: 567 - totalAnswered };
  }, [responses, gender, totalAnswered]);

  const generateReportText = () => {
    if (!reportContent) return "";

    const lines: string[] = [];
    lines.push("INFORME DE RESULTADOS - MMPI-2");
    lines.push("Inventario Multifásico de Personalidad de Minnesota - 2");
    lines.push(`Fecha del test: ${testDate}`);
    lines.push(`Baremos: ${gender === 'male' ? 'Hombres' : 'Mujeres'}`);
    lines.push(`Respuestas: ${totalAnswered}/567 | Omisiones: ${reportContent.omissions}`);
    lines.push(`Estado: ${isComplete ? 'Completado' : 'Incompleto'}`);
    lines.push("");
    lines.push("═══════════════════════════════════════");
    lines.push("ESCALAS DE VALIDEZ");
    lines.push("═══════════════════════════════════════");
    reportContent.scores.filter(s => s.type === "Validez").forEach(s => {
      lines.push(`${s.code} (${s.name}): PD=${s.raw} | T=${s.tScore} | ${s.level}`);
      if (s.interpretation) lines.push(`  → ${s.interpretation}`);
    });
    lines.push("");
    lines.push("Análisis de Validez:");
    reportContent.validityFindings.forEach(f => lines.push(`  • ${f}`));

    lines.push("");
    lines.push("═══════════════════════════════════════");
    lines.push("ESCALAS CLÍNICAS BÁSICAS");
    lines.push("═══════════════════════════════════════");
    reportContent.scores.filter(s => s.type === "Clínica").forEach(s => {
      lines.push(`${s.code} (${s.name}): PD=${s.raw} | T=${s.tScore} | ${s.level}`);
      if (s.tScore >= 65 && s.interpretation) lines.push(`  → ${s.interpretation}`);
    });

    lines.push("");
    lines.push("═══════════════════════════════════════");
    lines.push("ESCALAS DE CONTENIDO");
    lines.push("═══════════════════════════════════════");
    reportContent.scores.filter(s => s.type === "Contenido").forEach(s => {
      lines.push(`${s.code} (${s.name}): PD=${s.raw} | T=${s.tScore} | ${s.level}`);
      if (s.tScore >= 65 && s.interpretation) lines.push(`  → ${s.interpretation}`);
    });

    lines.push("");
    lines.push("═══════════════════════════════════════");
    lines.push("HALLAZGOS CLÍNICOS");
    lines.push("═══════════════════════════════════════");
    reportContent.clinicalFindings.forEach(f => lines.push(`• ${f}`));

    if (additionalNotes) {
      lines.push("");
      lines.push("═══════════════════════════════════════");
      lines.push("INTERPRETACIÓN DEL PROFESIONAL");
      lines.push("═══════════════════════════════════════");
      lines.push(additionalNotes);
    }

    if (clinicalNotes) {
      lines.push("");
      lines.push("NOTAS ADICIONALES:");
      lines.push(clinicalNotes);
    }

    lines.push("");
    lines.push("─────────────────────────────────────");
    lines.push("Este informe ha sido generado como herramienta de apoyo.");
    lines.push("La interpretación final corresponde al profesional tratante.");

    return lines.join("\n");
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportText = generateReportText();
      const priceNum = parseFloat(price) || 0;

      // Create a document record
      const { error } = await supabase.from("documents").insert({
        patient_id: patientId,
        title: `Informe MMPI-2 - ${new Date(testDate).toLocaleDateString('es-AR')}`,
        description: reportText,
        document_type: "informe",
        price: priceNum,
        is_paid: priceNum === 0,
        payment_date: priceNum === 0 ? new Date().toISOString() : null,
      });

      if (error) throw error;

      toast({ title: "Informe generado", description: priceNum > 0 ? `Con costo de $${priceNum} para el paciente` : "Gratuito para el paciente" });
      setShowDialog(false);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Error", description: "No se pudo generar el informe", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!reportContent) return null;

  return (
    <>
      <Button variant="outline" className="gap-2" onClick={() => setShowDialog(true)}>
        <FileText className="h-4 w-4" />
        Generar Informe
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generar Informe MMPI-2
            </DialogTitle>
            <DialogDescription>
              El informe quedará disponible en la sección de Documentos del paciente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Baremos</Label>
                <select
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                >
                  <option value="male">Hombres</option>
                  <option value="female">Mujeres</option>
                </select>
              </div>
              <div className="flex-1">
                <Label className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Precio (ARS)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0 = gratuito"
                  className="mt-1"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {parseFloat(price) > 0 ? "El paciente deberá pagar para descargar" : "Gratuito para el paciente"}
                </p>
              </div>
            </div>

            <div>
              <Label>Interpretación del profesional (editable)</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Agregue su interpretación clínica..."
                rows={5}
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">El informe incluirá:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Escalas de Validez con interpretación</li>
                <li>Escalas Clínicas Básicas con puntajes T</li>
                <li>Escalas de Contenido</li>
                <li>Hallazgos clínicos y patrones detectados</li>
                <li>Su interpretación profesional</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Generando..." : "Crear Informe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
