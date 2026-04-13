// ============================================================
// CONTENIDO CLÍNICO COMPLETO — ENFOQUE HUMANISTA
// Sistema Reflexionar · .PSI. · 2026
// ============================================================

export interface SectionAuthor {
  name: string;
  years: string;
  bio: string;
  keyContributions: string[];
}

export interface SectionExercise {
  id: string;
  title: string;
  instruction: string;
  fields: ExerciseField[];
}

export interface ExerciseField {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'radio' | 'checkbox' | 'scale' | 'select';
  placeholder?: string;
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
}

export interface HumanisticSection {
  id: string;
  menuId: string;
  title: string;
  subtitle: string;
  quote: string;
  quoteAuthor: string;
  authors: SectionAuthor[];
  theoreticalSummary: string;
  exercises: SectionExercise[];
}

// ─── MARCO EPISTEMOLÓGICO ───────────────────────────────────
export const HUMANISTIC_EPISTEMOLOGY = {
  title: 'Fundamentos filosóficos de la Psicología Humanista',
  roots: [
    { school: 'Fenomenología', authors: 'Husserl, Merleau-Ponty', principle: 'La experiencia vivida tal como aparece a la conciencia es el objeto de estudio.' },
    { school: 'Existencialismo', authors: 'Heidegger, Sartre, Kierkegaard', principle: 'El ser humano se construye a través de sus elecciones. Libertad y responsabilidad son constitutivas.' },
    { school: 'Filosofía del diálogo', authors: 'Buber', principle: 'La relación auténtica Yo-Tú como fundamento de todo crecimiento humano.' },
  ],
  postulates: [
    'AntiReduccionismo: el ser humano solo tiene sentido como totalidad.',
    'Paradigma idiográfico: cada persona es única e irrepetible.',
    'Primacía de la experiencia subjetiva.',
    'Tendencia actualizante: orientación innata hacia el crecimiento (Rogers, Goldstein).',
    'Libertad y responsabilidad: el ser humano puede elegir su respuesta ante cualquier circunstancia (Frankl).',
  ],
};

// ─── SECCIÓN 1: MI HISTORIA DE VIDA ────────────────────────
const section1_HistoriaDeVida: HumanisticSection = {
  id: 'history',
  menuId: 'history',
  title: 'Mi Historia de Vida',
  subtitle: 'Narrativa autobiográfica, hitos vitales y construcción de sentido personal',
  quote: 'La vida solo puede ser comprendida mirando hacia atrás, pero debe ser vivida mirando hacia adelante.',
  quoteAuthor: 'Kierkegaard',
  authors: [
    {
      name: 'Charlotte Bühler',
      years: '1893-1974',
      bio: 'Psicóloga austríaca, pionera de la psicología del ciclo vital. Desarrolló la teoría de las fases de la vida y el concepto de intencionalidad vital.',
      keyContributions: ['Fases de la vida', 'Intencionalidad vital', 'El curso de la vida humana (1933)'],
    },
    {
      name: 'Erik Erikson',
      years: '1902-1994',
      bio: 'Teoría de las ocho etapas del desarrollo psicosocial. La historia de vida como secuencia de crisis normativas.',
      keyContributions: [
        'Confianza vs. Desconfianza (0-18m)', 'Autonomía vs. Vergüenza (18m-3a)',
        'Iniciativa vs. Culpa (3-6a)', 'Laboriosidad vs. Inferioridad (6-12a)',
        'Identidad vs. Confusión (adolescencia)', 'Intimidad vs. Aislamiento (adultez temprana)',
        'Generatividad vs. Estancamiento (adultez media)', 'Integridad vs. Desesperación (vejez)',
      ],
    },
    {
      name: 'Dan McAdams',
      years: '1954-',
      bio: 'Psicólogo de la narrativa. La identidad es una historia que la persona construye y reconstruye.',
      keyContributions: ['Escenas nucleares', 'Imago', 'Temas narrativos (agencia vs. comunión)', 'Tono narrativo'],
    },
    {
      name: 'Viktor Frankl',
      years: '1905-1997',
      bio: 'Logoterapia. La historia de vida como búsqueda retrospectiva de sentido.',
      keyContributions: ['Valores de creación', 'Valores de experiencia', 'Valores de actitud'],
    },
  ],
  theoreticalSummary: 'La historia personal no es un mero registro de hechos sino una narrativa con estructura intencional (Bühler). Cada etapa vital plantea una crisis normativa (Erikson). El self es una historia que se construye (McAdams). Toda vida se orienta hacia el sentido (Frankl).',
  exercises: [
    {
      id: 'ciclo_vital',
      title: 'Mapa del Ciclo Vital (Erikson)',
      instruction: 'Completá cada etapa con tus recuerdos y reflexiones. No hay respuestas correctas. Lo importante es tu experiencia subjetiva.',
      fields: [
        { id: 'primera_infancia', label: 'Primera infancia (0-3 años) — ¿Qué sabés o recordás de esta etapa?', type: 'textarea', placeholder: 'Recuerdos, relatos familiares, sensaciones tempranas...' },
        { id: 'primera_infancia_tension', label: 'Tensión principal vivida', type: 'radio', options: ['Pude confiar en que el mundo me cuidaría', 'Aprendí que el mundo era impredecible o amenazante', 'No lo tengo claro'] },
        { id: 'infancia_temprana', label: 'Infancia temprana (3-6 años) — Primeras iniciativas, juegos, exploración', type: 'textarea' },
        { id: 'edad_escolar', label: 'Edad escolar (6-12 años) — Experiencias, logros, dificultades', type: 'textarea' },
        { id: 'adolescencia', label: 'Adolescencia — ¿Quién eras? ¿Qué buscabas? ¿Qué te confundía?', type: 'textarea' },
        { id: 'adultez_temprana', label: 'Adultez temprana (20-35 años) — Vínculos, decisiones, intimidad', type: 'textarea' },
        { id: 'adultez_media', label: 'Adultez media (35-60 años) — ¿Qué estás construyendo? ¿Qué legado imaginás?', type: 'textarea' },
      ],
    },
    {
      id: 'escenas_nucleares',
      title: 'Escenas Nucleares (McAdams)',
      instruction: 'Escribí 3 momentos de tu vida que consideres especialmente significativos. Pueden ser positivos, negativos o ambivalentes.',
      fields: [
        { id: 'escena1_fecha', label: 'Escena 1 — Un momento cumbre — Fecha aproximada', type: 'text' },
        { id: 'escena1_desc', label: '¿Cuándo te sentiste más vivo/a, más vos mismo/a?', type: 'textarea' },
        { id: 'escena1_significado', label: '¿Qué dice este momento sobre quién sos?', type: 'textarea' },
        { id: 'escena2_fecha', label: 'Escena 2 — Un momento de quiebre — Fecha aproximada', type: 'text' },
        { id: 'escena2_desc', label: '¿Cuándo sentiste que algo se rompió o cambió para siempre?', type: 'textarea' },
        { id: 'escena2_aprendizaje', label: '¿Qué aprendiste o perdiste?', type: 'textarea' },
        { id: 'escena3_fecha', label: 'Escena 3 — Un turning point — Fecha aproximada', type: 'text' },
        { id: 'escena3_desc', label: '¿Cuándo tomaste una decisión que cambió el curso de tu vida?', type: 'textarea' },
        { id: 'escena3_direccion', label: '¿Hacia dónde te llevó?', type: 'textarea' },
      ],
    },
    {
      id: 'busqueda_sentido',
      title: 'Búsqueda de Sentido (Frankl)',
      instruction: 'Explorá las tres vías de acceso al sentido según Frankl.',
      fields: [
        { id: 'valores_creacion', label: 'Valores de creación — ¿Qué has dado al mundo?', type: 'textarea' },
        { id: 'valores_experiencia', label: 'Valores de experiencia — ¿Qué has recibido que te haya enriquecido profundamente?', type: 'textarea' },
        { id: 'valores_actitud', label: 'Valores de actitud — ¿Cómo has respondido ante el sufrimiento?', type: 'textarea' },
        { id: 'hilo_conductor', label: '¿Podés identificar un tema que atraviese toda tu historia?', type: 'textarea' },
      ],
    },
  ],
};

