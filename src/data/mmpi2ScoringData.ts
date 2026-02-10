// MMPI-2 Scoring Keys and Interpretation Data
// Based on standard MMPI-2 scoring keys and clinical interpretation guidelines

// Scoring direction: 'V' means answer TRUE scores, 'F' means answer FALSE scores
interface ScaleKey {
  name: string;
  code: string;
  description: string;
  trueItems: number[];
  falseItems: number[];
  kCorrection?: number; // K correction factor (e.g., 0.5 means add 0.5*K)
}

// ==================== VALIDITY SCALES ====================
export const VALIDITY_SCALES: ScaleKey[] = [
  {
    name: "Mentira",
    code: "L",
    description: "Tendencia a presentarse de manera excesivamente favorable",
    trueItems: [],
    falseItems: [16, 29, 41, 51, 77, 93, 102, 107, 123, 139, 153, 183, 203, 232, 260],
  },
  {
    name: "Infrecuencia",
    code: "F",
    description: "Respuestas atípicas o exageración de síntomas",
    trueItems: [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 84, 96, 114, 138, 144, 150, 156, 162, 168, 180, 198, 216, 228, 234, 240, 246, 252, 258, 264, 270, 282, 288, 294, 300, 306, 312, 324, 336, 349, 355, 361],
    falseItems: [6, 12, 78, 90, 102, 108, 126, 132, 174, 186, 192, 204, 210, 222, 276, 318, 330, 343],
  },
  {
    name: "Corrección",
    code: "K",
    description: "Defensividad sutil",
    trueItems: [],
    falseItems: [29, 37, 58, 76, 110, 116, 122, 127, 130, 136, 148, 157, 158, 167, 171, 196, 213, 243, 267, 284, 290, 330, 338, 339, 341, 346, 365, 422, 449, 461],
  },
];

