// ============================================================
// CONTENIDO CLÍNICO COMPLETO — ENFOQUE CONDUCTUAL
// Sistema Reflexionar · .PSI. · 2026
// ============================================================

import type { HumanisticSection, SectionAuthor, SectionExercise } from './humanisticContent';

// ─── MARCO EPISTEMOLÓGICO ───────────────────────────────────
export const BEHAVIORAL_EPISTEMOLOGY = {
  title: 'Las cuatro generaciones del conductismo',
  generations: [
    {
      name: 'Primera generación — Conductismo clásico (1890-1930)',
      principle: 'El objeto es la conducta observable. El método es el experimento controlado.',
      authors: 'Pavlov, Watson, Bechterev, Thorndike, Mary Cover Jones',
      keyIdeas: [
        'Condicionamiento clásico (Pavlov): EC-EI → RC. Extinción, recuperación espontánea, generalización, discriminación.',
        'Watson (1913): la psicología como ciencia natural de la conducta. Experimento del Pequeño Albert.',
        'Mary Cover Jones (1924): primer tratamiento conductual documentado (contracondicionamiento del caso Peter).',
        'Thorndike: ley del efecto — las respuestas seguidas de consecuencias satisfactorias se fortalecen.',
      ],
    },
    {
      name: 'Segunda generación — Conductismo radical y análisis experimental (1930-1970)',
      principle: 'El objeto es la conducta como función de sus consecuencias. El método es el análisis experimental.',
      authors: 'Skinner, Hull, Tolman',
      keyIdeas: [
        'Condicionamiento operante (Skinner): la conducta opera sobre el ambiente; las consecuencias modifican su probabilidad.',
        'Cuatro contingencias: reforzamiento positivo/negativo, castigo positivo, extinción.',
        'Programas de reforzamiento: RF, RV, IF, IV — la razón variable produce la conducta más resistente a extinción.',
        'Discriminación operante y control de estímulos: los estímulos discriminativos señalan la disponibilidad del reforzador.',
        'Conducta verbal (Skinner, 1957): mand, tact, intraverbal, ecóico.',
        'Tolman: mapas cognitivos y aprendizaje latente — puente entre conductismo y cognición.',
      ],
    },
    {
      name: 'Tercera generación — Análisis Aplicado de Conducta (1960-1990)',
      principle: 'El objeto es la conducta clínicamente significativa en contexto natural. El método es el diseño de caso único.',
      authors: 'Ayllon, Azrin, Lovaas, Baer, Wolf, Risley, Patterson, Kazdin',
      keyIdeas: [
        'Economía de fichas (Ayllon & Azrin, 1968): reforzamiento simbólico en hospital psiquiátrico.',
        'Siete dimensiones del ABA (Baer, Wolf & Risley, 1968): aplicada, conductual, analítica, tecnológica, conceptualmente sistemática, efectiva, generalizable.',
        'Trampa de coerción familiar (Patterson): modelo del desarrollo de conducta antisocial.',
        'Kazdin: significación clínica vs. estadística — lo que importa es la diferencia en la vida del paciente.',
      ],
    },
    {
      name: 'Cuarta generación — Conductismo contemporáneo y neurociencia (1990-presente)',
      principle: 'El objeto es la conducta en contexto. El método integra laboratorio y neurociencia.',
      authors: 'Jack Michael, Miltenberger, Iwata, Sidman, Barnes-Holmes',
      keyIdeas: [
        'Motivating Operations (Michael): condiciones que alteran el valor reforzante y la frecuencia de conductas.',
        'Análisis funcional experimental (Iwata): protocolo multielemento con cuatro condiciones.',
        'Equivalencia de estímulos (Sidman): relaciones emergentes no entrenadas — base de la comprensión simbólica.',
        'Relational Frame Theory (Barnes-Holmes & Hayes): marcos relacionales como habilidad central del lenguaje humano.',
      ],
    },
  ],
};

// ─── SECCIONES CLÍNICAS ────────────────────────────────────

