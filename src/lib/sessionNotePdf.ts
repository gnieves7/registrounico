import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ExportSessionNoteParams {
  patientName: string;
  professionalName: string;
  sessionDate: string;
  topic?: string | null;
  templateName?: string;
  body: string;
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const sanitize = (v: string) =>
  v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9-_]+/g, '-').toLowerCase();

export function exportSessionNotePdf(params: ExportSessionNoteParams) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('Nota clínica de sesión', MARGIN, y);
  y += 22;

  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(`Paciente: ${params.patientName}`, MARGIN, y);
  y += 14;
  doc.text(`Profesional: ${params.professionalName}`, MARGIN, y);
  y += 14;
  doc.text(
    `Fecha de sesión: ${format(new Date(params.sessionDate), "dd/MM/yyyy HH:mm", { locale: es })}`,
    MARGIN,
    y,
  );
  y += 14;
  if (params.topic) {
    doc.text(`Tema: ${params.topic}`, MARGIN, y);
    y += 14;
  }
  if (params.templateName) {
    doc.text(`Plantilla: ${params.templateName}`, MARGIN, y);
    y += 14;
  }

  y += 8;
  doc.setDrawColor(180);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 18;

  doc.setTextColor(30);
  doc.setFontSize(11);
  const lines = doc.splitTextToSize(params.body || '(sin contenido)', CONTENT_WIDTH);
  for (const line of lines) {
    if (y > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    const isHeading = /^[A-ZÁÉÍÓÚÑ0-9\s·\-—()\/]+$/.test(line.trim()) && line.trim().length > 0 && line.trim() === line.trim().toUpperCase() && line.trim().length < 80;
    if (isHeading) {
      doc.setFont('times', 'bold');
      y += 4;
      doc.text(line, MARGIN, y);
      doc.setFont('times', 'normal');
    } else {
      doc.text(line, MARGIN, y);
    }
    y += 16;
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(
      `.PSI. · Generado ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}  ·  Página ${i} de ${pageCount}`,
      MARGIN,
      PAGE_HEIGHT - 24,
    );
  }

  const filename = `nota-${sanitize(params.patientName)}-${format(new Date(params.sessionDate), 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}