// ==================== CLINICAL SCALES ====================
export const CLINICAL_SCALES: ScaleKey[] = [
  {
    name: "Hipocondría",
    code: "Hs",
    description: "Preocupación excesiva por la salud física",
    trueItems: [18, 28, 39, 53, 59, 97, 101, 111, 149, 175, 247],
    falseItems: [2, 3, 8, 10, 20, 45, 47, 57, 91, 117, 141, 143, 152, 164, 173, 176, 179, 208, 224, 249, 255],
    kCorrection: 0.5,
  },
  {
    name: "Depresión",
    code: "D",
    description: "Síntomas depresivos y pesimismo",
    trueItems: [5, 15, 18, 28, 38, 39, 46, 56, 73, 92, 107, 127, 130, 139, 146, 147, 170, 175, 181, 215, 233],
    falseItems: [2, 3, 9, 10, 20, 29, 33, 37, 43, 45, 49, 55, 68, 75, 76, 95, 109, 118, 134, 140, 141, 142, 143, 148, 165, 178, 188, 189, 212, 221, 223, 226, 238, 245, 248, 260, 267],
  },
  {
    name: "Histeria Conversiva",
    code: "Hy",
    description: "Síntomas somáticos y negación de problemas",
    trueItems: [11, 18, 28, 39, 40, 44, 53, 57, 59, 97, 101, 111, 149, 175, 179, 247],
    falseItems: [2, 3, 6, 7, 8, 9, 10, 14, 20, 26, 29, 45, 47, 58, 69, 76, 91, 93, 95, 98, 107, 110, 115, 116, 117, 124, 128, 129, 135, 141, 143, 148, 152, 157, 164, 167, 173, 176, 179, 185, 193, 208, 213, 224, 241, 249, 253, 255, 260, 263],
    kCorrection: 0,
  },
  {
    name: "Desviación Psicopática",
    code: "Pd",
    description: "Conflicto con la autoridad y normas sociales",
    trueItems: [17, 21, 22, 31, 32, 35, 42, 52, 54, 56, 71, 82, 89, 94, 99, 105, 113, 195, 202, 219, 225, 259, 264, 288],
    falseItems: [9, 12, 34, 70, 79, 83, 95, 122, 125, 129, 143, 157, 158, 160, 167, 171, 185, 209, 214, 217, 226, 243, 261, 263, 266, 267],
    kCorrection: 0.4,
  },
  {
    name: "Masculinidad-Feminidad",
    code: "Mf",
    description: "Intereses y actitudes de género",
    trueItems: [4, 25, 62, 64, 67, 74, 80, 112, 119, 122, 128, 137, 166, 177, 187, 191, 196, 205, 209, 219, 236, 251, 256, 268, 271],
    falseItems: [1, 19, 26, 27, 63, 68, 69, 76, 86, 103, 104, 133, 163, 184, 193, 194, 197, 199, 201, 207, 231, 235, 237, 239, 254, 257, 272],
  },
  {
    name: "Paranoia",
    code: "Pa",
    description: "Suspicacia, sensibilidad interpersonal",
    trueItems: [16, 17, 22, 23, 24, 42, 99, 113, 138, 144, 145, 146, 162, 234, 259, 271, 277, 285, 305, 307, 333, 334, 336, 355, 361],
    falseItems: [81, 95, 98, 100, 104, 110, 244, 255, 266, 283, 284, 286, 297, 314, 315],
  },
  {
    name: "Psicastenia",
    code: "Pt",
    description: "Ansiedad, obsesiones, compulsiones",
    trueItems: [11, 16, 23, 31, 38, 56, 65, 73, 82, 89, 94, 130, 147, 170, 175, 196, 218, 233, 242, 259, 266, 301, 305, 317, 321, 336, 337, 340, 342, 343, 344, 346, 349, 351, 352, 356, 357, 358, 359, 360, 361],
    falseItems: [3, 9, 33, 109, 140, 165, 174, 293, 321],
    kCorrection: 1.0,
  },
  {
    name: "Esquizofrenia",
    code: "Sc",
    description: "Pensamiento desorganizado, alienación",
    trueItems: [16, 17, 21, 22, 23, 31, 32, 35, 38, 42, 44, 46, 48, 65, 85, 92, 138, 145, 147, 166, 168, 170, 180, 182, 190, 218, 221, 229, 233, 234, 242, 247, 252, 256, 268, 273, 274, 277, 279, 281, 287, 291, 292, 296, 298, 299, 303, 307, 311, 316, 319, 320, 322, 323, 325, 329, 332, 333, 355],
    falseItems: [6, 9, 12, 34, 90, 91, 106, 165, 177, 179, 192, 210, 255, 276, 278, 280, 290, 295, 343],
    kCorrection: 1.0,
  },
  {
    name: "Hipomanía",
    code: "Ma",
    description: "Energía elevada, grandiosidad",
    trueItems: [13, 15, 21, 23, 50, 55, 61, 85, 87, 98, 113, 122, 131, 145, 155, 168, 169, 182, 190, 200, 205, 206, 211, 212, 218, 220, 227, 229, 238, 242, 244, 248, 250, 253, 269],
    falseItems: [88, 93, 100, 106, 107, 136, 154, 158, 167, 243, 263],
    kCorrection: 0.2,
  },
  {
    name: "Introversión Social",
    code: "Si",
    description: "Timidez y evitación social",
    trueItems: [31, 56, 70, 100, 104, 110, 127, 135, 158, 161, 167, 185, 215, 243, 251, 265, 275, 284, 289, 296, 302, 308, 326, 337, 338, 347, 348, 351, 352, 357, 364, 367, 368, 369],
    falseItems: [25, 32, 49, 79, 86, 106, 112, 131, 181, 189, 207, 209, 231, 237, 255, 262, 267, 280, 321, 328, 335, 340, 342, 344, 345, 350, 353, 354, 358, 359, 360, 362, 363, 366, 370],
  },
];

