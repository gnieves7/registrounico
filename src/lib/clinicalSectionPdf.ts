import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface ClinicalSection {
  heading: string;
  lines: string[];
}

export interface ClinicalPdfParams {
  documentTitle: string;
  patientName: string;
  professionalName: string;
  subtitle?: string;
  sections: ClinicalSection[];
  filenamePrefix: string;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const sanitize = (v: string) =>
  v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').toLowerCase();

export function exportClinicalPdf(params: ClinicalPdfParams) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text(params.documentTitle, MARGIN, y);
  y += 22;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Paciente: ${params.patientName}`, MARGIN, y); y += 14;
  doc.text(`Profesional: ${params.professionalName}`, MARGIN, y); y += 14;
  doc.text(`Generado: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`, MARGIN, y); y += 14;
  if (params.subtitle) { doc.text(params.subtitle, MARGIN, y); y += 14; }

  y += 6;
  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 16;

  const ensureSpace = (h: number) => {
    if (y + h > PAGE_HEIGHT - MARGIN) { doc.addPage(); y = MARGIN; }
  };

  for (const section of params.sections) {
    ensureSpace(24);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(section.heading, MARGIN, y);
    y += 16;

    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(40);

    if (section.lines.length === 0) {
      ensureSpace(14);
      doc.setTextColor(140);
      doc.text('(sin contenido)', MARGIN, y);
      doc.setTextColor(40);
      y += 14;
    } else {
      for (const raw of section.lines) {
        const wrapped = doc.splitTextToSize(raw || '—', CONTENT_WIDTH);
        for (const line of wrapped) {
          ensureSpace(14);
          doc.text(line, MARGIN, y);
          y += 14;
        }
      }
    }
    y += 8;
  }

  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `.PSI. · ${params.documentTitle}  ·  Página ${i} de ${pageCount}`,
      MARGIN, PAGE_HEIGHT - 24,
    );
  }

  const filename = `${params.filenamePrefix}-${sanitize(params.patientName)}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}
