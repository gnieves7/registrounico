/**
 * Contenido extenso de la sección "Psicología del Testimonio" (Acompañar / Forense).
 * Marco teórico, investigaciones, instrumentos validados y fichas descargables.
 * Renderizado por el componente <TestimonyPsychologyExtended />.
 */

export interface TheoryAxis {
  key: string;
  title: string;
  body: string;
  bullets?: string[];
}

export interface ResearchEntry {
  axis: string;
  citation: string; // APA 7 inline
  finding: string;
  forensicImplication: string;
}

export interface CbcaCriterion {
  number: number;
  category: string;
  name: string;
  description: string;
}

export const TESTIMONY_THEORY: TheoryAxis[] = [
  {
    key: 'memory',
    title: 'a) Memoria y testimonio',
    body:
      'La memoria es un proceso reconstructivo —no una grabación literal— organizado en tres fases: codificación (encoding), almacenamiento y recuperación. Cada fase es vulnerable a distorsiones (Loftus, 2005; Schacter, 2001). En contexto forense interesan especialmente la memoria episódica (eventos autobiográficos, contextualizados temporo-espacialmente) y su distinción operativa con la memoria semántica (conocimiento general descontextualizado).',
    bullets: [
      'Niños/as y adolescentes: memoria episódica funcional desde los 3-4 años, pero con menor capacidad metamnésica y mayor sugestionabilidad (Ceci & Bruck, 1995).',
      'Adultos: mayor estabilidad del relato pero vulnerables al efecto de información post-evento (misinformation effect).',
      'Trauma y memoria: hipermnesia para el núcleo del evento + amnesia parcial periférica; fragmentación sensorial (van der Kolk, 2014).',
      'Sugestionabilidad y contaminación mnémica: preguntas dirigidas, entrevistas repetidas, conversación con terceros y exposición mediática pueden incorporar contenidos no vividos al recuerdo (Bruck & Ceci, 1999).',
    ],
  },
  {
    key: 'credibility-models',
    title: 'b) Modelos de credibilidad del testimonio',
    body:
      'Tres marcos teóricos sustentan la evaluación científica de la credibilidad del relato:',
    bullets: [
      'Modelo de Monitoring de la Realidad (Johnson & Raye, 1981): los recuerdos de eventos vividos contienen más detalles perceptivos, contextuales y sensoriales; los imaginados, más operaciones cognitivas y razonamientos.',
      'Hipótesis de Undeutsch (1967): los relatos basados en experiencias reales difieren cualitativamente —en contenido y estructura— de los relatos inventados o sugeridos. Fundamento epistemológico del CBCA.',
      'Modelo de Evaluación Cognitiva (Steller & Köhnken, 1989): operacionaliza la hipótesis de Undeutsch en 19 criterios verificables, integrados en el SVA junto con análisis de validez externa.',
    ],
  },
  {
    key: 'declaration',
    title: 'c) Evaluación de la declaración',
    body:
      'La evaluación distingue validez interna (cualidades del relato en sí) y validez externa (factores contextuales, psicológicos y procesales que pueden afectarla). El profesional debe diferenciar tres categorías clínicamente relevantes: relato genuino (basado en experiencia vivida), fabricación intencional (simulación, mendacidad) y error honesto (distorsión no deliberada por sugestión, contaminación o reconstrucción defectuosa). La fabulación —producción de contenido sin intención de engañar— aparece especialmente en cuadros orgánicos, disociativos o en infancia temprana.',
  },
  {
    key: 'vulnerable-witnesses',
    title: 'd) Vulnerabilidad de testigos especiales',
    body:
      'Las 100 Reglas de Brasilia (Res. MPA 147/2020) y la Ley 26.485 imponen estándares reforzados de actuación con testigos vulnerables:',
    bullets: [
      'Niños, niñas y adolescentes (NNyA): entrevista única en Cámara Gesell, protocolo NICHD, evitar revictimización (CCyC Art. 707).',
      'Víctimas de abuso sexual infantil: presentaciones atípicas, retracciones evolutivas (SAASI — Summit, 1983), necesidad de marco SVA.',
      'Personas con discapacidad intelectual: mayor sugestionabilidad y aquiescencia; uso de GSS-2 y ajustes de lenguaje.',
      'Víctimas de violencia de género: TEPT complejo, memoria fragmentada, "mentira útil" para protección (Herman, 1992; Echeburúa).',
    ],
  },
];

