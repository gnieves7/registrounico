/**
 * Generador de plantillas PDF para la sección "Psicología del Testimonio".
 * Produce tres documentos exportables (Ficha CBCA, Checklist SVA, Informe-síntesis)
 * con identidad del profesional firmante y pie de página institucional .PSI.
 */
import { jsPDF } from 'jspdf';
import {
  CBCA_CRITERIA,
  SVA_VALIDITY_CHECKLIST,
  TESTIMONY_REPORT_TEMPLATE,
} from '@/data/testimonyPsychologyContent';

export type TestimonyTemplateKind = 'cbca' | 'validity' | 'report';

export interface TemplatePdfOptions {
  professionalName?: string | null;
  professionalLicense?: string | null;
  professionalCollege?: string | null;
  professionalRole?: string | null; // ej: "Perito de parte" / "Consultor técnico"
}

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 15;
const FOOTER_Y = PAGE_H - 12;
const ETHIC_NOTE =
  'Aviso epistemológico: los presentes instrumentos rinden indicadores de naturaleza ' +
  'PROBABILÍSTICA-ORIENTATIVA. No constituyen diagnóstico de verdad/falsedad. La ' +
  'determinación de la verdad procesal corresponde exclusivamente al órgano jurisdiccional ' +
  '(CPP Santa Fe — Ley 12.734).';