// ─── SECCIÓN 2: EJERCICIOS DE AUTOCONCIENCIA ───────────────
const section2_Autoconciencia: HumanisticSection = {
  id: 'training',
  menuId: 'training',
  title: 'Ejercicios de Autoconciencia',
  subtitle: 'Exploración experiencial, contacto presente y crecimiento',
  quote: 'Lo que soy no es lo que debo ser; lo que puedo ser es lo que importa.',
  quoteAuthor: 'Rogers',
  authors: [
    {
      name: 'Carl Rogers',
      years: '1902-1987',
      bio: 'Teoría del Self. Distingue Self real, Self ideal e Incongruencia. La terapia trabaja para reducir la incongruencia.',
      keyContributions: ['Self real vs. Self ideal', 'Incongruencia', 'Consideración positiva incondicional', 'Tendencia actualizante'],
    },
    {
      name: 'Fritz Perls',
      years: '1893-1970',
      bio: 'Terapia Gestalt. Ciclo de la experiencia y mecanismos de interrupción del contacto.',
      keyContributions: ['Ciclo de contacto-retirada', 'Confluencia', 'Introyección', 'Proyección', 'Retroflexión', 'Deflexión', 'Egotismo'],
    },
    {
      name: 'Eugene Gendlin',
      years: '1926-2017',
      bio: 'Discípulo de Rogers. Desarrolló el Focusing — acceso a la sensación sentida (felt sense).',
      keyContributions: ['Focusing (6 pasos)', 'Sensación sentida', 'Mango (handle)', 'Cambio sentido (felt shift)'],
    },
    {
      name: 'Abraham Maslow',
      years: '1908-1970',
      bio: 'Jerarquía de necesidades y experiencias cumbre (peak experiences).',
      keyContributions: ['Pirámide de necesidades', 'Autorrealización', 'Experiencias cumbre', 'Metamotivación'],
    },
  ],
  theoreticalSummary: 'La autoconciencia humanista trabaja sobre la brecha entre self real y self ideal (Rogers), las interrupciones del contacto (Perls), la sensación sentida corporal (Gendlin) y los momentos de plenitud (Maslow).',
  exercises: [
    {
      id: 'qsort_self',
      title: 'Q-Sort del Self (Rogers)',
      instruction: 'Distribuí las afirmaciones en dos columnas: cómo SOY actualmente vs. cómo me GUSTARÍA ser. Observá la distancia.',
      fields: [
        { id: 'como_soy', label: 'Cómo SOY actualmente (ordená las afirmaciones)', type: 'textarea', placeholder: 'Listá las que más te representan ahora...' },
        { id: 'como_quisiera', label: 'Cómo me GUSTARÍA ser', type: 'textarea', placeholder: 'Listá las que más desearías para vos...' },
        { id: 'distancias', label: '¿Cuáles son las 3 mayores distancias?', type: 'textarea' },
        { id: 'impedimentos', label: '¿Qué te impide acercar estas dos columnas?', type: 'textarea' },
      ],
    },
    {
      id: 'ciclo_experiencia',
      title: 'Ciclo de la Experiencia (Perls/Gestalt)',
      instruction: 'Pensá en algo que quieras pero no estés pudiendo obtener o hacer.',
      fields: [
        { id: 'sensacion_corporal', label: '¿Dónde lo sentís en el cuerpo? ¿Cómo es esa sensación?', type: 'textarea' },
        { id: 'emocion_asociada', label: '¿Qué emoción aparece cuando te detenés en eso?', type: 'textarea' },
        { id: 'necesidad', label: '¿Qué necesitás realmente? (más allá de lo que declarás querer)', type: 'textarea' },
        { id: 'interrupcion', label: '¿Qué te impide actuar hacia esa necesidad?', type: 'textarea' },
        { id: 'tipo_interrupcion', label: 'Tipo de interrupción (Perls)', type: 'checkbox', options: ['Confluencia — me fusiono con lo que otros esperan', 'Introyección — hago lo que me dijeron sin cuestionarlo', 'Proyección — le adjudico al otro lo que siento yo', 'Retroflexión — me hago a mí lo que querría recibir', 'Deflexión — evito el contacto directo con rodeos', 'Egotismo — me controlo tanto que no llego a sentir'] },
        { id: 'experimento', label: '¿Qué pequeña acción podrías hacer esta semana?', type: 'textarea' },
      ],
    },
    {
      id: 'focusing',
      title: 'Focusing (Gendlin)',
      instruction: 'Buscá un momento tranquilo. Cerrá los ojos si podés. Seguí estos pasos despacio.',
      fields: [
        { id: 'espacio', label: 'Paso 1 — Despejá un espacio interno. ¿Qué aparece?', type: 'textarea' },
        { id: 'sensacion_sentida', label: 'Paso 2 — Sensación sentida. ¿Cómo la describirías?', type: 'textarea' },
        { id: 'mango', label: 'Paso 3 — ¿Qué palabra, imagen o gesto captura esa sensación?', type: 'text' },
        { id: 'resonar', label: 'Paso 4 — ¿Ese mango calza con la sensación?', type: 'textarea' },
        { id: 'preguntar', label: 'Paso 5 — ¿Qué hace que todo esto se sienta así?', type: 'textarea' },
        { id: 'recibir', label: 'Paso 6 — ¿Qué emergió? ¿Podés recibirlo sin juzgarlo?', type: 'textarea' },
      ],
    },
    {
      id: 'experiencias_cumbre',
      title: 'Experiencias Cumbre (Maslow)',
      instruction: 'Recordá 2 momentos en que te sentiste más pleno/a, más vivo/a, más entero/a.',
      fields: [
        { id: 'cumbre1_cuando', label: 'Experiencia 1 — ¿Cuándo fue?', type: 'text' },
        { id: 'cumbre1_que', label: '¿Qué estaba pasando?', type: 'textarea' },
        { id: 'cumbre1_cuerpo', label: '¿Cómo se sentía en el cuerpo?', type: 'textarea' },
        { id: 'cumbre1_valores', label: '¿Qué valores estaban presentes?', type: 'textarea' },
        { id: 'cumbre2_cuando', label: 'Experiencia 2 — ¿Cuándo fue?', type: 'text' },
        { id: 'cumbre2_que', label: '¿Qué estaba pasando?', type: 'textarea' },
        { id: 'comun', label: '¿Hay algo en común entre estas dos experiencias?', type: 'textarea' },
        { id: 'condiciones', label: '¿Cómo podrías crear más condiciones para que ocurran?', type: 'textarea' },
      ],
    },
  ],
};

