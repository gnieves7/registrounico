import jsPDF from "jspdf";
import type { PsicodiagFormData } from "@/components/interview/psicodiagnostica/types";

const FOOTER = "Lic./Esp. ___________________________  Mat. N° _________";

function addHeader(doc: jsPDF, page: number) {
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("PLANILLA DE PRIMERA ENTREVISTA PSICODIAGNÓSTICA", 105, 12, { align: "center" });
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.text("Uso Profesional Exclusivo — Confidencial", 105, 17, { align: "center" });
  doc.setLineWidth(0.3);
  doc.line(20, 19, 190, 19);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text(`${FOOTER}     Pág. ${page}`, 105, 287, { align: "center" });
}

function ensureSpace(doc: jsPDF, y: number, needed: number, page: { n: number }): number {
  if (y + needed > 275) {
    doc.addPage();
    page.n += 1;
    addHeader(doc, page.n);
    return 28;
  }
  return y;
}

function section(doc: jsPDF, y: number, title: string, page: { n: number }): number {
  y = ensureSpace(doc, y, 14, page);
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text(title, 25, y);
  y += 5;
  doc.setLineWidth(0.2);
  doc.line(25, y - 1, 185, y - 1);
  return y + 3;
}

function field(doc: jsPDF, y: number, label: string, value: string, page: { n: number }): number {
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  const text = `${label}:`;
  y = ensureSpace(doc, y, 7, page);
  doc.text(text, 25, y);
  doc.setFont("times", "normal");
  const display = (value || "—").trim() || "—";
  const lines = doc.splitTextToSize(display, 110);
  doc.text(lines, 80, y);
  return y + Math.max(6, lines.length * 5);
}

function block(doc: jsPDF, y: number, label: string, value: string, page: { n: number }): number {
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  y = ensureSpace(doc, y, 10, page);
  doc.text(`${label}:`, 25, y);
  y += 5;
  doc.setFont("times", "normal");
  const txt = (value || "—").trim() || "—";
  const lines = doc.splitTextToSize(txt, 160);
  y = ensureSpace(doc, y, lines.length * 5 + 2, page);
  doc.text(lines, 25, y);
  return y + lines.length * 5 + 3;
}

