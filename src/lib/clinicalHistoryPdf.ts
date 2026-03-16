import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface ClinicalHistorySession {
  session_date: string;
  topic: string | null;
  clinical_notes: string | null;
  patient_notes: string | null;
  patient_questions: string | null;
}

export interface ClinicalHistoryTask {
  title: string;
  category_label: string;
  status_label: string;
  due_date: string | null;
  completed_at: string | null;
  instructions: string | null;
  response: string | null;
}

export interface ClinicalHistoryAward {
  award_title: string;
  award_description: string | null;
  category_title: string;
  awarded_at: string;
  clinical_note: string | null;
}

interface ExportClinicalHistoryPdfParams {
  patientName: string;
  generatedBy: string;
  sessions: ClinicalHistorySession[];
  tasks: ClinicalHistoryTask[];
  awards: ClinicalHistoryAward[];
}

const PAGE_HEIGHT = 841.89;
const PAGE_WIDTH = 595.28;
const MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const sanitizeFileName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const formatDateTime = (value?: string | null) => {
  if (!value) return "Sin fecha";
  return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es });
};

const drawParagraph = (doc: jsPDF, text: string, y: number, options?: { indent?: number; size?: number; color?: [number, number, number] }) => {
  const indent = options?.indent ?? 0;
  const size = options?.size ?? 10;
  const color = options?.color ?? [70, 70, 70];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, CONTENT_WIDTH - indent);
  doc.text(lines, MARGIN + indent, y);
  return y + lines.length * (size + 2);
};

const ensureSpace = (doc: jsPDF, y: number, requiredHeight: number) => {
  if (y + requiredHeight <= PAGE_HEIGHT - MARGIN) return y;
  doc.addPage();
  return MARGIN;
};

const drawSectionTitle = (doc: jsPDF, title: string, y: number) => {
  const nextY = ensureSpace(doc, y, 42);
  doc.setDrawColor(207, 184, 147);
  doc.setFillColor(250, 244, 235);
  doc.roundedRect(MARGIN, nextY, CONTENT_WIDTH, 28, 8, 8, "FD");
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(120, 68, 24);
  doc.text(title, MARGIN + 12, nextY + 18);
  return nextY + 40;
};

const drawMetaLine = (doc: jsPDF, label: string, value: string, y: number) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(label, MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text(value, MARGIN + 82, y);
  return y + 14;
};

