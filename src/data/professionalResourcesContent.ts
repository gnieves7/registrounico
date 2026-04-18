/**
 * Contenido estático del Centro de Recursos Profesionales:
 * fichas conceptuales y tablas de autores por sección.
 * Los recursos descargables/links se cargan desde Supabase (professional_resources).
 */

export type ResourceSection =
  | 'protocols'
  | 'gender_violence'
  | 'psychological_damage'
  | 'sexual_abuse'
  | 'report_models';

export interface AuthorRef {
  name: string;
  contribution: string;
}

export interface SectionDefinition {
  id: ResourceSection;
  number: string;
  title: string;
  shortTitle: string;
  accentHsl: string; // HSL triple "h s% l%" sin envoltorio hsl()
  introduction: string;
  authors: AuthorRef[];
  lauraContext: string;
}

export const RESOURCE_SECTIONS: SectionDefinition[] = [
  {
    id: 'protocols',
    number: '01',
    title: 'Protocolos de Actuación',
    shortTitle: 'Protocolos',
    accentHsl: '215 60% 27%', // azul institucional
    introduction:
      'Conjunto de marcos normativos y guías oficiales que orientan la intervención profesional ante situaciones de violencia familiar, de género y maltrato. Integra el enfoque ecológico de OPS/OMS, la perspectiva sistémica y los protocolos jurisdiccionales argentinos.',
    authors: [
      { name: 'OPS / OMS', contribution: 'Enfoque ecológico del trauma y la violencia. Guías de respuesta en salud mental.' },
      { name: 'Irene Intebi', contribution: 'Protocolos de intervención en abuso y maltrato (Argentina / SENAF).' },
      { name: 'Perrone & Nannini', contribution: 'Violencia y abusos sexuales en la familia — perspectiva sistémica.' },
      { name: 'Min. Justicia y DDHH Argentina', contribution: 'Protocolos de actuación judicial en violencia familiar y de género.' },
    ],
    lauraContext:
      'El profesional está consultando sobre protocolos de actuación en violencia familiar y de género. Orientá desde el marco OPS/OMS, Intebi y la normativa argentina vigente.',
  },
  {
    id: 'gender_violence',
    number: '02',
    title: 'Violencia de Género',
    shortTitle: 'Violencia de Género',
    accentHsl: '273 36% 48%', // violeta
    introduction:
      'Marco integrador del ciclo de la violencia (Walker), el TEPT complejo (Herman) y la perspectiva legal argentina (Ley 26.485). Aborda evaluación, intervención y abordaje pericial de mujeres en situación de violencia.',
    authors: [
      { name: 'Lenore Walker', contribution: 'Síndrome de la Mujer Maltratada. Ciclo de la violencia.' },
      { name: 'Judith Herman', contribution: 'Trauma y Recuperación. TEPT complejo en víctimas de violencia crónica.' },
      { name: 'Mary Ann Dutton', contribution: 'Evaluación forense en violencia de pareja. Tipologías del agresor.' },
      { name: 'Enrique Echeburúa', contribution: 'Evaluación del daño psíquico. Perfiles de víctimas y agresores.' },
      { name: 'Jorge Corsi', contribution: 'Violencia familiar y de género — marco conceptual argentino pionero.' },
      { name: 'Diana Scialabba', contribution: 'Perspectiva de género en psicología jurídica argentina.' },
      { name: 'Eva Giberti', contribution: 'Víctimas, género e intervención institucional en Argentina.' },
    ],
    lauraContext:
      'El profesional está revisando un caso de violencia de género. Orientá sobre evaluación del daño y marcos legales vigentes en Argentina (Ley 26.485, Walker, Herman, Echeburúa).',
  },
  {
    id: 'psychological_damage',
    number: '03',
    title: 'Daño Psicológico',
    shortTitle: 'Daño Psicológico',
    accentHsl: '27 92% 43%', // naranja
    introduction:
      'Distingue daño psíquico (alteración clínica diagnosticable) de daño moral (categoría jurídica). Integra criterios DSM-5 y CIE-11 para TEPT y TEPT complejo como marcadores forenses, y baremos de valoración pericial.',
    authors: [
      { name: 'Enrique Echeburúa', contribution: 'Marco latinoamericano para evaluación del daño psíquico forense.' },
      { name: 'Pau Pérez Sales', contribution: 'Trauma, tortura y evaluación del daño — perspectiva crítica y transcultural.' },
      { name: 'Bessel van der Kolk', contribution: 'Neurobiología del trauma. El cuerpo lleva la cuenta.' },
      { name: 'García-Vera & Sanz', contribution: 'Prevalencia de TEPT en víctimas. Criterios diagnósticos forenses.' },
      { name: 'Jorge Folino', contribution: 'Evaluación forense en contexto judicial latinoamericano.' },
      { name: 'Pedro Martínez Leal', contribution: 'Baremos y criterios de valoración del daño psíquico.' },
    ],
    lauraContext:
      'El profesional necesita orientación para evaluar y documentar daño psíquico en una víctima. Indicá criterios forenses relevantes (DSM-5/CIE-11, Echeburúa, Pérez Sales).',
  },
  {
    id: 'sexual_abuse',
    number: '04',
    title: 'Sospecha de Abuso Sexual',
    shortTitle: 'Abuso Sexual',
    accentHsl: '11 75% 41%', // rojo
    introduction:
      'Integra epistemología del testimonio infantil, hipótesis Undeutsch, CBCA/SVA, Protocolo NICHD, SAASI (Summit) y presentaciones atípicas (Kendall-Tackett). Importante: distinguir evaluación clínica de pericial forense — son procesos con objetivos, encuadre y alcances diferentes.',
    authors: [
      { name: 'Irene Intebi', contribution: 'Referente argentina máxima en ASI: evaluación, entrevista forense, informes.' },
      { name: 'Eva Giberti', contribution: 'Cámara Gesell. Intervención institucional y análisis del testimonio infantil.' },
      { name: 'Lamb, Orbach & Hershkowitz', contribution: 'Protocolo NICHD — entrevista forense basada en evidencia empírica.' },
      { name: 'Steller & Köhnken', contribution: 'CBCA/SVA — análisis de contenido basado en criterios.' },
      { name: 'Roland Summit', contribution: 'Síndrome de Acomodación al Abuso Sexual Infantil (SAASI).' },
      { name: 'Kathleen Kendall-Tackett', contribution: 'Presentaciones atípicas y víctimas asintomáticas en abuso infantil.' },
      { name: 'Udo Undeutsch', contribution: 'Hipótesis Undeutsch — base epistemológica del CBCA.' },
      { name: 'Berliner & Elliott', contribution: 'Marco clínico-forense integrado en abuso sexual infantil.' },
    ],
    lauraContext:
      'El profesional está evaluando una situación de posible abuso sexual en NNyA. Orientá desde Intebi, NICHD y CBCA/SVA. Recordá la distinción entre evaluación clínica y pericial.',
  },
  {
    id: 'report_models',
    number: '05',
    title: 'Modelos de Informes',
    shortTitle: 'Informes',
    accentHsl: '152 64% 29%', // verde
    introduction:
      'Estructuras de referencia organizadas por tipo de informe (psicodiagnóstico clínico, daño psíquico, riesgo del agresor, credibilidad de testimonio, capacidad/comprensión, situación NNyA) y por bibliografía (Folino, Echeburúa, COP Catalunya, MPF).',
    authors: [
      { name: 'Folino & Escobar Córdoba', contribution: 'Herramientas para la práctica forense — estructura de informes periciales.' },
      { name: 'Echeburúa et al.', contribution: 'Modelos de informe en violencia de género y daño psíquico (Guía COP España).' },
      { name: 'COP Catalunya', contribution: 'Guía de elaboración de informes psicológicos.' },
      { name: 'Min. Público Fiscal CABA / Santa Fe', contribution: 'Modelos de informe pericial en contexto judicial argentino.' },
    ],
    lauraContext:
      'El profesional necesita ayuda para estructurar un informe pericial. Orientá sobre las secciones imprescindibles según el tipo de causa.',
  },
];
