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
  VALIDITY_SCALES, CLINICAL_SCALES, CONTENT_SCALES, SUPPLEMENTARY_SCALES,
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
  gender?: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
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
  testDate, clinicalInterpretation, clinicalNotes, gender: externalGender, onGenderChange,
}: Mmpi2ReportGeneratorProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [internalGender, setInternalGender] = useState<'male' | 'female'>('male');
  const gender = externalGender ?? internalGender;
  const handleGenderChange = (v: string) => {
    const g = v as 'male' | 'female';
    if (onGenderChange) onGenderChange(g);
    else setInternalGender(g);
  };
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

    const suppScores: ScoreEntry[] = [];
    for (const scale of SUPPLEMENTARY_SCALES) {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, gender);
      const { level } = getTScoreLevel(t);
      const interp = getScaleInterpretation(scale.code, t) || "";
      suppScores.push({ code: scale.code, name: scale.name, type: "Suplementaria", raw, tScore: t, level, interpretation: interp });
      tScores[scale.code] = t;
    }

    const validity = isProtocolValid(tScores, omissions);
    const validityFindings = analyzeValidityPattern(tScores);
    const clinicalFindings = analyzeClinicalPatterns(tScores);
    const harrisLingoes = calculateHarrisLingoesScores(responseMap, gender);

    return { scores, suppScores, tScores, validityFindings, clinicalFindings, omissions, validity, harrisLingoes };
  }, [responses, gender, totalAnswered]);

  const handleDownloadPdf = () => {
    if (!reportContent) return;

    const validityScores = reportContent.scores.filter(s => s.type === "Validez");
    const clinicalScores = reportContent.scores.filter(s => s.type === "Clínica");
    const contentScores = reportContent.scores.filter(s => s.type === "Contenido");
    const suppScores = reportContent.suppScores;
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

    const calcAge = (): string => {
      if (!patientBirthDate) return "—";
      const birth = new Date(patientBirthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      return `${age} años`;
    };

    const getTScoreColor = (t: number) => t >= 76 ? '#dc2626' : t >= 65 ? '#d97706' : '#16a34a';
    const getTScoreBg = (t: number) => t >= 76 ? '#fef2f2' : t >= 65 ? '#fffbeb' : 'transparent';
    const getTScoreBadge = (t: number) => {
      if (t >= 76) return '<span class="badge badge-danger">⚠ Muy Elevada</span>';
      if (t >= 65) return '<span class="badge badge-warning">↑ Elevada</span>';
      return '<span class="badge badge-normal">✓ Normal</span>';
    };

    // SVG icons as inline strings
    const icons = {
      shield: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      brain: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h1v4a2 2 0 0 0 4 0v-4h1a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z"/></svg>',
      chart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="4" width="4" height="17"/></svg>',
      heart: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.34l-.77-.76a5.4 5.4 0 0 0-7.65 7.65l.77.76L12 20.64l7.65-7.65.77-.76a5.4 5.4 0 0 0 0-7.65z"/></svg>',
      clipboard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
      user: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      layers: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    };

    const patientHeader = `
      <div class="patient-card">
        <div class="patient-card-icon">${icons.user}</div>
        <div class="patient-grid">
          <div><span class="label">Paciente</span><span class="value">${patientName || '—'}</span></div>
          <div><span class="label">Fecha de Nacimiento</span><span class="value">${patientBirthDate ? new Date(patientBirthDate).toLocaleDateString('es-AR') : '—'}</span></div>
          <div><span class="label">Edad</span><span class="value">${calcAge()}</span></div>
          <div><span class="label">Fecha del Test</span><span class="value">${new Date(testDate).toLocaleDateString('es-AR')}</span></div>
          <div><span class="label">Baremos</span><span class="value">${gender === 'male' ? 'Masculino' : 'Femenino'}</span></div>
          <div><span class="label">Respuestas</span><span class="value">${totalAnswered}/567</span></div>
        </div>
      </div>`;

    // PAGE 1
    const page1 = `
      <div class="page">
        <div class="report-header">
          <div class="report-header-left">
            <h1 class="report-title">MMPI®-2</h1>
            <p class="report-subtitle">Inventario Multifásico de Personalidad de Minnesota®-2</p>
            <p class="report-subtitle-sm">Informe Psicológico Confidencial</p>
          </div>
          <div class="report-header-right">
            <div class="logo-circle">
              <span>MMPI</span>
            </div>
          </div>
        </div>
        ${patientHeader}

        <div class="section-header green">${icons.shield} VALIDEZ DEL PROTOCOLO</div>
        <table class="styled-table">
          <tbody>
            <tr><td class="label-col">Escala ? (omisiones)</td><td class="val-col">${omissions}</td><td>${omissions <= 30 ? '<span class="badge badge-normal">✓ Válido</span>' : '<span class="badge badge-danger">⚠ Inválido</span>'}</td></tr>
            ${validityScores.map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td class="label-col">Escala ${s.code} (${s.name})</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:700">${s.tScore}</td><td>${getValidityLabel(s.code, s.tScore)}</td></tr>`).join('')}
          </tbody>
        </table>

        <div class="section-header blue">${icons.chart} ESCALAS CLÍNICAS</div>
        <p class="note">Valores T ≥ 65 se consideran clínicamente significativos • T ≥ 76 muy elevados</p>
        <table class="styled-table">
          <thead><tr><th>Escala</th><th class="val-col">PD+K</th><th class="val-col">T</th><th>Nivel</th></tr></thead>
          <tbody>
            ${clinicalScores.map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td>${clinicalNames[s.code] || s.code}</td><td class="val-col">${s.raw}</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:700">${s.tScore}</td><td>${getTScoreBadge(s.tScore)}</td></tr>`).join('')}
          </tbody>
        </table>

        <div class="two-col">
          <div>
            <div class="section-header-sm purple">${icons.layers} ESCALAS DE CONTENIDO (1/2)</div>
            <table class="styled-table compact">
              <thead><tr><th>Escala</th><th class="val-col">PD</th><th class="val-col">T</th></tr></thead>
              <tbody>
                ${contentScores.slice(0, Math.ceil(contentScores.length / 2)).map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td>${s.name}</td><td class="val-col">${s.raw}</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:600">${s.tScore}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
          <div>
            <div class="section-header-sm purple">${icons.layers} ESCALAS DE CONTENIDO (2/2)</div>
            <table class="styled-table compact">
              <thead><tr><th>Escala</th><th class="val-col">PD</th><th class="val-col">T</th></tr></thead>
              <tbody>
                ${contentScores.slice(Math.ceil(contentScores.length / 2)).map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td>${s.name}</td><td class="val-col">${s.raw}</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:600">${s.tScore}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-header amber">${icons.heart} ESCALAS SUPLEMENTARIAS</div>
        <table class="styled-table">
          <thead><tr><th>Escala</th><th class="val-col">PD</th><th class="val-col">T</th><th>Nivel</th><th>Significado</th></tr></thead>
          <tbody>
            ${suppScores.map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td><b>${s.code}</b> – ${s.name}</td><td class="val-col">${s.raw}</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:700">${s.tScore}</td><td>${getTScoreBadge(s.tScore)}</td><td class="interp-cell">${s.interpretation.split('.')[0]}.</td></tr>`).join('')}
          </tbody>
        </table>

        <div class="page-footer"><span>Informe MMPI®-2 • Confidencial</span><span>Página 1</span></div>
      </div>`;

    // PAGE 2
    const elevatedClinical = clinicalScores.filter(s => s.tScore >= 57);
    const nonElevatedClinical = clinicalScores.filter(s => s.tScore < 57).map(s => s.code);

    const page2 = `
      <div class="page">
        <div class="chapter-title">${icons.shield} 1. Validez y Estilo de Respuesta</div>
        <div class="info-box ${reportContent.validity.valid ? 'info-box-green' : 'info-box-red'}">
          ${reportContent.validity.valid
            ? '<b>✓ Protocolo válido e interpretable</b> — Sin indicadores de invalidez o distorsión grave.'
            : `<b>⚠ Protocolo inválido:</b> ${reportContent.validity.reason}`}
        </div>
        <ul class="rich-list">
          <li><div class="rich-list-header">Escala ? = ${omissions}</div><p>${omissions === 0 ? 'Adecuada comprensión de los ítems y colaboración plena.' : `${omissions} ítems sin responder.`}</p></li>
          ${validityScores.map(s => `<li><div class="rich-list-header" style="color:${getTScoreColor(s.tScore)}">Escala ${s.code} = ${s.tScore} (${s.level.toLowerCase()})</div><p>${s.interpretation}</p></li>`).join('')}
        </ul>
        <div class="conclusion-box">${reportContent.validityFindings.join(' ')}</div>

        <div class="chapter-title">${icons.brain} 2. Perfil de Escalas Clínicas</div>
        <p class="body-text">${elevatedClinical.length > 0
          ? 'Se observan las siguientes configuraciones clínicas relevantes:'
          : 'No se observan elevaciones clínicamente significativas en las escalas clínicas básicas.'}</p>
        <ul class="rich-list">
          ${elevatedClinical.map(s => `<li><div class="rich-list-header" style="color:${getTScoreColor(s.tScore)}">${s.code} – ${s.name} = T ${s.tScore} (${s.level.toLowerCase()})</div><p>${s.interpretation}</p></li>`).join('')}
        </ul>
        ${nonElevatedClinical.length > 0 ? `<p class="body-text muted">Las escalas ${nonElevatedClinical.join(', ')} se mantienen en rangos bajos o medios.</p>` : ''}

        <div class="page-footer"><span>Informe MMPI®-2 • Confidencial</span><span>Página 2</span></div>
      </div>`;

    // PAGE 3: Harris-Lingoes
    const areaLabels: Record<string, { label: string; color: string }> = {
      'depresiva': { label: '🔵 Área Depresiva', color: '#2563eb' },
      'somática-histeriforme': { label: '🟠 Área Somática-Histeriforme', color: '#d97706' },
      'control del yo': { label: '🔴 Control del Yo', color: '#dc2626' },
      'interpersonal': { label: '🟢 Área Interpersonal', color: '#16a34a' },
    };

    const areas = ['depresiva', 'somática-histeriforme', 'control del yo', 'interpersonal'];
    const hlByArea = areas.map(area => ({
      area,
      ...areaLabels[area],
      scales: hlScores.filter(s => s.area === area),
    }));

    const page3 = `
      <div class="page">
        <div class="chapter-title">${icons.layers} 3. Sub-Escalas de Harris-Lingoes</div>
        <p class="note">Desglose de las escalas clínicas en componentes específicos. T ≥ 65 indica elevación significativa.</p>
        ${hlByArea.map(({ label, color, scales }) => `
          <div class="hl-area" style="border-left-color:${color}">
            <div class="hl-area-header" style="color:${color}">${label}</div>
            <table class="styled-table compact">
              <thead><tr><th>Sub-escala</th><th>Padre</th><th class="val-col">PD</th><th class="val-col">T</th><th>Interpretación</th></tr></thead>
              <tbody>
                ${scales.map(s => `<tr style="background:${getTScoreBg(s.tScore)}"><td><b>${s.code}</b> ${s.name}</td><td>${s.parentScale}</td><td class="val-col">${s.raw}</td><td class="val-col" style="color:${getTScoreColor(s.tScore)};font-weight:700">${s.tScore}</td><td class="interp-cell">${s.interpretation}</td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="page-footer"><span>Informe MMPI®-2 • Confidencial</span><span>Página 3</span></div>
      </div>`;

    // PAGE 4: Content + Supplementary interpretation + Findings
    const elevatedContent = contentScores.filter(s => s.tScore >= 60);
    const elevatedSupp = suppScores.filter(s => s.tScore >= 65 || s.tScore <= 39);

    const page4 = `
      <div class="page">
        <div class="chapter-title">${icons.clipboard} 4. Escalas de Contenido</div>
        ${elevatedContent.length > 0 ? `<ul class="rich-list">
          ${elevatedContent.map(s => `<li><div class="rich-list-header" style="color:${getTScoreColor(s.tScore)}">${s.name} = T ${s.tScore} ${s.tScore >= 76 ? '(muy elevada)' : s.tScore >= 65 ? '(elevada)' : '(subclínico)'}</div><p>${s.interpretation}</p></li>`).join('')}
        </ul>` : '<p class="body-text muted">No se observan elevaciones significativas en las escalas de contenido.</p>'}

        <div class="chapter-title">${icons.heart} 5. Escalas Suplementarias — Interpretación</div>
        ${elevatedSupp.length > 0 ? `<ul class="rich-list">
          ${elevatedSupp.map(s => `<li><div class="rich-list-header" style="color:${getTScoreColor(s.tScore)}"><b>${s.code}</b> – ${s.name} = T ${s.tScore}</div><p>${s.interpretation}</p></li>`).join('')}
        </ul>` : '<p class="body-text muted">Todas las escalas suplementarias se encuentran dentro de rangos normales.</p>'}

        <div class="chapter-title">${icons.brain} 6. Hallazgos Clínicos</div>
        <ul class="rich-list">
          ${reportContent.clinicalFindings.map(f => `<li><p>${f}</p></li>`).join('')}
        </ul>

        <div class="page-footer"><span>Informe MMPI®-2 • Confidencial</span><span>Página 4</span></div>
      </div>`;

    // PAGE 5: Professional interpretation
    const page5 = additionalNotes ? `
      <div class="page">
        <div class="chapter-title">${icons.clipboard} 7. Integración Clínica</div>
        <div class="clinical-text">${additionalNotes.replace(/\n/g, '<br>')}</div>

        ${clinicalNotes ? `
        <div class="chapter-title">${icons.heart} 8. Consideraciones y Orientación</div>
        <div class="clinical-text">${clinicalNotes.replace(/\n/g, '<br>')}</div>` : ''}

        <div class="page-footer"><span>Informe MMPI®-2 • Confidencial</span><span>Página 5</span></div>
      </div>` : '';

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Informe MMPI-2 — ${patientName || 'Paciente'}</title>
<style>
  @media print {
    @page { margin: 12mm 14mm; size: A4; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; font-size: 9.5pt; line-height: 1.45; background: #fff; }
  .page { max-width: 210mm; margin: 0 auto; padding: 12mm 14mm; min-height: 297mm; position: relative; }

  /* Header */
  .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 3px solid #1e3a5f; }
  .report-title { font-size: 28pt; font-weight: 900; color: #1e3a5f; letter-spacing: -1px; }
  .report-subtitle { font-size: 10pt; color: #555; }
  .report-subtitle-sm { font-size: 8pt; color: #888; font-style: italic; margin-top: 2px; }
  .logo-circle { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #1e3a5f, #2563eb); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 10pt; letter-spacing: 1px; }

  /* Patient card */
  .patient-card { display: flex; gap: 12px; align-items: flex-start; background: linear-gradient(135deg, #f0f4ff, #e8f0fe); border: 1px solid #c5d5ea; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
  .patient-card-icon { color: #1e3a5f; margin-top: 2px; }
  .patient-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 16px; flex: 1; }
  .patient-grid .label { display: block; font-size: 7pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  .patient-grid .value { display: block; font-size: 9.5pt; font-weight: 600; color: #1a1a1a; }

  /* Section headers */
  .section-header { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 5px 10px; border-radius: 4px; margin: 12px 0 6px; display: flex; align-items: center; gap: 6px; }
  .section-header.green { background: #ecfdf5; color: #065f46; border-left: 3px solid #10b981; }
  .section-header.blue { background: #eff6ff; color: #1e3a5f; border-left: 3px solid #2563eb; }
  .section-header.purple { background: #f5f3ff; color: #5b21b6; border-left: 3px solid #7c3aed; }
  .section-header.amber { background: #fffbeb; color: #92400e; border-left: 3px solid #f59e0b; }
  .section-header-sm { font-size: 9pt; font-weight: 700; padding: 4px 8px; border-radius: 4px; margin: 8px 0 4px; display: flex; align-items: center; gap: 5px; }
  .section-header-sm.purple { background: #f5f3ff; color: #5b21b6; border-left: 3px solid #7c3aed; }

  /* Tables */
  .styled-table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 10px; border-radius: 6px; overflow: hidden; }
  .styled-table thead tr { background: #1e3a5f; color: white; }
  .styled-table th { text-align: left; font-weight: 600; padding: 4px 8px; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3px; }
  .styled-table td { padding: 3px 8px; border-bottom: 1px solid #e5e7eb; }
  .styled-table .val-col { text-align: center; width: 40px; }
  .styled-table .label-col { width: 180px; }
  .styled-table .interp-cell { font-size: 7.5pt; color: #555; max-width: 200px; }
  .styled-table.compact { font-size: 8pt; }
  .styled-table.compact td { padding: 2px 6px; }
  .styled-table.compact th { padding: 3px 6px; }
  .styled-table tbody tr:hover { background: #f9fafb; }

  /* Badges */
  .badge { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 7pt; font-weight: 600; }
  .badge-normal { background: #ecfdf5; color: #065f46; }
  .badge-warning { background: #fffbeb; color: #92400e; }
  .badge-danger { background: #fef2f2; color: #991b1b; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0; }
  .note { font-size: 7.5pt; color: #888; margin-bottom: 4px; font-style: italic; }

  /* Page 2+ styles */
  .chapter-title { font-size: 13pt; font-weight: 700; color: #1e3a5f; margin: 16px 0 10px; padding-bottom: 5px; border-bottom: 2px solid #2563eb; display: flex; align-items: center; gap: 8px; }
  .body-text { font-size: 9.5pt; line-height: 1.6; margin-bottom: 8px; }
  .body-text.muted { color: #666; font-style: italic; }

  .info-box { padding: 10px 14px; border-radius: 6px; margin-bottom: 12px; font-size: 9pt; }
  .info-box-green { background: #ecfdf5; border: 1px solid #a7f3d0; color: #065f46; }
  .info-box-red { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

  .rich-list { list-style: none; padding: 0; margin: 8px 0; }
  .rich-list li { margin-bottom: 10px; padding: 6px 10px; background: #fafafa; border-radius: 6px; border-left: 3px solid #cbd5e1; }
  .rich-list-header { font-weight: 700; font-size: 9pt; margin-bottom: 2px; }
  .rich-list li p { font-size: 8.5pt; color: #444; line-height: 1.5; margin: 0; }

  .conclusion-box { margin: 10px 0; padding: 8px 12px; background: linear-gradient(135deg, #eff6ff, #e8f0fe); border-left: 3px solid #2563eb; border-radius: 0 6px 6px 0; font-size: 9pt; }

  .clinical-text { white-space: pre-wrap; line-height: 1.7; font-size: 9.5pt; padding: 8px 12px; background: #fafafa; border-radius: 6px; }

  /* Harris-Lingoes areas */
  .hl-area { margin-bottom: 10px; padding-left: 10px; border-left: 3px solid #cbd5e1; }
  .hl-area-header { font-size: 10pt; font-weight: 700; margin-bottom: 4px; }

  .page-footer { position: absolute; bottom: 10mm; left: 14mm; right: 14mm; font-size: 7pt; color: #aaa; display: flex; justify-content: space-between; border-top: 1px solid #e5e7eb; padding-top: 4px; }
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