export const TESTIMONY_RESEARCH: ResearchEntry[] = [
  {
    axis: 'Sugestionabilidad infantil y entrevista forense',
    citation:
      'Lamb, M. E., Brown, D. A., Hershkowitz, I., Orbach, Y., & Esplin, P. W. (2018). Tell me what happened: Questioning children about abuse (2.ª ed.). Wiley-Blackwell.',
    finding:
      'La revisión empírica del Protocolo NICHD demuestra que las entrevistas estructuradas con preguntas abiertas y libre evocación incrementan significativamente la cantidad y calidad de información forense respecto de las entrevistas no estructuradas.',
    forensicImplication:
      'La adopción del NICHD reduce contaminación, mejora la admisibilidad procesal del testimonio infantil y disminuye la necesidad de re-entrevistas (clave para no revictimizar bajo el CPPN y la Ley 12.734).',
  },
  {
    axis: 'Indicadores de credibilidad testimonial (CBCA)',
    citation:
      'Amado, B. G., Arce, R., Fariña, F., & Vilariño, M. (2016). Criteria-Based Content Analysis (CBCA) reality criteria in adults: A meta-analytic review. International Journal of Clinical and Health Psychology, 16(2), 201–210. https://doi.org/10.1016/j.ijchp.2016.01.002',
    finding:
      'Meta-análisis con tamaños del efecto medio-altos (d ≈ 0.79) para discriminar relatos verdaderos de inventados en adultos, con mejores resultados en los criterios I-II-III del CBCA.',
    forensicImplication:
      'Respalda el uso del CBCA como herramienta orientativa también en adultos —no sólo en NNyA— pero no como prueba diagnóstica única; debe integrarse al SVA completo.',
  },
  {
    axis: 'Efectos del trauma en la memoria declarativa',
    citation:
      'Brewin, C. R. (2018). Memory and forgetting. Current Psychiatry Reports, 20(10), 87. https://doi.org/10.1007/s11920-018-0950-7',
    finding:
      'Las víctimas de trauma muestran simultáneamente intrusiones vívidas (núcleo del evento) y dificultades para producir un relato coherente y temporalmente ordenado, especialmente bajo TEPT.',
    forensicImplication:
      'La fragmentación o discontinuidad del relato no debe interpretarse per se como indicador de mendacidad; constituye un patrón clínico esperable en víctimas traumatizadas.',
  },
  {
    axis: 'Entrevistas a víctimas de abuso sexual',
    citation:
      'Hershkowitz, I., Lamb, M. E., & Katz, C. (2014). Allegation rates in forensic child abuse investigations: Comparing the revised and standard NICHD protocols. Psychology, Public Policy, and Law, 20(3), 336–344. https://doi.org/10.1037/a0037391',
    finding:
      'El Protocolo NICHD revisado (con componente de soporte emocional) incrementó la tasa de develación en NNyA reticentes sin aumentar falsos positivos.',
    forensicImplication:
      'Justifica el uso del NICHD revisado en Cámara Gesell argentina cuando hay sospecha fundada y resistencia a develar.',
  },
  {
    axis: 'Falsos recuerdos y contaminación del relato',
    citation:
      'Otgaar, H., Howe, M. L., Patihis, L., Merckelbach, H., Lynn, S. J., Lilienfeld, S. O., & Loftus, E. F. (2019). The return of the repressed: The persistent and problematic claims of long-forgotten trauma. Perspectives on Psychological Science, 14(6), 1072–1095. https://doi.org/10.1177/1745691619862306',
    finding:
      'Es posible inducir experimentalmente recuerdos completos de eventos traumáticos no ocurridos mediante técnicas sugestivas (visualización guiada, entrevistas repetidas con presión).',
    forensicImplication:
      'Obliga al perito a indagar exhaustivamente el contexto de develación, número de entrevistas previas y técnicas usadas (terapéuticas o policiales) antes de evaluar credibilidad.',
  },
  {
    axis: 'Testimonios en contexto de violencia de género',
    citation:
      'Arce, R., Fariña, F., Carballal, A., & Novo, M. (2009). Creación y validación de un protocolo de evaluación forense de las secuelas psicológicas de la violencia de género. Psicothema, 21(2), 241–247.',
    finding:
      'Protocolo integrado SVA + evaluación de secuelas (TEPT, depresión, ansiedad) discrimina con sensibilidad/especificidad >85% víctimas reales de simuladoras en muestras forenses españolas.',
    forensicImplication:
      'Modelo replicable en contexto argentino bajo Ley 26.485; respalda la articulación entre análisis del relato y evaluación del daño psíquico (Echeburúa).',
  },
];