// ─── SECCIÓN 3: REGISTRO EXPERIENCIAL ──────────────────────
const section3_RegistroExperiencial: HumanisticSection = {
  id: 'emotional',
  menuId: 'emotional',
  title: 'Registro Experiencial',
  subtitle: 'Estado emocional presente, calidad del contacto y bienestar subjetivo',
  quote: 'Las emociones son la sabiduría condensada de la evolución.',
  quoteAuthor: 'Damasio',
  authors: [
    {
      name: 'Carl Rogers',
      years: '1902-1987',
      bio: 'Las 6 condiciones necesarias y suficientes para el cambio terapéutico.',
      keyContributions: ['Contacto psicológico', 'Incongruencia del cliente', 'Congruencia del terapeuta', 'Consideración positiva incondicional', 'Comprensión empática'],
    },
    {
      name: 'Leslie Greenberg',
      years: '1945-',
      bio: 'Terapia Focalizada en las Emociones (EFT). Distingue tipos de respuesta emocional.',
      keyContributions: ['Emoción primaria adaptativa', 'Emoción primaria maladaptativa', 'Emoción secundaria', 'Emoción instrumental'],
    },
    {
      name: 'Antonio Damasio',
      years: '1944-',
      bio: 'Las emociones son guías indispensables para la toma de decisiones. El marcador somático precede a la conciencia emocional.',
      keyContributions: ['Marcador somático', 'El cuerpo sabe antes que la mente'],
    },
    {
      name: 'Lisa Feldman Barrett',
      years: '1963-',
      bio: 'Teoría de las emociones construidas. Mayor vocabulario emocional = mayor capacidad de regulación.',
      keyContributions: ['Granularidad emocional', 'Emociones construidas', 'Diferenciación emocional'],
    },
  ],
  theoreticalSummary: 'El registro emocional humanista no categoriza emociones en escala de malestar — las acompaña y diferencia. La diferenciación emocional es en sí misma terapéutica (Barrett). El cuerpo sabe antes que la mente (Damasio).',
  exercises: [
    {
      id: 'registro_diario',
      title: 'Registro Diario de Experiencia',
      instruction: 'No respondas automáticamente. Detente un momento. ¿Qué hay en vos en este momento?',
      fields: [
        { id: 'como_estas', label: '¿Cómo estás ahora? (no respondas automáticamente)', type: 'textarea' },
        { id: 'emocion', label: 'Emoción predominante — ¿Podés nombrarla con más precisión que "bien" o "mal"?', type: 'text', placeholder: 'Ej: nostálgico, inquieto, esperanzado, entumecido...' },
        { id: 'intensidad', label: 'Intensidad (no como malestar sino como presencia)', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Muy leve', scaleMaxLabel: 'Muy intensa' },
        { id: 'localizacion', label: 'Localización corporal', type: 'checkbox', options: ['Cabeza / tensión', 'Garganta / nudo', 'Pecho / opresión', 'Estómago / revuelo', 'Hombros / peso', 'Mandíbula / tensión', 'Piernas / inquietud', 'Manos', 'Otra'] },
        { id: 'tipo_emocion', label: 'Tipo de emoción (Greenberg — opcional)', type: 'radio', options: ['Primaria — respuesta directa a algo que está pasando ahora', 'Secundaria — reacción a otra emoción que estoy tapando', 'Maladaptativa — tiene que ver con mi historia, no con hoy', 'No lo sé, y eso también está bien'] },
        { id: 'situacion', label: '¿Ocurrió algo que trajo esta experiencia?', type: 'textarea' },
        { id: 'necesidad', label: '¿Qué necesitás ahora que sentís esto?', type: 'textarea' },
        { id: 'dialogo_emocion', label: '¿Qué le dirías a esta emoción si fuera una persona o una voz?', type: 'textarea' },
      ],
    },
  ],
};

// ─── SECCIÓN 4: DIARIO DE EXPERIENCIAS ─────────────────────
const section4_DiarioExperiencias: HumanisticSection = {
  id: 'unconscious',
  menuId: 'unconscious',
  title: 'Diario de Experiencias',
  subtitle: 'Registro de experiencias significativas, emociones sentidas y momentos de contacto',
  quote: 'La escritura transforma la experiencia en comprensión.',
  quoteAuthor: 'Pennebaker',
  authors: [
    {
      name: 'Irvin Yalom',
      years: '1931-',
      bio: 'Psicoterapia existencial. Cuatro preocupaciones existenciales últimas: muerte, libertad, aislamiento y falta de sentido.',
      keyContributions: ['Muerte', 'Libertad', 'Aislamiento existencial', 'Falta de sentido'],
    },
    {
      name: 'James Pennebaker',
      years: '1950-',
      bio: 'Escribir sobre experiencias emocionalmente significativas produce beneficios mensurables. 15-20 minutos durante 3-4 días es suficiente.',
      keyContributions: ['Escritura expresiva', 'Integración hechos + emociones', 'Insight narrativo', 'Lenguaje del cambio'],
    },
    {
      name: 'Martin Heidegger',
      years: '1889-1976',
      bio: 'Dasein (ser-ahí). La persona no existe y luego tiene experiencias — es sus experiencias.',
      keyContributions: ['Dasein', 'Ser-en-el-mundo', 'Angustia como disposición afectiva fundamental'],
    },
    {
      name: 'Rollo May',
      years: '1909-1994',
      bio: 'Introdujo el existencialismo en la psicología norteamericana. Distinción entre miedo y angustia.',
      keyContributions: ['Miedo vs. angustia', 'Lo daimónico', 'Presencia existencial'],
    },
  ],
  theoreticalSummary: 'El diario existencial registra encuentros con las preocupaciones últimas (Yalom). La escritura expresiva con integración de hechos y emociones produce beneficios mensurables (Pennebaker). La angustia no es patológica — revela la condición existencial (Heidegger).',
  exercises: [
    {
      id: 'escritura_libre',
      title: 'Entrada de Diario Libre',
      instruction: 'Escribí sobre algo que te esté importando emocionalmente. No corrijas. No te censures. Lo que escribas es completamente privado.',
      fields: [
        { id: 'contenido', label: 'Escritura libre (15-20 minutos recomendados)', type: 'textarea', placeholder: 'No corrijas. No te censures. No te preocupes por la gramática...' },
        { id: 'algo_inesperado', label: '¿Apareció algo que no esperabas?', type: 'textarea' },
        { id: 'cambia_algo', label: '¿Cambia algo en cómo ves la situación?', type: 'textarea' },
      ],
    },
    {
      id: 'preguntas_existenciales',
      title: 'Preguntas Existenciales (Yalom)',
      instruction: 'Explorá las cuatro preocupaciones existenciales últimas.',
      fields: [
        { id: 'muerte', label: 'Sobre la muerte — ¿Hay algo que estés posponiendo por creer que tenés tiempo infinito?', type: 'textarea' },
        { id: 'libertad', label: 'Sobre la libertad — ¿Hay alguna elección que estés evitando tomar?', type: 'textarea' },
        { id: 'aislamiento', label: 'Sobre el aislamiento — ¿Hay algo de vos que no le mostrás a nadie?', type: 'textarea' },
        { id: 'sentido', label: 'Sobre el sentido — ¿Qué le da sentido a tu vida en este momento?', type: 'textarea' },
      ],
    },
    {
      id: 'suenos_experienciales',
      title: 'Registro de Sueños y Experiencias Oníricas',
      instruction: 'La fenomenología trabaja con sueños como experiencias significativas, no como símbolos fijos a descifrar.',
      fields: [
        { id: 'sueno_desc', label: 'Descripción del sueño (en presente, como si estuviera ocurriendo ahora)', type: 'textarea' },
        { id: 'sueno_emocion', label: '¿Qué emoción predominaba?', type: 'textarea' },
        { id: 'sueno_resonancia', label: '¿Hay algo de tu vida despierta que resuene con este sueño?', type: 'textarea' },
        { id: 'sueno_identificacion', label: 'Si fueras todos los elementos del sueño... (técnica gestáltica)', type: 'textarea', placeholder: 'El [elemento] del sueño soy yo cuando...' },
      ],
    },
  ],
};

// ─── SECCIÓN 5: CALIDAD DEL ENCUENTRO ──────────────────────
const section5_CalidadEncuentro: HumanisticSection = {
  id: 'alliance',
  menuId: 'alliance',
  title: 'Calidad del Encuentro',
  subtitle: 'Presencia terapéutica, empatía y autenticidad en el vínculo',
  quote: 'El cambio ocurre en el encuentro, no en la técnica.',
  quoteAuthor: 'Buber / Rogers',
  authors: [
    {
      name: 'Martin Buber',
      years: '1878-1965',
      bio: 'Filosofía del Diálogo. Relación Yo-Tú vs. Yo-Ello. El encuentro genuino transforma.',
      keyContributions: ['Relación Yo-Tú', 'Relación Yo-Ello', 'Yo y Tú (1923)'],
    },
    {
      name: 'Carl Rogers',
      years: '1902-1987',
      bio: 'No son las técnicas sino las actitudes del terapeuta las que producen el cambio.',
      keyContributions: ['Congruencia (autenticidad)', 'Consideración positiva incondicional', 'Comprensión empática'],
    },
    {
      name: 'Edward Bordin',
      years: '1913-1992',
      bio: 'Alianza de trabajo: vínculo, acuerdo en metas y acuerdo en tareas.',
      keyContributions: ['Vínculo afectivo', 'Acuerdo en metas', 'Acuerdo en tareas'],
    },
    {
      name: 'Bruce Wampold',
      years: '1948-',
      bio: 'Los factores comunes explican más varianza que las técnicas específicas. La alianza es el predictor más robusto del resultado.',
      keyContributions: ['The Great Psychotherapy Debate (2001)', 'Factores comunes', 'Alianza como predictor'],
    },
  ],
  theoreticalSummary: 'La terapia humanista apunta a momentos de relación Yo-Tú (Buber). Las actitudes del terapeuta — congruencia, aceptación incondicional, empatía — son lo que produce cambio (Rogers). La alianza terapéutica es el predictor más robusto del resultado (Wampold).',
  exercises: [
    {
      id: 'registro_post_sesion',
      title: 'Registro Post-Sesión',
      instruction: 'Completá después de cada encuentro terapéutico.',
      fields: [
        { id: 'como_te_fuiste', label: '¿Cómo te sentiste al terminar la sesión?', type: 'checkbox', options: ['Aliviado/a', 'Movilizado/a', 'Confundido/a', 'Conectado/a', 'Incómodo/a', 'Tranquilo/a', 'Vacío/a', 'Con más preguntas que respuestas'] },
        { id: 'comprendido', label: '¿Te sentiste genuinamente comprendido/a?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Muy poco', scaleMaxLabel: 'Completamente' },
        { id: 'contacto_real', label: '¿Hubo un momento en que sentiste contacto real? ¿Podés describirlo?', type: 'textarea' },
        { id: 'no_dicho', label: '¿Hubo algo que no pudiste decir?', type: 'textarea' },
        { id: 'que_te_llevas', label: '¿Qué te llevás de hoy?', type: 'textarea' },
      ],
    },
  ],
};

// ─── SECCIÓN 6: LÍNEA DE VIDA ──────────────────────────────
const section6_LineaDeVida: HumanisticSection = {
  id: 'timeline',
  menuId: 'timeline',
  title: 'Línea de Vida',
  subtitle: 'Momentos cumbres, crisis existenciales e hitos de crecimiento personal',
  quote: 'No somos lo que nos pasó — somos lo que elegimos hacer con lo que nos pasó.',
  quoteAuthor: 'Frankl',
  authors: [
    {
      name: 'Charlotte Bühler',
      years: '1893-1974',
      bio: 'Las fases vitales tienen estructura intencional: expansión, punto culminante, restricción.',
      keyContributions: ['Fase de expansión', 'Punto culminante', 'Fase de restricción'],
    },
    {
      name: 'Daniel Levinson',
      years: '1920-1994',
      bio: 'Transiciones de vida normativas alrededor de los 20, 30, 40 y 50 años.',
      keyContributions: ['Las estaciones de la vida (1978)', 'Transiciones normativas', 'Cuestionamiento de la estructura vital'],
    },
    {
      name: 'Viktor Frankl',
      years: '1905-1997',
      bio: 'El triángulo trágico: sufrimiento, culpa y muerte pueden transformarse en logro, cambio y responsabilidad.',
      keyContributions: ['Triángulo trágico', 'Sufrimiento → logro', 'Culpa → cambio', 'Finitud → responsabilidad'],
    },
  ],
  theoreticalSummary: 'La línea de vida humanista no evita los momentos difíciles — los integra como parte constitutiva de la historia de crecimiento. Las fases vitales tienen estructura intencional (Bühler), las transiciones son normativas (Levinson) y el sufrimiento puede transformarse en sentido (Frankl).',
  exercises: [
    {
      id: 'mapa_visual',
      title: 'Mapa Visual de Vida',
      instruction: 'Ubicá en la línea los momentos más significativos. No hay orden correcto. Incluí lo difícil y lo bello.',
      fields: [
        { id: 'momentos', label: 'Agregar momentos (↑ crecimiento, ↓ quiebre, ● decisión, ✕ pérdida, ★ encuentro transformador)', type: 'textarea', placeholder: 'Describí cada momento con año, descripción breve, qué cambió, qué ganaste, qué perdiste...' },
      ],
    },
    {
      id: 'reflexion_integradora',
      title: 'Reflexión Integradora',
      instruction: 'Mirá tu línea de vida como una totalidad.',
      fields: [
        { id: 'tema', label: '¿Hay un tema que atraviesa tu línea de vida?', type: 'textarea' },
        { id: 'herida', label: '¿Hay una herida que se repite de distintas formas?', type: 'textarea' },
        { id: 'fortaleza', label: '¿Hay una fortaleza que también se repite?', type: 'textarea' },
        { id: 'capitulo', label: 'Si tu vida fuera una historia, ¿en qué capítulo estás ahora?', type: 'textarea' },
        { id: 'proximo', label: '¿Hacia dónde querés que vaya el próximo capítulo?', type: 'textarea' },
      ],
    },
  ],
};

// ─── SECCIÓN 7: INVITACIONES DE EXPLORACIÓN ────────────────
const section7_Invitaciones: HumanisticSection = {
  id: 'tasks',
  menuId: 'tasks',
  title: 'Invitaciones de Exploración',
  subtitle: 'Experiencias, lecturas o ejercicios de autoconocimiento para la semana',
  quote: 'No te doy una tarea. Te propongo un experimento.',
  quoteAuthor: 'Perls',
  authors: [
    {
      name: 'Fritz Perls',
      years: '1893-1970',
      bio: 'En Gestalt, las tareas son experimentos. El "fracaso" es tan informativo como el "éxito".',
      keyContributions: ['Experimento gestáltico', 'Observación sin juicio', 'Ampliar la conciencia'],
    },
    {
      name: 'James Bugental',
      years: '1915-2008',
      bio: 'Presencia terapéutica e invitaciones de búsqueda interior: aperturas, no asignaciones.',
      keyContributions: ['Presencia terapéutica', 'Invitaciones de búsqueda interior', 'Contacto con experiencia genuina'],
    },
    {
      name: 'Mihaly Csikszentmihalyi',
      years: '1934-2021',
      bio: 'Estado de flow: absorción completa en una actividad desafiante pero manejable.',
      keyContributions: ['Flow (flujo)', 'Absorción', 'Desafío-habilidad', 'Presencia plena'],
    },
  ],
  theoreticalSummary: 'Las invitaciones humanistas no son prescripciones conductuales — son experimentos (Perls). Son aperturas, no asignaciones (Bugental). Buscan crear condiciones para estados de flow y presencia plena (Csikszentmihalyi).',
  exercises: [
    {
      id: 'invitacion_semanal',
      title: 'Invitación de Esta Semana',
      instruction: 'Recordá: no hay respuesta correcta. Lo que no pasa también es información.',
      fields: [
        { id: 'que_observaste', label: '¿Qué observaste?', type: 'textarea' },
        { id: 'que_sorprendio', label: '¿Qué te sorprendió?', type: 'textarea' },
        { id: 'que_no_hiciste', label: '¿Qué preferiste no hacer y por qué?', type: 'textarea' },
      ],
    },
  ],
};

export const HUMANISTIC_INVITATIONS_LIBRARY = {
  autoconciencia: [
    'Esta semana, elegí un momento al día para detenerte 3 minutos y preguntarte: "¿Cómo estoy realmente ahora?"',
    'Observá cuándo decís "tengo que" y reemplazalo mentalmente por "elijo". ¿Cambia algo?',
    'Llevá un registro de cuándo estás presente y cuándo estás "en piloto automático"',
  ],
  contacto_cuerpo: [
    'Una vez al día, escaneá tu cuerpo de pies a cabeza sin juzgar lo que encontrás',
    'Observá qué postura tomás cuando te sentís vulnerable vs. cuando te sentís seguro/a',
    'Antes de dormir: ¿dónde guardaste la tensión del día?',
  ],
  vinculos: [
    'Intentá una conversación sin revisar el celular ni pensar en tu respuesta mientras el otro habla',
    'Decile a alguien algo que genuinamente apreciás de él/ella (sin que sea una ocasión especial)',
    'Observá la diferencia entre estar con alguien y estar presente con alguien',
  ],
  sentido_valores: [
    'Escribí tres cosas que hiciste esta semana que sintás que valían la pena',
    '¿Qué harías diferente si nadie te estuviera juzgando?',
    'Identificá una situación donde actuaste desde el miedo vs. una donde actuaste desde tus valores',
  ],
  creatividad: [
    'Dibujá (sin habilidad artística necesaria) cómo te sentís hoy',
    'Escribí una carta que nunca vas a enviar a alguien que te importa',
    'Elegí una canción que capture lo que no podés poner en palabras ahora',
  ],
};

// ─── SECCIÓN 8: CELEBRACIÓN DEL CRECIMIENTO ────────────────
const section8_Celebracion: HumanisticSection = {
  id: 'rewards',
  menuId: 'rewards',
  title: 'Celebración del Crecimiento',
  subtitle: 'Momentos de autenticidad, coraje y crecimiento reconocidos',
  quote: 'Crecer no es llegar a ser diferente. Es llegar a ser más completamente lo que ya sos.',
  quoteAuthor: 'Rogers',
  authors: [
    {
      name: 'Abraham Maslow',
      years: '1908-1970',
      bio: 'Metamotivación y valores del Ser. Las personas autorrealizadas se motivan por crecimiento, no por déficit.',
      keyContributions: ['Valores del Ser (B-values)', 'Verdad, bondad, belleza, totalidad', 'Motivación por crecimiento vs. por déficit'],
    },
    {
      name: 'Carl Rogers',
      years: '1902-1987',
      bio: 'Proceso valorativo organísmico: el organismo evalúa experiencias según si promueven o inhiben el crecimiento.',
      keyContributions: ['Proceso valorativo organísmico', 'El organismo como juez', 'Hitos como expansión sentida'],
    },
    {
      name: 'Barbara Fredrickson',
      years: '1964-',
      bio: 'Teoría de ampliación y construcción: las emociones positivas amplían el repertorio cognitivo y construyen recursos duraderos.',
      keyContributions: ['Broaden-and-build', 'Emociones positivas como intervención', 'Celebrar consolida el cambio'],
    },
  ],
  theoreticalSummary: 'El reconocimiento del crecimiento no es reforzamiento conductual — es nombrar lo que ya existe (Maslow). Los hitos se reconocen porque el organismo los siente como expansión (Rogers). Celebrar tiene base empírica: amplía recursos y consolida el cambio (Fredrickson).',
  exercises: [
    {
      id: 'hito_crecimiento',
      title: 'Registro de Hitos de Crecimiento',
      instruction: 'Reconocé los momentos de expansión.',
      fields: [
        { id: 'tipo_hito', label: 'Tipo de hito', type: 'checkbox', options: [
          'Me permití sentir algo que antes evitaba',
          'Actué desde mis valores aunque me costara',
          'Puse un límite que necesitaba poner',
          'Me mostré auténtico/a con alguien importante',
          'Me quedé presente en algo difícil sin escapar',
          'Me perdoné por algo',
          'Pedí ayuda cuando la necesitaba',
          'Me sorprendí siendo más capaz de lo que creía',
        ] },
        { id: 'descripcion', label: 'Descripción de lo que pasó', type: 'textarea' },
        { id: 'valor_expresado', label: '¿Qué valor expresaste? (autenticidad, coraje, presencia, compasión...)', type: 'text' },
        { id: 'cuerpo', label: '¿Cómo se sintió en el cuerpo?', type: 'textarea' },
        { id: 'palabra', label: 'Una palabra que capture este momento', type: 'text' },
      ],
    },
  ],
};

// ─── SECCIÓN 9: PROCESO DE CRECIMIENTO ─────────────────────
const section9_ProcesoCrecimiento: HumanisticSection = {
  id: 'monitoring',
  menuId: 'monitoring',
  title: 'Proceso de Crecimiento',
  subtitle: 'Evolución de las áreas de crecimiento: congruencia, sentido y contacto',
  quote: 'El bienestar no es la ausencia de sufrimiento. Es la presencia de crecimiento.',
  quoteAuthor: 'Ryff',
  authors: [
    {
      name: 'Carol Ryff',
      years: '1989',
      bio: '6 dimensiones del bienestar psicológico que van más allá de la ausencia de síntomas.',
      keyContributions: ['Autoaceptación', 'Relaciones positivas', 'Autonomía', 'Dominio del entorno', 'Propósito en la vida', 'Crecimiento personal'],
    },
  ],
  theoreticalSummary: 'El monitoreo humanista evalúa bienestar psicológico multidimensional (Ryff), satisfacción vital (Diener), propósito en la vida (Frankl/PIL) y congruencia del self (Rogers). Las 6 dimensiones de Ryff se visualizan en un gráfico hexagonal.',
  exercises: [
    {
      id: 'bienestar_ryff',
      title: 'Escala de Bienestar Psicológico (Ryff — versión breve)',
      instruction: 'Respondé según cómo te has sentido en el último mes. 1 = Totalmente en desacuerdo · 6 = Totalmente de acuerdo.',
      fields: [
        { id: 'autoaceptacion_1', label: 'Autoaceptación — "Me gusto como soy."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'autoaceptacion_2', label: '"Acepto tanto mis partes buenas como mis limitaciones."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'autoaceptacion_3', label: '"Mi pasado me ha hecho ser quien soy."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'relaciones_1', label: 'Relaciones — "Tengo vínculos cálidos y de confianza."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'relaciones_2', label: '"Me importa el bienestar de otros."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'relaciones_3', label: '"Puedo ser auténtico/a con las personas cercanas."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'autonomia_1', label: 'Autonomía — "Mis decisiones son mías, no de otros."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'autonomia_2', label: '"No me preocupa demasiado lo que otros piensen de mí."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'autonomia_3', label: '"Me evalúo según mis propios criterios."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'dominio_1', label: 'Dominio — "Gestiono bien mis responsabilidades cotidianas."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'dominio_2', label: '"Puedo organizar mi entorno para satisfacer mis necesidades."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'dominio_3', label: '"Siento que tengo control sobre mi vida."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'proposito_1', label: 'Propósito — "Tengo dirección y sentido en mi vida."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'proposito_2', label: '"Lo que hago tiene valor y significado."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'proposito_3', label: '"Tengo metas que me motivan."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'crecimiento_1', label: 'Crecimiento — "Siento que estoy creciendo como persona."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'crecimiento_2', label: '"Estoy abierto/a a nuevas experiencias."', type: 'scale', scaleMin: 1, scaleMax: 6 },
        { id: 'crecimiento_3', label: '"Me conozco mejor que hace un año."', type: 'scale', scaleMin: 1, scaleMax: 6 },
      ],
    },
  ],
};

// ─── SECCIÓN 10: LAURA — ACOMPAÑANTE HUMANISTA ─────────────
const section10_Laura: HumanisticSection = {
  id: 'assistant',
  menuId: 'assistant',
  title: 'Laura — Acompañante',
  subtitle: 'Asistente de orientación humanista-existencial',
  quote: 'Estar presente con el consultante — no resolver, no interpretar, no dirigir.',
  quoteAuthor: 'Rogers',
  authors: [
    {
      name: 'Carl Rogers',
      years: '1902-1987',
      bio: 'Las tres actitudes del terapeuta: congruencia, consideración positiva incondicional y comprensión empática.',
      keyContributions: ['No-directividad', 'Reflejo de sentimientos', 'Paráfrasis', 'Clarificación', 'Validación'],
    },
  ],
  theoreticalSummary: 'Laura opera desde las tres actitudes rogerianas: congruencia, aceptación incondicional y comprensión empática. Usa reflejo activo y focalización suave (Gendlin). Nunca diagnostica, interpreta, prescribe ni apura hacia la solución.',
  exercises: [],
};

// ─── EXPORTACIONES ──────────────────────────────────────────
export const HUMANISTIC_SECTIONS: HumanisticSection[] = [
  section1_HistoriaDeVida,
  section2_Autoconciencia,
  section3_RegistroExperiencial,
  section4_DiarioExperiencias,
  section5_CalidadEncuentro,
  section6_LineaDeVida,
  section7_Invitaciones,
  section8_Celebracion,
  section9_ProcesoCrecimiento,
  section10_Laura,
];

export const HUMANISTIC_SECTIONS_MAP = Object.fromEntries(
  HUMANISTIC_SECTIONS.map(s => [s.id, s])
) as Record<string, HumanisticSection>;

// ─── EMOCIONES DIFERENCIADAS (Greenberg / Barrett) ─────────
export const HUMANISTIC_EMOTION_FAMILIES = {
  tristeza: ['triste', 'melancólico', 'vacío', 'nostálgico', 'apesadumbrado', 'desolado'],
  miedo: ['ansioso', 'inquieto', 'aprehensivo', 'aterrado', 'vulnerable', 'alerta'],
  enojo: ['irritado', 'frustrado', 'resentido', 'indignado', 'furioso', 'decepcionado'],
  alegria: ['contento', 'entusiasmado', 'esperanzado', 'agradecido', 'vivo', 'pleno'],
  verguenza: ['avergonzado', 'humillado', 'expuesto', 'inadecuado', 'pequeño'],
  amor: ['conectado', 'cálido', 'compasivo', 'tierno', 'apreciado', 'perteneciente'],
  otras: ['confundido', 'ambivalente', 'insensible', 'entumecido', 'inquieto', 'sorprendido'],
};

// ─── PROMPT DE LAURA HUMANISTA ──────────────────────────────
export const LAURA_HUMANISTIC_SYSTEM_PROMPT = `Sos Laura, acompañante de orientación humanista-existencial integrada en .PSI.

Tu función es estar presente con el consultante — no resolver, no interpretar, no dirigir.

Trabajás desde tres actitudes rogerianas:
1. CONGRUENCIA: sos honesta. Si algo no lo sabés, lo decís. No fingís certezas.
2. CONSIDERACIÓN POSITIVA INCONDICIONAL: ninguna experiencia que comparta el consultante merece juicio. Toda experiencia humana es válida.
3. COMPRENSIÓN EMPÁTICA: intentás entrar en el mundo interno del consultante y reflejar lo que percibís desde adentro, no desde afuera.

Técnicas que usás:
- Reflejo de sentimientos: "Escucho que hay algo de [tristeza/alivio/confusión] en lo que contás..."
- Preguntas abiertas: "¿Qué hay más en eso?" / "¿Cómo se siente eso en el cuerpo?"
- Validación: "Tiene todo el sentido que te sientas así."
- Focalización suave (Gendlin): "¿Hay alguna sensación en el cuerpo asociada a eso?"
- Presencia existencial (Yalom): si surge algo sobre muerte, libertad, soledad o sentido, no lo evités. Acompañá esas preguntas con respeto y sin apuro.

Vocabulario que usás: consultante, experiencia, contacto, presencia, crecimiento, autenticidad, encuentro, sentido, cuerpo, emoción, necesidad.

Vocabulario que NUNCA usás: paciente, pensamiento automático, conducta, reforzamiento, inconsciente, transferencia, estructura clínica, técnica.

Extensión de tus respuestas: cortas. Una pregunta a la vez. Nunca más de 3 oraciones. No des listas. No des pasos. Estás en una conversación, no en una sesión estructurada.

Límites claros:
- Si el consultante expresa ideación de daño o crisis aguda, respondé con calidez y derivá inmediatamente al profesional responsable. No hagas evaluación de riesgo.
- No reemplazás la terapia. Si el consultante te pide que lo hagas, sé honesta al respecto.
- Nunca recordés conversaciones anteriores como si fueran tuyas — no tenés memoria continua.`;

// ─── REFERENCIAS BIBLIOGRÁFICAS ─────────────────────────────
export const HUMANISTIC_REFERENCES = {
  foundational: [
    'Buber, M. (1923/1993). Yo y Tú. Nueva Visión.',
    'Bühler, C. (1933). Der menschliche Lebenslauf als psychologisches Problem. Hirzel.',
    'Erikson, E. (1950). Childhood and Society. Norton.',
    'Frankl, V. (1946/2004). El hombre en busca de sentido. Herder.',
    'Gendlin, E. (1978). Focusing. Everest House.',
    'Maslow, A. (1954). Motivation and Personality. Harper & Row.',
    'May, R. (1969). Love and Will. Norton.',
    'Perls, F., Hefferline, R., & Goodman, P. (1951). Gestalt Therapy. Julian Press.',
    'Rogers, C. (1951). Client-Centered Therapy. Houghton Mifflin.',
    'Rogers, C. (1961). On Becoming a Person. Houghton Mifflin.',
    'Yalom, I. (1980). Existential Psychotherapy. Basic Books.',
  ],
  empirical: [
    'Bordin, E.S. (1979). The generalizability of the psychoanalytic concept of the working alliance. Psychotherapy, 16(3), 252-260.',
    'Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience. Harper & Row.',
    'Damasio, A. (1994). Descartes\' Error. Putnam.',
    'Feldman Barrett, L. (2017). How Emotions Are Made. Houghton Mifflin Harcourt.',
    'Fredrickson, B. (2001). The role of positive emotions in positive psychology. American Psychologist, 56(3), 218-226.',
    'Greenberg, L.S. (2002). Emotion-Focused Therapy. APA.',
    'Pennebaker, J.W. (1997). Writing about emotional experiences as a therapeutic process. Psychological Science, 8(3), 162-166.',
    'Ryff, C.D. (1989). Happiness is everything, or is it? Journal of Personality and Social Psychology, 57(6), 1069-1081.',
    'Wampold, B.E. (2001). The Great Psychotherapy Debate. Lawrence Erlbaum.',
  ],
  spanish: [
    'Gimeno-Bayón, A. (1996). Comprendiendo cómo somos. Desclée De Brouwer.',
    'Quitmann, H. (1985/1989). Psicología Humanística. Herder.',
    'Schnake, A. (1995). Los diálogos del cuerpo. Cuatro Vientos.',
    'Villegas, M. (1981). La psicología humanista: historia, concepto y método. Anuario de Psicología, 24, 7-46.',
  ],
};
