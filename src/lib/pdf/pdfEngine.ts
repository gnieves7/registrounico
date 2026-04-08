import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  PAGE_WIDTH, PAGE_HEIGHT,
  MARGIN_LEFT, MARGIN_RIGHT, MARGIN_TOP, MARGIN_BOTTOM,
  CONTENT_WIDTH,
  FONT_BODY, FONT_SECTION_TITLE, FONT_HEADER_NAME, FONT_HEADER_DETAIL,
  FONT_FOOTER, FONT_TABLE, FONT_DISCLAIMER,
  LINE_HEIGHT, SECTION_SPACE_BEFORE, SECTION_SPACE_AFTER,
  COLOR_BLACK, COLOR_GRAY, COLOR_LIGHT_GRAY, COLOR_TABLE_HEADER_BG,
  PROFESSIONAL, DISCLAIMER_TEXT, REPORT_TYPE_LABELS,
  type ReportType,
} from "./constants";

export interface ReportFormData {
  reportType: ReportType;
  patientName: string;
  patientLastName: string;
  patientDni?: string;
  patientAge?: string;
  patientGender?: string;
  patientAddress?: string;
  evaluationDate: string;
  emissionDate?: string;
  // Forensic
  cuij?: string;
  courtName?: string;
  courtDivision?: string;
  caseCaption?: string;
  expertiseObject?: string;
  expertisePoints?: string;
  methodology?: string;
  caseBackground?: string;
  technicalDevelopment?: string;
  indicatorAnalysis?: string;
  expertConclusions?: string;
  reservations?: string;
  // Clinical
  consultationReason?: string;
  techniques?: string;
  clinicalObservations?: string;
  resultsInterpretation?: string;
  diagnosis?: string;
  diagnosisCode?: string;
  clinicalConclusions?: string;
  therapeuticRecommendations?: string;
  // Corporate
  evaluationObjective?: string;
  instrumentsApplied?: string;
  competencyProfile?: string;
  integrativeSynthesis?: string;
  recommendation?: string; // apto / apto con reservas / no apto
  recommendationRationale?: string;
  // Psychometric data
  mmpiData?: Record<string, string | number>;
  mcmiData?: Record<string, string | number>;
  mbtiData?: { type?: string; dimensions?: Record<string, number> };
}

const MONTHS_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function formatDateLong(dateStr?: string): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

