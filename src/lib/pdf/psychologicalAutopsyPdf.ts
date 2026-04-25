/**
 * Generador de PDF para la sección "Autopsia Psicológica" del módulo Acompañar.
 * Exporta el contenido completo (descripción, marco teórico, referentes, investigaciones,
 * instrumentos, bibliografía y consideraciones éticas) con identidad del profesional
 * firmante y pie de página institucional .PSI.
 */
import { jsPDF } from 'jspdf';
import {
  AP_OVERVIEW,
  AP_THEORY,
  AP_REFERENTS,
  AP_RESEARCH,
  AP_INSTRUMENTS,
  AP_BIBLIOGRAPHY,
  AP_ETHICS,
} from '@/data/psychologicalAutopsyContent';

export interface APPdfOptions {
  professionalName?: string | null;
  professionalLicense?: string | null;
  professionalCollege?: string | null;
  professionalRole?: string | null;
}

const PAGE_W = 210;
const PAGE_H = 297;
const MX = 15;
const FOOTER_Y = PAGE_H - 12;
const ACCENT: [number, number, number] = [115, 30, 50]; // hsl(348 60% 32%)
const ETHIC_NOTE =
  'Aviso epistemológico: la Autopsia Psicológica rinde indicadores PROBABILÍSTICO-ORIENTATIVOS. ' +
  'No determina la modalidad legal de muerte (NASH); esa atribución corresponde al órgano ' +
  'jurisdiccional (CPP Santa Fe — Ley 12.734).';

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - 30) {
    doc.addPage();
    return 40;
  }
  return y;
}

function drawHeader(doc: jsPDF) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...ACCENT);
  doc.text('.PSI. — Centro de Recursos Psicoforenses', MX, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text('Autopsia Psicológica · uso pericial / clínico-forense', MX, 21);

  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.4);
  doc.line(MX, 24, PAGE_W - MX, 24);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  doc.text('Autopsia Psicológica — Compendio académico-pericial', MX, 32);
}

function drawFooter(doc: jsPDF, opts: APPdfOptions, page: number, total: number) {
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(MX, FOOTER_Y - 12, PAGE_W - MX, FOOTER_Y - 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(110, 110, 110);
  const ethicLines = doc.splitTextToSize(ETHIC_NOTE, PAGE_W - MX * 2);
  doc.text(ethicLines, MX, FOOTER_Y - 8);

  const proLine = [
    opts.professionalName || '— Profesional firmante —',
    opts.professionalLicense ? `Mat. ${opts.professionalLicense}` : null,
    opts.professionalCollege || null,
    opts.professionalRole || null,
  ].filter(Boolean).join(' · ');

  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(proLine, MX, FOOTER_Y);

  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text(
    `© ${new Date().getFullYear()} .PSI. — Plataforma de Sistemas Interactivos · ${page}/${total}`,
    PAGE_W - MX,
    FOOTER_Y,
    { align: 'right' },
  );
}

function sectionTitle(doc: jsPDF, y: number, title: string): number {
  y = ensureSpace(doc, y, 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...ACCENT);
  doc.text(title, MX, y);
  y += 2;
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.3);
  doc.line(MX, y, MX + 50, y);
  return y + 5;
}

function paragraph(doc: jsPDF, y: number, text: string, opts?: { bold?: boolean; size?: number }): number {
  doc.setFont('helvetica', opts?.bold ? 'bold' : 'normal');
  doc.setFontSize(opts?.size ?? 9.5);
  doc.setTextColor(40, 40, 40);
  const lines = doc.splitTextToSize(text, PAGE_W - MX * 2);
  y = ensureSpace(doc, y, lines.length * 4 + 2);
  doc.text(lines, MX, y);
  return y + lines.length * 4 + 2;
}

function bulletList(doc: jsPDF, y: number, items: string[]): number {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  items.forEach((it) => {
    const lines = doc.splitTextToSize(`• ${it}`, PAGE_W - MX * 2 - 4);
    y = ensureSpace(doc, y, lines.length * 4 + 1);
    doc.text(lines, MX + 2, y);
    y += lines.length * 4 + 1;
  });
  return y + 2;
}

function subTitle(doc: jsPDF, y: number, text: string): number {
  y = ensureSpace(doc, y, 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 30, 30);
  doc.text(text, MX, y);
  return y + 4;
}