// ==================== CONTENT SCALES ====================
export const CONTENT_SCALES: ScaleKey[] = [
  {
    name: "Ansiedad",
    code: "ANS",
    description: "Ansiedad generalizada",
    trueItems: [15, 30, 31, 39, 170, 196, 273, 290, 299, 301, 305, 339, 408, 415, 463, 469, 509, 556],
    falseItems: [140, 208, 318, 388, 520],
  },
  {
    name: "Miedos",
    code: "MIE",
    description: "Miedos específicos",
    trueItems: [154, 317, 322, 329, 334, 392, 395, 397, 435, 438, 441, 447, 458, 468, 471, 555],
    falseItems: [115, 163, 186, 385, 401, 453, 462],
  },
  {
    name: "Obsesividad",
    code: "OBS",
    description: "Características obsesivas",
    trueItems: [55, 87, 135, 196, 309, 313, 327, 328, 394, 442, 482, 491, 497, 509, 547, 553],
    falseItems: [],
  },
  {
    name: "Depresión",
    code: "DEP",
    description: "Pensamientos depresivos significativos",
    trueItems: [38, 52, 56, 65, 71, 82, 92, 130, 146, 215, 234, 246, 277, 303, 306, 331, 377, 399, 400, 411, 454, 506, 512, 516, 520, 539],
    falseItems: [3, 9, 75, 95, 388, 474, 546],
  },
  {
    name: "Preocupaciones por la Salud",
    code: "SAU",
    description: "Síntomas físicos en diversos órganos corporales",
    trueItems: [11, 18, 28, 36, 40, 44, 53, 59, 97, 101, 111, 149, 175, 247, 464, 474, 486, 491, 502, 523, 526, 544],
    falseItems: [20, 47, 57, 91, 117, 141, 142, 159, 164, 176, 179, 208, 224, 249],
  },
  {
    name: "Pensamiento Delirante",
    code: "DEL",
    description: "Pensamiento estrafalario",
    trueItems: [24, 32, 60, 96, 138, 162, 198, 228, 259, 298, 311, 316, 319, 333, 336, 355, 361, 466, 490, 508, 543, 551],
    falseItems: [427],
  },
  {
    name: "Enojo",
    code: "ENJ",
    description: "Hostilidad y problemas de control de la ira",
    trueItems: [29, 37, 116, 134, 302, 389, 410, 414, 430, 461, 486, 513, 540, 542, 548],
    falseItems: [564],
  },
  {
    name: "Cinismo",
    code: "CIN",
    description: "Actitudes cínicas y misantrópicas",
    trueItems: [50, 58, 76, 81, 104, 110, 124, 225, 241, 254, 283, 284, 286, 315, 346, 352, 358, 374, 399, 403, 445, 470, 538],
    falseItems: [],
  },
  {
    name: "Prácticas Antisociales",
    code: "PAS",
    description: "Conductas antisociales",
    trueItems: [26, 35, 66, 81, 84, 104, 105, 110, 123, 227, 240, 248, 250, 254, 269, 283, 284, 374, 412, 418, 419],
    falseItems: [266],
  },
  {
    name: "Personalidad Tipo A",
    code: "PTA",
    description: "Comportamiento tipo A",
    trueItems: [27, 136, 151, 212, 302, 358, 414, 419, 420, 423, 430, 437, 507, 510, 523, 531, 535, 541, 545],
    falseItems: [],
  },
  {
    name: "Baja Autoestima",
    code: "BAE",
    description: "Baja autoestima",
    trueItems: [70, 73, 130, 235, 326, 369, 376, 380, 411, 421, 450, 457, 475, 476, 483, 485, 503, 504, 519, 526, 562],
    falseItems: [61, 78, 109],
  },
  {
    name: "Incomodidad Social",
    code: "ISO",
    description: "Malestar social",
    trueItems: [46, 158, 167, 185, 265, 275, 289, 304, 326, 337, 347, 348, 358, 367, 369, 480],
    falseItems: [49, 86, 262, 280, 321, 335, 340, 360],
  },
  {
    name: "Problemas Familiares",
    code: "FAM",
    description: "Problemas familiares",
    trueItems: [21, 54, 83, 125, 145, 190, 195, 205, 217, 220, 225, 307, 378, 379, 382, 413, 449, 478, 543, 550, 563, 567],
    falseItems: [83, 125],
  },
  {
    name: "Dificultad en el Trabajo",
    code: "DTR",
    description: "Dificultad en el trabajo",
    trueItems: [15, 17, 31, 54, 73, 98, 135, 233, 243, 299, 302, 318, 339, 364, 368, 394, 409, 428, 445, 464, 491, 505, 509, 517, 525, 545, 554, 559, 561, 566],
    falseItems: [10, 108, 318],
  },
  {
    name: "Rechazo al Tratamiento",
    code: "RTR",
    description: "Rechazo al tratamiento",
    trueItems: [22, 92, 274, 306, 364, 368, 373, 375, 376, 377, 391, 399, 482, 488, 491, 495, 497, 499, 500, 504, 528, 539, 554],
    falseItems: [493, 494, 501],
  },
];

// ==================== T-SCORE CONVERSION TABLES ====================
// Simplified T-score conversion using linear interpolation based on standard norms
// In production, use full conversion tables from the manual

export interface TScoreTableEntry {
  rawScore: number;
  tScoreMale: number;
  tScoreFemale: number;
}

