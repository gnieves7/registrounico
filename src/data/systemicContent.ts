// ============================================================
// CONTENIDO CLÍNICO COMPLETO — ENFOQUE SISTÉMICO
// Sistema Reflexionar · .PSI. · 2026
// ============================================================

import type { SectionAuthor, SectionExercise, HumanisticSection } from './humanisticContent';

// Re-export the shared types so consumers can use them
export type SystemicSection = HumanisticSection;

// ─── MARCO EPISTEMOLÓGICO ───────────────────────────────────
export const SYSTEMIC_EPISTEMOLOGY = {
  title: 'Las tres generaciones de la Terapia Sistémica',
  generations: [
    {
      name: 'Primera Generación — Cibernética de primer orden (1950-1970)',
      principle: 'El observador está fuera del sistema',
      authors: 'Bertalanffy, Wiener, Bateson, Jackson, Haley',
      concepts: [
        'No-sumatividad: el todo es cualitativamente diferente a la suma de sus partes',
        'Equifinalidad: sistemas distintos pueden llegar al mismo estado final desde condiciones iniciales diferentes',
        'Retroalimentación negativa (homeostática) y positiva (amplificadora)',
        'Doble vínculo: mensajes contradictorios en distintos niveles lógicos sin posibilidad de metacomunicar',
        'Homeostasis familiar: el síntoma cumple una función homeostática en el sistema',
        'Jerarquías disfuncionales: el síntoma emerge cuando las fronteras de poder están confundidas',
      ],
    },
    {
      name: 'Segunda Generación — Cibernética de segundo orden (1970-1990)',
      principle: 'El observador forma parte del sistema que observa',
      authors: 'Von Glasersfeld, Maturana, Varela, Von Foerster, Watzlawick, Minuchin, Satir, Selvini Palazzoli',
      concepts: [
        'Constructivismo: la realidad no se descubre — se construye',
        'Autopoiesis: los sistemas vivientes se producen y reproducen a sí mismos continuamente',
        'El terapeuta no repara — perturba al sistema para que genere sus propias soluciones',
        'Cinco axiomas de la comunicación (Watzlawick): es imposible no comunicar; contenido y relación; puntuación; digital y analógico; simetría y complementariedad',
        'Cambio 1 (dentro del sistema) vs. Cambio 2 (del sistema mismo)',
      ],
    },
    {
      name: 'Tercera Generación — Posmodernismo y narrativa (1990-presente)',
      principle: 'La realidad se construye en el lenguaje',
      authors: 'Gergen, White, Epston, Anderson, Goolishian, Andersen',
      concepts: [
        'Construccionismo social: la realidad se construye intersubjetivamente en el lenguaje',
        'Externalización del problema: el problema no es la persona — el problema es el problema',
        'Historia dominante vs. historia alternativa: amplificar excepciones',
        'Postura del no-saber (not-knowing): el terapeuta es socio conversacional genuinamente curioso',
        'Equipo reflexivo: multiplicar perspectivas sin imponer ninguna como verdad',
      ],
    },
  ],
};

// ─── EMOCIONES SISTÉMICAS (Clima relacional — Gottman) ─────
export const SYSTEMIC_RELATIONAL_EMOTIONS = {
  positivas: [
    { emoji: '🤝', label: 'Conexión', description: 'Intercambio positivo genuino entre miembros del sistema' },
    { emoji: '🛡️', label: 'Apoyo', description: 'El sistema contiene y sostiene a sus miembros' },
    { emoji: '🔄', label: 'Reparación', description: 'Intento de reconexión después de un momento difícil' },
    { emoji: '👂', label: 'Escucha', description: 'Comunicación congruente donde todos se sienten oídos' },
    { emoji: '🌱', label: 'Crecimiento', description: 'El sistema permite la diferenciación y autonomía' },
  ],
  negativas_gottman: [
    { emoji: '⚔️', label: 'Crítica', description: 'Atacar el carácter del otro en lugar de expresar queja' },
    { emoji: '😤', label: 'Desprecio', description: 'Superioridad, sarcasmo, falta de respeto — predictor más poderoso de ruptura' },
    { emoji: '🛡️', label: 'Actitud defensiva', description: 'Contraatacar en lugar de escuchar — impide la reparación' },
    { emoji: '🧱', label: 'Muro de piedra', description: 'Retiro emocional de la interacción — respuesta a inundación' },
  ],
  estilos_satir: [
    { emoji: '🙇', label: 'Aplacador', description: 'Cede para evitar conflicto. Mensaje: yo no cuento' },
    { emoji: '👊', label: 'Culpador', description: 'Acusa y domina. Mensaje: vos no contás' },
    { emoji: '🧊', label: 'Calculador', description: 'Intelectualiza para no sentir. Mensaje: nada cuenta excepto los hechos' },
    { emoji: '🤹', label: 'Distractor', description: 'Desvía, bromea, cambia de tema. Mensaje: nada cuenta' },
    { emoji: '✨', label: 'Congruente', description: 'Integra mensaje verbal, emocional y corporal en coherencia' },
  ],
};

// ─── SECCIONES CLÍNICAS ────────────────────────────────────

