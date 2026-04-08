// A4 dimensions in points (1pt = 1/72 inch)
export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;

// Margins: left 3cm (85pt), right 2cm (57pt), top 2.5cm (71pt), bottom 2cm (57pt)
export const MARGIN_LEFT = 85;
export const MARGIN_RIGHT = 57;
export const MARGIN_TOP = 71;
export const MARGIN_BOTTOM = 57;
export const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

// Font sizes
export const FONT_BODY = 11;
export const FONT_SECTION_TITLE = 12;
export const FONT_HEADER_NAME = 11;
export const FONT_HEADER_DETAIL = 10;
export const FONT_FOOTER = 9;
export const FONT_TABLE = 10;
export const FONT_DISCLAIMER = 9;

// Line spacing (1.5 interlineado for body)
export const LINE_HEIGHT = FONT_BODY * 1.5;
export const SECTION_SPACE_BEFORE = 12;
export const SECTION_SPACE_AFTER = 6;

// Colors
export const COLOR_BLACK: [number, number, number] = [0, 0, 0];
export const COLOR_GRAY: [number, number, number] = [100, 100, 100];
export const COLOR_LIGHT_GRAY: [number, number, number] = [230, 230, 230];
export const COLOR_TABLE_HEADER_BG: [number, number, number] = [230, 230, 230];

// Professional data
export const PROFESSIONAL = {
  fullName: "Lic. Esp. Germán H. Nieves",
  license: "Mat. N° 1889 — Colegio de Psicólogos de la Provincia de Santa Fe",
  specialty: "Psicólogo Clínico y Forense — Especialista en Psicología Forense (UNR)",
  forensicRole: "Perito de parte — Consultor Técnico en causas penales y de familia — Provincia de Santa Fe",
  signatureTitle: "Psicólogo Clínico y Forense",
  signatureLicense: "Mat. N° 1889 — C.P.S.F.",
  forensicArticle: "Consultor Técnico — Art. 253 CPCC Santa Fe",
  city: "Santa Fe",
};

export const DISCLAIMER_TEXT =
  "El presente informe es confidencial y está destinado exclusivamente a la persona o institución a la que fue dirigido. Su reproducción total o parcial sin autorización del profesional emisor está prohibida. Elaborado bajo las normas deontológicas del Código de Ética del Colegio de Psicólogos de la Provincia de Santa Fe y la Ley Nacional de Salud Mental N° 26.657.";

export type ReportType = "clinical" | "forensic" | "corporate";

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  clinical: "Informe Clínico Psicológico",
  forensic: "Informe Pericial / Técnico de Parte",
  corporate: "Informe de Evaluación Corporativa / Laboral",
};

export const CLINICAL_SECTIONS = [
  "I. Datos de identificación del paciente",
  "II. Motivo de consulta",
  "III. Técnicas administradas",
  "IV. Observaciones clínicas",
  "V. Resultados e interpretación",
  "VI. Diagnóstico presuntivo",
  "VII. Conclusiones clínicas",
  "VIII. Recomendaciones terapéuticas",
  "IX. Firma y aclaración",
];

export const FORENSIC_SECTIONS = [
  "I. Carátula del expediente y datos de la causa",
  "II. Objeto de la pericia / Puntos periciales propuestos",
  "III. Metodología utilizada",
  "IV. Antecedentes del caso",
  "V. Desarrollo y fundamentos técnicos",
  "VI. Análisis de los indicadores evaluados",
  "VII. Conclusiones periciales",
  "VIII. Reservas y limitaciones metodológicas",
  "IX. Firma, matrícula y fecha",
];

export const CORPORATE_SECTIONS = [
  "I. Datos del evaluado",
  "II. Objetivo de la evaluación",
  "III. Instrumentos aplicados",
  "IV. Perfil de competencias observadas",
  "V. Síntesis integradora",
  "VI. Recomendación",
  "VII. Firma y fecha",
];