function sanitizeFileName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export class PsiPdfEngine {
  private doc: jsPDF;
  private y: number = MARGIN_TOP;
  private pageNumber: number = 1;
  private totalPages: number = 1;
  private formData: ReportFormData;
  private reportLabel: string;

  constructor(formData: ReportFormData) {
    this.doc = new jsPDF({ unit: "pt", format: "a4" });
    this.formData = formData;
    this.reportLabel = REPORT_TYPE_LABELS[formData.reportType];
  }

  // ── Header (first page only) ──
  private drawHeader(): void {
    const doc = this.doc;
    const headerY = MARGIN_TOP;

    // Logo text ".PSI."
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(".PSI.", MARGIN_LEFT, headerY + 4);

    doc.setFontSize(7);
    doc.setFont("times", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text("Plataforma de Sistemas Interactivos", MARGIN_LEFT, headerY + 14);

    // Professional data (right column)
    const rightX = PAGE_WIDTH - MARGIN_RIGHT;
    doc.setFont("times", "bold");
    doc.setFontSize(FONT_HEADER_NAME);
    doc.setTextColor(0, 0, 0);
    doc.text(PROFESSIONAL.fullName, rightX, headerY, { align: "right" });

    doc.setFont("times", "normal");
    doc.setFontSize(FONT_HEADER_DETAIL);
    doc.setTextColor(40, 40, 40);
    doc.text(PROFESSIONAL.license, rightX, headerY + 13, { align: "right" });
    doc.text(PROFESSIONAL.specialty, rightX, headerY + 25, { align: "right" });

    let extraY = 0;
    if (this.formData.reportType === "forensic") {
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      doc.text(PROFESSIONAL.forensicRole, rightX, headerY + 37, { align: "right" });
      extraY = 14;

      if (this.formData.cuij) {
        doc.setFont("times", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Expte. N° ${this.formData.cuij}`, rightX, headerY + 37 + extraY, { align: "right" });
        extraY += 14;
      }
    }

    // Separator line
    const lineY = headerY + 42 + extraY;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_LEFT, lineY, PAGE_WIDTH - MARGIN_RIGHT, lineY);

    this.y = lineY + 18; // 12pt space after line + 6pt padding
  }

  // ── Footer (all pages except first) ──
  private drawFooter(pageNum: number): void {
    const doc = this.doc;
    const footerY = PAGE_HEIGHT - MARGIN_BOTTOM + 10;

    // Separator line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(MARGIN_LEFT, footerY - 8, PAGE_WIDTH - MARGIN_RIGHT, footerY - 8);

    doc.setFont("times", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    // Left: patient + report type
    const patientFooter = `${this.formData.patientLastName || this.formData.patientName}, ${(this.formData.patientName || "").charAt(0)}. — ${this.reportLabel}`;
    doc.text(patientFooter, MARGIN_LEFT, footerY, { align: "left" });

    // Center: page N of T
    const pageText = `Página ${pageNum} de ${this.totalPages}`;
    doc.text(pageText, PAGE_WIDTH / 2, footerY, { align: "center" });

    // Right: date
    const dateText = `${PROFESSIONAL.city}, ${formatDateLong(this.formData.emissionDate)}`;
    doc.text(dateText, PAGE_WIDTH - MARGIN_RIGHT, footerY, { align: "right" });
  }

  // ── Page break ──
  private newPage(): void {
    this.doc.addPage();
    this.pageNumber++;
    this.y = MARGIN_TOP;
  }

  private ensureSpace(requiredHeight: number): void {
    if (this.y + requiredHeight > PAGE_HEIGHT - MARGIN_BOTTOM - 20) {
      this.newPage();
    }
  }

  // ── Title (centered, bold) ──
  private drawReportTitle(): void {
    this.ensureSpace(40);
    this.doc.setFont("times", "bold");
    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(this.reportLabel.toUpperCase(), PAGE_WIDTH / 2, this.y, { align: "center" });
    this.y += 24;
  }

  // ── Section title ──
  drawSectionTitle(title: string): void {
    this.ensureSpace(SECTION_SPACE_BEFORE + 20);
    this.y += SECTION_SPACE_BEFORE;
    this.doc.setFont("times", "bold");
    this.doc.setFontSize(FONT_SECTION_TITLE);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(title, MARGIN_LEFT, this.y);
    this.y += SECTION_SPACE_AFTER + 10;
  }

  // ── Body paragraph (justified) ──
  drawParagraph(text: string, options?: { italic?: boolean; bold?: boolean; size?: number; indent?: number }): void {
    if (!text || text.trim() === "") return;
    const size = options?.size ?? FONT_BODY;
    const indent = options?.indent ?? 0;
    const style = options?.bold ? "bold" : options?.italic ? "italic" : "normal";

    this.doc.setFont("times", style);
    this.doc.setFontSize(size);
    this.doc.setTextColor(0, 0, 0);

    const maxWidth = CONTENT_WIDTH - indent;
    const lines: string[] = this.doc.splitTextToSize(text, maxWidth);

    for (const line of lines) {
      this.ensureSpace(size * 1.5 + 2);
      this.doc.text(line, MARGIN_LEFT + indent, this.y);
      this.y += size * 1.5;
    }
    this.y += 4;
  }

  // ── Patient identification table ──
  drawPatientTable(): void {
    const fields: [string, string | undefined][] = [
      ["Nombre y Apellido", `${this.formData.patientName || ""} ${this.formData.patientLastName || ""}`.trim()],
      ["DNI", this.formData.patientDni],
      ["Edad", this.formData.patientAge],
      ["Género", this.formData.patientGender],
      ["Domicilio", this.formData.patientAddress],
      ["Fecha de evaluación", this.formData.evaluationDate ? format(new Date(this.formData.evaluationDate), "dd/MM/yyyy") : undefined],
    ];

    for (const [label, value] of fields) {
      if (!value) continue;
      this.ensureSpace(16);
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(FONT_BODY);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${label}:`, MARGIN_LEFT + 10, this.y);

      this.doc.setFont("times", "normal");
      this.doc.text(value, MARGIN_LEFT + 150, this.y);
      this.y += 16;
    }
    this.y += 6;
  }

  // ── Data table with header ──
  drawDataTable(headers: string[], rows: (string | number)[][], options?: { highlightFn?: (row: (string | number)[], colIdx: number) => boolean }): void {
    const colCount = headers.length;
    const colWidth = CONTENT_WIDTH / colCount;
    const rowHeight = 18;

    // Header
    this.ensureSpace(rowHeight * 2);
    this.doc.setFillColor(...COLOR_TABLE_HEADER_BG);
    this.doc.rect(MARGIN_LEFT, this.y - 12, CONTENT_WIDTH, rowHeight, "F");
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.rect(MARGIN_LEFT, this.y - 12, CONTENT_WIDTH, rowHeight, "S");

    this.doc.setFont("times", "bold");
    this.doc.setFontSize(FONT_TABLE);
    this.doc.setTextColor(0, 0, 0);
    headers.forEach((h, i) => {
      this.doc.text(h, MARGIN_LEFT + i * colWidth + 4, this.y);
    });
    this.y += rowHeight - 4;

    // Rows
    for (const row of rows) {
      this.ensureSpace(rowHeight + 4);
      this.doc.setDrawColor(0, 0, 0);
      this.doc.setLineWidth(0.5);
      this.doc.rect(MARGIN_LEFT, this.y - 12, CONTENT_WIDTH, rowHeight, "S");

      row.forEach((cell, i) => {
        const cellStr = cell === null || cell === undefined || cell === "" ? "—" : String(cell);
        const isBold = options?.highlightFn?.(row, i);
        this.doc.setFont("times", isBold ? "bold" : "normal");
        this.doc.setFontSize(FONT_TABLE);
        this.doc.setTextColor(0, 0, 0);
        this.doc.text(cellStr, MARGIN_LEFT + i * colWidth + 4, this.y);
      });
      this.y += rowHeight - 4;
    }
    this.y += 8;
  }

  // ── Signature block ──
  private drawSignatureBlock(): void {
    this.ensureSpace(120);

    // Disclaimer
    this.y += 10;
    this.doc.setFont("times", "italic");
    this.doc.setFontSize(FONT_DISCLAIMER);
    this.doc.setTextColor(80, 80, 80);
    const disclaimerLines = this.doc.splitTextToSize(DISCLAIMER_TEXT, CONTENT_WIDTH);
    for (const line of disclaimerLines) {
      this.ensureSpace(14);
      this.doc.text(line, MARGIN_LEFT, this.y);
      this.y += 12;
    }

    this.y += 30;
    this.ensureSpace(90);

    // Signature line (right-aligned)
    const signX = PAGE_WIDTH - MARGIN_RIGHT - 170;
    const lineWidth = 170;

    // Dotted line
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    const dashLen = 4;
    for (let x = signX; x < signX + lineWidth; x += dashLen * 2) {
      this.doc.line(x, this.y, Math.min(x + dashLen, signX + lineWidth), this.y);
    }

    this.y += 14;
    this.doc.setFont("times", "bold");
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    const rightAlign = PAGE_WIDTH - MARGIN_RIGHT;
    this.doc.text(PROFESSIONAL.fullName, rightAlign, this.y, { align: "right" });
    this.y += 12;
    this.doc.setFont("times", "normal");
    this.doc.text(PROFESSIONAL.signatureTitle, rightAlign, this.y, { align: "right" });
    this.y += 12;
    this.doc.text(PROFESSIONAL.signatureLicense, rightAlign, this.y, { align: "right" });
    this.y += 12;
    this.doc.text(`${PROFESSIONAL.city}, ${formatDateLong(this.formData.emissionDate)}`, rightAlign, this.y, { align: "right" });

    if (this.formData.reportType === "forensic") {
      this.y += 16;
      this.doc.setFont("times", "italic");
      this.doc.setFontSize(9);
      this.doc.text(PROFESSIONAL.forensicArticle, rightAlign, this.y, { align: "right" });
    }
  }

  // ── Build Clinical Report ──
  private buildClinical(): void {
    this.drawSectionTitle("I. Datos de identificación del paciente");
    this.drawPatientTable();

    this.drawSectionTitle("II. Motivo de consulta");
    this.drawParagraph(this.formData.consultationReason || "");

    this.drawSectionTitle("III. Técnicas administradas");
    this.drawParagraph(this.formData.techniques || "");

    this.drawSectionTitle("IV. Observaciones clínicas");
    this.drawParagraph(this.formData.clinicalObservations || "");

    this.drawSectionTitle("V. Resultados e interpretación");
    this.drawParagraph(this.formData.resultsInterpretation || "");
    this.drawPsychometricTables();

    this.drawSectionTitle("VI. Diagnóstico presuntivo");
    if (this.formData.diagnosisCode) {
      this.drawParagraph(`Codificación: ${this.formData.diagnosisCode}`, { bold: true });
    }
    this.drawParagraph(this.formData.diagnosis || "");

    this.drawSectionTitle("VII. Conclusiones clínicas");
    this.drawParagraph(this.formData.clinicalConclusions || "");

    this.drawSectionTitle("VIII. Recomendaciones terapéuticas");
    this.drawParagraph(this.formData.therapeuticRecommendations || "");
  }

  // ── Build Forensic Report ──
  private buildForensic(): void {
    this.drawSectionTitle("I. Carátula del expediente y datos de la causa");
    const caseFields: [string, string | undefined][] = [
      ["CUIJ", this.formData.cuij],
      ["Juzgado", this.formData.courtName],
      ["Fuero / Secretaría", this.formData.courtDivision],
      ["Carátula", this.formData.caseCaption],
    ];
    for (const [label, value] of caseFields) {
      if (!value) continue;
      this.ensureSpace(16);
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(FONT_BODY);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${label}:`, MARGIN_LEFT + 10, this.y);
      this.doc.setFont("times", "normal");
      this.doc.text(value, MARGIN_LEFT + 150, this.y);
      this.y += 16;
    }
    this.y += 6;

    this.drawSectionTitle("II. Objeto de la pericia / Puntos periciales propuestos");
    this.drawParagraph(this.formData.expertiseObject || "");
    if (this.formData.expertisePoints) {
      this.drawParagraph(this.formData.expertisePoints);
    }

    this.drawSectionTitle("III. Metodología utilizada");
    this.drawParagraph(this.formData.methodology || "");

    this.drawSectionTitle("IV. Antecedentes del caso");
    this.drawParagraph(this.formData.caseBackground || "");

    this.drawSectionTitle("V. Desarrollo y fundamentos técnicos");
    this.drawParagraph(this.formData.technicalDevelopment || "");

    this.drawSectionTitle("VI. Análisis de los indicadores evaluados");
    this.drawParagraph(this.formData.indicatorAnalysis || "");
    this.drawPsychometricTables();

    this.drawSectionTitle("VII. Conclusiones periciales");
    this.drawParagraph(this.formData.expertConclusions || "");

    this.drawSectionTitle("VIII. Reservas y limitaciones metodológicas");
    this.drawParagraph(this.formData.reservations || "");
  }

  // ── Build Corporate Report ──
  private buildCorporate(): void {
    this.drawSectionTitle("I. Datos del evaluado");
    this.drawPatientTable();

    this.drawSectionTitle("II. Objetivo de la evaluación");
    this.drawParagraph(this.formData.evaluationObjective || "");

    this.drawSectionTitle("III. Instrumentos aplicados");
    this.drawParagraph(this.formData.instrumentsApplied || "");

    this.drawSectionTitle("IV. Perfil de competencias observadas");
    this.drawParagraph(this.formData.competencyProfile || "");

    this.drawSectionTitle("V. Síntesis integradora");
    this.drawParagraph(this.formData.integrativeSynthesis || "");

    this.drawSectionTitle("VI. Recomendación");
    if (this.formData.recommendation) {
      this.drawParagraph(this.formData.recommendation, { bold: true, size: 12 });
    }
    this.drawParagraph(this.formData.recommendationRationale || "");
  }

  // ── Psychometric tables ──
  private drawPsychometricTables(): void {
    // MMPI-2
    if (this.formData.mmpiData && Object.keys(this.formData.mmpiData).length > 0) {
      this.drawParagraph("MMPI-2 — Inventario Multifásico de Personalidad de Minnesota", { bold: true, size: 11 });

      // Validity scales
      const validityScales = ["L", "F", "K", "Fb", "VRIN", "TRIN"];
      const validityRows = validityScales
        .filter(s => this.formData.mmpiData![s] !== undefined)
        .map(s => {
          const t = Number(this.formData.mmpiData![s]) || 0;
          const interp = t >= 65 ? "Elevación clínicamente significativa" : t >= 50 ? "Rango normal" : "Bajo";
          return [s, String(t || "—"), interp];
        });
      if (validityRows.length > 0) {
        this.drawParagraph("Escalas de validez:", { bold: true, size: 10 });
        this.drawDataTable(["Escala", "Puntuación T", "Interpretación"], validityRows);
      }

      // Clinical scales
      const clinicalScales = ["Hs", "D", "Hy", "Pd", "Mf", "Pa", "Pt", "Sc", "Ma", "Si"];
      const clinicalNames: Record<string, string> = {
        Hs: "Hipocondría", D: "Depresión", Hy: "Histeria", Pd: "Desviación Psicopática",
        Mf: "Masculinidad-Feminidad", Pa: "Paranoia", Pt: "Psicastenia",
        Sc: "Esquizofrenia", Ma: "Hipomanía", Si: "Introversión Social"
      };
      const clinicalRows = clinicalScales
        .filter(s => this.formData.mmpiData![s] !== undefined)
        .map(s => {
          const t = Number(this.formData.mmpiData![s]) || 0;
          const classification = t >= 65 ? "Elevación clínicamente significativa" : t >= 55 ? "Elevación moderada" : "Normal";
          return [clinicalNames[s] || s, String(t || "—"), classification];
        });
      if (clinicalRows.length > 0) {
        this.drawParagraph("Escalas clínicas:", { bold: true, size: 10 });
        this.drawDataTable(
          ["Escala", "Puntuación T", "Clasificación"],
          clinicalRows,
          { highlightFn: (row) => Number(row[1]) >= 65 }
        );
      }
    }

    // MCMI-III
    if (this.formData.mcmiData && Object.keys(this.formData.mcmiData).length > 0) {
      this.drawParagraph("MCMI-III — Inventario Clínico Multiaxial de Millon", { bold: true, size: 11 });
      const mcmiRows = Object.entries(this.formData.mcmiData).map(([scale, br]) => {
        const brNum = Number(br) || 0;
        const classification = brNum >= 85 ? "Prominencia del rasgo" : brNum >= 75 ? "Presencia del rasgo" : "No significativo";
        return [scale, String(brNum || "—"), classification];
      });
      this.drawDataTable(
        ["Escala", "Tasa Base (BR)", "Clasificación"],
        mcmiRows,
        { highlightFn: (row) => Number(row[1]) >= 75 }
      );
    }

    // MBTI
    if (this.formData.mbtiData?.type) {
      this.drawParagraph("MBTI — Indicador de Tipos de Myers-Briggs", { bold: true, size: 11 });
      
      // Type box
      this.ensureSpace(50);
      const boxW = 100;
      const boxX = MARGIN_LEFT + (CONTENT_WIDTH - boxW) / 2;
      this.doc.setDrawColor(0, 0, 0);
      this.doc.setLineWidth(1);
      this.doc.rect(boxX, this.y - 10, boxW, 30, "S");
      this.doc.setFont("times", "bold");
      this.doc.setFontSize(18);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(this.formData.mbtiData.type, PAGE_WIDTH / 2, this.y + 10, { align: "center" });
      this.y += 36;

      if (this.formData.mbtiData.dimensions) {
        const dimRows = Object.entries(this.formData.mbtiData.dimensions).map(([dim, score]) => [dim, String(score)]);
        this.drawDataTable(["Dimensión", "Puntuación de preferencia"], dimRows);
      }
    }
  }

  // ── Main generate method ──
  generate(): { blob: Blob; fileName: string } {
    // First page
    this.drawHeader();
    this.drawReportTitle();

    switch (this.formData.reportType) {
      case "clinical":
        this.buildClinical();
        break;
      case "forensic":
        this.buildForensic();
        break;
      case "corporate":
        this.buildCorporate();
        break;
    }

    this.drawSignatureBlock();

    // Count total pages
    this.totalPages = this.doc.getNumberOfPages();

    // Draw footers on pages 2+
    for (let i = 2; i <= this.totalPages; i++) {
      this.doc.setPage(i);
      this.drawFooter(i);
    }

    const lastName = sanitizeFileName(this.formData.patientLastName || this.formData.patientName || "Paciente");
    const typeLabel = sanitizeFileName(this.reportLabel);
    const dateStr = format(new Date(), "yyyy-MM-dd");
    const fileName = `${lastName}_${typeLabel}_${dateStr}.pdf`;

    const blob = this.doc.output("blob");
    return { blob, fileName };
  }

  // Get as data URL for preview
  generatePreviewUrl(): string {
    const { blob } = this.generate();
    return URL.createObjectURL(blob);
  }
}