export const SYSTEMIC_SECTIONS: SystemicSection[] = [
  // ── SECCIÓN 1: Historia del Sistema ──
  {
    id: 'systemic_history',
    menuId: 'history',
    title: 'Historia del Sistema',
    subtitle: 'Genograma, ciclo vital y patrones multigeneracionales',
    quote: 'El individuo que vemos es siempre un fragmento del contexto.',
    quoteAuthor: 'Salvador Minuchin',
    authors: [
      {
        name: 'Murray Bowen',
        years: '1913-1990',
        bio: 'Desarrolló la teoría de los sistemas familiares con los conceptos de diferenciación del self, transmisión multigeneracional y triángulos.',
        keyContributions: ['Diferenciación del self', 'Transmisión multigeneracional', 'Triángulos', 'Proceso de proyección familiar'],
      },
      {
        name: 'Monica McGoldrick',
        years: '1943-',
        bio: 'Creadora del genograma como instrumento clínico sistémico. Mapa visual de al menos tres generaciones.',
        keyContributions: ['Genograma', 'Ciclo vital familiar', 'Genograma cultural'],
      },
      {
        name: 'Salvador Minuchin',
        years: '1921-2017',
        bio: 'Fundador de la terapia estructural. La estructura familiar determina el funcionamiento de sus miembros.',
        keyContributions: ['Subsistemas', 'Fronteras claras/difusas/rígidas', 'Alineaciones y coaliciones', 'Jerarquía'],
      },
    ],
    theoreticalSummary: 'La historia del sistema no es la suma de las biografías individuales — es el mapa de las pautas relacionales que se transmiten entre generaciones. El genograma (McGoldrick) permite visualizar triángulos, cortes emocionales, lealtades invisibles (Nagy) y recursos transmitidos. La diferenciación del self (Bowen) marca la capacidad de mantener identidad propia bajo presión relacional.',
    exercises: [
      {
        id: 'genogram',
        title: 'Genograma Interactivo (McGoldrick / Bowen)',
        instruction: 'Vamos a mapear tu familia a lo largo de al menos tres generaciones. Esto nos ayuda a ver patrones que se repiten, recursos que se transmiten y contextos que explican muchas cosas que parecen individuales.',
        fields: [
          { id: 'grandparents_paternal', label: 'Abuelos paternos — nombres, años, ocupaciones, notas', type: 'textarea', placeholder: 'Abuelo paterno, abuela paterna, relación entre ellos...' },
          { id: 'grandparents_maternal', label: 'Abuelos maternos — nombres, años, ocupaciones, notas', type: 'textarea', placeholder: 'Abuelo materno, abuela materna, relación entre ellos...' },
          { id: 'parents', label: 'Padres — datos, relación parental, hermanos de cada uno', type: 'textarea', placeholder: 'Padre, madre, tipo de relación, hermanos/as de cada uno...' },
          { id: 'consultant_family', label: 'Tu familia actual — hermanos, pareja, hijos', type: 'textarea', placeholder: 'Tus hermanos/as, pareja actual, hijos/as...' },
          { id: 'significant_relationships', label: 'Relaciones significativas entre díadas', type: 'textarea', placeholder: 'Cercana, conflictiva, distante, cortada, fusionada, triangulada con...' },
        ],
      },
      {
        id: 'family_lifecycle',
        title: 'Ciclo Vital Familiar (Carter & McGoldrick)',
        instruction: '¿En qué etapa del ciclo vital se encuentra tu sistema familiar ahora?',
        fields: [
          {
            id: 'lifecycle_stage',
            label: 'Etapa actual del sistema',
            type: 'select',
            options: [
              'Joven adulto que se independiza',
              'Formación de pareja',
              'Familia con hijos pequeños (0-6 años)',
              'Familia con hijos en edad escolar / adolescentes',
              'Familia con hijos que se van (nido vacío)',
              'Familia en la vejez',
            ],
          },
          { id: 'lifecycle_crisis', label: '¿Cómo vivís esa transición? ¿Qué crisis central observás?', type: 'textarea', placeholder: 'Describí cómo el sistema está transitando esta etapa...' },
          { id: 'pending_transitions', label: '¿Hay alguna transición no completada? (separación no elaborada, duelo pendiente, independización no lograda)', type: 'textarea' },
        ],
      },
      {
        id: 'multigenerational_patterns',
        title: 'Patrones Multigeneracionales (Bowen)',
        instruction: '¿Hay patrones que reconozcas en más de una generación de tu familia?',
        fields: [
          {
            id: 'repeated_roles',
            label: 'Roles que se repiten',
            type: 'checkbox',
            options: ['El que cuida', 'El que enferma', 'El que triunfa', 'El que fracasa', 'El ausente', 'El mediador', 'El chivo expiatorio', 'El favorito'],
          },
          { id: 'roles_generations', label: '¿En qué generaciones aparece cada rol?', type: 'textarea' },
          {
            id: 'repeated_symptoms',
            label: 'Síntomas que se repiten',
            type: 'checkbox',
            options: ['Depresión', 'Alcoholismo', 'Violencia', 'Abandono', 'Enfermedad crónica', 'Suicidio', 'Fracaso económico reiterado'],
          },
          { id: 'emotional_cutoffs', label: 'Cortes emocionales — personas "borradas" de la historia familiar', type: 'textarea' },
          { id: 'invisible_loyalties', label: 'Lealtades invisibles (Nagy) — ¿hay algo que debés a tu familia que te impide avanzar?', type: 'textarea' },
          { id: 'transmitted_resources', label: 'Recursos transmitidos — fortalezas, valores, capacidades heredadas', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 2: Ejercicios Relacionales ──
  {
    id: 'systemic_exercises',
    menuId: 'training',
    title: 'Ejercicios Relacionales',
    subtitle: 'Comunicación, preguntas circulares y externalización',
    quote: 'El problema está entre las personas, no dentro de ellas.',
    quoteAuthor: 'Gregory Bateson',
    authors: [
      {
        name: 'Virginia Satir',
        years: '1916-1988',
        bio: 'Identificó cuatro estilos comunicacionales disfuncionales (aplacador, culpador, calculador, distractor) y el quinto: comunicación congruente.',
        keyContributions: ['Estilos comunicacionales', 'Autoestima familiar', 'Comunicación congruente'],
      },
      {
        name: 'Karl Tomm',
        years: '1943-',
        bio: 'Sistematizó las preguntas circulares en cuatro tipos: lineales, circulares, estratégicas y reflexivas.',
        keyContributions: ['Interrogatorio circular', 'Preguntas reflexivas', 'Preguntas estratégicas'],
      },
      {
        name: 'Michael White & David Epston',
        years: '1948-2008 / 1944-',
        bio: 'Creadores de la terapia narrativa. El problema no es la persona — el problema es el problema.',
        keyContributions: ['Externalización del problema', 'Historia dominante vs. alternativa', 'Documentos terapéuticos'],
      },
    ],
    theoreticalSummary: 'Los ejercicios relacionales exploran la comunicación (Satir), las conexiones circulares (Tomm/Selvini Palazzoli) y la externalización del problema (White & Epston). No buscan cambiar conductas individuales sino pautas interaccionales.',
    exercises: [
      {
        id: 'communication_map',
        title: 'Mapa de Comunicación (Satir)',
        instruction: 'Pensá en una situación de conflicto reciente en tu sistema (familia, pareja, trabajo).',
        fields: [
          { id: 'situation', label: '¿Qué estaba pasando? ¿Quiénes estaban involucrados?', type: 'textarea' },
          {
            id: 'comm_style',
            label: '¿Cómo respondiste? (Satir)',
            type: 'radio',
            options: ['Aplacador: cedí, concordé aunque no quería', 'Culpador: acusé, dominé, elevé el tono', 'Calculador: me volví frío/a, distancié las emociones', 'Distractor: cambié de tema, hice un chiste', 'Congruente: expresé lo que sentía con claridad y respeto'],
          },
          { id: 'implicit_message', label: '¿Qué mensaje implícito comunicaste con ese estilo?', type: 'textarea' },
          { id: 'real_message', label: '¿Qué querías comunicar realmente y no pudiste?', type: 'textarea' },
          { id: 'congruent_rewrite', label: 'Si pudieras repetirlo congruentemente: "Cuando [situación], yo siento [emoción] y necesito [necesidad]."', type: 'textarea' },
        ],
      },
      {
        id: 'circular_questions',
        title: 'Preguntas Circulares (Tomm / Selvini Palazzoli)',
        instruction: 'Las preguntas circulares te invitan a salir de tu perspectiva individual y ver el sistema desde otros ángulos.',
        fields: [
          { id: 'differences', label: '¿Quién se preocupa más por el problema actual? ¿Quién menos? ¿Qué hace cada uno?', type: 'textarea' },
          { id: 'first_reactor', label: '¿Quién reacciona primero cuando hay tensión? ¿Cómo responden los demás?', type: 'textarea' },
          { id: 'system_when_better', label: '¿Qué pasa en el sistema cuando vos mejorás? ¿Qué cambia para los demás?', type: 'textarea' },
          { id: 'system_needs', label: '¿Qué necesitaría cambiar en el sistema para que el problema fuera innecesario?', type: 'textarea' },
          { id: 'other_perspective', label: '¿Cómo cree [persona] que vos ves esta situación? ¿Y cómo cree que [otro] la ve?', type: 'textarea' },
          { id: 'temporal', label: 'Si este patrón continúa cinco años más, ¿cómo estará el sistema?', type: 'textarea' },
        ],
      },
      {
        id: 'externalization',
        title: 'Externalización del Problema (White & Epston)',
        instruction: 'Vamos a separarte del problema. El problema no sos vos. Es algo que tiene influencia sobre vos y sobre el sistema — pero esa influencia no es total.',
        fields: [
          { id: 'problem_name', label: '¿Cómo llamarías al problema si fuera una entidad separada de vos?', type: 'text', placeholder: 'Ej: "La Angustia", "El Control", "El Silencio"' },
          { id: 'effects_self', label: '¿Cómo afecta [nombre del problema] a tu vida y relaciones?', type: 'textarea' },
          { id: 'effects_others', label: '¿Cómo afecta a las personas cercanas a vos?', type: 'textarea' },
          { id: 'problem_history', label: '¿Cuándo llegó a tu vida? ¿Qué lo invitó a quedarse?', type: 'textarea' },
          { id: 'exceptions', label: '¿Hay momentos en que tiene menos influencia? ¿Qué hacés diferente?', type: 'textarea' },
          { id: 'what_exceptions_say', label: '¿Qué dice sobre vos haber podido reducir su influencia en esos momentos?', type: 'textarea' },
          { id: 'preferred_stance', label: '¿Qué relación preferirías tener con [nombre del problema]?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 3: Clima Relacional ──
  {
    id: 'systemic_climate',
    menuId: 'emotional',
    title: 'Clima Relacional',
    subtitle: 'Los Cuatro Jinetes, reparación e inundación emocional',
    quote: 'Las familias no se rompen por los conflictos — se rompen por la falta de reparación.',
    quoteAuthor: 'John Gottman',
    authors: [
      {
        name: 'John Gottman',
        years: '1942-',
        bio: 'Investigador empírico más importante en dinámicas relacionales. Identificó los Cuatro Jinetes del Apocalipsis y el índice 5:1.',
        keyContributions: ['Los Cuatro Jinetes', 'Índice 5:1', 'Flooding (inundación emocional)', 'Reparación relacional'],
      },
      {
        name: 'Ivan Boszormenyi-Nagy',
        years: '1920-2007',
        bio: 'Introdujo la dimensión ética en el análisis sistémico con el concepto de lealtades invisibles y libro mayor relacional.',
        keyContributions: ['Lealtades invisibles', 'Libro mayor relacional', 'Terapia contextual'],
      },
    ],
    theoreticalSummary: 'El clima relacional se mide en interacciones, no en individuos. Gottman demostró que la ratio 5:1 (positivas/negativas) predice estabilidad. Los Cuatro Jinetes (crítica, desprecio, actitud defensiva, muro de piedra) predicen ruptura. La reparación — no la ausencia de conflicto — define las relaciones funcionales.',
    exercises: [
      {
        id: 'relational_climate',
        title: 'Registro del Clima Relacional',
        instruction: 'Registrá el estado de tu sistema relacional hoy — no tu estado individual.',
        fields: [
          {
            id: 'reference_system',
            label: '¿Sobre qué sistema estás registrando?',
            type: 'select',
            options: ['Pareja', 'Familia de origen', 'Familia actual', 'Relación con hijo/a', 'Sistema laboral'],
          },
          { id: 'temperature', label: 'Temperatura relacional hoy', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Muy frío / distante', scaleMaxLabel: 'Cálido / conectado' },
          { id: 'positive_exchanges', label: '¿Cuántos intercambios positivos hubo hoy?', type: 'text', placeholder: 'Número aproximado' },
          { id: 'negative_exchanges', label: '¿Cuántos intercambios negativos hubo?', type: 'text', placeholder: 'Número aproximado' },
          {
            id: 'four_horsemen',
            label: '¿Apareció alguno de los Cuatro Jinetes? (Gottman)',
            type: 'checkbox',
            options: ['Crítica al carácter', 'Desprecio / sarcasmo', 'Actitud defensiva', 'Muro de piedra / retirada'],
          },
          { id: 'horsemen_description', label: 'Descripción breve del episodio', type: 'textarea' },
          { id: 'flooding', label: '¿Hubo inundación emocional (flooding)?', type: 'radio', options: ['Sí', 'No'] },
          { id: 'flooding_trigger', label: 'Si sí, ¿qué lo disparó?', type: 'textarea' },
          { id: 'repair_attempt', label: '¿Se produjo alguna reparación?', type: 'radio', options: ['Sí', 'No'] },
          { id: 'repair_description', label: '¿Cómo fue? ¿O qué lo impidió?', type: 'textarea' },
          { id: 'observed_pattern', label: '¿Hubo una secuencia repetida (yo hago X → él/ella hace Y → yo hago Z)?', type: 'textarea' },
          { id: 'system_need', label: '¿Qué necesita el sistema en este momento? (no solo vos)', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 4: Registro de Pautas ──
  {
    id: 'systemic_patterns',
    menuId: 'unconscious',
    title: 'Registro de Pautas',
    subtitle: 'Secuencias relacionales, puntuación circular y excepciones',
    quote: 'No busques el origen del problema. Buscá la pauta que lo mantiene.',
    quoteAuthor: 'Paul Watzlawick',
    authors: [
      {
        name: 'Gregory Bateson',
        years: '1904-1980',
        bio: 'Antropólogo y epistemólogo. "La pauta que conecta" es el nivel meta que da coherencia a las regularidades del sistema.',
        keyContributions: ['La pauta que conecta', 'Doble vínculo', 'Tipos lógicos', 'Aprendizaje deutero'],
      },
      {
        name: 'Paul Watzlawick',
        years: '1921-2007',
        bio: 'Pragmática de la comunicación humana. La puntuación de la secuencia define quién causa qué — siempre es circular.',
        keyContributions: ['Axiomas de la comunicación', 'Puntuación de la secuencia', 'Cambio 1 vs. Cambio 2'],
      },
      {
        name: 'Steve de Shazer',
        years: '1940-2005',
        bio: 'Creador de la terapia breve centrada en soluciones. La pregunta del milagro y la búsqueda de excepciones.',
        keyContributions: ['Pregunta del milagro', 'Búsqueda de excepciones', 'Escala de avance'],
      },
    ],
    theoreticalSummary: 'El registro de pautas identifica secuencias relacionales repetidas. La puntuación circular (Watzlawick) revela que el "origen" del conflicto es siempre una cuestión de perspectiva. Las excepciones (De Shazer) muestran que el sistema ya tiene recursos para operar diferente.',
    exercises: [
      {
        id: 'relational_sequence',
        title: 'Registro de Secuencia Relacional',
        instruction: 'Describí la secuencia como una danza de pasos, no como culpa de alguien.',
        fields: [
          { id: 'system_involved', label: 'Sistema involucrado', type: 'text' },
          { id: 'step1_trigger', label: 'Paso 1 — El disparador: ¿qué ocurrió primero?', type: 'textarea' },
          { id: 'step2_my_response', label: 'Paso 2 — Mi respuesta: ¿qué hice / dije / no dije?', type: 'textarea' },
          { id: 'step3_other_response', label: 'Paso 3 — La respuesta del otro: ¿cómo respondió el sistema?', type: 'textarea' },
          { id: 'step4_my_reaction', label: 'Paso 4 — Mi respuesta a la respuesta del otro', type: 'textarea' },
          { id: 'step5_outcome', label: 'Paso 5 — ¿Cómo terminó?', type: 'textarea' },
          { id: 'my_punctuation', label: 'Puntuación mía: "Hago X porque el otro hace Y"', type: 'textarea' },
          { id: 'other_punctuation', label: 'Puntuación del otro: "Hace Y porque yo hago X"', type: 'textarea' },
          { id: 'circular_view', label: '¿Qué pasaría si la secuencia fuera circular y nadie tuviera razón sobre el origen?', type: 'textarea' },
          { id: 'exception', label: 'Excepción (De Shazer): ¿hubo algún momento reciente en que esta pauta NO ocurrió?', type: 'textarea' },
          { id: 'miracle_question', label: 'Pregunta del milagro: si mañana el problema hubiera desaparecido, ¿cuál sería la primera señal pequeña?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 5: Vínculo con el Sistema ──
  {
    id: 'systemic_alliance',
    menuId: 'alliance',
    title: 'Vínculo con el Sistema',
    subtitle: 'Alianza múltiple, joining y posición del terapeuta',
    quote: 'El terapeuta no cambia a la familia — se une a ella para que pueda cambiarse a sí misma.',
    quoteAuthor: 'Salvador Minuchin',
    authors: [
      {
        name: 'William Pinsof',
        years: '1945-',
        bio: 'Amplió la alianza terapéutica al contexto sistémico: alianza individual, subsistémica y del sistema completo.',
        keyContributions: ['Alianza terapéutica sistémica', 'Coalición encubierta'],
      },
      {
        name: 'Salvador Minuchin',
        years: '1921-2017',
        bio: 'El joining (unión) es el proceso de acomodación al estilo relacional del sistema. Sin joining, toda intervención es rechazada.',
        keyContributions: ['Joining: mantenimiento, rastreo, mimetismo'],
      },
    ],
    theoreticalSummary: 'En terapia sistémica hay múltiples alianzas simultáneas (Pinsof). El terapeuta debe unirse al sistema (joining — Minuchin) antes de poder moverlo. El riesgo específico es la coalición encubierta con un miembro en detrimento de los demás.',
    exercises: [
      {
        id: 'post_session_system',
        title: 'Registro Post-Sesión del Sistema',
        instruction: 'Reflexioná sobre la sesión como sistema, no como individuo.',
        fields: [
          { id: 'participants', label: '¿Quiénes participaron en la sesión?', type: 'text' },
          { id: 'whole_system_heard', label: '¿El terapeuta pudo escuchar y comprender a todos los presentes?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Solo a algunos', scaleMaxLabel: 'Sí, a todos' },
          { id: 'system_seen', label: '¿Hubo algún momento en que sentiste que el sistema fue visto (no solo una persona)?', type: 'textarea' },
          { id: 'unsaid', label: '¿Algo del sistema quedó sin decirse?', type: 'textarea' },
          { id: 'discomfort', label: '¿Hubo algo que incomodó al sistema? (como información terapéutica)', type: 'textarea' },
          { id: 'system_takeaway', label: '¿Qué se lleva el sistema de hoy? (el sistema como totalidad)', type: 'textarea' },
          { id: 'system_scale', label: 'Escala de avance del sistema (De Shazer): 0 = peor momento, 10 = problema resuelto', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Peor momento', scaleMaxLabel: 'Problema resuelto' },
          { id: 'what_prevents_lower', label: '¿Qué hace que no estén en un número más bajo?', type: 'textarea' },
          { id: 'what_to_go_up', label: '¿Qué necesitaría pasar para subir un punto más?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 6: Línea del Sistema ──
  {
    id: 'systemic_timeline',
    menuId: 'timeline',
    title: 'Línea del Sistema',
    subtitle: 'Mapa temporal, transiciones y rituales familiares',
    quote: 'La familia es un sistema en el tiempo, no en el espacio.',
    quoteAuthor: 'Monica McGoldrick',
    authors: [
      {
        name: 'Monica McGoldrick',
        years: '1943-',
        bio: 'El ciclo vital familiar es una serie de transiciones que requieren reorganización del sistema. Las transiciones no resueltas generan nodos de estrés acumulado.',
        keyContributions: ['Ciclo vital familiar', 'Nodos de estrés acumulado', 'Genograma cultural'],
      },
      {
        name: 'Evan Imber-Black',
        years: '1948-',
        bio: 'Los rituales familiares organizan el tiempo y el sentido del sistema. Su interrupción o ausencia es clínicamente significativa.',
        keyContributions: ['Rituales de celebración', 'Rituales de transición', 'Rituales cotidianos'],
      },
    ],
    theoreticalSummary: 'La línea del sistema ubica los momentos clave no como eventos individuales sino como reorganizaciones del sistema. Las transiciones no resueltas cargan al sistema hacia el futuro. Los rituales (Imber-Black) construyen la textura del sistema familiar.',
    exercises: [
      {
        id: 'system_timeline',
        title: 'Mapa Temporal del Sistema',
        instruction: 'Ubiquemos los momentos clave del sistema en el tiempo. No solo lo que le pasó a cada individuo — lo que le pasó al sistema.',
        fields: [
          { id: 'arrivals', label: 'Llegadas de miembros al sistema (nacimientos, uniones, adopciones)', type: 'textarea' },
          { id: 'departures', label: 'Pérdidas / partidas (muertes, separaciones, emigraciones)', type: 'textarea' },
          { id: 'critical_events', label: 'Eventos críticos del sistema (crisis, rupturas, reunificaciones)', type: 'textarea' },
          { id: 'lifecycle_transitions', label: 'Transiciones de ciclo vital (casamientos, divorcios, nacimientos, migraciones)', type: 'textarea' },
          { id: 'systemic_trauma', label: 'Traumas sistémicos (duelo no elaborado, violencia, catástrofe)', type: 'textarea' },
          { id: 'migration_history', label: '¿Hubo migraciones en tu familia? ¿Qué se perdió y qué se ganó? ¿Qué quedó sin duelo?', type: 'textarea' },
          { id: 'political_history', label: '¿Hay episodios políticos/sociales (dictadura, guerra, pobreza extrema) que marcaron al sistema?', type: 'textarea' },
          { id: 'rituals_existing', label: '¿Qué rituales de celebración tiene tu sistema?', type: 'textarea' },
          { id: 'rituals_lost', label: '¿Cuáles se perdieron o se transformaron?', type: 'textarea' },
          { id: 'rituals_needed', label: '¿Hay algún ritual que el sistema necesitaría construir?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 7: Prescripciones y Rituales ──
  {
    id: 'systemic_prescriptions',
    menuId: 'tasks',
    title: 'Prescripciones y Rituales',
    subtitle: 'Prescripciones sistémicas, rituales terapéuticos y tareas narrativas',
    quote: 'El ritual crea el tiempo en que el sistema puede ser diferente.',
    quoteAuthor: 'Evan Imber-Black',
    authors: [
      {
        name: 'Mara Selvini Palazzoli',
        years: '1916-1999',
        bio: 'La prescripción no es tarea conductual — es intervención paradójica o ritual sistémico diseñado para perturbar la homeostasis.',
        keyContributions: ['Prescripción invariable', 'Ritual sistémico', 'Hipótesis sistémica'],
      },
      {
        name: 'Michael White',
        years: '1948-2008',
        bio: 'Las tareas narrativas amplifican excepciones y construyen evidencia para la historia alternativa.',
        keyContributions: ['Tareas narrativas', 'Documentos terapéuticos', 'Cartas de despedida al problema'],
      },
      {
        name: 'Steve de Shazer',
        years: '1940-2005',
        bio: 'Fórmula de primera sesión: "Observá lo que pasa en tu vida que valga la pena que continúe."',
        keyContributions: ['Tarea de primera sesión', 'Ampliar lo que funciona'],
      },
    ],
    theoreticalSummary: 'Las prescripciones sistémicas no buscan cambiar conductas individuales — perturban pautas del sistema. Los rituales terapéuticos (Imber-Black) combinan lo conocido con lo nuevo, son simbólicos pero concretos, e involucran a todo el sistema.',
    exercises: [
      {
        id: 'prescription_record',
        title: 'Prescripción / Ritual de esta Semana',
        instruction: 'Registrá la prescripción asignada y lo que observó el sistema al intentar cumplirla.',
        fields: [
          { id: 'prescription_title', label: 'Título de la prescripción', type: 'text' },
          { id: 'what_system_will_do', label: 'Lo que el sistema hará (quién, qué, cuándo, dónde)', type: 'textarea' },
          { id: 'systemic_function', label: 'Función sistémica (para el profesional): ¿qué pauta pretende perturbar?', type: 'textarea' },
          { id: 'completed', label: '¿Pudieron hacer la prescripción?', type: 'radio', options: ['Sí completamente', 'Parcialmente', 'No'] },
          { id: 'resistance', label: 'Si no: ¿qué lo impidió? (la resistencia es informativa)', type: 'textarea' },
          { id: 'unexpected_observation', label: '¿Qué observó el sistema que no esperaba?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 8: Cambios del Sistema ──
  {
    id: 'systemic_changes',
    menuId: 'rewards',
    title: 'Cambios del Sistema',
    subtitle: 'Reconocimiento de cambios, testigos externos e historia alternativa',
    quote: 'Un pequeño cambio en el sistema puede reorganizarlo todo.',
    quoteAuthor: 'Karl Tomm',
    authors: [
      {
        name: 'Karl Tomm',
        years: '1943-',
        bio: 'El cambio en sistemas es saltatorio y no proporcional. El reconocimiento consolida el cambio al hacerlo visible.',
        keyContributions: ['Cambio sistémico no lineal', 'Reconocimiento de pequeños cambios'],
      },
      {
        name: 'Michael White',
        years: '1948-2008',
        bio: 'El cambio narrativo se consolida cuando es reconocido por testigos — audiencias que dan consistencia social a la nueva historia.',
        keyContributions: ['Testigos externos', 'Historia alternativa', 'Rituales de reconocimiento'],
      },
    ],
    theoreticalSummary: 'El cambio sistémico no es lineal ni acumulativo — un pequeño cambio en un punto clave puede reorganizar todo. Reconocer y nombrar los cambios (Tomm) los consolida. Los testigos externos (White) dan consistencia social a la nueva identidad del sistema.',
    exercises: [
      {
        id: 'systemic_change_record',
        title: 'Registro de Cambio Sistémico',
        instruction: 'Registrá cualquier cambio que hayas observado en el sistema — por pequeño que sea.',
        fields: [
          {
            id: 'change_type',
            label: 'Tipo de cambio observado',
            type: 'checkbox',
            options: [
              'Una pauta relacional apareció diferente',
              'El sistema se comunicó de forma nueva',
              'Se abrió un tema que estaba cerrado',
              'Alguien hizo algo inesperadamente diferente',
              'El problema tuvo menos influencia',
              'Se recuperó o reparó un vínculo',
              'El sistema construyó algo nuevo juntos',
            ],
          },
          { id: 'change_description', label: '¿Qué pasó exactamente? ¿Quiénes estaban involucrados?', type: 'textarea' },
          { id: 'difference_from_before', label: '¿En qué es diferente a cómo era antes?', type: 'textarea' },
          { id: 'what_made_possible', label: '¿Qué hizo posible este cambio? ¿Qué recursos del sistema aparecieron?', type: 'textarea' },
          { id: 'what_change_reveals', label: '¿Qué cualidad del sistema revela este cambio que el problema había ocultado? (White)', type: 'textarea' },
          { id: 'witnesses', label: '¿Hay alguien que debería saber que esto cambió? ¿A quién le contarías?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── SECCIÓN 9: Cambio Relacional (Monitoreo) ──
  {
    id: 'systemic_monitoring',
    menuId: 'monitoring',
    title: 'Cambio Relacional',
    subtitle: 'FACES-IV, SCORE-15 y medición de cambio sistémico',
    quote: 'El cambio sistémico no se mide en individuos — se mide en relaciones.',
    quoteAuthor: 'David Olson',
    authors: [
      {
        name: 'David Olson',
        years: '1942-',
        bio: 'Desarrolló el Modelo Circumplejo con tres dimensiones: cohesión, flexibilidad y comunicación. FACES-IV evalúa el sistema en estos ejes.',
        keyContributions: ['Modelo Circumplejo', 'FACES-IV', 'Cohesión balanceada vs. desligamiento/aglutinamiento'],
      },
      {
        name: 'Peter Stratton',
        years: '',
        bio: 'Desarrolló el SCORE-15, instrumento breve específicamente diseñado para medir cambio en terapia sistémica.',
        keyContributions: ['SCORE-15', 'Fortalezas y adaptabilidad', 'Dificultades de comunicación'],
      },
    ],
    theoreticalSummary: 'Los instrumentos sistémicos no miden al individuo — miden al sistema. FACES-IV (Olson) evalúa cohesión y flexibilidad en un modelo circumplejo. SCORE-15 (Stratton) mide cambio a lo largo del proceso. La medición se aplica al inicio, mitad y final del proceso.',
    exercises: [
      {
        id: 'faces_iv_brief',
        title: 'FACES-IV — Evaluación Mensual (versión breve)',
        instruction: 'Respondé pensando en tu sistema familiar / de pareja en el último mes. 1 = Totalmente en desacuerdo · 5 = Totalmente de acuerdo.',
        fields: [
          { id: 'cohesion_close', label: 'Los miembros de mi familia se sienten cercanos entre sí', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'cohesion_support', label: 'Mi familia se apoya mutuamente en momentos difíciles', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'cohesion_enjoy', label: 'Disfrutamos de hacer cosas juntos', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'flex_problems', label: 'Podemos resolver los problemas cuando algo no funciona', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'flex_rules', label: 'Las reglas en mi familia pueden cambiar cuando es necesario', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'flex_leadership', label: 'El liderazgo en mi familia es compartido y flexible', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'disengaged_alone', label: 'Los miembros hacen las cosas por su cuenta', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'enmeshed_depend', label: 'Los miembros dependen demasiado entre sí', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'rigid_rules', label: 'Las reglas de mi familia nunca cambian', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
          { id: 'chaotic_charge', label: 'Nunca sabemos quién está a cargo en mi familia', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Totalmente en desacuerdo', scaleMaxLabel: 'Totalmente de acuerdo' },
        ],
      },
      {
        id: 'score_15',
        title: 'SCORE-15 (Stratton — adaptado)',
        instruction: 'Respondé sobre tu sistema familiar en general. 1 = Nunca · 5 = Siempre.',
        fields: [
          { id: 'sc_resolve', label: 'Podemos resolver juntos los desafíos', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_support', label: 'Nos apoyamos cuando alguien lo necesita', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_talk', label: 'Podemos hablar de lo que nos preocupa', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_hope', label: 'Tenemos esperanza de que las cosas pueden mejorar', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_trust_change', label: 'Confiamos en que el sistema puede cambiar', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_conflict', label: 'Las conversaciones difíciles terminan en conflicto sin resolución', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_taboo', label: 'Hay temas de los que no podemos hablar', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_not_heard', label: 'Sentimos que no nos escuchamos realmente', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_impact_relations', label: 'El problema afecta negativamente las relaciones', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
          { id: 'sc_stuck', label: 'El sistema se siente estancado frente al problema', type: 'scale', scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Siempre' },
        ],
      },
    ],
  },

  // ── SECCIÓN 10: Laura — Observadora del Sistema ──
  {
    id: 'systemic_laura',
    menuId: 'assistant',
    title: 'Laura — Observadora del Sistema',
    subtitle: 'Curiosidad circular, preguntas que perturban y perspectiva múltiple',
    quote: 'Hacer una pregunta ya es una intervención.',
    quoteAuthor: 'Gianfranco Cecchin',
    authors: [
      {
        name: 'Gianfranco Cecchin',
        years: '1932-2004',
        bio: 'Miembro del equipo de Milán. Reformuló la neutralidad como curiosidad: interés genuino por múltiples perspectivas sin adherirse a ninguna.',
        keyContributions: ['Curiosidad circular', 'Neutralidad como postura activa'],
      },
    ],
    theoreticalSummary: 'En el modelo sistémico, hacer una pregunta ya es una intervención. Las preguntas circulares de Laura no buscan información — perturban la puntuación lineal del sistema y abren nuevas perspectivas. Laura nunca toma partido, nunca confirma la narrativa lineal, nunca diagnostica individuos.',
    exercises: [],
  },
];

// ─── BIBLIOGRAFÍA ──────────────────────────────────────────
export const SYSTEMIC_BIBLIOGRAPHY = {
  firstGeneration: [
    'Bateson, G. (1972). Steps to an Ecology of Mind. Chandler.',
    'Bertalanffy, L. von (1968). General System Theory. George Braziller.',
    'Watzlawick, P., Beavin, J., & Jackson, D. (1967). Pragmatics of Human Communication. Norton.',
    'Watzlawick, P., Weakland, J., & Fisch, R. (1974). Change. Norton.',
    'Haley, J. (1976). Problem-Solving Therapy. Jossey-Bass.',
    'Wiener, N. (1948). Cybernetics. MIT Press.',
  ],
  secondGeneration: [
    'Maturana, H., & Varela, F. (1984). El árbol del conocimiento. Editorial Universitaria.',
    'Minuchin, S. (1974). Families and Family Therapy. Harvard University Press.',
    'Satir, V. (1964). Conjoint Family Therapy. Science and Behavior Books.',
    'Selvini Palazzoli, M. et al. (1978). Paradox and Counterparadox. Jason Aronson.',
    'Von Foerster, H. (1981). Observing Systems. Intersystems Publications.',
  ],
  thirdGeneration: [
    'Andersen, T. (1987). The reflecting team. Family Process, 26(4), 415-428.',
    'Anderson, H., & Goolishian, H. (1992). The client is the expert. In Therapy as Social Construction. Sage.',
    'De Shazer, S. (1985). Keys to Solution in Brief Therapy. Norton.',
    'White, M., & Epston, D. (1990). Narrative Means to Therapeutic Ends. Norton.',
    'White, M. (2007). Maps of Narrative Practice. Norton.',
    'Gergen, K. (1985). The social constructionist movement in modern psychology. American Psychologist.',
  ],
  instruments: [
    'Gottman, J.M. (1994). What Predicts Divorce? Lawrence Erlbaum.',
    'McGoldrick, M., & Gerson, R. (1985). Genograms in Family Assessment. Norton.',
    'Olson, D.H. (2011). FACES IV and the Circumplex Model. JMFT, 37(1), 64-80.',
    'Stratton, P. et al. (2010). SCORE-15. Journal of Family Therapy, 32(1), 46-68.',
    'Tomm, K. (1987). Interventive interviewing. Family Process, 26-27.',
    'Imber-Black, E. et al. (1988). Rituals in Families and Family Therapy. Norton.',
    'Pinsof, W.M. (1994). An integrative systems perspective on the therapeutic alliance. Wiley.',
    'Cecchin, G. (1987). Hypothesizing, circularity, and neutrality revisited. Family Process.',
  ],
  spanish: [
    'Andolfi, M. (1984). Terapia familiar. Paidós.',
    'Boszormenyi-Nagy, I. (1973/1983). Lealtades invisibles. Amorrortu.',
    'Linares, J.L. (1996). Identidad y narrativa. Paidós.',
    'Minuchin, S. (1979). Familias y terapia familiar. Gedisa.',
    'Watzlawick, P. (1976). ¿Es real la realidad? Herder.',
    'Watzlawick, P. et al. (1976). Cambio. Herder.',
  ],
};