// Mean and SD for T-score calculation (approximate norms)
export const SCALE_NORMS: Record<string, { maleMean: number; maleSD: number; femaleMean: number; femaleSD: number }> = {
  L:   { maleMean: 3.7, maleSD: 2.5, femaleMean: 4.0, femaleSD: 2.6 },
  F:   { maleMean: 5.5, maleSD: 4.4, femaleMean: 4.4, femaleSD: 3.7 },
  K:   { maleMean: 15.3, maleSD: 5.2, femaleMean: 14.6, femaleSD: 5.0 },
  Hs:  { maleMean: 4.9, maleSD: 3.8, femaleMean: 5.8, femaleSD: 4.2 },
  D:   { maleMean: 18.1, maleSD: 5.1, femaleMean: 20.5, femaleSD: 5.3 },
  Hy:  { maleMean: 20.5, maleSD: 5.4, femaleMean: 22.3, femaleSD: 5.5 },
  Pd:  { maleMean: 15.2, maleSD: 4.8, femaleMean: 15.7, femaleSD: 4.7 },
  Mf:  { maleMean: 21.1, maleSD: 5.1, femaleMean: 36.5, femaleSD: 4.5 },
  Pa:  { maleMean: 9.5, maleSD: 3.5, femaleMean: 9.8, femaleSD: 3.6 },
  Pt:  { maleMean: 11.8, maleSD: 7.2, femaleMean: 13.5, femaleSD: 7.8 },
  Sc:  { maleMean: 11.0, maleSD: 8.2, femaleMean: 12.0, femaleSD: 8.5 },
  Ma:  { maleMean: 17.0, maleSD: 4.5, femaleMean: 16.2, femaleSD: 4.3 },
  Si:  { maleMean: 25.3, maleSD: 9.5, femaleMean: 27.5, femaleSD: 9.8 },
  // Content scales
  ANS: { maleMean: 6.5, maleSD: 4.8, femaleMean: 7.8, femaleSD: 5.2 },
  MIE: { maleMean: 5.2, maleSD: 3.8, femaleMean: 8.5, femaleSD: 4.5 },
  OBS: { maleMean: 5.2, maleSD: 3.5, femaleMean: 5.8, femaleSD: 3.7 },
  DEP: { maleMean: 5.5, maleSD: 4.5, femaleMean: 6.5, femaleSD: 5.0 },
  SAU: { maleMean: 5.0, maleSD: 4.0, femaleMean: 6.2, femaleSD: 4.5 },
  DEL: { maleMean: 3.0, maleSD: 3.0, femaleMean: 2.5, femaleSD: 2.8 },
  ENJ: { maleMean: 6.5, maleSD: 3.5, femaleMean: 5.8, femaleSD: 3.2 },
  CIN: { maleMean: 10.0, maleSD: 5.0, femaleMean: 8.5, femaleSD: 4.8 },
  PAS: { maleMean: 7.5, maleSD: 3.8, femaleMean: 5.8, femaleSD: 3.2 },
  PTA: { maleMean: 8.8, maleSD: 3.8, femaleMean: 8.0, femaleSD: 3.5 },
  BAE: { maleMean: 4.2, maleSD: 3.5, femaleMean: 5.0, femaleSD: 3.8 },
  ISO: { maleMean: 7.5, maleSD: 5.0, femaleMean: 8.5, femaleSD: 5.2 },
  FAM: { maleMean: 4.5, maleSD: 3.5, femaleMean: 5.0, femaleSD: 3.8 },
  DTR: { maleMean: 7.0, maleSD: 5.0, femaleMean: 7.5, femaleSD: 5.2 },
  RTR: { maleMean: 8.5, maleSD: 4.0, femaleMean: 7.5, femaleSD: 3.8 },
};

export function calculateRawScore(
  responses: Map<number, 'V' | 'F'>,
  scale: ScaleKey
): number {
  let score = 0;
  for (const item of scale.trueItems) {
    if (responses.get(item) === 'V') score++;
  }
  for (const item of scale.falseItems) {
    if (responses.get(item) === 'F') score++;
  }
  return score;
}

export function calculateTScore(
  rawScore: number,
  scaleCode: string,
  gender: 'male' | 'female',
  kRawScore?: number,
  kCorrection?: number
): number {
  const norms = SCALE_NORMS[scaleCode];
  if (!norms) return 50;

  let adjustedRaw = rawScore;
  if (kCorrection && kRawScore !== undefined) {
    adjustedRaw = rawScore + Math.round(kCorrection * kRawScore);
  }

  const mean = gender === 'male' ? norms.maleMean : norms.femaleMean;
  const sd = gender === 'male' ? norms.maleSD : norms.femaleSD;

  if (sd === 0) return 50;
  const tScore = Math.round(50 + 10 * ((adjustedRaw - mean) / sd));
  return Math.max(30, Math.min(120, tScore));
}

// ==================== INTERPRETATION DATA ====================
export interface ScaleInterpretation {
  scaleCode: string;
  scaleName: string;
  scaleType: 'validity' | 'clinical' | 'content';
  description: string;
  interpretations: {
    range: string;
    minT: number;
    maxT: number;
    level: string;
    interpretation: string;
  }[];
}