function buildContent(doc: jsPDF) {
  drawHeader(doc);
  let y = 40;

  // 1. Descripción general
  y = sectionTitle(doc, y, '1. Descripción general');
  y = paragraph(doc, y, AP_OVERVIEW.definition);
  y = subTitle(doc, y, 'Objetivos del procedimiento');
  y = bulletList(doc, y, AP_OVERVIEW.objectives);
  y = subTitle(doc, y, 'Modalidades de AP');
  y = bulletList(doc, y, AP_OVERVIEW.modalities.map((m) => `${m.name}. ${m.desc}`));
  y = subTitle(doc, y, 'Contextos de aplicación');
  y = bulletList(doc, y, AP_OVERVIEW.contexts);
  y = subTitle(doc, y, 'Rol del psicólogo forense');
  y = paragraph(doc, y, AP_OVERVIEW.role);
  y = subTitle(doc, y, 'Estatus epistemológico y limitaciones');
  y = paragraph(doc, y, AP_OVERVIEW.epistemic);

  // 2. Marco teórico
  y = sectionTitle(doc, y, '2. Marco teórico');
  AP_THEORY.forEach((axis) => {
    y = subTitle(doc, y, axis.title);
    y = paragraph(doc, y, axis.body);
    if (axis.bullets?.length) y = bulletList(doc, y, axis.bullets);
  });

  // 3. Referentes
  y = sectionTitle(doc, y, '3. Exponentes y referentes');
  const refGroups: Array<[string, typeof AP_REFERENTS.founders]> = [
    ['Fundadores históricos', AP_REFERENTS.founders],
    ['Referentes contemporáneos internacionales', AP_REFERENTS.international],
    ['Referentes latinoamericanos', AP_REFERENTS.latam],
  ];
  refGroups.forEach(([label, items]) => {
    y = subTitle(doc, y, label);
    y = bulletList(doc, y, items.map((a) => `${a.name}. ${a.contribution}`));
  });

  // 4. Investigaciones
  y = sectionTitle(doc, y, '4. Investigaciones relevantes');
  AP_RESEARCH.forEach((r, i) => {
    y = subTitle(doc, y, `${i + 1}. ${r.title} (${r.year})`);
    y = paragraph(doc, y, `${r.authors}. ${r.source}`, { size: 8.5 });
    y = paragraph(doc, y, `Método: ${r.method}`);
    y = paragraph(doc, y, `Relevancia forense: ${r.forensic}`);
  });

  // 5. Instrumentos
  y = sectionTitle(doc, y, '5. Instrumentos, cuestionarios y planillas');
  AP_INSTRUMENTS.forEach((ins, i) => {
    y = subTitle(doc, y, `${i + 1}. ${ins.name}`);
    y = paragraph(doc, y, `Autores / año: ${ins.authors}`);
    y = paragraph(doc, y, `Propósito: ${ins.purpose}`);
    y = paragraph(doc, y, `Estructura: ${ins.structure}`);
    y = paragraph(doc, y, `Validación / normas: ${ins.validation}`);
    y = paragraph(doc, y, `Accesibilidad: ${ins.access}`);
    y = paragraph(doc, y, `Pertinencia forense: ${ins.forensic}`);
  });

  // 6. Bibliografía
  y = sectionTitle(doc, y, '6. Bibliografía y recursos recomendados');
  y = subTitle(doc, y, '6.1 Libros fundamentales');
  AP_BIBLIOGRAPHY.books.forEach((b) => {
    y = paragraph(doc, y, b.ref, { bold: true });
    y = paragraph(doc, y, b.note, { size: 8.5 });
  });
  y = subTitle(doc, y, '6.2 Artículos de acceso libre');
  y = bulletList(doc, y, AP_BIBLIOGRAPHY.articles);
  y = subTitle(doc, y, '6.3 Recursos institucionales y normativa');
  y = bulletList(doc, y, AP_BIBLIOGRAPHY.institutions.map((it) => `${it.name} — ${it.url}`));

  // Ética
  y = sectionTitle(doc, y, 'Consideraciones éticas y deontológicas');
  y = paragraph(doc, y, AP_ETHICS);
}

export function generatePsychologicalAutopsyPdf(opts: APPdfOptions = {}): {
  doc: jsPDF;
  fileName: string;
} {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  buildContent(doc);
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, opts, i, total);
  }
  const stamp = new Date().toISOString().slice(0, 10);
  return { doc, fileName: `Autopsia_Psicologica_compendio_${stamp}.pdf` };
}

export function downloadPsychologicalAutopsyPdf(opts: APPdfOptions = {}) {
  const { doc, fileName } = generatePsychologicalAutopsyPdf(opts);
  doc.save(fileName);
}