const drawSummaryCard = (doc: jsPDF, x: number, title: string, value: string) => {
  doc.setDrawColor(224, 217, 205);
  doc.setFillColor(255, 252, 247);
  doc.roundedRect(x, 142, 150, 62, 10, 10, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(33, 33, 33);
  doc.text(value, x + 14, 170);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(title, x + 14, 188);
};

export function exportClinicalHistoryPdf({
  patientName,
  generatedBy,
  sessions,
  tasks,
  awards,
}: ExportClinicalHistoryPdfParams) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFillColor(248, 242, 232);
  doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(MARGIN, 30, CONTENT_WIDTH, PAGE_HEIGHT - 60, 18, 18, "F");

  doc.setFillColor(120, 68, 24);
  doc.roundedRect(MARGIN, 42, 190, 24, 12, 12, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 248, 240);
  doc.text("REFLEXIONAR · HISTORIAL CLINICO", MARGIN + 12, 58);

  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(28, 28, 28);
  doc.text("Reporte integral del proceso terapeutico", MARGIN, 100);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(95, 95, 95);
  const subtitle = doc.splitTextToSize(
    "Documento exportable con sesiones, micro-tareas y premios simbolicos para archivo profesional y seguimiento evolutivo.",
    CONTENT_WIDTH,
  );
  doc.text(subtitle, MARGIN, 120);

  drawSummaryCard(doc, MARGIN, "Sesiones registradas", String(sessions.length));
  drawSummaryCard(doc, MARGIN + 162, "Micro-tareas", String(tasks.length));
  drawSummaryCard(doc, MARGIN + 324, "Premios simbolicos", String(awards.length));

  let y = 234;
  y = drawMetaLine(doc, "Paciente", patientName || "Paciente", y);
  y = drawMetaLine(doc, "Profesional", generatedBy || "Profesional", y);
  y = drawMetaLine(doc, "Emision", format(new Date(), "dd/MM/yyyy HH:mm", { locale: es }), y);

  y += 6;
  y = drawSectionTitle(doc, "1. Sesiones", y);

  if (sessions.length === 0) {
    y = drawParagraph(doc, "No hay sesiones registradas para este paciente en el periodo disponible.", y);
  } else {
    sessions.forEach((session, index) => {
      y = ensureSpace(doc, y, 110);
      doc.setDrawColor(231, 225, 214);
      doc.setFillColor(252, 249, 243);
      doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 84, 10, 10, "FD");
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text(`${index + 1}. ${formatDateTime(session.session_date)}`, MARGIN + 12, y + 20);

      let innerY = y + 38;
      innerY = drawParagraph(doc, `Tema: ${session.topic || "Sin tema consignado"}`, innerY, { indent: 12 });
      if (session.patient_questions) innerY = drawParagraph(doc, `Preguntas del paciente: ${session.patient_questions}`, innerY + 2, { indent: 12, size: 9 });
      if (session.patient_notes) innerY = drawParagraph(doc, `Notas del paciente: ${session.patient_notes}`, innerY + 2, { indent: 12, size: 9 });
      if (session.clinical_notes) innerY = drawParagraph(doc, `Nota clinica: ${session.clinical_notes}`, innerY + 2, { indent: 12, size: 9 });
      y = Math.max(y + 96, innerY + 10);
    });
  }

  y = drawSectionTitle(doc, "2. Micro-tareas entre sesiones", y + 6);

  if (tasks.length === 0) {
    y = drawParagraph(doc, "No hay micro-tareas registradas para este paciente.", y);
  } else {
    tasks.forEach((task, index) => {
      y = ensureSpace(doc, y, 108);
      doc.setDrawColor(231, 225, 214);
      doc.setFillColor(252, 249, 243);
      doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 86, 10, 10, "FD");
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text(`${index + 1}. ${task.title}`, MARGIN + 12, y + 20);

      let innerY = y + 38;
      innerY = drawParagraph(doc, `Categoria: ${task.category_label} · Estado: ${task.status_label}`, innerY, { indent: 12 });
      if (task.due_date) innerY = drawParagraph(doc, `Vencimiento: ${formatDateTime(task.due_date)}`, innerY + 2, { indent: 12, size: 9 });
      if (task.instructions) innerY = drawParagraph(doc, `Indicaciones: ${task.instructions}`, innerY + 2, { indent: 12, size: 9 });
      if (task.response) innerY = drawParagraph(doc, `Respuesta del paciente: ${task.response}`, innerY + 2, { indent: 12, size: 9 });
      if (task.completed_at) innerY = drawParagraph(doc, `Completada: ${formatDateTime(task.completed_at)}`, innerY + 2, { indent: 12, size: 9 });
      y = Math.max(y + 98, innerY + 10);
    });
  }

  y = drawSectionTitle(doc, "3. Premios simbolicos", y + 6);

  if (awards.length === 0) {
    y = drawParagraph(doc, "No hay premios simbolicos otorgados para este paciente.", y);
  } else {
    awards.forEach((award, index) => {
      y = ensureSpace(doc, y, 100);
      doc.setDrawColor(231, 225, 214);
      doc.setFillColor(252, 249, 243);
      doc.roundedRect(MARGIN, y, CONTENT_WIDTH, 82, 10, 10, "FD");
      doc.setFont("times", "bold");
      doc.setFontSize(13);
      doc.setTextColor(33, 33, 33);
      doc.text(`${index + 1}. ${award.award_title}`, MARGIN + 12, y + 20);

      let innerY = y + 38;
      innerY = drawParagraph(doc, `Categoria: ${award.category_title} · Otorgado: ${formatDateTime(award.awarded_at)}`, innerY, { indent: 12 });
      if (award.award_description) innerY = drawParagraph(doc, award.award_description, innerY + 2, { indent: 12, size: 9 });
      if (award.clinical_note) innerY = drawParagraph(doc, `Validacion clinica: ${award.clinical_note}`, innerY + 2, { indent: 12, size: 9 });
      y = Math.max(y + 94, innerY + 10);
    });
  }

  const footerY = ensureSpace(doc, y + 10, 40);
  doc.setDrawColor(224, 217, 205);
  doc.line(MARGIN, footerY, PAGE_WIDTH - MARGIN, footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Documento confidencial para uso clinico. Salud mental es prioridad.",
    MARGIN,
    footerY + 16,
  );

  doc.save(`historial-clinico-${sanitizeFileName(patientName || "paciente")}.pdf`);
}