export const SCALE_INTERPRETATIONS: ScaleInterpretation[] = [
  // VALIDITY SCALES
  {
    scaleCode: "L",
    scaleName: "Mentira",
    scaleType: "validity",
    description: "Evalúa la tendencia a presentarse de manera excesivamente favorable",
    interpretations: [
      { range: "80+", minT: 80, maxT: 120, level: "Muy Alto", interpretation: "Probablemente inválido. El sujeto aparenta estar bien adaptado. Tratan deliberadamente de mostrarse en forma favorable." },
      { range: "70-79", minT: 70, maxT: 79, level: "Alto", interpretation: "Validez cuestionable. Se niegan los defectos. Auto-imagen demasiado virtuosa. Estado de confusión, represión, falta de insight." },
      { range: "60-69", minT: 60, maxT: 69, level: "Moderado", interpretation: "Defensividad marcada. Persona muy convencional y conformista. El sujeto puede ser moralista o rígido." },
      { range: "50-59", minT: 50, maxT: 59, level: "Medio", interpretation: "Actitud adecuada ante la prueba. Puede tener seguridad de sí misma y acepta alguna de sus fallas." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Acepta abiertamente sus fallas y problemas. Puede ser sarcástica o tener problemas para adaptarse a las normas sociales." },
    ],
  },
  {
    scaleCode: "F",
    scaleName: "Infrecuencia",
    scaleType: "validity",
    description: "Identifica exageración de síntomas o respuestas al azar",
    interpretations: [
      { range: "110+", minT: 110, maxT: 120, level: "Muy Alto", interpretation: "Claramente inválido. Psicopatología severa, desorientación, errores de calificación, problemas de lectura." },
      { range: "100-109", minT: 100, maxT: 109, level: "Alto", interpretation: "Probablemente inválido. Responde a todo verdadero. Posible desorientación, estado tóxico, síndrome orgánico cerebral." },
      { range: "81-99", minT: 81, maxT: 99, level: "Alto", interpretation: "Validez cuestionable/limítrofe. Sugiere confusión y desorientación. Posible exageración de problemas." },
      { range: "65-80", minT: 65, maxT: 80, level: "Medio-Alto", interpretation: "Probablemente válido. Puede exagerar algunos síntomas. La persona presenta un amplio rango de problemas psicológicos." },
      { range: "51-64", minT: 51, maxT: 64, level: "Medio", interpretation: "Protocolo aceptable. La persona es accesible y está abierta a la discusión de sus problemas." },
      { range: "≤50", minT: 0, maxT: 50, level: "Normal", interpretation: "Protocolo aceptable. Expresión de síntomas adecuada, persona sincera y socialmente adaptada." },
    ],
  },
  {
    scaleCode: "K",
    scaleName: "Corrección",
    scaleType: "validity",
    description: "Detecta tendencia a negar psicopatología y defensividad",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Defensividad marcada. Se finge estar bien. Sujeto tímido, inhibido, falta de involucramiento emocional. Negación, falta de insight." },
      { range: "56-64", minT: 56, maxT: 64, level: "Moderado", interpretation: "Puede ser una persona equilibrada, autosuficiente y con buen ajuste, o bien defensiva de forma sutil." },
      { range: "41-55", minT: 41, maxT: 55, level: "Medio", interpretation: "Actitud adecuada. Equilibrio entre apertura y defensa. Autoconciencia y franqueza apropiadas." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Autocrítica excesiva, desvalidación. Posible llamada de ayuda. Puede indicar psicopatología o pobre autoconcepto." },
    ],
  },
  // CLINICAL SCALES
  {
    scaleCode: "Hs",
    scaleName: "Hipocondría (1)",
    scaleType: "clinical",
    description: "Preocupación excesiva por la salud física",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Preocupación extrema por funciones corporales. Quejas somáticas vagas y difusas. Posibles síntomas de conversión." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Preocupaciones por la salud significativas. Personas que usan quejas somáticas como mecanismo de ajuste." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de preocupación por la salud dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Sin preocupaciones somáticas significativas." },
    ],
  },
  {
    scaleCode: "D",
    scaleName: "Depresión (2)",
    scaleType: "clinical",
    description: "Nivel de depresión e insatisfacción vital",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Depresión severa. Sentimientos de desesperanza, ideación suicida posible. Retirada social marcada." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Depresión clínica significativa. Pesimismo, insatisfacción, falta de confianza en sí mismo. Posible trastorno depresivo." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de humor y satisfacción dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona activa, entusiasta, con buena autoestima." },
    ],
  },
  {
    scaleCode: "Hy",
    scaleName: "Histeria Conversiva (3)",
    scaleType: "clinical",
    description: "Síntomas somáticos y negación de problemas emocionales",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Reacciones de estrés extremas con somatización. Episodios de ansiedad y pánico. Fuerte negación de conflictos emocionales." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Tendencia a desarrollar síntomas físicos bajo estrés. Necesidad excesiva de atención y aprobación." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel normal de expresión emocional y capacidad de afrontamiento." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona directa, poco sociable, con intereses restringidos." },
    ],
  },
  {
    scaleCode: "Pd",
    scaleName: "Desviación Psicopática (4)",
    scaleType: "clinical",
    description: "Conflicto con la autoridad y normas sociales",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Marcada dificultad con normas y autoridad. Impulsividad, ira, relaciones interpersonales conflictivas. Historia de problemas legales." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Rebeldía, inconformismo. Dificultades en relaciones interpersonales. Baja tolerancia a la frustración." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de adaptación social dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona convencional, conformista, con buen control de impulsos." },
    ],
  },
  {
    scaleCode: "Mf",
    scaleName: "Masculinidad-Feminidad (5)",
    scaleType: "clinical",
    description: "Intereses y actitudes de género",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "En hombres: intereses estéticos, sensibilidad. En mujeres: intereses mecánicos, asertividad, independencia." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Intereses no tradicionales para su género. Flexibilidad en roles de género." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Identificación de género dentro de lo esperado." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Identificación marcada con rol de género tradicional." },
    ],
  },
  {
    scaleCode: "Pa",
    scaleName: "Paranoia (6)",
    scaleType: "clinical",
    description: "Suspicacia y sensibilidad interpersonal",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Ideas paranoides marcadas. Suspicacia extrema, hostilidad, posibles ideas delirantes de persecución o grandeza." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Sensibilidad interpersonal elevada. Tendencia a interpretar negativamente las acciones de otros. Resentimiento." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de sensibilidad interpersonal dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona confiada, puede ser ingenua en relaciones interpersonales." },
    ],
  },
  {
    scaleCode: "Pt",
    scaleName: "Psicastenia (7)",
    scaleType: "clinical",
    description: "Ansiedad, obsesiones y compulsiones",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Ansiedad severa e incapacitante. Rumia excesiva, rituales compulsivos, sentimientos de culpa e inseguridad profundos." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Ansiedad significativa. Tendencias obsesivo-compulsivas. Autoculpa, inseguridad, dificultad para tomar decisiones." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de ansiedad dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona relajada, segura de sí misma, libre de preocupaciones." },
    ],
  },
  {
    scaleCode: "Sc",
    scaleName: "Esquizofrenia (8)",
    scaleType: "clinical",
    description: "Pensamiento desorganizado y alienación",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Pensamiento desorganizado severo. Posible esquizofrenia o psicosis. Alienación social y emocional marcada." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Posibles dificultades en el pensamiento. Aislamiento social, creatividad inusual o ideación peculiar." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Funcionamiento del pensamiento dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona práctica, convencional, con buen contacto con la realidad." },
    ],
  },
  {
    scaleCode: "Ma",
    scaleName: "Hipomanía (9)",
    scaleType: "clinical",
    description: "Energía elevada y grandiosidad",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Energía excesiva, grandiosidad, posible episodio maníaco. Habla rápida, fuga de ideas, conductas de riesgo." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Energía elevada, hiperactividad. Posible impulsividad, baja tolerancia al aburrimiento, optimismo excesivo." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de energía y actividad dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona con baja energía, posible apatía o fatiga." },
    ],
  },
  {
    scaleCode: "Si",
    scaleName: "Introversión Social (0)",
    scaleType: "clinical",
    description: "Timidez y evitación social",
    interpretations: [
      { range: "76+", minT: 76, maxT: 120, level: "Muy marcada", interpretation: "Introversión marcada. Aislamiento social significativo. Evitación de situaciones sociales, timidez extrema." },
      { range: "66-75", minT: 66, maxT: 75, level: "Elevada", interpretation: "Introversión significativa. Prefiere actividades solitarias, incomodidad en situaciones sociales." },
      { range: "50-65", minT: 50, maxT: 65, level: "Normal", interpretation: "Nivel de socialización dentro de límites normales." },
      { range: "≤49", minT: 0, maxT: 49, level: "Bajo", interpretation: "Persona extrovertida, sociable, con facilidad para las relaciones interpersonales." },
    ],
  },
  // CONTENT SCALES
  {
    scaleCode: "ANS", scaleName: "Ansiedad", scaleType: "content",
    description: "Ansiedad generalizada",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Síntomas de ansiedad incluyendo tensión, problemas somáticos, dificultades para dormir, preocupaciones y falta de concentración. Miedo a perder el juicio. Dificultad para tomar decisiones." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin ansiedad significativa reportada." },
    ],
  },
  {
    scaleCode: "MIE", scaleName: "Miedos", scaleType: "content",
    description: "Miedos específicos",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Miedos específicos incluyendo ver sangre, lugares altos, temor a dejar el hogar, desastres naturales. Las mujeres muestran calificaciones más elevadas." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin miedos específicos significativos." },
    ],
  },
  {
    scaleCode: "OBS", scaleName: "Obsesividad", scaleType: "content",
    description: "Características obsesivas",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Dificultades para tomar decisiones, meditación excesiva. Conductas compulsivas posibles. Tendencia a preocuparse en exceso y sentirse abrumados por sus pensamientos." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin características obsesivas significativas." },
    ],
  },
  {
    scaleCode: "DEP", scaleName: "Depresión (Contenido)", scaleType: "content",
    description: "Pensamientos depresivos significativos",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Pensamientos depresivos significativos: tristeza, incertidumbre sobre el futuro, desinterés. Sentimientos de desesperanza, vacío interior. Posibles ideas suicidas." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin pensamientos depresivos significativos." },
    ],
  },
  {
    scaleCode: "SAU", scaleName: "Preocupaciones por la Salud", scaleType: "content",
    description: "Síntomas físicos diversos",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Síntomas físicos en diversos órganos corporales. Preocupación excesiva por la salud. Se encontró elevada en personas con dermatitis y colon irritable." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin preocupaciones somáticas significativas." },
    ],
  },
  {
    scaleCode: "DEL", scaleName: "Pensamiento Delirante", scaleType: "content",
    description: "Pensamiento estrafalario",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Síntomas psicóticos como alucinaciones, contenido del pensamiento paranoide. Pueden reportar experiencias inusuales." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Sin indicadores de pensamiento delirante." },
    ],
  },
  {
    scaleCode: "ENJ", scaleName: "Enojo", scaleType: "content",
    description: "Hostilidad y problemas de control de la ira",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Problemas de control de la ira. Irritabilidad, impaciencia, hostilidad. Pueden ser gruñones y tercos. Problemas interpersonales debido al enojo." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Buen control emocional del enojo." },
    ],
  },
  {
    scaleCode: "CIN", scaleName: "Cinismo", scaleType: "content",
    description: "Actitudes cínicas y misantrópicas",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Creencias misantrópicas. Esperan motivaciones ocultas y negativas de los demás. Desconfianza generalizada hacia las personas." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Actitud confiada hacia los demás." },
    ],
  },
  {
    scaleCode: "PAS", scaleName: "Prácticas Antisociales", scaleType: "content",
    description: "Conductas antisociales",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Reportan conductas problemáticas durante la adolescencia. Actitudes antisociales. Posible historia de problemas con la ley." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Conducta prosocial adecuada." },
    ],
  },
  {
    scaleCode: "PTA", scaleName: "Personalidad Tipo A", scaleType: "content",
    description: "Comportamiento tipo A",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Comportamiento tipo A: competitividad, impaciencia, hostilidad. Trabajadores compulsivos que presionan a otros y son directos." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Personalidad relajada, paciente." },
    ],
  },
  {
    scaleCode: "BAE", scaleName: "Baja Autoestima", scaleType: "content",
    description: "Baja autoestima",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Opinión muy desfavorable de sí mismo. Sentimientos de inutilidad, de no ser atractivo. Incapacidad de aceptar elogios. Se sienten insignificantes." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Autoestima adecuada." },
    ],
  },
  {
    scaleCode: "ISO", scaleName: "Incomodidad Social", scaleType: "content",
    description: "Malestar social",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Se sienten incómodos en reuniones y fiestas. Prefieren estar solos. Les resulta difícil iniciar conversaciones y son reservados y tímidos." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Comodidad en situaciones sociales." },
    ],
  },
  {
    scaleCode: "FAM", scaleName: "Problemas Familiares", scaleType: "content",
    description: "Problemas familiares",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Discordia familiar considerable. Perciben su infancia y familia como desagradable. Describen a sus familias como carentes de amor y apoyo." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Relaciones familiares percibidas como adecuadas." },
    ],
  },
  {
    scaleCode: "DTR", scaleName: "Dificultad en el Trabajo", scaleType: "content",
    description: "Dificultad en el trabajo",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Conductas o actitudes que interfieren con el rendimiento laboral. Baja autoconfianza, dificultad de concentración, obsesividad, tensión y presión." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Buen ajuste laboral." },
    ],
  },
  {
    scaleCode: "RTR", scaleName: "Rechazo al Tratamiento", scaleType: "content",
    description: "Rechazo al tratamiento",
    interpretations: [
      { range: "65+", minT: 65, maxT: 120, level: "Alto", interpretation: "Actitudes negativas hacia la salud mental. No creen que alguien pueda entenderlos. Resistencia a asumir responsabilidad sobre sus problemas." },
      { range: "≤40", minT: 0, maxT: 40, level: "Bajo", interpretation: "Apertura al tratamiento psicológico." },
    ],
  },
];