export const BEHAVIORAL_SECTIONS: HumanisticSection[] = [

  // ── 1. HISTORIA CONDUCTUAL ──────────────────────────────
  {
    id: 'behavioral_history',
    menuId: 'history',
    title: 'Historia Conductual',
    subtitle: 'Reconstrucción de la historia de aprendizaje y los patrones conductuales actuales',
    quote: 'Toda conducta tiene una historia. Entender esa historia es el primer paso para cambiarla.',
    quoteAuthor: 'B.F. Skinner',
    theoreticalSummary:
      'La historia en el marco conductual no busca la causa original del sufrimiento — busca reconstruir la historia de aprendizaje: el conjunto de contingencias que establecieron y mantienen los patrones conductuales actuales (Haynes & O\'Brien, 2000). El modelo de la bioconducta (Bijou & Baer, 1961) propone que el desarrollo es cambio continuo en las interacciones organismo-ambiente. Para cada conducta problema se traza: contexto de aprendizaje inicial, consecuencias reforzantes, generalización a otros contextos y contingencias actuales de mantenimiento. La teoría biosocial (Linehan, 1993) añade la interacción entre vulnerabilidad biológica en regulación emocional y el ambiente invalidante como factor de historia de aprendizaje.',
    authors: [
      { name: 'Stephen Haynes', years: '1949-', bio: 'Desarrolló el modelo de análisis funcional longitudinal para reconstruir la historia de contingencias que establecieron los patrones conductuales actuales.', keyContributions: ['Análisis funcional longitudinal', 'Variables causales en psicopatología', 'Evaluación conductual clínica'] },
      { name: 'Sidney Bijou', years: '1908-2009', bio: 'Junto con Baer, desarrolló el análisis conductual del desarrollo humano: el desarrollo como cambio continuo en las interacciones organismo-ambiente.', keyContributions: ['Análisis conductual del desarrollo', 'Modelo bioconductual', 'Psicología infantil conductual'] },
      { name: 'Albert Bandura', years: '1925-2021', bio: 'Desarrolló la teoría del aprendizaje social: el modelado como mecanismo de aprendizaje vicarial y la autoeficacia percibida como determinante de la conducta.', keyContributions: ['Aprendizaje social', 'Autoeficacia', 'Modelado vicarial', 'Experimento del muñeco Bobo'] },
      { name: 'Marsha Linehan', years: '1943-', bio: 'Creó la teoría biosocial: vulnerabilidad emocional biológica + ambiente invalidante producen déficits en regulación emocional.', keyContributions: ['Teoría biosocial', 'DBT', 'Regulación emocional', 'Análisis de cadena conductual'] },
    ],
    exercises: [
      {
        id: 'historia_aprendizaje',
        title: 'Historia de Aprendizaje (Haynes & Bijou)',
        instruction: 'Reconstruí la historia de los patrones conductuales que hoy querés cambiar. No buscamos culpables — buscamos entender cómo se aprendieron y qué los mantiene.',
        fields: [
          { id: 'conducta_problema', label: 'Conducta problema principal (describila de forma observable)', type: 'textarea', placeholder: 'No: "soy ansioso". Sí: "cuando tengo que hablar en público, me quedo en blanco y evito la situación"' },
          { id: 'primera_aparicion_edad', label: 'Edad de primera aparición', type: 'text', placeholder: 'Ej: 8 años' },
          { id: 'primera_aparicion_contexto', label: '¿En qué contexto apareció por primera vez?', type: 'textarea', placeholder: '¿Qué pasó? ¿Qué consecuencias tuvo?' },
          { id: 'consecuencias_primera_vez', label: '¿Qué se evitó o se obtuvo esa primera vez?', type: 'textarea', placeholder: '¿Qué reacción generó en otros?' },
          { id: 'generalizacion', label: '¿Se extendió a más contextos con el tiempo?', type: 'textarea', placeholder: '¿A cuáles? ¿Cómo ocurrió?' },
          { id: 'historia_reforzamiento', label: 'Historia de reforzamiento: ¿qué consecuencias la mantienen hasta hoy?', type: 'textarea', placeholder: 'Aunque sean consecuencias a corto plazo que crean problemas a largo plazo' },
          { id: 'intentos_cambio', label: '¿Hubo momentos en que la conducta disminuyó? ¿Qué lo produjo?', type: 'textarea' },
        ],
      },
      {
        id: 'areas_conductuales',
        title: 'Análisis por Áreas Conductuales (Skinner)',
        instruction: 'Analizá tus patrones de evitación, exceso y déficit conductual.',
        fields: [
          { id: 'evitacion', label: '¿Qué situaciones, personas o actividades evitás?', type: 'textarea' },
          { id: 'evitacion_alivio', label: '¿Qué alivio inmediato produce la evitación? (reforzamiento negativo)', type: 'textarea' },
          { id: 'evitacion_costo', label: '¿Qué costo tiene la evitación a largo plazo?', type: 'textarea' },
          { id: 'exceso', label: '¿Hay conductas que hacés con demasiada frecuencia o intensidad?', type: 'textarea', placeholder: 'Comer en exceso, revisar el celular, pedir reaseguración, etc.' },
          { id: 'exceso_refuerzo', label: '¿Qué las refuerza? ¿Qué producen inmediatamente?', type: 'textarea' },
          { id: 'deficit', label: '¿Hay conductas que casi no hacés y que te gustaría hacer más?', type: 'textarea' },
          { id: 'deficit_inhibicion', label: '¿Por qué no ocurren? ¿Qué las suprime o inhibe?', type: 'textarea' },
        ],
      },
      {
        id: 'aprendizaje_social',
        title: 'Historia de Aprendizaje Social (Bandura)',
        instruction: 'Explorá los modelos significativos y la historia de autoeficacia.',
        fields: [
          { id: 'modelos', label: '¿Qué personas observaste extensamente en tu infancia/adolescencia?', type: 'textarea', placeholder: 'Padres, cuidadores, pares, figuras significativas' },
          { id: 'conductas_imitadas', label: '¿Qué conductas de esas personas incorporaste?', type: 'textarea', placeholder: 'Tanto adaptativas como problemáticas' },
          { id: 'autoeficacia_alta', label: '¿En qué áreas te sentís capaz? ¿Qué experiencias construyeron esa sensación?', type: 'textarea' },
          { id: 'autoeficacia_baja', label: '¿En qué áreas te sentís poco capaz? ¿Hubo experiencias de fracaso o invalidación?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── 2. ENTRENAMIENTO EN HABILIDADES ─────────────────────
  {
    id: 'behavioral_training',
    menuId: 'training',
    title: 'Entrenamiento en Habilidades',
    subtitle: 'Adquisición y práctica de conductas objetivo mediante BST y moldeamiento',
    quote: 'Las habilidades se aprenden con instrucción, práctica y retroalimentación — no con comprensión.',
    quoteAuthor: 'Raymond Miltenberger',
    theoreticalSummary:
      'El Behavioral Skills Training (BST) es el protocolo de entrenamiento conductual más validado: instrucción, modelado, ensayo y retroalimentación (Miltenberger). La instrucción sola produce aprendizaje limitado — el componente crítico es el ensayo con retroalimentación. Las habilidades complejas son cadenas conductuales donde cada conducta sirve como SD para la siguiente y reforzador condicionado para la anterior (chaining). El moldeamiento (shaping) refuerza aproximaciones sucesivas a la conducta meta. La generalización no ocurre automáticamente — debe programarse (Stokes & Baer, 1977): entrenar en múltiples ambientes, con materiales variados y reforzamiento natural.',
    authors: [
      { name: 'Raymond Miltenberger', years: '1959-', bio: 'Su Behavior Modification: Principles and Procedures es el texto estándar en formación ABA. Sistematizó el BST y la evaluación funcional clínica.', keyContributions: ['BST — Behavioral Skills Training', 'Evaluación funcional en tres niveles', 'FCT — Entrenamiento en Comunicación Funcional'] },
      { name: 'B.F. Skinner', years: '1904-1990', bio: 'Construyó el sistema conductual más coherente de la historia de la psicología. Su conductismo radical incluye eventos privados como conductas sujetas a los mismos principios.', keyContributions: ['Condicionamiento operante', 'Programas de reforzamiento', 'Moldeamiento', 'Conducta verbal'] },
      { name: 'Marsha Linehan', years: '1943-', bio: 'Desarrolló el entrenamiento en habilidades DBT: mindfulness, tolerancia al malestar, regulación emocional y efectividad interpersonal.', keyContributions: ['DBT Skills Training', 'Análisis de cadena conductual', 'Regulación emocional'] },
      { name: 'Trevor Stokes', years: '', bio: 'Junto con Baer, estableció que la generalización debe programarse, no esperarse. Definió las estrategias para transferir el aprendizaje al contexto natural.', keyContributions: ['Tecnología implícita de la generalización', 'Programación de generalización'] },
    ],
    exercises: [
      {
        id: 'cadena_conductual',
        title: 'Análisis de Cadena Conductual (Chaining)',
        instruction: 'Desglosá una habilidad que querés desarrollar en pasos observables y medibles.',
        fields: [
          { id: 'habilidad', label: 'Habilidad que querés desarrollar (observable y medible)', type: 'textarea' },
          { id: 'paso1', label: 'Paso 1', type: 'text' },
          { id: 'paso2', label: 'Paso 2', type: 'text' },
          { id: 'paso3', label: 'Paso 3', type: 'text' },
          { id: 'paso4', label: 'Paso 4', type: 'text' },
          { id: 'paso5', label: 'Paso 5', type: 'text' },
          { id: 'paso_dificil', label: '¿En qué paso tenés más dificultad? ¿Qué ocurre exactamente ahí?', type: 'textarea' },
          { id: 'antecede_dificultad', label: '¿Qué antecede a esa dificultad? (SD o contexto)', type: 'textarea' },
          { id: 'consecuencias_interfieren', label: '¿Qué consecuencias interfieren con ese paso?', type: 'textarea' },
          { id: 'practica_dia', label: '¿Cuándo vas a practicar esta semana?', type: 'text', placeholder: 'Día, hora, contexto' },
          { id: 'registro_practica', label: '¿Completaste el ensayo?', type: 'radio', options: ['Sí', 'Parcialmente', 'No'] },
          { id: 'obstaculo', label: '¿Qué obstáculo apareció?', type: 'textarea' },
        ],
      },
      {
        id: 'moldeamiento',
        title: 'Moldeamiento de Conducta Meta (Shaping)',
        instruction: 'Reforzamiento diferencial de aproximaciones sucesivas a la conducta meta.',
        fields: [
          { id: 'conducta_meta', label: 'Conducta meta final (observable, medible, alcanzable)', type: 'textarea' },
          { id: 'nivel_actual', label: 'Nivel actual de desempeño (línea de base)', type: 'textarea' },
          { id: 'criterio_semana', label: 'Criterio de esta semana (una aproximación al nivel final)', type: 'textarea' },
          { id: 'reforzador', label: '¿Cómo te vas a reforzar al completarla? (inmediato, consistente, apetitivo)', type: 'textarea' },
          { id: 'alcanzo_criterio', label: '¿Alcanzaste el criterio de esta semana?', type: 'radio', options: ['Sí', 'No'] },
          { id: 'proximo_criterio', label: 'Próximo criterio', type: 'textarea' },
        ],
      },
      {
        id: 'habilidades_dbt',
        title: 'Registro de Habilidades DBT (Linehan)',
        instruction: 'Registrá la práctica de habilidades de regulación emocional y tolerancia al malestar.',
        fields: [
          { id: 'modulo_dbt', label: 'Módulo', type: 'radio', options: ['Mindfulness', 'Tolerancia al malestar', 'Regulación emocional', 'Efectividad interpersonal'] },
          { id: 'habilidad_especifica', label: 'Habilidad específica practicada', type: 'text' },
          { id: 'situacion', label: 'Situación en que la usaste', type: 'textarea' },
          { id: 'suds_antes', label: 'Nivel de malestar ANTES (SUDs 0-100)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo' },
          { id: 'suds_despues', label: 'Nivel de malestar DESPUÉS (SUDs 0-100)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo' },
          { id: 'efectividad', label: '¿Fue efectiva?', type: 'radio', options: ['Sí, completamente', 'Parcialmente', 'No fue efectiva'] },
          { id: 'obstaculo_habilidad', label: 'Si no fue efectiva: ¿qué obstáculo apareció?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── 3. REGISTRO DE MALESTAR (SUDS) ─────────────────────
  {
    id: 'behavioral_emotional',
    menuId: 'emotional',
    title: 'Registro de Malestar',
    subtitle: 'Registro diario de malestar subjetivo con el sistema SUDs (Wolpe) y modelo tripartito (Lang)',
    quote: 'Lo que no se mide no se puede cambiar. Medir el malestar es el primer paso para manejarlo.',
    quoteAuthor: 'Joseph Wolpe',
    theoreticalSummary:
      'Wolpe desarrolló la escala SUDs (0-100) como instrumento operacional para la desensibilización sistemática: convierte la experiencia subjetiva en dato observable y medible. El modelo de habituación (Groves & Thompson, 1970) explica que la presentación sostenida del estímulo temido sin escape produce reducción automática de la respuesta autonómica. La teoría contemporánea del aprendizaje inhibitorio (Craske et al., 2014) propone que la exposición no elimina la asociación CS-US sino que crea una nueva memoria inhibitoria que compite con la original — el objetivo es maximizar la violación de expectativas. El modelo tripartito de Lang (1971) distingue tres sistemas de respuesta emocional: cognitivo-verbal, fisiológico-autonómico y conductual-motor, que pueden disociarse.',
    authors: [
      { name: 'Joseph Wolpe', years: '1915-1997', bio: 'Creó la desensibilización sistemática y la escala SUDs. Su inhibición recíproca demostró que la relajación inhibe la respuesta de ansiedad.', keyContributions: ['SUDs (0-100)', 'Desensibilización sistemática', 'Inhibición recíproca', 'Jerarquía de exposición'] },
      { name: 'Peter Lang', years: '1930-', bio: 'Propuso el modelo tripartito de la emoción: tres sistemas de respuesta (cognitivo, fisiológico, motor) que pueden disociarse.', keyContributions: ['Modelo tripartito emocional', 'Bio-information theory', 'Procesamiento emocional'] },
      { name: 'Michelle Craske', years: '1959-', bio: 'Revolucionó la teoría de la exposición con el modelo de aprendizaje inhibitorio: el objetivo no es reducir el SUDs sino maximizar la violación de expectativas.', keyContributions: ['Aprendizaje inhibitorio', 'Exposición con violación de expectativas', 'Variabilidad en exposición'] },
      { name: 'James Gross', years: '1966-', bio: 'Demostró que la supresión emocional reduce la expresión conductual pero aumenta la activación fisiológica. La revaluación es más adaptativa.', keyContributions: ['Modelo de regulación emocional', 'Revaluación vs. supresión', 'Estrategias de regulación'] },
    ],
    exercises: [
      {
        id: 'registro_suds',
        title: 'Registro Diario de Malestar — SUDs + Lang',
        instruction: 'Registrá el malestar con sus tres componentes: cognitivo, fisiológico y conductual.',
        fields: [
          { id: 'momento', label: 'Momento del día', type: 'radio', options: ['Mañana', 'Tarde', 'Noche'] },
          { id: 'situacion', label: 'Situación activadora: ¿qué ocurrió o qué anticipabas?', type: 'textarea' },
          { id: 'suds', label: 'Nivel de malestar SUDs (Wolpe)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo imaginable' },
          { id: 'fisiologico', label: 'Componente fisiológico (Lang — sistema autonómico)', type: 'checkbox', options: ['Taquicardia', 'Tensión muscular', 'Respiración acelerada', 'Sudoración/temblor', 'Náuseas', 'Opresión torácica', 'Mareo/irrealidad'] },
          { id: 'conductual', label: 'Componente conductual (Lang — sistema motor)', type: 'radio', options: ['Evité la situación', 'Me retiré', 'Busqué reaseguración', 'Conducta de seguridad', 'Me quedé inhibido/a', 'Me quedé y toleré el malestar'] },
          { id: 'funcion_respuesta', label: 'Si evitaste: ¿cuánto bajó el SUDs? ¿Cuánto dura ese alivio?', type: 'textarea' },
          { id: 'costo_evitacion', label: '¿Qué costo tiene esa evitación a largo plazo?', type: 'textarea' },
          { id: 'exposicion', label: '¿Te expusiste al estímulo temido?', type: 'radio', options: ['Sí', 'No'] },
          { id: 'suds_post_exposicion', label: 'Si te expusiste — SUDs final tras exposición', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo' },
        ],
      },
    ],
  },

  // ── 4. AUTORREGISTRO ABC ────────────────────────────────
  {
    id: 'behavioral_abc',
    menuId: 'unconscious',
    title: 'Autorregistro ABC',
    subtitle: 'Registro de Antecedente — Conducta — Consecuente: el instrumento fundamental del análisis conductual',
    quote: 'Para cambiar una conducta hay que entender qué la mantiene. El ABC te da esa información.',
    quoteAuthor: 'B.F. Skinner',
    theoreticalSummary:
      'El registro ABC deriva del paradigma de tres términos de Skinner: SD → R → SR. Documenta antecedentes (estímulos discriminativos, operaciones motivacionales, contexto), conducta (topografía, frecuencia, duración, intensidad) y consecuentes (inmediatos vs. demorados, sociales vs. automáticos). El error clínico más frecuente es tratar la topografía en lugar de la función: dos conductas idénticas pueden tener funciones completamente diferentes. La evaluación funcional opera en tres niveles (Miltenberger): indirecta (FAST, MAS, QABF), descriptiva (observación directa, registro ABC) y experimental (manipulación de condiciones — Iwata).',
    authors: [
      { name: 'B.F. Skinner', years: '1904-1990', bio: 'Estableció el paradigma de tres términos (SD → R → SR) como unidad de análisis conductual. Todo análisis funcional parte de esta estructura.', keyContributions: ['Paradigma de tres términos', 'Control de estímulos', 'Estímulo discriminativo'] },
      { name: 'Brian Iwata', years: '1948-', bio: 'Desarrolló el protocolo de análisis funcional experimental más usado: cuatro condiciones (atención, demanda, solo, control) para identificar función con precisión experimental.', keyContributions: ['Análisis funcional experimental', 'Protocolo multielemento', 'Funciones de la conducta'] },
      { name: 'Raymond Miltenberger', years: '1959-', bio: 'Sistematizó la evaluación funcional en tres niveles: indirecta, descriptiva y experimental.', keyContributions: ['Evaluación funcional clínica', 'FAST', 'Análisis ABC en práctica'] },
      { name: 'Jack Michael', years: '1926-2016', bio: 'Actualizó el análisis skinneriano con las Motivating Operations: condiciones que alteran el valor reforzante de un estímulo y la frecuencia de conductas relacionadas.', keyContributions: ['Motivating Operations', 'UEO y CEO', 'Operaciones de establecimiento'] },
    ],
    exercises: [
      {
        id: 'registro_abc',
        title: 'Registro ABC Completo (Skinner / Iwata)',
        instruction: 'Registrá el episodio conductual completo: qué ocurrió antes, qué hiciste y qué consecuencias tuvo.',
        fields: [
          { id: 'contexto_fisico', label: 'A — Contexto físico: ¿dónde estabas?', type: 'text' },
          { id: 'contexto_social', label: 'A — Contexto social: ¿quién estaba presente?', type: 'text' },
          { id: 'estimulo_discriminativo', label: 'A — ¿Qué ocurrió justo antes de la conducta? (estímulo discriminativo)', type: 'textarea' },
          { id: 'estado_organismo', label: 'A — Estado del organismo (operación motivacional: cansancio, hambre, estrés acumulado)', type: 'textarea' },
          { id: 'conducta_observable', label: 'B — ¿Qué hiciste exactamente? (conducta observable)', type: 'textarea', placeholder: 'NO: "me puse ansioso". SÍ: "me levanté, fui al baño, revisé el celular tres veces"' },
          { id: 'duracion', label: 'B — Duración', type: 'text' },
          { id: 'intensidad_suds', label: 'B — Intensidad (SUDs)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Nula', scaleMaxLabel: 'Máxima' },
          { id: 'consecuente_inmediato', label: 'C — ¿Qué ocurrió justo después? (primeros 30-60 seg)', type: 'textarea' },
          { id: 'malestar_antes', label: 'C — Malestar antes', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Nulo', scaleMaxLabel: 'Máximo' },
          { id: 'malestar_despues', label: 'C — Malestar después', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Nulo', scaleMaxLabel: 'Máximo' },
          { id: 'tipo_consecuente', label: 'C — Tipo de consecuente', type: 'radio', options: ['Obtuve algo que quería (R+)', 'Se eliminó algo desagradable (R−/evitación)', 'Ocurrió algo desagradable (castigo)', 'No ocurrió nada aparente (automático)'] },
          { id: 'funcion', label: 'Función probable de la conducta', type: 'radio', options: ['Obtener atención social', 'Escapar de situación difícil', 'Acceder a algo tangible', 'Regulación sensorial/automática', 'No lo tengo claro'] },
        ],
      },
    ],
  },

  // ── 5. RELACIÓN TERAPÉUTICA CONDUCTUAL ──────────────────
  {
    id: 'behavioral_alliance',
    menuId: 'alliance',
    title: 'Relación Terapéutica',
    subtitle: 'La relación terapéutica como instrumento de cambio conductual (FAP)',
    quote: 'El mejor predictor de cambio en sesión es lo que ocurre en la relación terapéutica.',
    quoteAuthor: 'Robert Kohlenberg',
    theoreticalSummary:
      'La Psicoterapia Analítico Funcional (FAP, Kohlenberg & Tsai, 1991) propone que la relación terapéutica es el instrumento de cambio. Define tres tipos de Conductas Clínicamente Relevantes (CCR): CCR1 (conductas problemáticas en sesión), CCR2 (mejoras conductuales en sesión) y CCR3 (interpretaciones funcionales del paciente). Las cinco reglas de la FAP: observar CCR, evocar CCR1, reforzar naturalmente CCR2, observar efectos del reforzamiento, dar interpretaciones funcionales. El terapeuta es un componente del ambiente: sus conductas funcionan como estímulos discriminativos, evocadores y reforzadores. La retroalimentación contingente (Skinner) es más efectiva cuando es inmediata, específica, consistente y funcionalmente apropiada para ese paciente.',
    authors: [
      { name: 'Robert Kohlenberg', years: '1937-2021', bio: 'Creó la Psicoterapia Analítico Funcional (FAP): la relación terapéutica como instrumento de cambio conductual a través de las CCR.', keyContributions: ['FAP', 'Conductas Clínicamente Relevantes', 'Cinco reglas de la FAP'] },
      { name: 'Mavis Tsai', years: '', bio: 'Co-creadora de la FAP. Enfatizó la vulnerabilidad y autenticidad del terapeuta como medio de reforzamiento natural de las CCR2.', keyContributions: ['Co-creación de FAP', 'Autenticidad terapéutica', 'Reforzamiento natural en sesión'] },
      { name: 'B.F. Skinner', years: '1904-1990', bio: 'Sus principios de retroalimentación contingente fundamentan la intervención relacional: el feedback efectivo es inmediato, específico y funcionalmente apropiado.', keyContributions: ['Reforzamiento contingente', 'Retroalimentación inmediata', 'Control de estímulos'] },
    ],
    exercises: [
      {
        id: 'registro_post_sesion',
        title: 'Registro Post-Sesión (FAP — Kohlenberg & Tsai)',
        instruction: 'Reflexioná sobre lo que ocurrió en la sesión de hoy desde la perspectiva de tus patrones conductuales.',
        fields: [
          { id: 'suds_llegada', label: 'Estado al llegar a la sesión (SUDs)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo' },
          { id: 'evitando_algo', label: '¿Venías evitando algo en particular?', type: 'textarea' },
          { id: 'ccr1', label: '¿Notaste alguna conducta en sesión similar a lo que hacés fuera? (CCR1)', type: 'textarea' },
          { id: 'ccr2', label: '¿Hiciste algo diferente a tu patrón habitual en sesión? (CCR2)', type: 'textarea', placeholder: 'Hablar de algo difícil, no evitar un tema, expresar una emoción' },
          { id: 'feedback', label: '¿Hubo algún comentario del terapeuta que cambiara algo en vos?', type: 'textarea' },
          { id: 'tarea', label: 'Tarea acordada para esta semana', type: 'textarea' },
          { id: 'obstaculo_tarea', label: '¿Qué la haría difícil de completar?', type: 'textarea' },
          { id: 'primer_paso', label: '¿Cuál es el primer paso concreto que podés dar hoy?', type: 'textarea' },
          { id: 'suds_salida', label: 'Estado al salir de la sesión (SUDs)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo' },
        ],
      },
    ],
  },

  // ── 6. HISTORIA DE APRENDIZAJE (Línea de Vida) ──────────
  {
    id: 'behavioral_timeline',
    menuId: 'timeline',
    title: 'Historia de Aprendizaje',
    subtitle: 'Línea temporal de condicionamientos, modelos y aprendizajes significativos',
    quote: 'No nacemos con miedos, conductas problemáticas ni limitaciones — las aprendemos. Y lo aprendido puede desaprenderse.',
    quoteAuthor: 'John B. Watson',
    theoreticalSummary:
      'El aprendizaje por observación (Bandura, 1977) implica cuatro procesos: atención, retención, reproducción motora y motivación. La autoeficacia percibida determina qué conductas se intentarán y con cuánta persistencia. El condicionamiento evaluativo (De Houwer et al., 2001) explica la adquisición de actitudes y preferencias por apareamiento de estímulos. La historia de reforzamiento diferencial explica por qué las mismas contingencias producen efectos distintos en personas diferentes. Skinner incluía pensamientos y emociones como conductas privadas sujetas a los mismos principios del condicionamiento.',
    authors: [
      { name: 'Albert Bandura', years: '1925-2021', bio: 'Teoría del aprendizaje social: modelado vicarial, autoeficacia percibida y cuatro procesos del aprendizaje por observación.', keyContributions: ['Aprendizaje social', 'Autoeficacia', 'Reforzamiento vicario'] },
      { name: 'John B. Watson', years: '1878-1958', bio: 'Fundador del conductismo psicológico. Demostró con el Pequeño Albert que las respuestas emocionales son aprendidas.', keyContributions: ['Manifiesto conductista', 'Pequeño Albert', 'Condicionamiento emocional'] },
      { name: 'Ivan Pavlov', years: '1849-1936', bio: 'Descubrió el condicionamiento clásico: extinción, recuperación espontánea, generalización y discriminación.', keyContributions: ['Condicionamiento clásico', 'Extinción', 'Generalización del estímulo'] },
      { name: 'Mary Cover Jones', years: '1896-1987', bio: 'Primer tratamiento conductual documentado (1924): contracondicionamiento del miedo en el caso Peter, 30 años antes de Wolpe.', keyContributions: ['Contracondicionamiento', 'Caso Peter', 'Primera terapia conductual'] },
    ],
    exercises: [
      {
        id: 'mapa_aprendizaje',
        title: 'Mapa de Aprendizaje (Pavlov / Skinner / Bandura)',
        instruction: 'Identificá los hitos de aprendizaje significativos en tu historia: condicionamientos, modelos y episodios de reforzamiento.',
        fields: [
          { id: 'edad', label: 'Edad del hito', type: 'text' },
          { id: 'descripcion', label: 'Descripción del episodio de aprendizaje', type: 'textarea' },
          { id: 'tipo_aprendizaje', label: 'Tipo de aprendizaje', type: 'radio', options: ['Condicionamiento clásico (asociación estímulo-respuesta emocional)', 'Condicionamiento operante (conducta-consecuencia)', 'Aprendizaje vicario (modelado — Bandura)', 'Condicionamiento evaluativo (actitud adquirida)'] },
          { id: 'consecuencia_actual', label: 'Consecuencia en el repertorio conductual actual', type: 'textarea' },
        ],
      },
      {
        id: 'cadena_aprendizaje',
        title: 'Cadena de Aprendizaje Actual',
        instruction: 'Trazá la cadena desde la historia de aprendizaje hasta el patrón conductual actual.',
        fields: [
          { id: 'historia_relevante', label: 'Historia de aprendizaje relevante', type: 'textarea' },
          { id: 'conducta_aprendida', label: 'Conducta aprendida (inicialmente funcional)', type: 'textarea' },
          { id: 'generalizacion', label: 'Generalización a nuevos contextos', type: 'textarea' },
          { id: 'mantenimiento', label: 'Mantenimiento por contingencias actuales', type: 'textarea' },
          { id: 'consecuencias_lp', label: 'Consecuencias a largo plazo (costo del patrón)', type: 'textarea' },
          { id: 'punto_intervencion', label: '¿En qué punto de la cadena es más viable intervenir?', type: 'radio', options: ['Modificando antecedentes (control de estímulos)', 'Reemplazando la conducta (habilidades alternativas)', 'Modificando consecuencias (nuevas contingencias)', 'En todos los puntos simultáneamente'] },
        ],
      },
    ],
  },

  // ── 7. TAREAS CONDUCTUALES ──────────────────────────────
  {
    id: 'behavioral_tasks',
    menuId: 'tasks',
    title: 'Tareas Conductuales',
    subtitle: 'Exposición, práctica de habilidades, autorregistro y modificación de contingencias',
    quote: 'El cambio conductual requiere práctica en el ambiente natural, no solo comprensión en el consultorio.',
    quoteAuthor: 'Alan Kazdin',
    theoreticalSummary:
      'El principio de Premack (1959): una conducta de alta probabilidad refuerza una de baja probabilidad. El contrato conductual (Homme et al., 1970) mejora la adherencia al hacer explícitas las contingencias. La regla del inmediatismo (Skinner): las consecuencias inmediatas controlan la conducta más poderosamente que las demoradas — la raíz de los problemas de autorregulación. La economía de fichas (Ayllon & Azrin, 1968) soluciona el problema del inmediatismo con reforzadores generalizados. El autoregistro (Kanfer, 1970) produce cambios reactivos: registrar la conducta en sí mismo la modifica hacia el valor socialmente deseable.',
    authors: [
      { name: 'Alan Kazdin', years: '1945-', bio: 'Sistematizó la evidencia clínica conductual, los diseños de caso único y definió significación clínica vs. estadística.', keyContributions: ['Significación clínica', 'Diseños de caso único', 'Modificación de conducta en settings aplicados'] },
      { name: 'David Premack', years: '1925-2015', bio: 'Estableció el principio de Premack: conductas de alta probabilidad refuerzan conductas de baja probabilidad.', keyContributions: ['Principio de Premack', 'Reforzamiento relativo'] },
      { name: 'Teodoro Ayllon', years: '1929-', bio: 'Junto con Azrin, creó la economía de fichas: primer sistema de reforzamiento simbólico en hospital psiquiátrico.', keyContributions: ['Economía de fichas', 'Reforzamiento simbólico', 'Modificación conductual hospitalaria'] },
      { name: 'Joseph Wolpe', years: '1915-1997', bio: 'Desarrolló la exposición gradual y la jerarquía de exposición como base del tratamiento de la ansiedad.', keyContributions: ['Jerarquía de exposición', 'Exposición gradual', 'Desensibilización sistemática'] },
    ],
    exercises: [
      {
        id: 'tarea_conductual',
        title: 'Formato de Tarea Conductual (Kazdin / Premack)',
        instruction: 'Planificá y registrá tu tarea conductual con predicción, reforzador y análisis post-tarea.',
        fields: [
          { id: 'titulo_tarea', label: 'Título de la tarea', type: 'text' },
          { id: 'descripcion_operacional', label: '¿Qué vas a hacer? (qué, cuándo, dónde, cuánto tiempo)', type: 'textarea' },
          { id: 'funcion_tarea', label: '¿Qué función cumple esta tarea?', type: 'radio', options: ['Exposición — reducir evitación', 'Activación — aumentar conductas de valor', 'Entrenamiento en habilidades', 'Autorregistro — obtener información funcional', 'Modificación de contingencias'] },
          { id: 'prediccion', label: '¿Qué creés que va a ocurrir?', type: 'textarea' },
          { id: 'suds_previsto', label: 'SUDs previsto durante la tarea', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Nulo', scaleMaxLabel: 'Máximo' },
          { id: 'reforzador_premack', label: '¿Con qué te vas a reforzar al completarla? (Premack)', type: 'textarea' },
          { id: 'completo', label: '¿Completaste la tarea?', type: 'radio', options: ['Sí', 'Parcialmente', 'No'] },
          { id: 'si_no_porque', label: 'Si parcialmente o no: ¿qué ocurrió?', type: 'radio', options: ['Olvidé realizarla', 'Evité realizarla', 'Empecé pero me fui (escape)', 'Las circunstancias lo impidieron'] },
          { id: 'suds_real', label: 'SUDs real durante la tarea', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Nulo', scaleMaxLabel: 'Máximo' },
          { id: 'coincidio_prediccion', label: '¿Coincidió con tu predicción?', type: 'textarea' },
          { id: 'aprendizaje_funcion', label: '¿Qué aprendiste sobre la función de tu conducta?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── 8. REFORZADORES DE LOGRO ────────────────────────────
  {
    id: 'behavioral_rewards',
    menuId: 'rewards',
    title: 'Reforzadores de Logro',
    subtitle: 'Reforzamiento positivo de conductas adaptativas y construcción de autoeficacia',
    quote: 'Reforzar la conducta correcta es más poderoso que suprimir la incorrecta.',
    quoteAuthor: 'John O. Cooper',
    theoreticalSummary:
      'El principio más fundamental del ABA clínico (Cooper et al., 2020): focalizar en construir y reforzar el repertorio de conductas adaptativas alternativas en lugar de eliminar las problemáticas. El DRI (reforzamiento diferencial de conducta incompatible) y el DRA (reforzamiento diferencial de conducta alternativa) reemplazan la conducta problema reforzando alternativas funcionalmente equivalentes. El FCT (Carr & Durand, 1985) enseña respuestas comunicativas que producen el mismo reforzador con menor costo de respuesta. Registrar logros construye autoeficacia (Bandura): la evidencia acumulada de ejecuciones exitosas modifica la expectativa de eficacia futura.',
    authors: [
      { name: 'John O. Cooper', years: '', bio: 'Co-autor de Applied Behavior Analysis (3ª ed., 2020): la enciclopedia del campo ABA y texto de referencia para la certificación BCBA.', keyContributions: ['ABA sistemático', 'DRI/DRA', 'Reforzamiento diferencial'] },
      { name: 'Edward Carr', years: '1947-2009', bio: 'Junto con Durand, desarrolló el Entrenamiento en Comunicación Funcional (FCT): reemplaza la conducta problema con una respuesta comunicativa equivalente.', keyContributions: ['FCT', 'Comunicación funcional', 'Apoyo conductual positivo'] },
      { name: 'Albert Bandura', years: '1925-2021', bio: 'La autoeficacia se construye con evidencia acumulada de logros de ejecución — no con persuasión verbal.', keyContributions: ['Autoeficacia', 'Logros de ejecución', 'Expectativa de eficacia'] },
    ],
    exercises: [
      {
        id: 'logro_conductual',
        title: 'Registro de Logro Conductual (Cooper / Bandura)',
        instruction: 'Registrá cada logro conductual: qué hiciste, qué patrón previo supera y cómo te reforzaste.',
        fields: [
          { id: 'tipo_logro', label: 'Tipo de logro', type: 'radio', options: ['Completé una exposición sin escape', 'Usé la conducta alternativa en lugar de la problemática', 'Mantuve la conducta meta varios días', 'Completé la tarea asignada', 'Practiqué la habilidad en contexto natural', 'Resistí el impulso de evitar', 'Solicité lo que necesitaba'] },
          { id: 'descripcion_logro', label: 'Descripción concreta y observable: ¿qué hiciste, dónde, cuándo?', type: 'textarea' },
          { id: 'patron_superado', label: '¿Qué patrón previo supera este logro?', type: 'textarea' },
          { id: 'funcion_logro', label: '¿Qué conducta problema reemplaza esta conducta adaptativa?', type: 'textarea' },
          { id: 'reforzador_usado', label: '¿Cómo te reforzaste?', type: 'textarea' },
          { id: 'autoeficacia_antes', label: 'Autoeficacia ANTES del logro (Bandura, 0-100%)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
          { id: 'autoeficacia_despues', label: 'Autoeficacia DESPUÉS del logro', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
          { id: 'plan_mantenimiento', label: '¿Cómo vas a mantener esta conducta? ¿Qué reforzadores naturales puede proveer el ambiente?', type: 'textarea' },
        ],
      },
    ],
  },

  // ── 9. DATOS DE INTERVENCIÓN (Monitoreo) ────────────────
  {
    id: 'behavioral_monitoring',
    menuId: 'monitoring',
    title: 'Datos de Intervención',
    subtitle: 'Medición conductual sistemática: línea de base, frecuencia, duración e intensidad',
    quote: 'En el análisis de conducta, los datos no apoyan la teoría — los datos son la evidencia del cambio.',
    quoteAuthor: 'Baer, Wolf & Risley',
    theoreticalSummary:
      'El diseño de caso único (Sidman, 1960; Kazdin, 1982) mide la conducta repetidamente, establece línea de base estable y usa al individuo como su propio control. Tipos: A-B, A-B-A-B, líneas de base múltiples, criterio cambiante. Las dimensiones de medición conductual incluyen frecuencia, tasa, duración, intensidad, latencia y porcentaje de intervalos. Instrumentos estandarizados: CBCL (Achenbach), Conners (TDAH), BRIEF (funciones ejecutivas), BIS/BAS (sistemas motivacionales de Gray). Los registros idiosincrásicos son frecuentemente más sensibles que los estandarizados para cambios individuales.',
    authors: [
      { name: 'Donald Baer', years: '1931-2002', bio: 'Co-fundador del ABA con Wolf y Risley. Definió las siete dimensiones del análisis aplicado de conducta.', keyContributions: ['Siete dimensiones del ABA', 'Generalización programada', 'Análisis aplicado'] },
      { name: 'Murray Sidman', years: '1923-2019', bio: 'Desarrolló la metodología del diseño de caso único y descubrió la equivalencia de estímulos.', keyContributions: ['Diseño de caso único', 'Equivalencia de estímulos', 'Tácticas de investigación científica'] },
      { name: 'Alan Kazdin', years: '1945-', bio: 'Formalizó los diseños experimentales de caso único (A-B-A-B, líneas base múltiples) y criterios de significación clínica.', keyContributions: ['Diseños de caso único', 'Significación clínica', 'Meta-análisis conductuales'] },
      { name: 'Thomas Achenbach', years: '1940-', bio: 'Creó el CBCL: instrumento de banda ancha para evaluación conductual en niños con escalas de síndrome y orientadas al DSM.', keyContributions: ['CBCL', 'ASEBA', 'Evaluación multiinformante'] },
    ],
    exercises: [
      {
        id: 'evaluacion_semanal',
        title: 'Evaluación Semanal — Conducta Objetivo (Kazdin / Sidman)',
        instruction: 'Registrá los datos de tu conducta objetivo esta semana para graficar el progreso.',
        fields: [
          { id: 'conducta_objetivo', label: 'Conducta objetivo principal', type: 'textarea' },
          { id: 'dimension', label: 'Dimensión de medición', type: 'radio', options: ['Frecuencia', 'Duración', 'Intensidad (SUDs)', 'Porcentaje'] },
          { id: 'dia1', label: 'Día 1 — dato', type: 'text' },
          { id: 'dia2', label: 'Día 2 — dato', type: 'text' },
          { id: 'dia3', label: 'Día 3 — dato', type: 'text' },
          { id: 'dia4', label: 'Día 4 — dato', type: 'text' },
          { id: 'dia5', label: 'Día 5 — dato', type: 'text' },
          { id: 'dia6', label: 'Día 6 — dato', type: 'text' },
          { id: 'dia7', label: 'Día 7 — dato', type: 'text' },
          { id: 'comparacion', label: 'Comparación con semana anterior', type: 'radio', options: ['Subió', 'Bajó', 'Igual'] },
          { id: 'conducta_alternativa_freq', label: '¿Cuántas veces usaste la conducta alternativa?', type: 'text' },
          { id: 'evitaciones', label: '¿Cuántas veces evitaste la situación objetivo?', type: 'text' },
          { id: 'exposiciones', label: '¿Cuántas veces te expusiste?', type: 'text' },
          { id: 'tareas_asignadas', label: 'Tareas asignadas', type: 'text' },
          { id: 'tareas_completadas', label: 'Tareas completadas', type: 'text' },
          { id: 'variables_contextuales', label: '¿Hubo algo que afectara los datos esta semana?', type: 'textarea', placeholder: 'Enfermedad, eventos vitales, cambios en el ambiente' },
        ],
      },
    ],
  },

  // ── 10. LAURA — ASISTENTE CONDUCTUAL ────────────────────
  {
    id: 'behavioral_assistant',
    menuId: 'assistant',
    title: 'Laura — Asistente Conductual',
    subtitle: 'Acompañamiento conductual entre sesiones: análisis funcional, autorregistro y reforzamiento',
    quote: 'Cuando el paciente aprende a hacer preguntas funcionales por sí mismo, se convierte en agente activo del cambio.',
    quoteAuthor: 'Kohlenberg & Tsai',
    theoreticalSummary:
      'La psicoeducación conductual es parte integral del tratamiento: comprender los principios del condicionamiento deculpabiliza la conducta (se aprendió, no refleja defectos de carácter) y la hace modificable. El análisis funcional puede ser un proceso conversacional que el paciente internaliza progresivamente. Desde la FAP, Laura funciona como estímulo discriminativo de conductas adaptativas (registrar, analizar, practicar) y puede funcionar como reforzador social de las aproximaciones al comportamiento meta. Limitación: el análisis funcional riguroso requiere observación directa y datos conductuales sistemáticos — Laura guía el autorregistro pero no reemplaza la evaluación funcional formal.',
    authors: [
      { name: 'Robert Kohlenberg', years: '1937-2021', bio: 'La FAP define al terapeuta (y por extensión, al asistente) como estímulo discriminativo de conductas adaptativas.', keyContributions: ['FAP', 'Terapeuta como SD', 'Reforzamiento natural'] },
      { name: 'B.F. Skinner', years: '1904-1990', bio: 'La psicoeducación conductual modifica la relación del paciente con su propia conducta al hacerla comprensible y modificable.', keyContributions: ['Psicoeducación conductual', 'Análisis funcional', 'Conducta verbal'] },
    ],
    exercises: [],
  },
];