export const CBCA_CRITERIA: CbcaCriterion[] = [
  // I. Características generales
  { number: 1, category: 'I. Características generales', name: 'Estructura lógica', description: 'Coherencia interna y consistencia entre los distintos elementos del relato.' },
  { number: 2, category: 'I. Características generales', name: 'Elaboración inestructurada', description: 'Presentación no lineal, con digresiones y saltos temporales propios del recuerdo genuino.' },
  { number: 3, category: 'I. Características generales', name: 'Cantidad de detalles', description: 'Riqueza de información concreta sobre lugar, tiempo, personas y acciones.' },
  // II. Contenidos específicos
  { number: 4, category: 'II. Contenidos específicos', name: 'Engranaje contextual', description: 'Encuadre temporo-espacial del hecho dentro de la rutina cotidiana.' },
  { number: 5, category: 'II. Contenidos específicos', name: 'Descripción de interacciones', description: 'Reciprocidad de acciones, reacciones y diálogos entre los actores.' },
  { number: 6, category: 'II. Contenidos específicos', name: 'Reproducción de la conversación', description: 'Cita textual o sustancial de los diálogos mantenidos durante el evento.' },
  { number: 7, category: 'II. Contenidos específicos', name: 'Complicaciones inesperadas', description: 'Aparición de imprevistos o interrupciones durante el desarrollo del hecho.' },
  { number: 8, category: 'II. Contenidos específicos', name: 'Detalles inusuales', description: 'Elementos atípicos, raros o sorprendentes pero plausibles.' },
  // III. Peculiaridades del contenido
  { number: 9, category: 'III. Peculiaridades del contenido', name: 'Detalles superfluos', description: 'Información periférica no esencial al núcleo del relato.' },
  { number: 10, category: 'III. Peculiaridades del contenido', name: 'Detalles incomprendidos relatados con precisión', description: 'Descripción exacta de elementos que el testigo no comprende plenamente (típico en NNyA).' },
  { number: 11, category: 'III. Peculiaridades del contenido', name: 'Asociaciones externas relacionadas', description: 'Vinculaciones espontáneas con eventos previos o paralelos.' },
  { number: 12, category: 'III. Peculiaridades del contenido', name: 'Estado mental subjetivo del testigo', description: 'Verbalización de emociones, sensaciones y pensamientos propios durante el hecho.' },
  { number: 13, category: 'III. Peculiaridades del contenido', name: 'Atribución del estado mental al agresor', description: 'Inferencias sobre las emociones o intenciones del autor.' },
  { number: 14, category: 'III. Peculiaridades del contenido', name: 'Correcciones espontáneas', description: 'Auto-rectificaciones del propio relato sin requerimiento externo.' },
  // IV. Contenidos referidos a la motivación
  { number: 15, category: 'IV. Motivación', name: 'Admisión de falta de memoria', description: 'Reconocimiento explícito de lagunas mnésicas ("no recuerdo esa parte").' },
  { number: 16, category: 'IV. Motivación', name: 'Dudas sobre el propio testimonio', description: 'Auto-cuestionamientos sobre la exactitud o coherencia del propio relato.' },
  { number: 17, category: 'IV. Motivación', name: 'Auto-desaprobación', description: 'Manifestaciones de culpa, vergüenza o autocrítica respecto al hecho.' },
  // V. Elementos específicos de la agresión
  { number: 18, category: 'V. Elementos de la agresión', name: 'Perdón al autor', description: 'Disculpas o justificaciones hacia el agresor (frecuente en vínculos intrafamiliares).' },
  { number: 19, category: 'V. Elementos de la agresión', name: 'Detalles característicos del delito', description: 'Elementos coincidentes con la fenomenología típica del tipo de delito investigado.' },
];