// ==================== VALIDITY PATTERN ANALYSIS ====================
export function analyzeValidityPattern(tScores: Record<string, number>): string[] {
  const findings: string[] = [];
  const L = tScores.L || 50;
  const F = tScores.F || 50;
  const K = tScores.K || 50;

  if (L > 70 && F >= 45 && F <= 55 && K >= 45 && K <= 55) {
    findings.push("Perfil defensivo: la persona utilizó un patrón de respuestas bastante ingenuo (L elevada, F y K en rango medio).");
  }
  if (L >= 60 && L <= 70 && K >= 60 && K <= 70 && F <= 50) {
    findings.push("Perfil defensivo: la persona trató de dar una buena imagen de sí mismo. Perfil de falsa bondad. Frecuente en contextos de selección de personal.");
  }
  if (L >= 45 && L <= 55 && F < 50 && K > 70) {
    findings.push("Patrón defensivo con defensas más elaboradas (K elevada con L y F normales).");
  }
  if (F >= 65 && F <= 80 && L < 50 && K < 50) {
    findings.push("Persona admite síntomas abiertamente, pide ayuda y siente que sus recursos no son suficientes para enfrentar las situaciones problemáticas.");
  }
  if (F > 100 && L < 45 && K < 45) {
    findings.push("Persona que exagera sus síntomas. Posible búsqueda de ayuda inmediata o simulación de patología en contexto forense.");
  }

  // Gough Index (F-K)
  const fk = F - K;
  if (fk > 9) {
    findings.push(`Índice de Gough (F-K = ${fk}): sugiere posible exageración de patología.`);
  }

  if (findings.length === 0) {
    findings.push("Configuración de escalas de validez dentro de parámetros aceptables.");
  }

  return findings;
}

