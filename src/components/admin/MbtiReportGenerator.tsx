import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Download, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { mbtiDescriptions, mbtiPreferences, getPreferenceStrength } from "@/data/mbtiQuestions";

interface MbtiReportGeneratorProps {
  testId: string;
  patientId: string;
  patientName?: string;
  testDate: string;
  personalityType: string;
  scores: {
    E: number; I: number; S: number; N: number;
    T: number; F: number; J: number; P: number;
  };
  clinicalNotes?: string | null;
}

export const MbtiReportGenerator = ({
  testId, patientId, patientName, testDate, personalityType, scores, clinicalNotes,
}: MbtiReportGeneratorProps) => {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [price, setPrice] = useState("0");
  const [additionalNotes, setAdditionalNotes] = useState(clinicalNotes || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [patientBirthDate, setPatientBirthDate] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("psychobiographies").select("birth_date").eq("user_id", patientId).maybeSingle()
      .then(({ data }) => { if (data?.birth_date) setPatientBirthDate(data.birth_date); });
  }, [patientId]);

  const typeInfo = mbtiDescriptions[personalityType];

  const calcAge = (): string => {
    if (!patientBirthDate) return "—";
    const birth = new Date(patientBirthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return `${age} años`;
  };

  const dimensions = [
    { left: 'E', right: 'I', leftLabel: 'Extroversión', rightLabel: 'Introversión', leftScore: scores.E, rightScore: scores.I },
    { left: 'S', right: 'N', leftLabel: 'Sensación', rightLabel: 'Intuición', leftScore: scores.S, rightScore: scores.N },
    { left: 'T', right: 'F', leftLabel: 'Pensamiento', rightLabel: 'Sentimiento', leftScore: scores.T, rightScore: scores.F },
    { left: 'J', right: 'P', leftLabel: 'Juicio', rightLabel: 'Percepción', leftScore: scores.J, rightScore: scores.P },
  ];

  const handleDownloadPdf = () => {
    if (!typeInfo) return;

    const icons = {
      user: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
      brain: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h1v4a2 2 0 0 0 4 0v-4h1a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z"/></svg>',
      target: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
      briefcase: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
      shield: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      building: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01"/></svg>',
      alert: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      lightbulb: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
      clipboard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
    };

    const getDimColor = (idx: number) => ['#2563eb', '#059669', '#d97706', '#7c3aed'][idx];

    const prefBarHtml = dimensions.map((dim, idx) => {
      const total = dim.leftScore + dim.rightScore;
      const leftPct = total > 0 ? Math.round((dim.leftScore / total) * 100) : 50;
      const diff = Math.abs(dim.leftScore - dim.rightScore);
      const strength = getPreferenceStrength(diff);
      const winner = dim.leftScore >= dim.rightScore ? dim.left : dim.right;
      const color = getDimColor(idx);

      return `
        <div class="pref-row">
          <div class="pref-labels">
            <span class="pref-label ${dim.leftScore >= dim.rightScore ? 'active' : ''}">${dim.leftLabel} (${dim.left}): ${dim.leftScore}</span>
            <span class="pref-strength" style="color:${color}">${strength.label}</span>
            <span class="pref-label ${dim.rightScore > dim.leftScore ? 'active' : ''}">${dim.rightLabel} (${dim.right}): ${dim.rightScore}</span>
          </div>
          <div class="pref-bar-bg">
            <div class="pref-bar-fill" style="width:${leftPct}%;background:${color}"></div>
          </div>
        </div>`;
    }).join('');

    const dominantPrefs = personalityType.split('').map(letter => {
      const p = mbtiPreferences[letter as keyof typeof mbtiPreferences];
      if (!p) return '';
      return `
        <div class="pref-card">
          <div class="pref-card-header"><span class="pref-badge" style="background:${getDimColor(['E','I'].includes(letter)?0:['S','N'].includes(letter)?1:['T','F'].includes(letter)?2:3)}">${p.letter}</span> ${p.name}</div>
          <p class="pref-desc">${p.description}</p>
          <ul class="pref-chars">
            ${p.characteristics.map(c => `<li>• ${c}</li>`).join('')}
          </ul>
        </div>`;
    }).join('');

    const listItems = (items: string[], icon: string, color: string) =>
      items.map(i => `<li><span style="color:${color}">${icon}</span> ${i}</li>`).join('');

    const page1 = `
      <div class="page">
        <div class="report-header">
          <div>
            <h1 class="report-title">MBTI®</h1>
            <p class="report-subtitle">Indicador de Tipo Myers-Briggs®</p>
            <p class="report-subtitle-sm">Informe Psicológico Profesional</p>
          </div>
          <div class="logo-circle"><span>MBTI</span></div>
        </div>

        <div class="patient-card">
          <div class="patient-card-icon">${icons.user}</div>
          <div class="patient-grid">
            <div><span class="label">Paciente</span><span class="value">${patientName || '—'}</span></div>
            <div><span class="label">Fecha de Nacimiento</span><span class="value">${patientBirthDate ? new Date(patientBirthDate).toLocaleDateString('es-AR') : '—'}</span></div>
            <div><span class="label">Edad</span><span class="value">${calcAge()}</span></div>
            <div><span class="label">Fecha del Test</span><span class="value">${new Date(testDate).toLocaleDateString('es-AR')}</span></div>
            <div><span class="label">Tipo de Personalidad</span><span class="value type-highlight">${personalityType}</span></div>
            <div><span class="label">Descripción</span><span class="value">${typeInfo.title}</span></div>
          </div>
        </div>

        <div class="type-hero">
          <div class="type-hero-badge">${personalityType}</div>
          <div class="type-hero-info">
            <h2>${typeInfo.title}</h2>
            <p class="type-hero-subtitle">${typeInfo.subtitle}</p>
          </div>
        </div>
        <div class="type-description">${typeInfo.description}</div>

        <div class="section-header blue">${icons.target} PERFIL DE PREFERENCIAS</div>
        <div class="pref-container">${prefBarHtml}</div>

        <div class="section-header teal">${icons.brain} PREFERENCIAS DOMINANTES</div>
        <div class="pref-grid">${dominantPrefs}</div>

        <div class="page-footer"><span>Informe MBTI® • Confidencial</span><span>Página 1</span></div>
      </div>`;

    const page2 = `
      <div class="page">
        <div class="chapter-title">${icons.briefcase} 1. Contribución a la Organización</div>
        <ul class="styled-list green">${listItems(typeInfo.contributions, '✓', '#059669')}</ul>

        <div class="chapter-title">${icons.shield} 2. Estilo de Mando</div>
        <ul class="styled-list blue">${listItems(typeInfo.leadershipStyle, '▸', '#2563eb')}</ul>

        <div class="chapter-title">${icons.building} 3. Entorno de Trabajo Preferido</div>
        <ul class="styled-list purple">${listItems(typeInfo.preferredEnvironment, '▸', '#7c3aed')}</ul>

        <div class="two-col">
          <div>
            <div class="chapter-title-sm danger">${icons.alert} 4. Peligros Potenciales</div>
            <ul class="styled-list red">${listItems(typeInfo.potentialDangers, '⚠', '#dc2626')}</ul>
          </div>
          <div>
            <div class="chapter-title-sm success">${icons.lightbulb} 5. Sugerencias de Desarrollo</div>
            <ul class="styled-list amber">${listItems(typeInfo.developmentSuggestions, '💡', '#d97706')}</ul>
          </div>
        </div>

        ${additionalNotes ? `
        <div class="chapter-title">${icons.clipboard} 6. Observaciones Clínicas</div>
        <div class="clinical-text">${additionalNotes.replace(/\n/g, '<br>')}</div>` : ''}

        <div class="page-footer"><span>Informe MBTI® • Confidencial</span><span>Página 2</span></div>
      </div>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Informe MBTI — ${patientName || 'Paciente'}</title>
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

  .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 3px solid #1e3a5f; }
  .report-title { font-size: 28pt; font-weight: 900; color: #1e3a5f; letter-spacing: -1px; }
  .report-subtitle { font-size: 10pt; color: #555; }
  .report-subtitle-sm { font-size: 8pt; color: #888; font-style: italic; margin-top: 2px; }
  .logo-circle { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #1e3a5f, #7c3aed); display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 10pt; letter-spacing: 1px; }

  .patient-card { display: flex; gap: 12px; align-items: flex-start; background: linear-gradient(135deg, #f0f4ff, #e8f0fe); border: 1px solid #c5d5ea; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
  .patient-card-icon { color: #1e3a5f; margin-top: 2px; }
  .patient-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px 16px; flex: 1; }
  .patient-grid .label { display: block; font-size: 7pt; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
  .patient-grid .value { display: block; font-size: 9.5pt; font-weight: 600; color: #1a1a1a; }
  .type-highlight { color: #1e3a5f; font-size: 12pt; font-weight: 900; }

  .type-hero { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; padding: 12px 16px; background: linear-gradient(135deg, #1e3a5f, #2563eb); border-radius: 10px; color: white; }
  .type-hero-badge { font-size: 28pt; font-weight: 900; letter-spacing: 2px; padding: 4px 16px; background: rgba(255,255,255,0.15); border-radius: 8px; }
  .type-hero-info h2 { font-size: 16pt; font-weight: 700; margin-bottom: 2px; }
  .type-hero-subtitle { font-size: 9pt; opacity: 0.85; }
  .type-description { font-size: 9.5pt; line-height: 1.65; margin-bottom: 14px; padding: 8px 12px; background: #fafbfc; border-radius: 6px; border-left: 3px solid #2563eb; }

  .section-header { font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 5px 10px; border-radius: 4px; margin: 12px 0 6px; display: flex; align-items: center; gap: 6px; }
  .section-header.blue { background: #eff6ff; color: #1e3a5f; border-left: 3px solid #2563eb; }
  .section-header.teal { background: #ecfdf5; color: #065f46; border-left: 3px solid #059669; }

  .pref-container { margin-bottom: 14px; }
  .pref-row { margin-bottom: 8px; }
  .pref-labels { display: flex; justify-content: space-between; align-items: center; font-size: 8pt; margin-bottom: 3px; }
  .pref-label { color: #888; }
  .pref-label.active { color: #1a1a1a; font-weight: 700; }
  .pref-strength { font-size: 7.5pt; font-weight: 600; }
  .pref-bar-bg { height: 10px; background: #e5e7eb; border-radius: 5px; overflow: hidden; }
  .pref-bar-fill { height: 100%; border-radius: 5px; transition: width 0.3s; }

  .pref-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .pref-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; background: #fafbfc; }
  .pref-card-header { font-weight: 700; font-size: 9.5pt; margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
  .pref-badge { display: inline-block; color: white; font-size: 8pt; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
  .pref-desc { font-size: 8pt; color: #555; margin-bottom: 4px; }
  .pref-chars { list-style: none; font-size: 7.5pt; color: #666; }
  .pref-chars li { margin-bottom: 1px; }

  .chapter-title { font-size: 13pt; font-weight: 700; color: #1e3a5f; margin: 16px 0 8px; padding-bottom: 5px; border-bottom: 2px solid #2563eb; display: flex; align-items: center; gap: 8px; }
  .chapter-title-sm { font-size: 11pt; font-weight: 700; margin: 10px 0 6px; padding-bottom: 4px; border-bottom: 2px solid; display: flex; align-items: center; gap: 6px; }
  .chapter-title-sm.danger { color: #dc2626; border-color: #fca5a5; }
  .chapter-title-sm.success { color: #059669; border-color: #6ee7b7; }

  .styled-list { list-style: none; padding: 0; margin: 0 0 10px; }
  .styled-list li { padding: 4px 8px; margin-bottom: 3px; font-size: 9pt; line-height: 1.5; border-radius: 4px; display: flex; align-items: flex-start; gap: 6px; }
  .styled-list.green li { background: #ecfdf5; }
  .styled-list.blue li { background: #eff6ff; }
  .styled-list.purple li { background: #f5f3ff; }
  .styled-list.red li { background: #fef2f2; }
  .styled-list.amber li { background: #fffbeb; }

  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 8px 0; }
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
        title: `Informe MBTI - ${personalityType} - ${new Date(testDate).toLocaleDateString('es-AR')}`,
        description: `Tipo: ${personalityType} (${typeInfo?.title || ''}). Informe MBTI generado automáticamente.`,
        document_type: "informe",
        price: priceNum,
        is_paid: priceNum === 0,
        payment_date: priceNum === 0 ? new Date().toISOString() : null,
      });
      if (error) throw error;
      toast({ title: "Informe generado", description: priceNum > 0 ? `Con costo de $${priceNum}` : "Gratuito para el paciente" });
      setShowDialog(false);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({ title: "Error", description: "No se pudo generar el informe", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!typeInfo) return null;

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
              Generar Informe MBTI
            </DialogTitle>
            <DialogDescription>
              El informe quedará disponible en la sección de Documentos del paciente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Precio (ARS)
              </Label>
              <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0 = gratuito" className="mt-1" />
              <p className="text-[10px] text-muted-foreground mt-1">
                {parseFloat(price) > 0 ? "El paciente deberá pagar para descargar" : "Gratuito"}
              </p>
            </div>

            <div>
              <Label>Observaciones del profesional (editable)</Label>
              <Textarea value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Agregue observaciones clínicas..." rows={4} />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">El informe incluirá:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Tipo de personalidad: {personalityType} — {typeInfo.title}</li>
                <li>Perfil de preferencias con gráfico</li>
                <li>Contribución a la organización</li>
                <li>Estilo de mando y entorno preferido</li>
                <li>Peligros potenciales y sugerencias</li>
                <li>Observaciones clínicas</li>
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
