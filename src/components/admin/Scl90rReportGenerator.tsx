import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { scl90rDimensions } from "@/data/scl90rQuestions";

interface Scl90rReportGeneratorProps {
  testId: string;
  patientId: string;
  patientName?: string;
  testDate: string;
  responses: Record<number, number>;
  totalAnswered: number;
  isComplete: boolean;
  clinicalInterpretation?: string | null;
  clinicalNotes?: string | null;
}

interface DimensionScore {
  code: string;
  name: string;
  items: number[];
  rawSum: number;
  itemCount: number;
  mean: number;
}

export const Scl90rReportGenerator = ({
  testId, patientId, patientName, testDate, responses,
  totalAnswered, isComplete, clinicalInterpretation, clinicalNotes,
}: Scl90rReportGeneratorProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [price, setPrice] = useState("0");
  const [additionalNotes, setAdditionalNotes] = useState(clinicalInterpretation || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [patientBirthDate, setPatientBirthDate] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("psychobiographies").select("birth_date").eq("user_id", patientId).maybeSingle()
      .then(({ data }) => { if (data?.birth_date) setPatientBirthDate(data.birth_date); });
  }, [patientId]);

  const calcAge = (): string => {
    if (!patientBirthDate) return "—";
    const birth = new Date(patientBirthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return `${age} años`;
  };

  const scores = useMemo(() => {
    const dimensionScores: DimensionScore[] = [];

    for (const [code, dim] of Object.entries(scl90rDimensions)) {
      if (code === "ADICIONALES") continue;
      const rawSum = dim.items.reduce((sum, itemNum) => sum + (responses[itemNum] || 0), 0);
      dimensionScores.push({
        code,
        name: dim.name,
        items: dim.items,
        rawSum,
        itemCount: dim.items.length,
        mean: dim.items.length > 0 ? rawSum / dim.items.length : 0,
      });
    }

    // Global indices
    const allItems = Object.values(responses);
    const totalSum = allItems.reduce((s, v) => s + v, 0);
    const positiveItems = allItems.filter(v => v > 0).length;
    const gsi = totalAnswered > 0 ? totalSum / totalAnswered : 0;
    const pst = positiveItems;
    const psdi = positiveItems > 0 ? totalSum / positiveItems : 0;

    return { dimensions: dimensionScores, gsi, pst, psdi, totalSum };
  }, [responses, totalAnswered]);

  const getMeanLevel = (mean: number) => {
    if (mean >= 2.5) return { label: "Muy Elevado", color: "#dc2626", bg: "#fef2f2" };
    if (mean >= 1.5) return { label: "Elevado", color: "#d97706", bg: "#fffbeb" };
    if (mean >= 0.75) return { label: "Moderado", color: "#2563eb", bg: "#eff6ff" };
    return { label: "Bajo", color: "#16a34a", bg: "transparent" };
  };

  const handleDownloadPdf = () => {
    const icons = {
      user: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      chart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="4" width="4" height="17"/></svg>',
      shield: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      clipboard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
      brain: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h1v4a2 2 0 0 0 4 0v-4h1a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z"/></svg>',
    };

    const getBadge = (mean: number) => {
      const { label, color } = getMeanLevel(mean);
      return `<span class="badge" style="background:${color}15;color:${color}">${label}</span>`;
    };

    // SVG bar chart
    const maxMean = Math.max(...scores.dimensions.map(d => d.mean), 1);
    const barWidth = 42;
    const barGap = 8;
    const chartWidth = scores.dimensions.length * (barWidth + barGap);
    const chartHeight = 120;
    const dimColors = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#dc2626", "#0891b2", "#be185d", "#4f46e5", "#ea580c"];

    const barsSvg = scores.dimensions.map((d, i) => {
      const barH = (d.mean / maxMean) * (chartHeight - 20);
      const x = i * (barWidth + barGap) + 10;
      const color = dimColors[i % dimColors.length];
      return `
        <rect x="${x}" y="${chartHeight - barH - 10}" width="${barWidth}" height="${barH}" rx="4" fill="${color}" opacity="0.85"/>
        <text x="${x + barWidth/2}" y="${chartHeight}" text-anchor="middle" font-size="6" fill="#666">${d.code}</text>
        <text x="${x + barWidth/2}" y="${chartHeight - barH - 14}" text-anchor="middle" font-size="7" fill="${color}" font-weight="700">${d.mean.toFixed(2)}</text>
      `;
    }).join('');

    const chartSvg = `<svg width="${chartWidth + 20}" height="${chartHeight + 10}" viewBox="0 0 ${chartWidth + 20} ${chartHeight + 10}">${barsSvg}</svg>`;

    const elevated = scores.dimensions.filter(d => d.mean >= 1.5);

    const page1 = `
      <div class="page">
        <div class="report-header">
          <div>
            <h1 class="report-title">SCL-90-R</h1>
            <p class="report-subtitle">Listado de Síntomas — 90 Revisado (L.R. Derogatis)</p>
            <p class="report-subtitle-sm">Informe Psicológico Confidencial</p>
          </div>
          <div class="logo-circle"><span>SCL</span></div>
        </div>

        <div class="patient-card">
          <div class="patient-card-icon">${icons.user}</div>
          <div class="patient-grid">
            <div><span class="label">Paciente</span><span class="value">${patientName || '—'}</span></div>
            <div><span class="label">Fecha de Nacimiento</span><span class="value">${patientBirthDate ? new Date(patientBirthDate).toLocaleDateString('es-AR') : '—'}</span></div>
            <div><span class="label">Edad</span><span class="value">${calcAge()}</span></div>
            <div><span class="label">Fecha del Test</span><span class="value">${new Date(testDate).toLocaleDateString('es-AR')}</span></div>
            <div><span class="label">Respuestas</span><span class="value">${totalAnswered}/90</span></div>
            <div><span class="label">Estado</span><span class="value">${isComplete ? 'Completado' : 'En progreso'}</span></div>
          </div>
        </div>

        <div class="section-header blue">${icons.shield} ÍNDICES GLOBALES</div>
        <div class="indices-grid">
          <div class="index-card"><span class="index-label">GSI</span><span class="index-desc">Índice de Severidad Global</span><span class="index-value">${scores.gsi.toFixed(2)}</span></div>
          <div class="index-card"><span class="index-label">PST</span><span class="index-desc">Total Síntomas Positivos</span><span class="index-value">${scores.pst}</span></div>
          <div class="index-card"><span class="index-label">PSDI</span><span class="index-desc">Índice Malestar Síntomas Positivos</span><span class="index-value">${scores.psdi.toFixed(2)}</span></div>
        </div>

        <div class="section-header green">${icons.chart} PERFIL DIMENSIONAL</div>
        <div class="chart-container">${chartSvg}</div>

        <div class="section-header purple">${icons.brain} DIMENSIONES SINTOMÁTICAS</div>
        <table class="styled-table">
          <thead><tr><th>Dimensión</th><th class="val-col">Código</th><th class="val-col">Suma</th><th class="val-col">Ítems</th><th class="val-col">Media</th><th>Nivel</th></tr></thead>
          <tbody>
            ${scores.dimensions.map(d => {
              const level = getMeanLevel(d.mean);
              return `<tr style="background:${level.bg}"><td>${d.name}</td><td class="val-col"><b>${d.code}</b></td><td class="val-col">${d.rawSum}</td><td class="val-col">${d.itemCount}</td><td class="val-col" style="color:${level.color};font-weight:700">${d.mean.toFixed(2)}</td><td>${getBadge(d.mean)}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <div class="page-footer"><span>Informe SCL-90-R • Confidencial</span><span>Página 1</span></div>
      </div>`;

    const page2 = `
      <div class="page">
        <div class="chapter-title">${icons.clipboard} INTERPRETACIÓN CLÍNICA</div>

        <div class="info-box ${scores.gsi >= 1.0 ? 'info-box-red' : 'info-box-green'}">
          ${scores.gsi >= 1.0
            ? `<b>⚠ Malestar psicológico significativo</b> — El Índice de Severidad Global (GSI = ${scores.gsi.toFixed(2)}) supera el punto de corte clínico.`
            : `<b>✓ Sin malestar psicológico significativo</b> — El GSI (${scores.gsi.toFixed(2)}) se encuentra dentro de rangos esperables.`}
        </div>

        ${elevated.length > 0 ? `
          <p class="body-text">Se identifican las siguientes dimensiones con elevación clínicamente significativa:</p>
          <ul class="rich-list">
            ${elevated.map(d => {
              const level = getMeanLevel(d.mean);
              const descriptions: Record<string, string> = {
                SOM: "Percepción de disfunciones corporales (cardiovasculares, gastrointestinales, respiratorias y otros sistemas con mediación autonómica).",
                OBS: "Pensamientos, impulsos y acciones experimentados como irresistibles pero de naturaleza no deseada, con dificultades cognitivas asociadas.",
                SI: "Sentimientos de inadecuación personal, inferioridad e incomodidad durante las interacciones interpersonales.",
                DEP: "Signos y síntomas clínicos del espectro depresivo: falta de motivación, desesperanza, pensamientos suicidas, afecto disfórico.",
                ANS: "Manifestaciones clínicas de ansiedad: nerviosismo, tensión, ataques de pánico, miedos, componentes cognitivos y somáticos.",
                HOS: "Pensamientos, sentimientos y acciones característicos del estado afectivo negativo de la ira: agresión, irritabilidad.",
                FOB: "Miedos persistentes, irracionales y desproporcionados hacia personas, lugares u objetos, con conductas de evitación/huida.",
                PAR: "Pensamiento proyectivo, hostilidad, suspicacia, grandiosidad, centralidad, miedo a la pérdida de autonomía y delirios.",
                PSI: "Indicadores de aislamiento, estilo de vida esquizoide, alucinaciones, difusión del pensamiento y control externo.",
              };
              return `<li>
                <div class="rich-list-header" style="color:${level.color}">${d.code} – ${d.name} = ${d.mean.toFixed(2)} (${level.label.toLowerCase()})</div>
                <p>${descriptions[d.code] || ''}</p>
              </li>`;
            }).join('')}
          </ul>
        ` : '<p class="body-text muted">No se observan dimensiones con elevación clínicamente significativa (media ≥ 1.5).</p>'}

        ${additionalNotes ? `
          <div class="chapter-title">${icons.clipboard} OBSERVACIONES DEL PROFESIONAL</div>
          <div class="clinical-text">${additionalNotes.replace(/\n/g, '<br>')}</div>
        ` : ''}

        <div class="conclusion-box">
          <b>Nota técnica:</b> El SCL-90-R evalúa nueve dimensiones primarias de síntomas y tres índices globales de malestar.
          Los puntajes se interpretan considerando la media por dimensión. Valores ≥ 1.5 indican elevación clínica.
          GSI ≥ 1.0 sugiere malestar psicológico significativo. Este informe requiere integración con la evaluación clínica.
        </div>

        <div class="page-footer"><span>Informe SCL-90-R • Confidencial</span><span>Página 2</span></div>
      </div>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Informe SCL-90-R — ${patientName || 'Paciente'}</title>
<style>
  @media print { @page { margin: 12mm 14mm; size: A4; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .page { page-break-after: always; } .page:last-child { page-break-after: auto; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; font-size: 9.5pt; line-height: 1.45; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 12mm 14mm; min-height: 297mm; position: relative; }
  .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 3px solid #059669; }
  .report-title { font-size: 28pt; font-weight: 900; color: #059669; letter-spacing: -1px; }
  .report-subtitle { font-size: 10pt; color: #555; }
  .report-subtitle-sm { font-size: 8pt; color: #888; font-style: italic; margin-top: 2px; }
  .logo-circle { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #059669, #0891b2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 10pt; letter-spacing: 1px; }
  .patient-card { display: flex; gap: 12px; align-items: flex-start; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
  .patient-card-icon { color: #059669; margin-top: 2px; }
  .patient-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 16px; flex: 1; }
  .patient-grid .label { display: block; font-size: 7pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  .patient-grid .value { display: block; font-size: 9.5pt; font-weight: 600; color: #1a1a1a; }
  .section-header { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 5px 10px; border-radius: 4px; margin: 12px 0 6px; display: flex; align-items: center; gap: 6px; }
  .section-header.blue { background: #eff6ff; color: #1e3a5f; border-left: 3px solid #2563eb; }
  .section-header.green { background: #ecfdf5; color: #065f46; border-left: 3px solid #10b981; }
  .section-header.purple { background: #f5f3ff; color: #5b21b6; border-left: 3px solid #7c3aed; }
  .indices-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
  .index-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; text-align: center; }
  .index-label { display: block; font-size: 14pt; font-weight: 900; color: #059669; }
  .index-desc { display: block; font-size: 7pt; color: #888; margin: 2px 0; }
  .index-value { display: block; font-size: 18pt; font-weight: 700; color: #1a1a1a; }
  .chart-container { text-align: center; margin: 8px 0 12px; overflow-x: auto; }
  .styled-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 10px; border-radius: 6px; overflow: hidden; }
  .styled-table thead tr { background: #059669; color: white; }
  .styled-table th { text-align: left; font-weight: 600; padding: 4px 8px; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3px; }
  .styled-table td { padding: 3px 8px; border-bottom: 1px solid #e5e7eb; }
  .styled-table .val-col { text-align: center; width: 45px; }
  .badge { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 7pt; font-weight: 600; }
  .chapter-title { font-size: 13pt; font-weight: 700; color: #059669; margin: 16px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #0891b2; display: flex; align-items: center; gap: 8px; }
  .body-text { font-size: 9.5pt; line-height: 1.6; margin-bottom: 8px; }
  .body-text.muted { color: #666; font-style: italic; }
  .info-box { padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 9pt; }
  .info-box-green { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  .info-box-red { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }
  .rich-list { list-style: none; padding: 0; margin: 8px 0; }
  .rich-list li { margin-bottom: 10px; padding: 6px 10px; background: #fafafa; border-radius: 6px; border-left: 3px solid #cbd5e1; }
  .rich-list-header { font-weight: 700; font-size: 9pt; margin-bottom: 2px; }
  .rich-list li p { font-size: 8.5pt; color: #444; line-height: 1.5; margin: 0; }
  .conclusion-box { margin: 10px 0; padding: 8px 12px; background: linear-gradient(135deg, #ecfdf5, #d1fae5); border-left: 3px solid #059669; border-radius: 0 6px 6px 0; font-size: 8.5pt; line-height: 1.6; }
  .clinical-text { white-space: pre-wrap; line-height: 1.7; font-size: 9.5pt; padding: 8px 12px; background: #fafafa; border-radius: 6px; }
  .page-footer { position: absolute; bottom: 10mm; left: 14mm; right: 14mm; font-size: 7pt; color: #aaa; display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 4px; }
</style></head><body>
${page1}
${page2}
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
      const priceNum = parseFloat(price) || 0;
      const { error } = await supabase.from("documents").insert({
        patient_id: patientId,
        title: `Informe SCL-90-R - ${new Date(testDate).toLocaleDateString('es-AR')}`,
        description: `Informe SCL-90-R generado automáticamente. GSI: ${scores.gsi.toFixed(2)}. Respuestas: ${totalAnswered}/90.`,
        document_type: "informe",
        price: priceNum,
        is_paid: priceNum === 0,
        payment_date: priceNum === 0 ? new Date().toISOString() : null,
      });
      if (error) throw error;
      toast({ title: "Informe generado", description: priceNum > 0 ? `Con costo de $${priceNum}` : "Gratuito" });
      setShowDialog(false);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Error", description: "No se pudo generar el informe", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap items-center">
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
              Generar Informe SCL-90-R
            </DialogTitle>
            <DialogDescription>El informe quedará disponible en Documentos del paciente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Precio (ARS)</Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 = gratuito" className="mt-1" />
            </div>
            <div>
              <Label>Observaciones del profesional</Label>
              <Textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Agregue observaciones clínicas..." rows={4} />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">El informe incluirá:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Índices globales (GSI, PST, PSDI)</li>
                <li>Perfil dimensional con gráfico de barras</li>
                <li>9 dimensiones sintomáticas con media y nivel</li>
                <li>Interpretación narrativa por dimensión elevada</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating}>
              {isGenerating ? "Generando..." : "Crear Informe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