// ==================== CLINICAL PATTERN ANALYSIS ====================
export function analyzeClinicalPatterns(tScores: Record<string, number>): string[] {
  const findings: string[] = [];
  
  const clinicalScales = ['Hs', 'D', 'Hy', 'Pd', 'Mf', 'Pa', 'Pt', 'Sc', 'Ma', 'Si'];
  const elevated = clinicalScales
    .filter(s => (tScores[s] || 50) >= 65)
    .sort((a, b) => (tScores[b] || 50) - (tScores[a] || 50));

  if (elevated.length === 0) {
    findings.push("Perfil clínico dentro de límites normales sin elevaciones significativas.");
    return findings;
  }

  const top2 = elevated.slice(0, 2);

  // Common code types
  if (top2.includes('D') && top2.includes('Pt')) {
    findings.push("Código 2-7 (Depresión-Psicastenia): sugiere ansiedad y depresión comórbidas, posible trastorno mixto ansioso-depresivo.");
  }
  if (top2.includes('D') && top2.includes('Hy')) {
    findings.push("Código 2-3 (Depresión-Histeria): tríada neurótica. Posibles síntomas somáticos con componente depresivo.");
  }
  if (top2.includes('Pd') && top2.includes('Ma')) {
    findings.push("Código 4-9 (Desviación Psicopática-Hipomanía): sugiere impulsividad, posibles dificultades con la autoridad y conductas de riesgo.");
  }
  if (top2.includes('Pa') && top2.includes('Sc')) {
    findings.push("Código 6-8 (Paranoia-Esquizofrenia): sugiere pensamiento desorganizado con contenido paranoide. Evaluar funcionamiento psicótico.");
  }
  if (top2.includes('Hs') && top2.includes('Hy')) {
    findings.push("Código 1-3 (Hipocondría-Histeria): perfil de conversión. Tendencia a somatizar conflictos emocionales.");
  }
  if (top2.includes('Pt') && top2.includes('Sc')) {
    findings.push("Código 7-8 (Psicastenia-Esquizofrenia): ansiedad severa con posible desorganización del pensamiento.");
  }

  // Individual elevations
  for (const scale of elevated) {
    const t = tScores[scale] || 50;
    const level = t >= 76 ? "muy marcada" : "elevada";
    const interp = SCALE_INTERPRETATIONS.find(s => s.scaleCode === scale);
    if (interp) {
      const match = interp.interpretations.find(i => t >= i.minT && t <= i.maxT);
      if (match) {
        findings.push(`${interp.scaleName} (T=${t}, ${level}): ${match.interpretation}`);
      }
    }
  }

  return findings;
}

export function getScaleInterpretation(scaleCode: string, tScore: number): string | null {
  const scale = SCALE_INTERPRETATIONS.find(s => s.scaleCode === scaleCode);
  if (!scale) return null;
  const match = scale.interpretations.find(i => tScore >= i.minT && tScore <= i.maxT);
  return match?.interpretation || null;
}

export function getTScoreLevel(tScore: number): { level: string; severity: 'normal' | 'moderate' | 'elevated' | 'very_elevated' } {
  if (tScore >= 76) return { level: "Muy marcada", severity: 'very_elevated' };
  if (tScore >= 66) return { level: "Elevada", severity: 'elevated' };
  if (tScore >= 50) return { level: "Normal", severity: 'normal' };
  return { level: "Bajo", severity: 'normal' };
}
