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
  | 'communication_regime'
  | 'audience_tips'
  | 'bibliography'
  | 'informed_consent'
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
    id: 'communication_regime',
    number: '05',
    title: 'Régimen Comunicacional',
    shortTitle: 'Rég. Comunicacional',
    accentHsl: '178 80% 27%', // teal
    introduction:
      'Marco de evaluación del régimen comunicacional (antes "régimen de visitas") en el Código Civil y Comercial argentino (Arts. 652-657). Aborda el rol del psicólogo como perito o consultor técnico en disputas de cuidado personal, evaluación del vínculo afectivo NNyA-progenitor y detección de obstaculización del contacto.',
    authors: [
      { name: 'Cecilia Grosman', contribution: 'Familia, infancia y derecho. Régimen comunicacional en el CCyC.' },
      { name: 'Marisa Herrera', contribution: 'Código Civil y Comercial comentado — Derecho de Familia argentino.' },
      { name: 'John Bowlby', contribution: 'Teoría del apego — base para evaluación del vínculo paterno-filial.' },
      { name: 'Joan Kelly', contribution: 'Coparentalidad post-divorcio. Evaluación del mejor interés del niño.' },
      { name: 'Richard Gardner (crítica)', contribution: 'SAP — concepto controvertido, no avalado por APA ni AACAP.' },
      { name: 'Janet Johnston', contribution: 'Alto conflicto familiar y resistencia/rechazo del NNyA al contacto.' },
      { name: 'APA Guidelines 2010', contribution: 'Pautas para evaluación psicológica en disputas de custodia.' },
    ],
    lauraContext:
      'El profesional consulta sobre régimen comunicacional bajo el CCyC argentino. Orientá desde el principio del interés superior del niño, teoría del apego y diferenciación entre rechazo justificado y obstaculización. Recordá que el SAP no está avalado científicamente.',
  },
  {
    id: 'audience_tips',
    number: '06',
    title: 'Consejos para Audiencias Orales',
    shortTitle: 'Audiencias',
    accentHsl: '38 60% 40%', // dorado oscuro
    introduction:
      'Orientación práctica para la actuación del perito de parte y consultor técnico en audiencias orales del sistema acusatorio (Ley 12.734 Santa Fe). Cubre presentación del informe, examen directo, contraexamen, manejo del lenguaje técnico y postura ética frente al tribunal.',
    authors: [
      { name: 'Stanley Brodsky', contribution: 'Testifying in Court — manual clásico de testimonio pericial.' },
      { name: 'David Faust', contribution: 'The Limits of Expert Testimony. Crítica epistemológica del peritaje.' },
      { name: 'Paul Ekman', contribution: 'Detección de la mentira y comunicación no verbal en contexto judicial.' },
      { name: 'Giselle Salas Calvo', contribution: 'Psicología del testimonio y declaración pericial — Latinoamérica.' },
      { name: 'Jorge Folino', contribution: 'Práctica pericial en tribunales argentinos.' },
      { name: 'MPA / SPPDP Santa Fe', contribution: 'Lineamientos del sistema acusatorio provincial.' },
    ],
    lauraContext:
      'El profesional se prepara para una audiencia oral en Santa Fe (Ley 12.734). Orientá sobre presentación del informe, manejo del contraexamen, lenguaje accesible y límites éticos del testimonio pericial (Brodsky, Faust).',
  },
  {
    id: 'bibliography',
    number: '07',
    title: 'Bibliografía Recomendada',
    shortTitle: 'Bibliografía',
    accentHsl: '316 67% 32%', // magenta oscuro
    introduction:
      'Selección bibliográfica organizada por área temática: psicología forense general, evaluación del daño, abuso sexual infantil, violencia de género, derecho de familia y testimonio pericial. Incluye referentes argentinos, latinoamericanos y anglosajones de acceso abierto y editorial.',
    authors: [
      { name: 'Jorge Folino', contribution: 'Psiquiatría y psicología forense en Argentina — referencia regional.' },
      { name: 'Mariano Castex', contribution: 'Daño psíquico en el ámbito civil y penal argentino.' },
      { name: 'Enrique Echeburúa', contribution: 'Tratado de evaluación del daño psicológico (Pirámide).' },
      { name: 'Irene Intebi', contribution: 'Abuso sexual infantil — Granica, varias ediciones.' },
      { name: 'Bessel van der Kolk', contribution: 'El cuerpo lleva la cuenta — neurobiología del trauma.' },
      { name: 'Marisa Herrera', contribution: 'Manual de Derecho de las Familias — CCyC argentino.' },
      { name: 'Papeles del Psicólogo (COP)', contribution: 'Revista de acceso abierto — psicología forense.' },
      { name: 'Anuario de Psicología Jurídica', contribution: 'Revista científica iberoamericana.' },
    ],
    lauraContext:
      'El profesional busca bibliografía de referencia en psicología forense. Sugerí lecturas según el subtema (daño, ASI, violencia de género, derecho de familia) priorizando autores argentinos (Folino, Castex, Intebi, Herrera) y revistas de acceso abierto.',
  },
  {
    id: 'informed_consent',
    number: '08',
    title: 'Consentimiento Informado',
    shortTitle: 'Consentimiento',
    accentHsl: '208 75% 37%', // azul
    introduction:
      'Marco legal argentino (Ley 26.529 de Derechos del Paciente, Ley 26.657 de Salud Mental, Código de Ética FePRA) y modelos diferenciados de consentimiento informado: clínico, pericial, supervisión, NNyA, terceros (obras sociales). Punto crítico: el consentimiento pericial NO es el mismo que el clínico — el peritado debe saber que el informe va al tribunal.',
    authors: [
      { name: 'Ley 26.529 (Argentina)', contribution: 'Derechos del Paciente, Historia Clínica y Consentimiento Informado.' },
      { name: 'Ley 26.657 (Argentina)', contribution: 'Salud Mental — consentimiento y autonomía del paciente.' },
      { name: 'Código de Ética FePRA', contribution: 'Federación de Psicólogos de la República Argentina.' },
      { name: 'Código de Ética COP Santa Fe', contribution: 'Colegio de Psicólogos de Santa Fe — normativa provincial.' },
      { name: 'CCyC Arts. 26, 595, 639', contribution: 'Capacidad progresiva de NNyA y consentimiento.' },
      { name: 'APA Ethical Principles', contribution: 'Estándares internacionales sobre consentimiento informado.' },
    ],
    lauraContext:
      'El profesional necesita orientación sobre consentimiento informado. Diferenciá según contexto: clínico (Ley 26.529), pericial (con aclaración de destino judicial del informe), NNyA (firma de ambos progenitores en divorcio conflictivo), supervisión y terceros. Citá FePRA y CCyC.',
  },
  {
    id: 'report_models',
    number: '09',
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
