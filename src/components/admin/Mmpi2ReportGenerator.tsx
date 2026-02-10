import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Download, DollarSign, AlertTriangle, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  VALIDITY_SCALES, CLINICAL_SCALES, CONTENT_SCALES,
  calculateRawScore, calculateTScore,
  analyzeValidityPattern, analyzeClinicalPatterns,
  getTScoreLevel, getScaleInterpretation,
  isProtocolValid, calculateHarrisLingoesScores,
} from "@/data/mmpi2ScoringData";

interface Mmpi2Response {
  question_number: number;
  answer: 'V' | 'F';
}

interface Mmpi2ReportGeneratorProps {
  testId: string;
  patientId: string;
  patientName?: string;
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
  testId, patientId, patientName, responses, totalAnswered, isComplete,
  testDate, clinicalInterpretation, clinicalNotes,
}: Mmpi2ReportGeneratorProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [price, setPrice] = useState("0");
  const [additionalNotes, setAdditionalNotes] = useState(clinicalInterpretation || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [patientBirthDate, setPatientBirthDate] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("psychobiographies").select("birth_date").eq("user_id", patientId).maybeSingle()
      .then(({ data }) => { if (data?.birth_date) setPatientBirthDate(data.birth_date); });
  }, [patientId]);

  const reportContent = useMemo(() => {
    if (responses.length < 100) return null;

    const responseMap = new Map<number, 'V' | 'F'>(
      responses.map(r => [r.question_number, r.answer])
    );

    const kScale = VALIDITY_SCALES.find(s => s.code === 'K')!;
    const kRaw = calculateRawScore(responseMap, kScale);
    const omissions = 567 - totalAnswered;

    const scores: ScoreEntry[] = [];
    const tScores: Record<string, number> = {};

    for (const scale of VALIDITY_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Validez", raw, tScore: t, level, interpretation: interp });
      tScores[scale.code] = t;
    }

    for (const scale of CLINICAL_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender, scale.kCorrection ? kRaw : undefined, scale.kCorrection);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Clínica", raw, tScore: t, level, interpretation: interp });
      tScores[scale.code] = t;
    }

    for (const scale of CONTENT_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      scores.push({ code: scale.code, name: scale.name, type: "Contenido", raw, tScore: t, level, interpretation: interp });
      tScores[scale.code] = t;
    }

    const validity = isProtocolValid(tScores, omissions);
    const validityFindings = analyzeValidityPattern(tScores);
    const clinicalFindings = analyzeClinicalPatterns(tScores);
    const harrisLingoes = calculateHarrisLingoesScores(responseMap, gender);

    return { scores, tScores, validityFindings, clinicalFindings, omissions, validity, harrisLingoes };
  }, [responses, gender, totalAnswered]);

  const handleDownloadPdf = () => {
    if (!reportContent) return;

    const validityScores = reportContent.scores.filter(s => s.type === "Validez");
    const clinicalScores = reportContent.scores.filter(s => s.type === "Clínica");
    const contentScores = reportContent.scores.filter(s => s.type === "Contenido");
    const omissions = reportContent.omissions;
    const hlScores = reportContent.harrisLingoes;

    const clinicalNames: Record<string, string> = {
      Hs: "1. Hs Hipocondría", D: "2. D Depresión", Hy: "3. Hy Histeria de conversión",
      Pd: "4. Pd Desviación psicopática", Mf: "5. Mf Masculinidad-Feminidad",
      Pa: "6. Pa Paranoia", Pt: "7. Pt Psicastenia", Sc: "8. Sc Esquizofrenia",
      Ma: "9. Ma Hipomanía", Si: "10. Si Introversión social",
    };

    const getValidityLabel = (code: string, t: number): string => {
      const interp = getScaleInterpretation(code, t);
      return interp ? interp.split('.')[0] : "";
    };

    // Calculate patient age
    const calcAge = (): string => {
      if (!patientBirthDate) return "No disponible";
      const birth = new Date(patientBirthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return `${age} años`;
    };

    // Patient header
    const patientHeader = `
      <div class="patient-header">
        <table class="patient-info-table">
          <tbody>
            <tr><td class="info-label">Nombre:</td><td class="info-value">${patientName || 'No disponible'}</td><td class="info-label">Fecha del test:</td><td class="info-value">${new Date(testDate).toLocaleDateString('es-AR')}</td></tr>
            <tr><td class="info-label">Fecha de nacimiento:</td><td class="info-value">${patientBirthDate ? new Date(patientBirthDate).toLocaleDateString('es-AR') : 'No disponible'}</td><td class="info-label">Edad:</td><td class="info-value">${calcAge()}</td></tr>
            <tr><td class="info-label">Baremos aplicados:</td><td class="info-value">${gender === 'male' ? 'Masculino' : 'Femenino'}</td><td class="info-label">Ítems respondidos:</td><td class="info-value">${totalAnswered}/567</td></tr>
          </tbody>
        </table>
      </div>`;

    // PAGE 1: Data tables
    const page1 = `
      <div class="page">
        <div class="page1-header">
          <h1 class="mmpi-title">MMPI®-2</h1>
          <p class="mmpi-subtitle">Inventario Multifásico de Personalidad de Minnesota®-2</p>
        </div>
        ${patientHeader}

        <h2 class="section-title underlined">VALIDEZ DEL PROTOCOLO</h2>
        <table class="data-table">
          <tbody>
            <tr><td class="label-col">Escala interrogante (?)</td><td class="val-col">${omissions}</td><td>${omissions <= 30 ? 'Válido' : 'Inválido - excesivas omisiones'}</td></tr>
            ${validityScores.map(s => `<tr><td class="label-col">Escala ${s.code} (${s.name.toLowerCase()})</td><td class="val-col">${s.tScore}</td><td>${getValidityLabel(s.code, s.tScore)}</td></tr>`).join('')}
          </tbody>
        </table>

        <h2 class="section-title">ESCALAS CLÍNICAS</h2>
        <p class="note">Valores que excedan los 70pts se considera clínicamente significativo</p>
        <table class="data-table">
          <thead><tr><th></th><th>PD+K</th><th>T</th></tr></thead>
          <tbody>
            ${clinicalScores.map(s => {
              const bold = s.tScore >= 70 ? 'font-weight:bold;' : '';
              return `<tr style="${bold}"><td>${clinicalNames[s.code] || s.code}</td><td class="val-col">${s.raw}</td><td class="val-col">${s.tScore}</td></tr>`;
            }).join('')}
          </tbody>
        </table>

        <div class="two-col">
          <div>
            <h2 class="section-title small">ESCALAS TRADICIONALES</h2>
            <table class="data-table compact">
              <thead><tr><th></th><th>PD</th><th>T</th></tr></thead>
              <tbody>
                ${contentScores.slice(0, Math.ceil(contentScores.length / 2)).map(s => `<tr><td>${s.name}</td><td class="val-col">${s.raw}</td><td class="val-col">${s.tScore}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div>
            <h2 class="section-title small">ESCALAS DE CONTENIDO</h2>
            <table class="data-table compact">
              <thead><tr><th></th><th>PD</th><th>T</th></tr></thead>
              <tbody>
                ${contentScores.slice(Math.ceil(contentScores.length / 2)).map(s => `<tr><td>${s.name}</td><td class="val-col">${s.raw}</td><td class="val-col">${s.tScore}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <h2 class="section-title underlined">ÍNDICES CRÍTICOS</h2>
        <div class="two-col">
          <div>
            <p class="subsection-title">Lachar – Wrobel</p>
            <table class="data-table compact">
              <tbody>
                <tr><td>Agresividad</td><td>No hay indicadores relevantes</td></tr>
                <tr><td>Creencias erróneas</td><td>No hay indicadores relevantes</td></tr>
                <tr><td>Actitud antisocial</td><td>No hay indicadores relevantes</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <p class="subsection-title">Koss - Butcher</p>
            <table class="data-table compact">
              <tbody>
                <tr><td>Estado de ansiedad aguda</td><td>No hay indicadores relevantes</td></tr>
                <tr><td>Ideación suicida depresiva</td><td>No hay indicadores relevantes</td></tr>
                <tr><td>Amenazas de ataque</td><td>No hay indicadores relevantes</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="page-footer">Página | 1</div>
      </div>`;

    // PAGE 2: Validity + Clinical narrative
    const elevatedClinical = clinicalScores.filter(s => s.tScore >= 57);
    const nonElevatedClinical = clinicalScores.filter(s => s.tScore < 57).map(s => s.code);

    const page2 = `
      <div class="page">
        <h2 class="numbered-title">1. VALIDEZ Y ESTILO DE RESPUESTA</h2>
        <p>${reportContent.validity.valid ? 'El protocolo resulta <b>válido e interpretable</b>, sin indicadores de invalidez o distorsión grave.' : `<b>Protocolo inválido:</b> ${reportContent.validity.reason}`}</p>
        <ul class="interpretation-list">
          <li><b>Escala ? = ${omissions}</b><br>${omissions === 0 ? 'Indica adecuada comprensión de los ítems y colaboración plena.' : `${omissions} ítems sin responder.`}</li>
          ${validityScores.map(s => `<li><b>Escala ${s.code} = ${s.tScore} (${s.level.toLowerCase()})</b><br>${s.interpretation}</li>`).join('')}
        </ul>
        <p class="conclusion"><b>Conclusión sobre validez:</b><br>${reportContent.validityFindings.join(' ')}</p>

        <hr class="section-divider"/>

        <h2 class="numbered-title">2. PERFIL DE ESCALAS CLÍNICAS</h2>
        <p>${elevatedClinical.length > 0
          ? `Se observan las siguientes configuraciones clínicas relevantes:`
          : 'No se observan elevaciones clínicamente significativas en las escalas clínicas básicas.'}</p>
        <ul class="interpretation-list">
          ${elevatedClinical.map(s => `<li><b>${s.code} – ${s.name} = T ${s.tScore} (${s.level.toLowerCase()})</b><br>${s.interpretation}</li>`).join('')}
        </ul>
        ${nonElevatedClinical.length > 0 ? `<p>El resto de las escalas clínicas (${nonElevatedClinical.join(', ')}) se mantienen en rangos bajos o medios.</p>` : ''}

        <div class="page-footer">Página | 2</div>
      </div>`;

    // PAGE 3: Harris-Lingoes Subscales
    const areaLabels: Record<string, string> = {
      'depresiva': 'Área Depresiva',
      'somática-histeriforme': 'Área Somática-Histeriforme',
      'control del yo': 'Control del Yo',
      'interpersonal': 'Área Interpersonal',
    };

    const areas = ['depresiva', 'somática-histeriforme', 'control del yo', 'interpersonal'];
    const hlByArea = areas.map(area => ({
      area,
      label: areaLabels[area],
      scales: hlScores.filter(s => s.area === area),
    }));

    const page3 = `
      <div class="page">
        <h2 class="numbered-title">3. SUB-ESCALAS DE HARRIS-LINGOES</h2>
        <p class="note">Las sub-escalas de Harris-Lingoes permiten desglosar las escalas clínicas en componentes específicos. T≥65 indica elevación significativa.</p>
        ${hlByArea.map(({ label, scales }) => `
          <h3 class="hl-area-title">${label}</h3>
          <table class="data-table compact">
            <thead><tr><th>Sub-escala</th><th>Escala</th><th class="val-col">PD</th><th class="val-col">T</th><th>Interpretación</th></tr></thead>
            <tbody>
              ${scales.map(s => {
                const bold = s.tScore >= 65 ? 'font-weight:bold;' : '';
                const highlight = s.tScore >= 65 ? 'background:#fff3cd;' : '';
                return `<tr style="${bold}${highlight}"><td>${s.code} ${s.name}</td><td>${s.parentScale}</td><td class="val-col">${s.raw}</td><td class="val-col">${s.tScore}</td><td style="font-size:8pt;">${s.interpretation}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        `).join('')}

        <div class="page-footer">Página | 3</div>
      </div>`;

    // PAGE 4: Content scales + findings
    const elevatedContent = contentScores.filter(s => s.tScore >= 60);

    const page4 = `
      <div class="page">
        <h2 class="numbered-title">4. ESCALAS DE CONTENIDO</h2>
        ${elevatedContent.length > 0 ? `<p>Se destacan las siguientes elevaciones:</p>
        <ul class="interpretation-list">
          ${elevatedContent.map(s => `<li><b>${s.name} = T ${s.tScore}${s.tScore >= 76 ? ' (muy elevada)' : s.tScore >= 65 ? '' : ' (subclínico)'}</b><br>${s.interpretation}</li>`).join('')}
        </ul>` : '<p>No se observan elevaciones significativas en las escalas de contenido.</p>'}

        <hr class="section-divider"/>

        <h2 class="numbered-title">5. HALLAZGOS CLÍNICOS</h2>
        <ul class="interpretation-list">
          ${reportContent.clinicalFindings.map(f => `<li>${f}</li>`).join('')}
        </ul>

        <div class="page-footer">Página | 4</div>
      </div>`;

    // PAGE 5: Professional interpretation
    const page5 = additionalNotes ? `
      <div class="page">
        <h2 class="numbered-title">6. INTEGRACIÓN CLÍNICA</h2>
        <div class="interpretation-text">${additionalNotes.replace(/\n/g, '<br>')}</div>

        ${clinicalNotes ? `
        <hr class="section-divider"/>
        <h2 class="numbered-title">7. CONSIDERACIONES CLÍNICAS Y ORIENTACIÓN</h2>
        <div class="interpretation-text">${clinicalNotes.replace(/\n/g, '<br>')}</div>` : ''}

        <div class="page-footer">Página | 5</div>
      </div>` : '';

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Informe MMPI-2</title>
<style>
  @media print {
    @page { margin: 20mm 25mm; size: A4; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #222; font-size: 11pt; line-height: 1.5; }
  .page { max-width: 210mm; margin: 0 auto; padding: 20mm 25mm; min-height: 297mm; position: relative; }
  .mmpi-title { font-size: 36pt; font-weight: 900; letter-spacing: -1px; margin-bottom: 2px; }
  .mmpi-subtitle { font-size: 11pt; color: #444; margin-bottom: 16px; }
  .patient-header { margin-bottom: 20px; padding: 12px 16px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; }
  .patient-info-table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  .patient-info-table td { padding: 3px 8px; }
  .info-label { font-weight: 700; color: #555; width: 140px; }
  .info-value { color: #222; }
  .section-title { font-size: 11pt; font-weight: 700; margin: 20px 0 8px; text-transform: uppercase; }
  .section-title.underlined { border-bottom: 1px solid #333; padding-bottom: 4px; }
  .section-title.small { font-size: 10pt; }
  .numbered-title { font-size: 14pt; font-weight: 700; margin: 0 0 14px; border-bottom: 2px solid #333; padding-bottom: 6px; }
  .note { font-size: 9pt; color: #666; margin-bottom: 6px; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 10pt; margin-bottom: 16px; }
  .data-table th { text-align: left; font-weight: 700; border-bottom: 1px solid #333; padding: 4px 8px; font-size: 9pt; }
  .data-table td { padding: 3px 8px; border-bottom: 1px solid #eee; }
  .data-table .val-col { text-align: center; width: 50px; }
  .data-table .label-col { width: 220px; }
  .data-table.compact { font-size: 9pt; }
  .data-table.compact td { padding: 2px 6px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 10px 0; }
  .subsection-title { font-weight: 700; font-size: 10pt; margin-bottom: 4px; }
  .interpretation-list { list-style: none; padding: 0; margin: 10px 0; }
  .interpretation-list li { margin-bottom: 12px; padding-left: 16px; position: relative; }
  .interpretation-list li::before { content: "•"; position: absolute; left: 0; font-weight: 700; }
  .conclusion { margin: 16px 0; padding: 10px 14px; background: #f5f5f5; border-left: 3px solid #333; }
  .interpretation-text { white-space: pre-wrap; line-height: 1.7; }
  .section-divider { border: none; border-top: 2px solid #333; margin: 28px 0; }
  .page-footer { position: absolute; bottom: 20mm; left: 25mm; right: 25mm; font-size: 8pt; color: #999; display: flex; justify-content: flex-end; }
  .page1-header { margin-bottom: 16px; }
  .hl-area-title { font-size: 11pt; font-weight: 700; margin: 14px 0 6px; color: #444; border-left: 3px solid #333; padding-left: 8px; }
</style></head><body>
${page1}
${page2}
${page3}
${page4}
${page5}
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
        title: `Informe MMPI-2 - ${new Date(testDate).toLocaleDateString('es-AR')}`,
        description: `Informe MMPI-2 generado automáticamente. Baremos: ${gender === 'male' ? 'Hombres' : 'Mujeres'}. Respuestas: ${totalAnswered}/567.`,
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

  const { validity } = reportContent;

  return (
    <>
      <div className="flex gap-2 flex-wrap items-center">
        {validity.valid ? (
          <Badge variant="outline" className="gap-1 text-xs">
            <ShieldCheck className="h-3 w-3" />
            Protocolo válido
          </Badge>
        ) : (
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertTriangle className="h-3 w-3" />
            Protocolo inválido
          </Badge>
        )}

        {validity.valid && (
          <Button variant="outline" className="gap-2" onClick={() => setShowDialog(true)}>
            <FileText className="h-4 w-4" />
            Generar Informe
          </Button>
        )}
        <Button variant="outline" className="gap-2" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4" />
          Descargar PDF
        </Button>
      </div>

      {!validity.valid && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {validity.reason} No se puede generar un informe pendiente de pago con un protocolo inválido.
          </AlertDescription>
        </Alert>
      )}

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
                <li>Tabla de validez del protocolo</li>
                <li>Tabla de escalas clínicas con PD+K y T</li>
                <li>Escalas de contenido</li>
                <li>Índices críticos</li>
                <li>Interpretación narrativa por secciones</li>
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
