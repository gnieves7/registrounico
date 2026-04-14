export type SchoolType =
  | 'psychoanalytic'
  | 'behavioral'
  | 'humanistic'
  | 'cognitive_behavioral'
  | 'systemic';

export interface SchoolTerms {
  patient: string;
  patient_plural: string;
  session: string;
  diagnosis: string;
  symptom: string;
  goal: string;
  intervention: string;
  discharge: string;
  intake: string;
  progress: string;
  referral: string;
}

export interface SchoolAuthor {
  name: string;
  works: string[];
}

export interface DiagnosticFramework {
  name: string;
  categories: string[];
  note: string;
}

export interface SchoolInstruments {
  available: string[];
  restricted: string[];
  restrictionNote: string;
  optionalNote?: string;
}

export interface EvolutionMetric {
  id: string;
  label: string;
  type: 'qualitative' | 'numeric' | 'scale' | 'scale_63' | 'scale_100' | 'percentage';
}

export interface ReportBlocks {
  diagnosticHeader: string;
  evolutionHeader: string;
  closureHeader: string;
}

export interface SchoolConfig {
  id: SchoolType;
  name: string;
  icon: string;
  color: string;
  colorSoft: string;
  terms: SchoolTerms;
  authors: SchoolAuthor[];
  diagnosticFramework: DiagnosticFramework;
  instruments: SchoolInstruments;
  suggestedGoals: string[];
  evolutionMetrics: EvolutionMetric[];
  reportBlocks: ReportBlocks;
}

