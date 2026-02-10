import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  VALIDITY_SCALES, CLINICAL_SCALES, CONTENT_SCALES,
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

interface ScoreEntry {
  code: string;
  name: string;
  type: string;
  raw: number;
  tScore: number;
  level: string;
  interpretation: string;
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

    const scores: ScoreEntry[] = [];

    for (const scale of VALIDITY_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Validez", raw, tScore: t, level, interpretation: interp });
    }

    for (const scale of CLINICAL_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender, scale.kCorrection ? kRaw : undefined, scale.kCorrection);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Clínica", raw, tScore: t, level, interpretation: interp });
    }

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

  const handleDownloadPdf = () => {
    if (!reportContent) return;

    const validityScores = reportContent.scores.filter(s => s.type === "Validez");
    const clinicalScores = reportContent.scores.filter(s => s.type === "Clínica");
    const contentScores = reportContent.scores.filter(s => s.type === "Contenido");

    const buildScaleRows = (scores: ScoreEntry[]) => scores.map(s => {
      const color = s.tScore >= 76 ? '#dc2626' : s.tScore >= 65 ? '#d97706' : '#16a34a';
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;font-weight:600;">${s.code}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;">${s.name}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;text-align:center;font-family:monospace;">${s.raw}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;text-align:center;font-family:monospace;font-weight:bold;color:${color};">${s.tScore}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e5e5;"><span style="background:${color}15;color:${color};padding:2px 8px;border-radius:10px;font-size:11px;">${s.level}</span></td>
      </tr>`;
    }).join('');

    // Build SVG chart for clinical scales
    const chartScales = [...validityScores, ...clinicalScores];
    const chartWidth = 700;
    const chartHeight = 260;
    const marginLeft = 40;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 40;
    const plotW = chartWidth - marginLeft - marginRight;
    const plotH = chartHeight - marginTop - marginBottom;
    const xStep = plotW / (chartScales.length - 1);
    const yMin = 30, yMax = 120;
    const toY = (t: number) => marginTop + plotH - ((t - yMin) / (yMax - yMin)) * plotH;
    const toX = (i: number) => marginLeft + i * xStep;

    const points = chartScales.map((s, i) => `${toX(i)},${toY(s.tScore)}`).join(' ');
    const dots = chartScales.map((s, i) => 
      `<circle cx="${toX(i)}" cy="${toY(s.tScore)}" r="4" fill="#8b6914" stroke="#fff" stroke-width="2"/>
       <text x="${toX(i)}" y="${toY(s.tScore) - 10}" text-anchor="middle" font-size="10" fill="#333" font-weight="bold">${s.tScore}</text>`
    ).join('');
    const xLabels = chartScales.map((s, i) =>
      `<text x="${toX(i)}" y="${chartHeight - 5}" text-anchor="middle" font-size="10" fill="#666">${s.code}</text>`
    ).join('');
    const yTicks = [30, 50, 65, 76, 90, 120];
    const yLabelsAndGrid = yTicks.map(t =>
      `<line x1="${marginLeft}" y1="${toY(t)}" x2="${chartWidth - marginRight}" y2="${toY(t)}" stroke="#ddd" stroke-dasharray="${t === 65 || t === 76 ? '4,4' : '2,6'}"/>
       <text x="${marginLeft - 5}" y="${toY(t) + 4}" text-anchor="end" font-size="9" fill="#999">${t}</text>`
    ).join('');

    const svgChart = `
      <svg width="${chartWidth}" height="${chartHeight}" xmlns="http://www.w3.org/2000/svg" style="font-family:Arial,sans-serif;">
        <rect x="${marginLeft}" y="${toY(120)}" width="${plotW}" height="${toY(76) - toY(120)}" fill="#dc262610"/>
        <rect x="${marginLeft}" y="${toY(76)}" width="${plotW}" height="${toY(65) - toY(76)}" fill="#d9770610"/>
        <rect x="${marginLeft}" y="${toY(65)}" width="${plotW}" height="${toY(50) - toY(65)}" fill="#16a34a08"/>
        <rect x="${marginLeft}" y="${toY(50)}" width="${plotW}" height="${toY(30) - toY(50)}" fill="#16a34a04"/>
        ${yLabelsAndGrid}
        <polyline points="${points}" fill="none" stroke="#8b6914" stroke-width="2.5"/>
        ${dots}
        ${xLabels}
        <text x="${chartWidth - 10}" y="${toY(76) - 4}" text-anchor="end" font-size="9" fill="#d97706">T=76 Muy elevado</text>
        <text x="${chartWidth - 10}" y="${toY(65) - 4}" text-anchor="end" font-size="9" fill="#d97706">T=65 Elevado</text>
      </svg>`;

    const logoSvg = `<svg viewBox="0 0 100 100" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="45" r="25" fill="none" stroke="hsl(45,93%,58%)" stroke-width="4"/>
      <circle cx="50" cy="35" r="25" fill="none" stroke="hsl(40,30%,96%)" stroke-width="4"/>
      <circle cx="65" cy="45" r="25" fill="none" stroke="hsl(199,89%,60%)" stroke-width="4"/>
      <circle cx="35" cy="45" r="12" fill="hsl(45,93%,58%)" opacity="0.15"/>
      <circle cx="50" cy="35" r="12" fill="hsl(40,30%,96%)" opacity="0.15"/>
      <circle cx="65" cy="45" r="12" fill="hsl(199,89%,60%)" opacity="0.15"/>
    </svg>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Informe MMPI-2</title>
<style>
  @media print { @page { margin: 15mm 20mm; size: A4; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; font-size: 12px; line-height: 1.5; }
  .header { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #8b6914; padding-bottom: 16px; margin-bottom: 20px; }
  .header-text h1 { margin: 0; font-size: 20px; color: #8b6914; }
  .header-text p { margin: 2px 0; color: #666; font-size: 11px; }
  .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; background: #faf8f2; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
  .meta-item { text-align: center; }
  .meta-item .label { font-size: 10px; color: #999; text-transform: uppercase; }
  .meta-item .value { font-weight: 600; color: #333; }
  .section-title { font-size: 14px; font-weight: 700; color: #8b6914; border-bottom: 1px solid #e5d9b8; padding-bottom: 4px; margin: 20px 0 10px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background: #f5f0e0; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #8b6914; border-bottom: 2px solid #d4c48a; }
  .findings { background: #faf8f2; padding: 12px; border-radius: 8px; border-left: 3px solid #8b6914; }
  .findings li { margin-bottom: 4px; }
  .interpretation-box { background: #f0f7ff; padding: 14px; border-radius: 8px; border-left: 3px solid #3b82f6; white-space: pre-wrap; }
  .chart-container { text-align: center; margin: 10px 0; page-break-inside: avoid; }
  .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 10px; color: #999; text-align: center; }
</style></head><body>
<div class="header">
  ${logoSvg}
  <div class="header-text">
    <h1>INFORME DE RESULTADOS MMPI-2</h1>
    <p>Inventario Multifásico de Personalidad de Minnesota - 2</p>
    <p>Fecha de generación: ${new Date().toLocaleDateString('es-AR')}</p>
  </div>
</div>

<div class="meta-grid">
  <div class="meta-item"><div class="label">Fecha del Test</div><div class="value">${new Date(testDate).toLocaleDateString('es-AR')}</div></div>
  <div class="meta-item"><div class="label">Baremos</div><div class="value">${gender === 'male' ? 'Hombres' : 'Mujeres'}</div></div>
  <div class="meta-item"><div class="label">Respuestas</div><div class="value">${totalAnswered}/567 (Omisiones: ${reportContent.omissions})</div></div>
</div>

<div class="section-title">Perfil Gráfico - Escalas de Validez y Clínicas</div>
<div class="chart-container">${svgChart}</div>

<div class="section-title">Escalas de Validez</div>
<table><thead><tr><th>Código</th><th>Escala</th><th style="text-align:center;">PD</th><th style="text-align:center;">T</th><th>Nivel</th></tr></thead>
<tbody>${buildScaleRows(validityScores)}</tbody></table>

<div class="findings" style="margin-top:10px;">
  <strong>Análisis de Validez:</strong>
  <ul>${reportContent.validityFindings.map(f => `<li>${f}</li>`).join('')}</ul>
</div>

<div class="section-title" style="page-break-before:auto;">Escalas Clínicas Básicas</div>
<table><thead><tr><th>Código</th><th>Escala</th><th style="text-align:center;">PD</th><th style="text-align:center;">T</th><th>Nivel</th></tr></thead>
<tbody>${buildScaleRows(clinicalScores)}</tbody></table>

${clinicalScores.filter(s => s.tScore >= 65 && s.interpretation).length > 0 ? `
<div class="findings" style="margin-top:10px;">
  <strong>Interpretación de Escalas Elevadas:</strong>
  <ul>${clinicalScores.filter(s => s.tScore >= 65 && s.interpretation).map(s => `<li><strong>${s.code} (${s.name}, T=${s.tScore}):</strong> ${s.interpretation}</li>`).join('')}</ul>
</div>` : ''}

<div class="section-title">Escalas de Contenido</div>
<table><thead><tr><th>Código</th><th>Escala</th><th style="text-align:center;">PD</th><th style="text-align:center;">T</th><th>Nivel</th></tr></thead>
<tbody>${buildScaleRows(contentScores)}</tbody></table>

<div class="section-title">Hallazgos Clínicos</div>
<div class="findings">
  <ul>${reportContent.clinicalFindings.map(f => `<li>${f}</li>`).join('')}</ul>
</div>

${additionalNotes ? `
<div class="section-title">Interpretación del Profesional</div>
<div class="interpretation-box">${additionalNotes.replace(/\n/g, '<br>')}</div>` : ''}

${clinicalNotes ? `
<div class="section-title">Notas Adicionales</div>
<div class="interpretation-box">${clinicalNotes.replace(/\n/g, '<br>')}</div>` : ''}

<div class="footer">
  <p>Este informe ha sido generado como herramienta de apoyo clínico.</p>
  <p>La interpretación final corresponde al profesional tratante.</p>
</div>
</body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const reportText = generateReportText();
      const priceNum = parseFloat(price) || 0;

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
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={() => setShowDialog(true)}>
          <FileText className="h-4 w-4" />
          Generar Informe
        </Button>
        <Button variant="outline" className="gap-2" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

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
                <li>Gráfico de perfil con zonas normativas</li>
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