export function exportPsicodiagPdf(data: PsicodiagFormData) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const page = { n: 1 };
  addHeader(doc, page.n);

  let y = 28;

  // Title
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("PLANILLA DE PRIMERA ENTREVISTA PSICODIAGNÓSTICA", 105, y, { align: "center" });
  y += 6;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.text("Instrumento de recolección clínica — Versión Genérica (Partes I–VI)", 105, y, {
    align: "center",
  });
  y += 8;

  // PARTE I
  y = section(doc, y, "PARTE I — DATOS DE IDENTIFICACIÓN Y ENCUADRE", page);
  y = field(doc, y, "Apellido/s y nombre/s", data.fullName, page);
  y = field(doc, y, "Fecha de nacimiento", data.birthDate, page);
  y = field(doc, y, "Edad", data.age, page);
  y = field(doc, y, "Género (autopercibido)", data.gender, page);
  y = field(doc, y, "DNI / Documento", data.dni, page);
  y = field(doc, y, "Nacionalidad", data.nationality, page);
  y = field(doc, y, "Estado civil", data.maritalStatus, page);
  y = field(doc, y, "Nivel educativo", data.education, page);
  y = field(doc, y, "Ocupación", data.occupation, page);
  y = field(doc, y, "Domicilio", data.address, page);
  y = field(doc, y, "Teléfono", data.phone, page);
  y = field(doc, y, "Correo electrónico", data.email, page);
  y = field(doc, y, "Obra social / Prepaga", data.insurance, page);
  y = field(doc, y, "Remitido/a por", data.referredBy, page);
  y += 2;
  y = field(doc, y, "Fecha y hora de la sesión", data.sessionDate, page);
  y = field(doc, y, "Modalidad", data.modality, page);
  y = field(doc, y, "Carácter del encuentro", data.encounterType, page);
  y = field(doc, y, "Consentimiento firmado", data.consentSigned, page);
  y = block(doc, y, "Composición del grupo conviviente", data.householdComposition, page);

  // PARTE II
  y = section(doc, y, "PARTE II — MOTIVO DE CONSULTA Y DEMANDA", page);
  y = block(doc, y, "Motivo de consulta (palabras del/la consultante)", data.motiveOwn, page);
  y = block(doc, y, "Motivo según el profesional", data.motiveProf, page);
  y = field(doc, y, "¿Tratamiento psicológico previo?", data.priorTherapy, page);
  y = field(doc, y, "Tipo(s) de abordaje previo", data.priorTherapyType, page);
  y = field(doc, y, "Tratamiento psiquiátrico actual/previo", data.psychiatric, page);
  y = field(doc, y, "Medicación psicotrópica actual", data.medication, page);
  y = field(doc, y, "Urgencia subjetiva", data.urgencySubj, page);
  y = field(doc, y, "Urgencia objetiva", data.urgencyObj, page);
  y = field(doc, y, "Nivel de insight", data.insight, page);
  y = field(doc, y, "Motivación para el proceso", data.motivation, page);

  // PARTE III
  y = section(doc, y, "PARTE III — HISTORIA PERSONAL Y DESARROLLO EVOLUTIVO", page);
  y = block(doc, y, "Historia perinatal y primera infancia", data.earlyHistory, page);
  y = block(doc, y, "Historia familiar y vincular", data.familyHistory, page);
  y = block(doc, y, "Trayectoria educativa", data.educationHistory, page);
  y = block(doc, y, "Historia laboral", data.workHistory, page);
  y = block(doc, y, "Historia afectiva y de pareja", data.relationshipHistory, page);
  y = block(doc, y, "Eventos traumáticos / vitales relevantes", data.traumaHistory, page);

  // PARTE IV
  y = section(doc, y, "PARTE IV — EXAMEN DEL ESTADO MENTAL", page);
  y = field(doc, y, "Presentación y aspecto", data.eemAppearance, page);
  y = field(doc, y, "Actitud y colaboración", data.eemAttitude, page);
  y = field(doc, y, "Conciencia y orientación", data.eemConsciousness, page);
  y = field(doc, y, "Atención y memoria", data.eemAttention, page);
  y = field(doc, y, "Lenguaje y curso del pensamiento", data.eemSpeech, page);
  y = field(doc, y, "Contenido del pensamiento", data.eemThoughtContent, page);
  y = field(doc, y, "Sensopercepción", data.eemPerception, page);
  y = field(doc, y, "Estado de ánimo y afecto", data.eemMood, page);
  y = field(doc, y, "Juicio e insight", data.eemJudgment, page);
  y = field(doc, y, "Ideación suicida/autolesiva", data.eemSuicidal, page);

  // PARTE V
  y = section(doc, y, "PARTE V — ÁREAS CLÍNICAS ESPECÍFICAS", page);
  y = block(doc, y, "Esfera del sueño", data.sleep, page);
  y = block(doc, y, "Alimentación", data.eating, page);
  y = block(doc, y, "Sexualidad", data.sexuality, page);
  y = block(doc, y, "Consumos / sustancias", data.substances, page);
  y = block(doc, y, "Red de apoyo social", data.socialNetwork, page);
  y = block(doc, y, "Recursos personales y resiliencia", data.resources, page);

  // PARTE VI
  y = section(doc, y, "PARTE VI — IMPRESIÓN DIAGNÓSTICA PROVISIONAL Y PLAN", page);
  y = block(doc, y, "Hipótesis diagnóstica provisional", data.diagnosticHypothesis, page);
  y = field(doc, y, "Referencia nosográfica (CIE/DSM)", data.diagnosticCode, page);
  y = block(doc, y, "Plan de evaluación / batería sugerida", data.evaluationPlan, page);
  y = block(doc, y, "Indicaciones / derivaciones", data.recommendations, page);
  y = field(doc, y, "Próximo paso acordado", data.nextStep, page);
  y = field(doc, y, "Fecha aproximada de devolución", data.followUpDate, page);
  y = block(doc, y, "Observaciones clínicas generales", data.observations, page);

  // Cierre y firma
  y = section(doc, y, "CIERRE Y FIRMA PROFESIONAL", page);
  y = field(doc, y, "Lic./Esp.", data.professionalName, page);
  y = field(doc, y, "Matrícula N°", data.professionalLicense, page);
  y = field(doc, y, "Fecha", data.signatureDate, page);
  y += 4;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.text(
    "Documento generado desde la plataforma .PSI. — Uso profesional confidencial.",
    105,
    y,
    { align: "center" }
  );

  const filename = `Planilla_Psicodiagnostica_${(data.fullName || "consultante")
    .replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}