export const SCHOOL_CONFIG: Record<SchoolType, SchoolConfig> = {

  psychoanalytic: {
    id: 'psychoanalytic',
    name: 'Psicoanálisis',
    icon: '🌀',
    color: '#2D2B6E',
    colorSoft: '#EEEDF8',
    terms: {
      patient: 'analizando',
      patient_plural: 'analizandos',
      session: 'sesión analítica',
      diagnosis: 'estructura clínica',
      symptom: 'formación del inconsciente',
      goal: 'objetivo de elaboración',
      intervention: 'interpretación',
      discharge: 'fin de análisis',
      intake: 'demanda',
      progress: 'proceso analítico',
      referral: 'derivación',
    },
    authors: [
      { name: 'Sigmund Freud', works: ['La interpretación de los sueños (1900)', 'Más allá del principio de placer (1920)', 'El yo y el ello (1923)', 'Inhibición, síntoma y angustia (1926)', 'Recordar, repetir y reelaborar (1914)'] },
      { name: 'Anna Freud', works: ['El yo y los mecanismos de defensa (1936)', 'Normalidad y patología en la niñez (1965)', 'Perfil metapsicológico (1962)'] },
      { name: 'Melanie Klein', works: ['El psicoanálisis de niños (1932)', 'Envidia y gratitud (1957)', 'Posición esquizo-paranoide y depresiva'] },
      { name: 'Donald Winnicott', works: ['Realidad y juego (1971)', 'El odio en la contratransferencia (1949)', 'Espacio transicional', 'Self verdadero y falso'] },
      { name: 'Heinz Kohut', works: ['Análisis del self (1971)', 'La restauración del self (1977)', 'Cómo cura el análisis (1984)'] },
      { name: 'Otto Kernberg', works: ['Trastornos graves de la personalidad (1984)', 'TFP — Terapia Focalizada en la Transferencia', 'Organización limítrofe de personalidad'] },
      { name: 'Peter Fonagy', works: ['Mentalización y desarrollo del self (2002)', 'MBT para TLP (2004)', 'Reflective Functioning Scale (1998)'] },
      { name: 'Wilfred Bion', works: ['Learning from Experience (1962)', 'Función alfa y elementos beta', 'Capacidad negativa'] },
      { name: 'Thomas Ogden', works: ['Subjects of Analysis (1994)', 'Reverie and Interpretation (1997)', 'Tercero analítico subjetivo'] },
      { name: 'Sándor Ferenczi', works: ['Confusión de lenguas (1933)', 'Técnica activa', 'Análisis mutuo'] },
      { name: 'Paula Heimann', works: ['On Countertransference (1950)'] },
      { name: 'Mark Solms', works: ['The Feeling Brain (2015)', 'Neuropsicoanálisis'] },
      { name: 'Jaak Panksepp', works: ['Affective Neuroscience (1998)', 'Siete sistemas emocionales primarios'] },
      { name: 'John Bowlby', works: ['Attachment and Loss (1969-1980)', 'Teoría del apego'] },
    ],
    diagnosticFramework: {
      name: 'Estructura clínica',
      categories: ['Neurosis histérica', 'Neurosis obsesiva', 'Fobia', 'Psicosis', 'Melancolía', 'Paranoia', 'Perversión', 'Estructura limítrofe'],
      note: 'El diagnóstico estructural coexiste con la codificación CIE-10 requerida legalmente.',
    },
    instruments: {
      available: ['TAT', 'HTP', 'Persona bajo la lluvia', 'Entrevista clínica psicoanalítica', 'Rorschach proyectivo'],
      restricted: ['MMPI-2', 'Rorschach Exner'],
      restrictionNote: 'El MMPI-2 y el Sistema Comprehensivo de Exner responden a paradigmas empiristas incompatibles con la epistemología psicoanalítica. Su uso no está recomendado desde este encuadre.',
      optionalNote: 'Si ejercés en contextos institucionales o forenses, podés activar el módulo de evaluación estandarizada de forma independiente.',
    },
    suggestedGoals: [
      'Elaboración del conflicto nuclear',
      'Levantamiento de la represión',
      'Insight genético y dinámico',
      'Fortalecimiento yoico',
      'Elaboración del duelo',
      'Trabajo sobre la escisión y proyección',
      'Construcción de la historia subjetiva',
      'Análisis de la transferencia',
    ],
    evolutionMetrics: [
      { id: 'free_association', label: 'Capacidad de asociación libre', type: 'qualitative' },
      { id: 'transference_quality', label: 'Calidad del vínculo transferencial', type: 'qualitative' },
      { id: 'insight_level', label: 'Nivel de insight alcanzado', type: 'qualitative' },
      { id: 'acting_out', label: 'Frecuencia de acting out', type: 'qualitative' },
      { id: 'dream_material', label: 'Riqueza del material onírico', type: 'qualitative' },
      { id: 'symbolization', label: 'Capacidad de simbolización', type: 'qualitative' },
    ],
    reportBlocks: {
      diagnosticHeader: 'Desde una perspectiva psicoanalítica, el material clínico sugiere una organización estructural del tipo [ESTRUCTURA], con predominio de mecanismos de defensa de orden [NIVEL]. La dinámica transferencial evidencia [DESCRIPCIÓN]. Las formaciones del inconsciente presentes incluyen [DESCRIPCIÓN].',
      evolutionHeader: 'El proceso analítico muestra [EVOLUCIÓN]. El insight alcanzado respecto a [CONFLICTO] permite observar [CAMBIO]. La calidad de la asociación libre ha [DESCRIPCIÓN].',
      closureHeader: 'Se produce el cierre del proceso analítico tras [DURACIÓN] de trabajo. El análisis permitió la elaboración de [DESCRIPCIÓN]. Se indica [RECOMENDACIÓN].',
    },
  },

  behavioral: {
    id: 'behavioral',
    name: 'Conductismo',
    icon: '📊',
    color: '#1B5E3B',
    colorSoft: '#EDF5F0',
    terms: {
      patient: 'cliente',
      patient_plural: 'clientes',
      session: 'sesión de intervención',
      diagnosis: 'análisis funcional de conducta',
      symptom: 'conducta problema',
      goal: 'conducta meta',
      intervention: 'técnica de modificación de conducta',
      discharge: 'alta por criterio de logro',
      intake: 'consulta inicial',
      progress: 'fase de intervención',
      referral: 'derivación',
    },
    authors: [
      { name: 'Ivan Pavlov', works: ['Conditioned Reflexes (1927)', 'Condicionamiento clásico: extinción, generalización, discriminación'] },
      { name: 'John B. Watson', works: ['Psychology as the Behaviorist Views It (1913)', 'Experimento del Pequeño Albert (1920)'] },
      { name: 'Mary Cover Jones', works: ['A Laboratory Study of Fear: The Case of Peter (1924)', 'Primer tratamiento conductual documentado'] },
      { name: 'Edward L. Thorndike', works: ['Ley del efecto (1898)', 'Animal Intelligence'] },
      { name: 'B.F. Skinner', works: ['Science and Human Behavior (1953)', 'Verbal Behavior (1957)', 'About Behaviorism (1974)', 'The Behavior of Organisms (1938)'] },
      { name: 'Joseph Wolpe', works: ['The Practice of Behavior Therapy (1969)', 'Desensibilización sistemática', 'SUDs'] },
      { name: 'Albert Bandura', works: ['Social Learning Theory (1977)', 'Self-Efficacy (1997)', 'Principles of Behavior Modification (1969)'] },
      { name: 'Alan Kazdin', works: ['Behavior Modification in Applied Settings', 'Single-Case Research Designs (1982)'] },
      { name: 'John O. Cooper', works: ['Applied Behavior Analysis (3ª ed., 2020)', 'Texto de referencia BCBA'] },
      { name: 'Raymond Miltenberger', works: ['Behavior Modification: Principles and Procedures (6ª ed.)', 'BST', 'Evaluación funcional'] },
      { name: 'Brian Iwata', works: ['Análisis funcional experimental (multielemento)', 'Toward a Functional Analysis of Self-Injury (1994)'] },
      { name: 'Robert Kohlenberg', works: ['Functional Analytic Psychotherapy (1991)', 'FAP: CCR1, CCR2, CCR3'] },
      { name: 'Gerald Patterson', works: ['Coercive Family Process (1982)', 'Parent Management Training'] },
      { name: 'Marsha Linehan', works: ['DBT Skills Training', 'Teoría biosocial', 'Análisis de cadena conductual'] },
      { name: 'Murray Sidman', works: ['Tactics of Scientific Research (1960)', 'Equivalencia de estímulos (1994)'] },
      { name: 'Donald Baer', works: ['Some Current Dimensions of ABA (1968)', 'Siete dimensiones del ABA'] },
      { name: 'Michelle Craske', works: ['Maximizing Exposure Therapy (2014)', 'Aprendizaje inhibitorio'] },
    ],
    diagnosticFramework: {
      name: 'Análisis funcional (ABC)',
      categories: ['Conducta mantenida por atención', 'Conducta mantenida por escape', 'Conducta mantenida por acceso tangible', 'Conducta automática/sensorial'],
      note: 'El análisis funcional complementa (no reemplaza) la codificación diagnóstica CIE-10.',
    },
    instruments: {
      available: ['MMPI-2', 'Registros conductuales ABC', 'BDI-II', 'BAI', 'HAM-A', 'HAM-D', 'SCL-90-R', 'Inventarios conductuales específicos'],
      restricted: ['Rorschach (proyectivo o Exner)', 'TAT', 'HTP'],
      restrictionNote: 'Las técnicas proyectivas carecen de validez psicométrica desde el paradigma conductual-empirista.',
    },
    suggestedGoals: [
      'Reducción de frecuencia de conducta problema',
      'Adquisición de conducta alternativa funcional',
      'Generalización a contextos naturales',
      'Mantenimiento a largo plazo (seguimiento)',
      'Extinción de respuesta condicionada',
      'Entrenamiento en habilidades sociales',
      'Exposición con prevención de respuesta',
    ],
    evolutionMetrics: [
      { id: 'behavior_frequency', label: 'Frecuencia de conducta problema (por período)', type: 'numeric' },
      { id: 'behavior_duration', label: 'Duración media de episodios (minutos)', type: 'numeric' },
      { id: 'behavior_intensity', label: 'Intensidad subjetiva (SUDs 0-100)', type: 'scale_100' },
      { id: 'target_behavior', label: 'Porcentaje de ocurrencia de conducta meta', type: 'percentage' },
      { id: 'generalization', label: 'Nivel de generalización (contextos)', type: 'qualitative' },
      { id: 'followup', label: 'Mantenimiento en seguimiento', type: 'qualitative' },
    ],
    reportBlocks: {
      diagnosticHeader: 'El análisis funcional de la conducta revela que [CONDUCTA PROBLEMA] ocurre con una frecuencia de [X] veces por [PERÍODO], bajo condiciones antecedentes de [DESCRIPCIÓN] y es mantenida por consecuentes de [DESCRIPCIÓN]. La función conductual identificada es [FUNCIÓN]. La línea de base establece una tasa de [DATO].',
      evolutionHeader: 'La comparación entre la fase de línea de base y la fase de intervención evidencia [CAMBIO]. La frecuencia de [CONDUCTA] ha [DIRECCIÓN] de [X] a [Y] por [PERÍODO]. El criterio de logro establecido [ESTADO].',
      closureHeader: 'Se procede al alta conductual habiendo alcanzado [CRITERIO DE LOGRO]. La conducta meta [DESCRIPCIÓN] se mantiene con una tasa de [DATO]. Se establece plan de seguimiento a [TIEMPO].',
    },
  },

  humanistic: {
    id: 'humanistic',
    name: 'Humanismo',
    icon: '◯',
    color: '#7A3B2E',
    colorSoft: '#F5EEEC',
    terms: {
      patient: 'consultante',
      patient_plural: 'consultantes',
      session: 'encuentro terapéutico',
      diagnosis: 'descripción fenomenológica',
      symptom: 'experiencia de malestar / bloqueo',
      goal: 'área de crecimiento',
      intervention: 'facilitación / acompañamiento',
      discharge: 'cierre del proceso',
      intake: 'primera consulta',
      progress: 'proceso de crecimiento',
      referral: 'derivación',
    },
    authors: [
      { name: 'Carl Rogers', works: ['El proceso de convertirse en persona', 'Psicoterapia centrada en el cliente'] },
      { name: 'Abraham Maslow', works: ['Motivación y personalidad', 'El hombre autorrealizado'] },
      { name: 'Fritz Perls', works: ['Gestalt Therapy', 'El enfoque Gestalt'] },
      { name: 'Irvin Yalom', works: ['Psicoterapia existencial', 'El don de la terapia'] },
      { name: 'Viktor Frankl', works: ['El hombre en busca de sentido', 'Logoterapia y análisis existencial'] },
      { name: 'Eugene Gendlin', works: ['Focusing'] },
      { name: 'Charlotte Bühler', works: ['El curso de la vida humana'] },
      { name: 'Martin Buber', works: ['Yo y Tú'] },
      { name: 'Leslie Greenberg', works: ['Emotion-Focused Therapy'] },
      { name: 'Rollo May', works: ['Love and Will', 'The Meaning of Anxiety'] },
    ],
    diagnosticFramework: {
      name: 'Conceptualización experiencial',
      categories: ['Incongruencia yo-experiencia', 'Bloqueo del contacto', 'Interrupción de ciclo de experiencia', 'Crisis existencial', 'Vacío existencial', 'Duelo no elaborado'],
      note: 'La descripción fenomenológica coexiste con la codificación CIE-10 cuando es requerida.',
    },
    instruments: {
      available: ['Escalas de Bienestar Psicológico (Ryff)', 'PIL (Purpose in Life Test)', 'SWLS (Satisfacción con la vida)', 'Registro fenomenológico de sesión', 'Q-sort rogeriano'],
      restricted: ['MMPI-2', 'Rorschach Exner'],
      restrictionNote: 'Los instrumentos psicométricos estandarizados responden a una epistemología nomotética incompatible con el paradigma idiográfico-fenomenológico.',
    },
    suggestedGoals: [
      'Ampliación de la autoconciencia',
      'Contacto con la experiencia presente',
      'Integración de aspectos rechazados del self',
      'Búsqueda y construcción de sentido vital',
      'Autenticidad en relaciones interpersonales',
      'Aceptación de la finitud y la incertidumbre',
      'Desarrollo de la autonomía personal',
    ],
    evolutionMetrics: [
      { id: 'congruence', label: 'Nivel de congruencia (Rogers)', type: 'qualitative' },
      { id: 'present_contact', label: 'Capacidad de contacto con la experiencia presente', type: 'qualitative' },
      { id: 'relations_quality', label: 'Calidad de las relaciones interpersonales', type: 'qualitative' },
      { id: 'meaning', label: 'Sentido de propósito vital (PIL)', type: 'scale' },
      { id: 'autonomy', label: 'Autonomía y autoaceptación (Ryff)', type: 'scale' },
      { id: 'self_integration', label: 'Integración de aspectos del self', type: 'qualitative' },
    ],
    reportBlocks: {
      diagnosticHeader: 'Desde una perspectiva humanista-existencial, la experiencia subjetiva de [NOMBRE] evidencia [DESCRIPCIÓN FENOMENOLÓGICA]. La narrativa personal refiere [ELEMENTOS]. La calidad del contacto consigo mismo/a y con su entorno vital muestra [DESCRIPCIÓN]. Las áreas de crecimiento identificadas son [DESCRIPCIÓN].',
      evolutionHeader: 'El proceso terapéutico evidencia [EVOLUCIÓN] en la experiencia subjetiva del/la consultante. La congruencia entre la experiencia sentida y la narrativa ha [DESCRIPCIÓN]. El contacto con el presente [DESCRIPCIÓN].',
      closureHeader: 'Se realiza el cierre del proceso terapéutico de mutuo acuerdo. El trabajo realizado ha permitido [DESCRIPCIÓN]. El/la consultante refiere [NARRATIVA DE CIERRE]. Se deja abierta la posibilidad de retomar.',
    },
  },

  cognitive_behavioral: {
    id: 'cognitive_behavioral',
    name: 'Cognitivo-Conductual',
    icon: '⬡',
    color: '#1A4A7A',
    colorSoft: '#EEF3FA',
    terms: {
      patient: 'paciente',
      patient_plural: 'pacientes',
      session: 'sesión estructurada',
      diagnosis: 'conceptualización cognitiva del caso',
      symptom: 'pensamiento automático / esquema disfuncional',
      goal: 'objetivo SMART',
      intervention: 'técnica cognitivo-conductual',
      discharge: 'alta por criterios de remisión',
      intake: 'evaluación inicial',
      progress: 'seguimiento con medición pre/post',
      referral: 'derivación',
    },
    authors: [
      { name: 'Aaron Beck', works: ['Terapia cognitiva de la depresión (1979)', 'Cognitive Therapy and the Emotional Disorders (1976)', 'Modelo cognitivo de tres niveles'] },
      { name: 'Albert Ellis', works: ['Razón y emoción en psicoterapia (1962)', 'REBT', 'Modelo ABC'] },
      { name: 'Steven Hayes', works: ['Acceptance and Commitment Therapy (1999)', 'Relational Frame Theory (2001)', 'Flexibilidad psicológica'] },
      { name: 'Marsha Linehan', works: ['DBT para TLP (1993)', 'Skills Training Manual', 'Teoría biosocial'] },
      { name: 'Donald Meichenbaum', works: ['Cognitive Behavior Modification (1977)', 'Stress Inoculation Training'] },
      { name: 'Albert Bandura', works: ['Autoeficacia (1977)', 'Aprendizaje social', 'Social Foundations of Thought and Action (1986)'] },
      { name: 'David Clark', works: ['Modelo cognitivo del pánico (1986)', 'Modelo de fobia social (1995)', 'Video-feedback'] },
      { name: 'Edna Foa', works: ['Procesamiento emocional (1986)', 'Exposición prolongada para TEPT', 'PTSD Symptom Scale'] },
      { name: 'Christine Padesky', works: ['Mind Over Mood (1995)', 'Modelo de mente positiva (2012)', 'Flecha descendente'] },
      { name: 'Paul Gilbert', works: ['The Compassionate Mind (2010)', 'CFT — Terapia focalizada en compasión'] },
      { name: 'Jeffrey Young', works: ['Terapia de Esquemas (2003)', '18 Esquemas Disfuncionales Tempranos'] },
      { name: 'Kristin Neff', works: ['Self-Compassion Scale (2003)', 'Mindful Self-Compassion (MSC)'] },
      { name: 'Jon Kabat-Zinn', works: ['MBSR (1979)', 'Full Catastrophe Living (1990)'] },
      { name: 'Keith Dobson', works: ['Handbook of Cognitive-Behavioral Therapies (5ª ed.)', 'Meta-análisis TCC para depresión (1989)'] },
      { name: 'Stefan Hofmann', works: ['Mecanismos de cambio en TCC', 'TCC-Neurociencia', 'Revaluación cognitiva'] },
    ],
    diagnosticFramework: {
      name: 'Conceptualización cognitiva (Beck)',
      categories: [
        'Creencia central de indefensión',
        'Creencia central de incompetencia',
        'Creencia central de incapacidad de ser amado',
        'Distorsión: catastrofización',
        'Distorsión: pensamiento dicotómico',
        'Distorsión: sobregeneralización',
        'Distorsión: lectura del pensamiento',
        'Distorsión: personalización',
      ],
      note: 'La conceptualización cognitiva se integra con diagnóstico DSM-5 / CIE-10.',
    },
    instruments: {
      available: ['MMPI-2', 'Rorschach Sistema Exner', 'BDI-II', 'BAI', 'HAM-A', 'HAM-D', 'SCL-90-R', 'PCL-5', 'Yale-Brown', 'Registro de pensamientos automáticos (RPD)', 'WHODAS 2.0'],
      restricted: [],
      restrictionNote: '',
    },
    suggestedGoals: [
      'Identificación de pensamientos automáticos negativos',
      'Reestructuración de creencias intermedias',
      'Modificación de creencias centrales disfuncionales',
      'Reducción de sintomatología (medida con escalas)',
      'Adquisición de habilidades de afrontamiento',
      'Exposición a estímulos evitados',
      'Prevención de recaídas',
      'Activación conductual',
    ],
    evolutionMetrics: [
      { id: 'bdi_score', label: 'BDI-II (depresión)', type: 'scale_63' },
      { id: 'bai_score', label: 'BAI (ansiedad)', type: 'scale_63' },
      { id: 'suds', label: 'SUDs — malestar subjetivo (0-100)', type: 'scale_100' },
      { id: 'belief_strength', label: 'Fuerza de creencia en pensamiento disfuncional (%)', type: 'percentage' },
      { id: 'automatic_thoughts', label: 'Frecuencia de pensamientos automáticos negativos', type: 'qualitative' },
      { id: 'gaf', label: 'Funcionamiento global (GAF)', type: 'scale_100' },
      { id: 'homework', label: 'Cumplimiento de tareas entre sesiones', type: 'percentage' },
    ],
    reportBlocks: {
      diagnosticHeader: 'La conceptualización cognitiva del caso evidencia creencias centrales del tipo [CREENCIA], activadas por situaciones de [DESCRIPCIÓN]. Los pensamientos automáticos predominantes son "[EJEMPLOS]", con distorsiones cognitivas de tipo [DISTORSIONES]. Las conductas de seguridad / evitación identificadas incluyen [DESCRIPCIÓN]. Diagnóstico CIE-10: [CÓDIGO].',
      evolutionHeader: 'La medición pre-post evidencia [CAMBIO] en las escalas administradas. El BDI-II pasó de [X] a [Y] ([INTERPRETACIÓN]). La fuerza de creencia en el pensamiento disfuncional principal descendió de [X]% a [Y]%. El cumplimiento de tareas fue de [%].',
      closureHeader: 'Se procede al alta terapéutica habiendo alcanzado criterios de remisión. BDI-II final: [PUNTUACIÓN] ([RANGO]). Se implementa plan de prevención de recaídas con sesiones de seguimiento a [TIEMPO].',
    },
  },

  systemic: {
    id: 'systemic',
    name: 'Sistémica',
    icon: '◎',
    color: '#1A5C5A',
    colorSoft: '#EDF5F5',
    terms: {
      patient: 'sistema consultante',
      patient_plural: 'sistemas consultantes',
      session: 'sesión familiar / entrevista sistémica',
      diagnosis: 'hipótesis sistémica',
      symptom: 'portador del síntoma (IP)',
      goal: 'cambio de pauta relacional',
      intervention: 'prescripción / redefinición / pregunta circular',
      discharge: 'cierre y separación del sistema',
      intake: 'consulta inicial del sistema',
      progress: 'cambio en pautas de interacción',
      referral: 'derivación',
    },
    authors: [
      { name: 'Ludwig von Bertalanffy', works: ['General System Theory'] },
      { name: 'Gregory Bateson', works: ['Pasos hacia una ecología de la mente', 'Toward a theory of schizophrenia'] },
      { name: 'Paul Watzlawick', works: ['Teoría de la comunicación humana', 'Cambio'] },
      { name: 'Salvador Minuchin', works: ['Familias y terapia familiar', 'Técnicas de terapia familiar'] },
      { name: 'Virginia Satir', works: ['Conjoint Family Therapy', 'Peoplemaking'] },
      { name: 'Mara Selvini Palazzoli', works: ['Paradoja y contraparadoja', 'Hipótesis, circularidad, neutralidad'] },
      { name: 'Murray Bowen', works: ['Family Therapy in Clinical Practice'] },
      { name: 'Michael White & David Epston', works: ['Medios narrativos para fines terapéuticos', 'Maps of Narrative Practice'] },
      { name: 'Harlene Anderson & Harold Goolishian', works: ['The client is the expert'] },
      { name: 'Tom Andersen', works: ['The reflecting team'] },
      { name: 'Steve de Shazer', works: ['Keys to Solution in Brief Therapy', 'Clues'] },
      { name: 'John Gottman', works: ['What Predicts Divorce?', 'The Seven Principles for Making Marriage Work'] },
      { name: 'Monica McGoldrick', works: ['Genograms in Family Assessment', 'The Expanded Family Life Cycle'] },
      { name: 'Karl Tomm', works: ['Interventive interviewing'] },
      { name: 'Ivan Boszormenyi-Nagy', works: ['Lealtades invisibles'] },
      { name: 'Evan Imber-Black', works: ['Rituals in Families and Family Therapy'] },
      { name: 'Gianfranco Cecchin', works: ['Hypothesizing, circularity, and neutrality revisited'] },
    ],
    diagnosticFramework: {
      name: 'Hipótesis sistémica y mapa relacional',
      categories: [
        'Sistema aglutinado (fronteras difusas)',
        'Sistema desligado (fronteras rígidas)',
        'Triangulación',
        'Coalición transgeneracional',
        'Paciente identificado / chivo expiatorio',
        'Doble vínculo',
        'Homeostasis disfuncional',
        'Escalada simétrica',
      ],
      note: 'La hipótesis sistémica orienta la intervención y coexiste con codificación CIE-10 cuando es requerida.',
    },
    instruments: {
      available: ['Genograma (McGoldrick & Gerson)', 'FACES-IV (Olson — cohesión y flexibilidad)', 'SCORE-15 (Stratton — cambio sistémico)', 'FES (Moos & Moos — clima familiar)', 'DAS (Spanier — ajuste diádico)', 'Línea de tiempo relacional', 'Escultura familiar', 'Mapa de comunicación (Satir)', 'Preguntas circulares (Tomm)'],
      restricted: ['MMPI-2', 'Rorschach'],
      restrictionNote: 'Los instrumentos de evaluación individual resultan inapropiados cuando la unidad de análisis es el sistema relacional.',
    },
    suggestedGoals: [
      'Modificación de pautas relacionales disfuncionales',
      'Clarificación y flexibilización de fronteras subsistémicas',
      'Redistribución del poder y jerarquías',
      'Construcción de nuevas narrativas relacionales (White)',
      'Diferenciación del self dentro del sistema (Bowen)',
      'Destriangulación',
      'Externalización del problema (White & Epston)',
      'Mejora de la ratio de interacciones positivas/negativas (Gottman 5:1)',
      'Resolución de lealtades invisibles (Boszormenyi-Nagy)',
      'Elaboración de transiciones del ciclo vital no resueltas (McGoldrick)',
    ],
    evolutionMetrics: [
      { id: 'communication_quality', label: 'Calidad de la comunicación familiar', type: 'qualitative' },
      { id: 'boundary_flexibility', label: 'Flexibilidad de roles y fronteras', type: 'qualitative' },
      { id: 'conflict_resolution', label: 'Capacidad de resolución de conflictos', type: 'qualitative' },
      { id: 'relational_satisfaction', label: 'Satisfacción relacional (pareja/familia)', type: 'scale' },
      { id: 'narrative_change', label: 'Narrativa de cambio construida por el sistema', type: 'qualitative' },
      { id: 'faces_cohesion', label: 'FACES-IV: Cohesión balanceada (Olson)', type: 'scale' },
      { id: 'faces_flexibility', label: 'FACES-IV: Flexibilidad balanceada (Olson)', type: 'scale' },
      { id: 'score15', label: 'SCORE-15: Cambio sistémico global (Stratton)', type: 'scale' },
      { id: 'gottman_ratio', label: 'Ratio interacciones positivas/negativas (Gottman)', type: 'qualitative' },
    ],
    reportBlocks: {
      diagnosticHeader: 'El sistema [FAMILIAR/DE PAREJA/GRUPAL] consultante presenta una organización con características [DESCRIPCIÓN ESTRUCTURAL] (Minuchin), con fronteras [TIPO] entre subsistemas. El/la paciente identificado/a [NOMBRE] cumple la función de [ROL SISTÉMICO]. Las pautas comunicacionales predominantes son [DESCRIPCIÓN].',
      evolutionHeader: 'El proceso sistémico evidencia [CAMBIO] en las pautas de interacción del sistema. La comunicación entre [MIEMBROS] ha [DESCRIPCIÓN]. Las fronteras subsistémicas muestran mayor [CARACTERÍSTICA]. El sistema ha podido [LOGRO].',
      closureHeader: 'Se produce el cierre del proceso de mutuo acuerdo con el sistema consultante. El trabajo permitió [LOGROS]. La narrativa de cambio construida por el sistema refiere [DESCRIPCIÓN]. Se deja abierta la posibilidad de nuevas consultas ante cambios en el ciclo vital familiar.',
    },
  },
};

export const SCHOOL_LIST = Object.values(SCHOOL_CONFIG);