function todayLong(): string {
  const d = new Date();
  const months = [
    'enero','febrero','marzo','abril','mayo','junio',
    'julio','agosto','septiembre','octubre','noviembre','diciembre',
  ];
  return `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

function drawHeader(doc: jsPDF, title: string) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(60, 20, 30);
  doc.text('.PSI. — Centro de Recursos Psicoforenses', MARGIN_X, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text('Plantilla profesional · uso pericial / clínico-forense', MARGIN_X, 21);

  doc.setDrawColor(180, 60, 80);
  doc.setLineWidth(0.4);
  doc.line(MARGIN_X, 24, PAGE_W - MARGIN_X, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text(title, MARGIN_X, 32);
}

function drawFooter(doc: jsPDF, opts: TemplatePdfOptions, pageNum: number, pageTotal: number) {
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(MARGIN_X, FOOTER_Y - 12, PAGE_W - MARGIN_X, FOOTER_Y - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);

  const ethicLines = doc.splitTextToSize(ETHIC_NOTE, PAGE_W - MARGIN_X * 2);
  doc.text(ethicLines, MARGIN_X, FOOTER_Y - 8);

  const proLine = [
    opts.professionalName || '— Profesional firmante —',
    opts.professionalLicense ? `Mat. ${opts.professionalLicense}` : null,
    opts.professionalCollege || null,
    opts.professionalRole || null,
  ].filter(Boolean).join(' · ');

  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(proLine, MARGIN_X, FOOTER_Y);

  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `© ${new Date().getFullYear()} .PSI. — Plataforma de Sistemas Interactivos · ${pageNum}/${pageTotal}`,
    PAGE_W - MARGIN_X,
    FOOTER_Y,
    { align: 'right' }
  );
}

function ensureSpace(doc: jsPDF, currentY: number, needed: number): number {
  if (currentY + needed > PAGE_H - 30) {
    doc.addPage();
    return 40;
  }
  return currentY;
}

function buildCbcaForm(doc: jsPDF) {
  drawHeader(doc, 'Ficha de Registro CBCA — 19 criterios');

  let y = 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  const intro = doc.splitTextToSize(
    'Marque cada criterio según presencia (Sí / No / Parcial), intensidad (1-3) y registre observación clínica con referencia al segmento del relato (línea o minuto).',
    PAGE_W - MARGIN_X * 2,
  );
  doc.text(intro, MARGIN_X, y);
  y += intro.length * 4 + 4;

  // Datos del caso
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  doc.text('Datos del caso', MARGIN_X, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  ['Carátula / CUIJ:', 'Entrevistado/a:', 'Edad:', 'Fecha de la entrevista:', 'Modalidad de registro:'].forEach((label) => {
    doc.text(label, MARGIN_X, y);
    doc.setDrawColor(200);
    doc.line(MARGIN_X + 50, y + 0.5, PAGE_W - MARGIN_X, y + 0.5);
    y += 6;
  });

  y += 4;

  // Tabla
  const colX = [MARGIN_X, MARGIN_X + 8, MARGIN_X + 70, MARGIN_X + 95, MARGIN_X + 120, PAGE_W - MARGIN_X];
  const headers = ['#', 'Criterio', 'Categoría', 'Pres. (S/N/P)', 'Int. (1-3)', 'Obs. / segmento'];
  doc.setFillColor(245, 235, 240);
  doc.rect(MARGIN_X, y, PAGE_W - MARGIN_X * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  headers.forEach((h, i) => doc.text(h, colX[i] + 1, y + 5));
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  CBCA_CRITERIA.forEach((c) => {
    y = ensureSpace(doc, y, 9);
    const nameLines = doc.splitTextToSize(c.name, 60);
    const catLines = doc.splitTextToSize(c.category.replace(/^[IV]+\.\s/, ''), 22);
    const rowH = Math.max(nameLines.length, catLines.length) * 3.2 + 4;

    doc.setDrawColor(220);
    doc.line(MARGIN_X, y + rowH, PAGE_W - MARGIN_X, y + rowH);

    doc.text(String(c.number), colX[0] + 1, y + 4);
    doc.text(nameLines, colX[1] + 1, y + 4);
    doc.text(catLines, colX[2] + 1, y + 4);
    // Empty boxes for fields
    doc.rect(colX[3] + 1, y + 1.5, 22, 4);
    doc.rect(colX[4] + 1, y + 1.5, 22, 4);
    doc.rect(colX[5] - 50, y + 1.5, 47, rowH - 3);
    y += rowH;
  });
}

function buildValidityChecklist(doc: jsPDF) {
  drawHeader(doc, 'Checklist de Validez SVA');

  let y = 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  const intro = doc.splitTextToSize(
    'Verificación de los factores externos que pueden afectar la validez de la declaración. Marque cada ítem como Adecuado / Parcial / Inadecuado / No evaluable, registrando observación clínica.',
    PAGE_W - MARGIN_X * 2,
  );
  doc.text(intro, MARGIN_X, y);
  y += intro.length * 4 + 6;

  SVA_VALIDITY_CHECKLIST.forEach((block) => {
    y = ensureSpace(doc, y, 14);
    doc.setFillColor(245, 235, 240);
    doc.rect(MARGIN_X, y, PAGE_W - MARGIN_X * 2, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text(block.section, MARGIN_X + 2, y + 5);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);

    block.items.forEach((item) => {
      y = ensureSpace(doc, y, 10);
      const lines = doc.splitTextToSize(item, PAGE_W - MARGIN_X * 2 - 60);
      const h = Math.max(lines.length * 4, 6) + 2;

      doc.rect(MARGIN_X, y - 3, 3, 3); // checkbox
      doc.text(lines, MARGIN_X + 6, y);

      // 4 small boxes A/P/I/N
      const labels = ['A', 'P', 'I', 'N/E'];
      labels.forEach((lab, i) => {
        const bx = PAGE_W - MARGIN_X - 50 + i * 12;
        doc.rect(bx, y - 3, 4, 4);
        doc.setFontSize(7);
        doc.text(lab, bx + 5, y);
        doc.setFontSize(9);
      });

      y += h;
    });
    y += 4;
  });
}

function buildReportSynthesis(doc: jsPDF, opts: TemplatePdfOptions) {
  drawHeader(doc, 'Informe-síntesis de Credibilidad Testimonial');

  let y = 40;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(110, 110, 110);
  doc.text(`Lugar y fecha: ____________________ , ${todayLong()}`, MARGIN_X, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  TESTIMONY_REPORT_TEMPLATE.forEach((block) => {
    y = ensureSpace(doc, y, 22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(60, 20, 30);
    doc.text(block.section, MARGIN_X, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    const lines = doc.splitTextToSize(block.content, PAGE_W - MARGIN_X * 2);
    doc.text(lines, MARGIN_X, y);
    y += lines.length * 4 + 2;

    // espacio para completar
    doc.setDrawColor(220);
    for (let i = 0; i < 3; i++) {
      y = ensureSpace(doc, y, 7);
      doc.line(MARGIN_X, y + 4, PAGE_W - MARGIN_X, y + 4);
      y += 6;
    }
    y += 3;
  });

  // Firma
  y = ensureSpace(doc, y, 35);
  y += 6;
  doc.setDrawColor(80);
  doc.line(MARGIN_X, y, MARGIN_X + 80, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(opts.professionalName || 'Firma y aclaración', MARGIN_X, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  const sigLines = [
    opts.professionalLicense ? `Matrícula: ${opts.professionalLicense}` : 'Matrícula: ____________________',
    opts.professionalCollege || 'Colegio de Psicólogos de la Provincia de Santa Fe',
    opts.professionalRole || 'Perito de parte / Consultor técnico (tachar lo que no corresponde)',
  ];
  sigLines.forEach((l, i) => doc.text(l, MARGIN_X, y + 10 + i * 4));
}

export function generateTestimonyTemplatePdf(
  kind: TestimonyTemplateKind,
  opts: TemplatePdfOptions = {},
): { doc: jsPDF; fileName: string } {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  if (kind === 'cbca') buildCbcaForm(doc);
  else if (kind === 'validity') buildValidityChecklist(doc);
  else buildReportSynthesis(doc, opts);

  // Footer en cada página
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, opts, i, total);
  }

  const fileMap: Record<TestimonyTemplateKind, string> = {
    cbca: 'Ficha_CBCA_19_criterios',
    validity: 'Checklist_Validez_SVA',
    report: 'Informe_Sintesis_Credibilidad_Testimonial',
  };
  const stamp = new Date().toISOString().slice(0, 10);
  return { doc, fileName: `${fileMap[kind]}_${stamp}.pdf` };
}

export function downloadTestimonyTemplate(
  kind: TestimonyTemplateKind,
  opts: TemplatePdfOptions = {},
) {
  const { doc, fileName } = generateTestimonyTemplatePdf(kind, opts);
  doc.save(fileName);
}