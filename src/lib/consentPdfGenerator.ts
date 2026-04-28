import jsPDF from "jspdf";
import type { ConsentModelMeta } from "./consentTemplates";
import type { ProfessionalData, PatientData } from "./consentDocxGenerator";

const dash = (v?: string) => (v && v.trim().length ? v.trim() : "__________");

interface BuildOptions {
  model: ConsentModelMeta;
  professional: ProfessionalData;
  patient?: PatientData;
  /** Firma del/la profesional como dataURL PNG */
  signatureDataUrl?: string;
}

const MARGIN_LEFT = 30; // mm (estándar Santa Fe 3 cm)
const MARGIN_RIGHT = 20;
const MARGIN_TOP = 25;
const MARGIN_BOTTOM = 25;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

export function buildConsentPdfBlob(opts: BuildOptions): Blob {
  const { model, professional, patient, signatureDataUrl } = opts;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFont("times", "normal");

  let y = MARGIN_TOP;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
      doc.addPage();
      y = MARGIN_TOP;
    }
  };

  const writeLine = (text: string, opts: { bold?: boolean; size?: number; align?: "left" | "center" | "right" } = {}) => {
    doc.setFont("times", opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size ?? 11);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(6);
      const x =
        opts.align === "center"
          ? PAGE_WIDTH / 2
          : opts.align === "right"
          ? PAGE_WIDTH - MARGIN_RIGHT
          : MARGIN_LEFT;
      doc.text(line, x, y, { align: opts.align ?? "left" });
      y += 5.5;
    }
  };

  const writeParagraph = (text: string) => {
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      ensureSpace(6);
      doc.text(line, MARGIN_LEFT, y, { maxWidth: CONTENT_WIDTH });
      y += 6.6; // ~ 1.5 line spacing
    }
    y += 2;
  };

  // Encabezado
  writeLine("CONSENTIMIENTO INFORMADO", { bold: true, size: 14, align: "center" });
  y += 2;
  writeLine(model.title, { size: 11, align: "center" });
  y += 4;

  // Datos profesional
  writeLine("Datos del/la profesional", { bold: true, size: 12 });
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH, y);
  y += 3;
  writeParagraph(
    `Nombre y apellido: ${dash(professional.fullName)}\n` +
      `M.N. Nº ${dash(professional.matriculaNacional)} · M.P. Nº ${dash(professional.matriculaProvincial)}\n` +
      `Especialidad: ${dash(professional.specialty)}\n` +
      `Domicilio profesional: ${dash(professional.address)}\n` +
      `Teléfono: ${dash(professional.phone)} · Correo: ${dash(professional.email)}`,
  );

  // Datos consultante
  writeLine("Datos del/la consultante", { bold: true, size: 12 });
  doc.line(MARGIN_LEFT, y, MARGIN_LEFT + CONTENT_WIDTH, y);
  y += 3;
  writeParagraph(
    `Nombre y apellido: ${dash(patient?.fullName)}\n` +
      `DNI: ${dash(patient?.dni)} · Fecha de nacimiento: ${dash(patient?.birthDate)}\n` +
      `Domicilio: ${dash(patient?.address)}`,
  );

  // Cuerpo
  for (const sec of model.sections) {
    ensureSpace(14);
    writeLine(sec.heading, { bold: true, size: 12 });
    let body = sec.body;
    if (professional.honorarios) body = body.replace(/\$__________/g, `$${professional.honorarios}`);
    writeParagraph(body);
  }

  // Marco legal
  ensureSpace(20);
  writeLine("Marco normativo aplicable", { bold: true, size: 11 });
  for (const law of model.legalFrame) writeParagraph(`• ${law}`);

  // Firmas
  ensureSpace(50);
  y += 8;
  const colWidth = CONTENT_WIDTH / 2 - 5;
  const leftX = MARGIN_LEFT;
  const rightX = MARGIN_LEFT + CONTENT_WIDTH / 2 + 5;

  // Firma profesional (con imagen si está)
  if (signatureDataUrl) {
    try {
      doc.addImage(signatureDataUrl, "PNG", leftX, y, colWidth, 22);
    } catch {
      // ignore
    }
  }
  const sigY = y + 24;
  doc.setLineWidth(0.3);
  doc.line(leftX, sigY, leftX + colWidth, sigY);
  doc.line(rightX, sigY, rightX + colWidth, sigY);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text(dash(professional.fullName), leftX + colWidth / 2, sigY + 5, { align: "center" });
  doc.setFont("times", "normal");
  doc.text(
    `M.N. ${dash(professional.matriculaNacional)} · M.P. ${dash(professional.matriculaProvincial)}`,
    leftX + colWidth / 2,
    sigY + 10,
    { align: "center" },
  );
  doc.text("Firma y aclaración del/la consultante", rightX + colWidth / 2, sigY + 5, {
    align: "center",
  });
  doc.text(`DNI: ${dash(patient?.dni)}`, rightX + colWidth / 2, sigY + 10, { align: "center" });

  // Lugar y fecha
  y = sigY + 22;
  ensureSpace(8);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Lugar y fecha: __________________________________, ${today}`, MARGIN_LEFT, y);

  return doc.output("blob");
}