export const SVA_VALIDITY_CHECKLIST = [
  {
    section: 'Características psicológicas del testigo',
    items: [
      'Adecuación del lenguaje a la edad y desarrollo evolutivo',
      'Adecuación del afecto al contenido relatado',
      'Susceptibilidad a la sugestión (considerar GSS-1/GSS-2 si corresponde)',
    ],
  },
  {
    section: 'Motivación para informar',
    items: [
      'Contexto de la denuncia (espontáneo / inducido / requerido)',
      'Relación con el supuesto autor y posibles ganancias secundarias',
      'Presiones familiares, judiciales o mediáticas',
    ],
  },
  {
    section: 'Cuestiones investigativas',
    items: [
      'Consistencia con leyes de la naturaleza y plausibilidad fáctica',
      'Consistencia con otras declaraciones del mismo testigo',
      'Consistencia con evidencia externa (médica, documental, testimonial)',
    ],
  },
  {
    section: 'Contexto y adecuación de la entrevista',
    items: [
      'Aplicación de protocolo estructurado (NICHD u homólogo)',
      'Ausencia de preguntas sugestivas o cerradas innecesarias',
      'Número de entrevistas previas y registro audiovisual disponible',
    ],
  },
];

export const TESTIMONY_REPORT_TEMPLATE = [
  { section: '1. Datos del caso', content: 'Carátula, CUIJ/legajo, juzgado/fiscalía, fecha de designación, profesional actuante (perito oficial / consultor técnico de parte), matrícula y jurisdicción.' },
  { section: '2. Datos del/la entrevistado/a', content: 'Nombre, edad, vínculo con los hechos, condición de testigo/víctima, datos relevantes del desarrollo evolutivo y antecedentes salud mental.' },
  { section: '3. Objeto pericial', content: 'Punto/s de pericia ordenados por el tribunal o propuestos por la parte, con transcripción literal.' },
  { section: '4. Metodología aplicada', content: 'Encuadre (NICHD, SVA), entrevistas realizadas (fecha, duración, modalidad), instrumentos administrados (CBCA, GSS-1/GSS-2 si aplica), revisión documental.' },
  { section: '5. Análisis del relato (CBCA)', content: 'Tabla de los 19 criterios con presencia/ausencia, intensidad y referencia al segmento del relato. Síntesis cualitativa.' },
  { section: '6. Análisis de validez (Checklist SVA)', content: 'Evaluación de los factores externos: características del testigo, motivación, cuestiones investigativas y adecuación de la entrevista.' },
  { section: '7. Discusión integradora', content: 'Articulación de los hallazgos con el marco teórico (Undeutsch, Steller-Köhnken) y la evidencia documental disponible. Limitaciones del análisis.' },
  { section: '8. Conclusiones', content: 'Pronunciamiento técnico orientativo-probabilístico (NUNCA categórico sobre verdad/falsedad). Respuesta puntual a cada punto de pericia.' },
  { section: '9. Aclaración ética obligatoria', content: '"Las presentes conclusiones constituyen un aporte técnico de naturaleza probabilística-orientativa. La determinación de la verdad procesal corresponde exclusivamente al órgano jurisdiccional."' },
  { section: '10. Firma profesional', content: 'Nombre, título, matrícula del Colegio de Psicólogos de Santa Fe, condición de actuación (perito de parte / consultor técnico), fecha y lugar.' },
];

export const TESTIMONY_INSTRUMENTS = {
  sva: {
    name: 'SVA — Statement Validity Assessment',
    purpose:
      'Sistema integrado para evaluar la validez de declaraciones, originalmente desarrollado en Alemania para casos de abuso sexual infantil; hoy extendido a adultos y otros delitos. Rinde un juicio orientativo, NO diagnóstico absoluto.',
    components: [
      'Entrevista estructurada (preferentemente Protocolo NICHD)',
      'CBCA — Criteria-Based Content Analysis (19 criterios)',
      'Lista de Validez (Validity Checklist) — análisis de factores externos',
    ],
    foundation:
      'Hipótesis de Undeutsch (1967): los relatos basados en experiencias reales difieren cualitativamente de los inventados.',
    procedure: [
      '1. Recopilación de antecedentes documentales del caso.',
      '2. Entrevista forense estructurada (NICHD) registrada audiovisualmente.',
      '3. Transcripción literal del relato.',
      '4. Aplicación del CBCA — análisis criterio por criterio.',
      '5. Aplicación de la Lista de Validez — factores externos.',
      '6. Integración y formulación del juicio orientativo final.',
    ],
    limitations:
      'No tiene valor diagnóstico absoluto. La presencia/ausencia de criterios CBCA es probabilística. Validez disminuye en menores de 4 años, en relatos muy breves y en sujetos con discapacidad intelectual severa. No permite distinguir confiablemente fabricación de error honesto inducido por sugestión.',
    argentineValidity:
      'Admisible en el sistema procesal penal de Santa Fe (Ley 12.734) como prueba pericial científica, sujeta a contradictorio. Recomendado por el Ministerio Público de la Acusación en investigaciones de delitos contra la integridad sexual y violencia de género.',
  },
  gss: {
    name: 'Escala de Sugestionabilidad de Gudjonsson (GSS-1 / GSS-2)',
    purpose:
      'Evalúa la sugestionabilidad interrogativa: tendencia a aceptar información engañosa y a modificar respuestas bajo presión interpersonal. Especialmente útil en evaluación de confesiones, testimonios de personas con discapacidad intelectual, y víctimas con alta vulnerabilidad.',
    subscales: [
      'Rendimiento (Recall): cantidad de información correcta recordada del relato.',
      'Ceder 1 (Yield 1): aceptación inicial de preguntas sugestivas.',
      'Cambio (Shift): modificación de respuestas tras retroalimentación negativa.',
      'Ceder 2 (Yield 2): aceptación de sugestiones tras presión.',
      'Sugestionabilidad Total: Yield 1 + Shift.',
    ],
    interpretation:
      'Puntuaciones elevadas (>1 DE sobre la media normativa) indican alta sugestionabilidad y obligan a extremar cautela en la valoración del testimonio o de eventuales confesiones. Imprescindible en casos de confesión cuestionada bajo coerción.',
    spanishNorms:
      'Adaptación española disponible (Muñoz, Manzanero & Hervilla, 2014). Baremos en castellano publicados para población general adulta y adolescente; baremos argentinos en construcción (referencia: cátedras de Psicología Forense UBA y UNR).',
  },
};

export const FORM_TEMPLATES = {
  cbcaForm: {
    title: 'Ficha de Registro CBCA',
    description:
      'Tabla de doble entrada con los 19 criterios SVA/CBCA. Para cada criterio: presencia (Sí / No / Parcial), intensidad (1-3), observaciones clínicas y referencia al segmento del relato (línea/minuto del registro).',
    columns: ['#', 'Criterio', 'Categoría', 'Presencia', 'Intensidad (1-3)', 'Observación clínica', 'Segmento del relato'],
  },
  validityChecklist: {
    title: 'Checklist de Validez SVA',
    description:
      'Lista de verificación de los factores externos que pueden afectar la validez de la declaración. Marcar cada ítem como Adecuado / Parcial / Inadecuado / No evaluable, con observación.',
  },
  reportSynthesis: {
    title: 'Informe-síntesis de Credibilidad Testimonial',
    description:
      'Plantilla de informe pericial adaptada a normativa argentina (Mat. Colegio de Psicólogos Santa Fe). Incluye datos del caso, metodología, análisis CBCA, análisis de validez, conclusiones probabilísticas y firma profesional.',
  },
};