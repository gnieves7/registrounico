// ============================================================
// CONTENIDO CLÍNICO COMPLETO — ENFOQUE COGNITIVO-CONDUCTUAL
// Sistema Reflexionar · .PSI. · 2026
// ============================================================

import type { HumanisticSection } from './humanisticContent';

export type CbtSection = HumanisticSection;

// ─── MARCO EPISTEMOLÓGICO ───────────────────────────────────
export const CBT_EPISTEMOLOGY = {
  title: 'Las tres generaciones de la TCC',
  description: 'La Terapia Cognitivo-Conductual no es una teoría estática — es un campo que atravesó tres transformaciones sustanciales, cada una con implicaciones clínicas y epistemológicas distintas.',
  generations: [
    {
      name: 'Primera Generación — Conductismo clínico (1950-1970)',
      principle: 'El objeto de estudio es la conducta observable',
      authors: 'Watson, Skinner, Wolpe, Eysenck',
      concepts: [
        'Condicionamiento clásico (Watson) y operante (Skinner)',
        'Reforzamiento positivo, negativo, castigo y extinción',
        'Programas de reforzamiento y resistencia a la extinción',
        'Desensibilización sistemática e inhibición recíproca (Wolpe)',
        'SUDs: Subjective Units of Distress (Wolpe, 1969)',
      ],
    },
    {
      name: 'Segunda Generación — Revolución cognitiva (1960-1990)',
      principle: 'Los procesos mentales son accesibles y modificables',
      authors: 'Beck, Ellis, Meichenbaum, Bandura, Clark, Foa, Padesky, Dobson, Hofmann',
      concepts: [
        'Modelo cognitivo de tres niveles (Beck): pensamientos automáticos, creencias intermedias, creencias centrales',
        '12 distorsiones cognitivas: pensamiento dicotómico, catastrofización, sobregeneralización, filtro mental, etc.',
        'Modelo ABC (Ellis): situación → creencia → consecuencia',
        'Autoeficacia y aprendizaje social (Bandura)',
        'Modelos cognitivos del pánico y la fobia social (Clark)',
        'Procesamiento emocional y exposición prolongada para TEPT (Foa)',
        'Flecha descendente y mente positiva (Padesky)',
      ],
    },
    {
      name: 'Tercera Generación — Terapias de tercera ola (1990-presente)',
      principle: 'Cambiar la relación con los pensamientos, no los pensamientos mismos',
      authors: 'Hayes, Linehan, Segal/Williams/Teasdale, Gilbert, Kabat-Zinn, Neff, Harris',
      concepts: [
        'ACT: defusión cognitiva, aceptación, momento presente, yo contexto, valores, acción comprometida (Hayes)',
        'DBT: mindfulness, tolerancia al malestar, regulación emocional, efectividad interpersonal (Linehan)',
        'MBCT: prevención de recaídas mediante mindfulness (Segal/Williams/Teasdale)',
        'CFT: tres sistemas de regulación emocional, mente compasiva (Gilbert)',
        'Autocompasión: mindfulness, humanidad compartida, bondad (Neff)',
        'Protocolo Unificado transdiagnóstico (Barlow)',
      ],
    },
  ],
};

// ─── SECCIÓN 1: HISTORIA CLÍNICA COGNITIVA ─────────────────
const section1_HistoriaClinica: CbtSection = {
  id: 'cbt_history',
  menuId: 'history',
  title: 'Historia Clínica Cognitiva',
  subtitle: 'Conceptualización del caso, factores predisponentes, precipitantes y mantenedores',
  quote: 'Los problemas actuales tienen raíces históricas, pero son mantenidos por procesos presentes.',
  quoteAuthor: 'Beck',
  authors: [
    {
      name: 'Aaron Beck',
      years: '1921-2021',
      bio: 'Fundador de la terapia cognitiva. Identificó los pensamientos automáticos y desarrolló el modelo cognitivo de tres niveles: pensamientos automáticos, creencias intermedias y creencias centrales (esquemas).',
      keyContributions: ['Modelo cognitivo de la depresión (1967)', 'Terapia cognitiva (1976)', '12 distorsiones cognitivas'],
    },
    {
      name: 'Judith Beck',
      years: '1954-',
      bio: 'Desarrolló el Diagrama de Conceptualización Cognitiva que organiza la historia del caso en tres niveles articulados: datos históricos, creencias centrales/supuestos, y situaciones actuales.',
      keyContributions: ['Cognitive Therapy: Basics and Beyond (1995)', 'Diagrama de conceptualización cognitiva'],
    },
    {
      name: 'Jeffrey Young',
      years: '1950-',
      bio: 'Extendió la terapia cognitiva para trastornos de personalidad con la Terapia de Esquemas. Identificó 18 Esquemas Disfuncionales Tempranos en cinco dominios.',
      keyContributions: ['Terapia de Esquemas (2003)', '18 EDT en 5 dominios', 'Modos de esquema'],
    },
  ],
  theoreticalSummary: 'La conceptualización cognitiva del caso organiza la información clínica en tres niveles (J. Beck): experiencias tempranas que formaron creencias centrales, supuestos condicionales derivados de esas creencias, y situaciones actuales que activan el sistema. Se complementa con el modelo de las 3P (Slade): factores Predisponentes, Precipitantes y Mantenedores. Young amplió este marco con los 18 Esquemas Disfuncionales Tempranos organizados en cinco dominios (desconexión, autonomía deteriorada, límites deteriorados, tendencia al otro, hipervigilancia).',
  exercises: [
    {
      id: 'conceptualizacion_cognitiva',
      title: 'Diagrama de Conceptualización Cognitiva (J. Beck)',
      instruction: 'Organizá tu historia en los tres niveles del modelo cognitivo: experiencias formativas, creencias que se instalaron, y cómo se activan hoy.',
      fields: [
        { id: 'mensajes_infancia', label: '¿Qué mensajes recibiste en tu infancia sobre vos mismo/a? (De padres, cuidadores, pares, instituciones)', type: 'textarea', placeholder: 'Describí los mensajes que recibiste...' },
        { id: 'experiencias_significativas', label: '¿Hubo experiencias significativas de pérdida, rechazo, fracaso o trauma?', type: 'textarea', placeholder: '' },
        { id: 'experiencias_positivas', label: '¿Hubo experiencias de logro, conexión o seguridad que también te formaron?', type: 'textarea', placeholder: '' },
        { id: 'creencia_self', label: 'Creencia central sobre mí mismo/a', type: 'radio', options: [
          '"Soy incompetente / incapaz"',
          '"Soy defectuoso/a / diferente a los demás"',
          '"No merezco ser amado/a"',
          '"Soy débil / vulnerable"',
          '"Soy malo/a / culpable"',
        ] },
        { id: 'creencia_otros', label: 'Creencia central sobre los demás', type: 'radio', options: [
          '"Los demás son peligrosos / no confiables"',
          '"Los demás me van a rechazar / abandonar"',
          '"Los demás son mejores que yo"',
          '"Los demás no me entienden"',
        ] },
        { id: 'creencia_futuro', label: 'Creencia central sobre el futuro', type: 'radio', options: [
          '"El futuro es amenazante"',
          '"Nada va a cambiar"',
          '"Siempre me va a ir mal"',
        ] },
        { id: 'supuestos', label: 'Supuestos condicionales ("Si... entonces...")', type: 'textarea', placeholder: 'Ej: "Si no soy perfecto, me van a rechazar"' },
        { id: 'estrategias_compensatorias', label: 'Estrategias compensatorias desarrolladas para manejar estas creencias', type: 'textarea', placeholder: 'Ej: perfeccionismo, evitación, control excesivo, búsqueda de aprobación...' },
      ],
    },
    {
      id: 'tres_p_slade',
      title: 'Análisis de las 3P (Slade / Zubin & Spring)',
      instruction: 'Identificá los factores que predispusieron, precipitaron y mantienen tu problema actual.',
      fields: [
        { id: 'predisponentes', label: 'Factores PREDISPONENTES: ¿qué aumentó tu vulnerabilidad? (genética, temperamento, historia temprana)', type: 'textarea', placeholder: '' },
        { id: 'precipitantes', label: 'Factores PRECIPITANTES: ¿qué desencadenó el episodio actual? (eventos vitales, pérdidas, transiciones)', type: 'textarea', placeholder: '' },
        { id: 'mantenedores', label: 'Factores MANTENEDORES: ¿qué sostiene el problema en el presente? (evitación, reforzamiento, patrones cognitivos)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 2: ENTRENAMIENTO COGNITIVO ────────────────────
const section2_EntrenamientoCognitivo: CbtSection = {
  id: 'cbt_training',
  menuId: 'training',
  title: 'Entrenamiento Cognitivo',
  subtitle: 'Reestructuración cognitiva, experimentos conductuales y defusión',
  quote: 'No son las cosas las que nos perturban, sino la opinión que tenemos de las cosas.',
  quoteAuthor: 'Epicteto (vía Beck)',
  authors: [
    {
      name: 'Aaron Beck',
      years: '1921-2021',
      bio: 'El registro de pensamientos disfuncionales y la reestructuración cognitiva son las técnicas centrales de la segunda generación. La pregunta clave: ¿cuál es la evidencia?',
      keyContributions: ['Registro de pensamientos (RPD)', 'Reestructuración cognitiva', 'Preguntas socráticas'],
    },
    {
      name: 'Albert Ellis',
      years: '1913-2007',
      bio: 'Desarrolló el modelo ABC y la técnica de disputa racional: preguntas lógicas, empíricas y pragmáticas para cuestionar la irracionalidad de las creencias.',
      keyContributions: ['REBT', 'Modelo ABC', 'Disputa racional', 'Cuatro creencias irracionales nucleares'],
    },
    {
      name: 'Steven Hayes',
      years: '1948-',
      bio: 'La defusión cognitiva observa los pensamientos como pensamientos, no como hechos. "Noto que tengo el pensamiento de que soy un fracasado" vs. "soy un fracasado".',
      keyContributions: ['ACT (1999)', 'Defusión cognitiva', 'Flexibilidad psicológica', 'Relational Frame Theory'],
    },
    {
      name: 'Christine Padesky',
      years: '1953-',
      bio: 'Amplió la TCC con las cuatro etapas del cambio de creencias centrales y el modelo de mente positiva: construir activamente fortalezas y recursos.',
      keyContributions: ['Mind Over Mood (1995)', 'Flecha descendente', 'Modelo de mente positiva (2012)'],
    },
  ],
  theoreticalSummary: 'La reestructuración cognitiva (Beck) examina la evidencia a favor y en contra de un pensamiento automático. Ellis complementa con la disputa racional de las creencias irracionales. Los experimentos conductuales (Bennett-Levy et al.) contrastan las predicciones del paciente con la realidad — la evidencia directa es más poderosa que la evidencia verbal. La tercera generación (Hayes) aporta la defusión cognitiva: no cambiar el contenido del pensamiento sino la relación funcional con él. Padesky profundiza con la flecha descendente para llegar a creencias centrales y el modelo de mente positiva.',
  exercises: [
    {
      id: 'reestructuracion_beck',
      title: 'Reestructuración Cognitiva (Beck)',
      instruction: 'Identificá un pensamiento automático y evaluá la evidencia como un científico evaluaría una hipótesis — con curiosidad, no con juicio.',
      fields: [
        { id: 'situacion', label: 'Situación: ¿qué estaba pasando?', type: 'textarea', placeholder: '' },
        { id: 'pensamiento', label: 'Pensamiento automático: ¿qué cruzó por tu mente?', type: 'textarea', placeholder: '' },
        { id: 'fuerza_creencia', label: 'Fuerza de creencia en el pensamiento', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0% No lo creo', scaleMaxLabel: '100% Totalmente' },
        { id: 'emocion', label: 'Emoción resultante y su intensidad (0-100)', type: 'textarea', placeholder: 'Ej: Ansiedad 75/100, Tristeza 60/100' },
        { id: 'distorsion', label: '¿Qué distorsión cognitiva podría estar operando?', type: 'checkbox', options: [
          'Pensamiento dicotómico (todo o nada)',
          'Catastrofización',
          'Sobregeneralización',
          'Filtro mental (foco selectivo en lo negativo)',
          'Descalificación de lo positivo',
          'Lectura del pensamiento',
          'Adivinación del futuro',
          'Razonamiento emocional ("lo siento, por lo tanto es verdad")',
          'Imperativos ("debería")',
          'Etiquetado',
          'Personalización',
          'Magnificación / minimización',
        ] },
        { id: 'evidencia_favor', label: '¿Qué evidencia hay A FAVOR de este pensamiento?', type: 'textarea', placeholder: '' },
        { id: 'evidencia_contra', label: '¿Qué evidencia hay EN CONTRA?', type: 'textarea', placeholder: '' },
        { id: 'pensamiento_alternativo', label: 'Pensamiento alternativo más equilibrado', type: 'textarea', placeholder: '' },
        { id: 'fuerza_alternativo', label: 'Fuerza de creencia en el pensamiento alternativo', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
        { id: 'emocion_despues', label: 'Emoción después de la reestructuración (0-100)', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'experimento_conductual',
      title: 'Experimento Conductual (Bennett-Levy)',
      instruction: 'Diseñá un experimento para contrastar tu predicción con la realidad. La evidencia directa es más poderosa que la evidencia verbal.',
      fields: [
        { id: 'prediccion', label: 'Predicción a evaluar: ¿qué creés que va a pasar?', type: 'textarea', placeholder: 'Ej: "Si digo lo que pienso, me van a rechazar"' },
        { id: 'fuerza_prediccion', label: 'Fuerza de creencia en la predicción', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
        { id: 'experimento', label: 'Experimento: ¿qué vas a hacer para probar esta predicción?', type: 'textarea', placeholder: '' },
        { id: 'resultado', label: 'Resultado: ¿qué pasó realmente?', type: 'textarea', placeholder: '' },
        { id: 'aprendizaje', label: '¿Qué aprendiste? ¿Qué dice esto sobre tu predicción original?', type: 'textarea', placeholder: '' },
        { id: 'fuerza_post', label: 'Fuerza de creencia en la predicción después del experimento', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
      ],
    },
    {
      id: 'defusion_hayes',
      title: 'Defusión Cognitiva (Hayes / ACT)',
      instruction: 'No cambiar el contenido del pensamiento sino la relación con él. Observar los pensamientos como eventos mentales, no como hechos.',
      fields: [
        { id: 'pensamiento_fusion', label: 'Paso 1 — Nombrá el pensamiento con el que estás fusionado/a', type: 'textarea', placeholder: 'Ej: "Soy un fracasado"' },
        { id: 'reformulacion', label: 'Paso 2 — Reformulá: "Estoy teniendo el pensamiento de que..."', type: 'textarea', placeholder: '' },
        { id: 'distancia', label: 'Paso 3 — ¿Cómo imaginás poner distancia con el pensamiento?', type: 'radio', options: [
          'Hojas flotando en un río',
          'Nubes pasando en el cielo',
          'Palabras en una pantalla',
          'Un vendedor ofreciendo algo que no necesito',
        ] },
        { id: 'accion_valores', label: 'Paso 4 — Independientemente de si este pensamiento está ahí, ¿qué acción alineada con tus valores podrías tomar hoy?', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'autocompasion_neff_gilbert',
      title: 'Autocompasión (Neff / Gilbert)',
      instruction: 'La autocrítica crónica activa el mismo sistema de alarma que una amenaza externa. Este ejercicio entrena una respuesta alternativa — no complacencia, sino bondad.',
      fields: [
        { id: 'situacion_autocritica', label: '¿Ante qué situación o error te criticás más duramente?', type: 'textarea', placeholder: '' },
        { id: 'voz_critica', label: '¿Qué te decís a vos mismo/a? (la voz crítica interna — sin filtro)', type: 'textarea', placeholder: '' },
        { id: 'tono_critica', label: '¿Con qué tono lo decís?', type: 'radio', options: ['Despectivo / humillante', 'Frío / indiferente', 'Exigente / implacable', 'Catastrofista'] },
        { id: 'mindfulness_neff', label: 'Paso 1 — Mindfulness (Neff): Reconocé lo que está pasando sin exagerar ni minimizar', type: 'textarea', placeholder: '"En este momento estoy sufriendo. Esta autocrítica me está causando dolor."' },
        { id: 'humanidad_compartida', label: 'Paso 2 — Humanidad compartida: ¿qué le dirías a un amigo/a que cometiera este mismo error?', type: 'textarea', placeholder: '' },
        { id: 'bondad', label: 'Paso 3 — Bondad hacia uno mismo: ¿qué necesitás escuchar ahora mismo?', type: 'textarea', placeholder: '' },
        { id: 'malestar_antes', label: 'Intensidad del malestar ANTES del ejercicio', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
        { id: 'malestar_despues', label: 'Intensidad del malestar DESPUÉS', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
      ],
    },
    {
      id: 'flecha_descendente',
      title: 'Flecha Descendente (Beck / Padesky)',
      instruction: 'Partí del pensamiento situacional y preguntá repetidamente: "Si eso fuera verdad, ¿qué significaría para vos?" hasta llegar a la creencia central.',
      fields: [
        { id: 'pa_inicial', label: 'Pensamiento automático (situacional)', type: 'textarea', placeholder: '' },
        { id: 'nivel_1', label: '"Si eso fuera verdad, ¿qué significaría para vos?" →', type: 'textarea', placeholder: '' },
        { id: 'nivel_2', label: '"Si eso fuera verdad, ¿qué significaría para vos?" →', type: 'textarea', placeholder: '' },
        { id: 'nivel_3', label: '"Si eso fuera verdad, ¿qué significaría para vos?" →', type: 'textarea', placeholder: '' },
        { id: 'creencia_central', label: 'Creencia central identificada (cuando llegás a algo profundo y fundamental)', type: 'textarea', placeholder: '' },
        { id: 'fuerza_cc', label: 'Intensidad de creencia en la creencia central', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
        { id: 'origen', label: '¿Cuándo recordás comenzar a creer esto sobre vos mismo/a?', type: 'textarea', placeholder: '' },
        { id: 'evidencia_contra_cc', label: '¿Qué evidencia existe en contra de esta creencia central? (Padesky)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 3: TERMÓMETRO EMOCIONAL ───────────────────────
const section3_TermometroEmocional: CbtSection = {
  id: 'cbt_emotional',
  menuId: 'emotional',
  title: 'Termómetro Emocional',
  subtitle: 'Intensidad emocional (SUDs), modelo tripartito y regulación emocional',
  quote: 'La emoción no es el problema — la relación con la emoción puede serlo.',
  quoteAuthor: 'Linehan',
  authors: [
    {
      name: 'Joseph Wolpe',
      years: '1915-1997',
      bio: 'Creador de la escala SUDs (Subjective Units of Disturbance Scale): 0 a 100 para medir la intensidad subjetiva del malestar.',
      keyContributions: ['SUDs (1969)', 'Desensibilización sistemática', 'Inhibición recíproca'],
    },
    {
      name: 'Peter Lang',
      years: '1930-',
      bio: 'Modelo tripartito de la emoción: las emociones tienen tres componentes disociables — cognitivo, fisiológico y conductual. La intervención puede entrar por cualquiera de los tres.',
      keyContributions: ['Modelo tripartito (1971)', 'Tres componentes emocionales'],
    },
    {
      name: 'James Gross',
      years: '1963-',
      bio: 'Modelo de proceso de regulación emocional: cinco estrategias en un continuum temporal. La revaluación cognitiva es la más adaptativa; la supresión es la más costosa.',
      keyContributions: ['Modelo de regulación emocional (1998)', 'Reappraisal vs. supresión'],
    },
    {
      name: 'Edna Foa',
      years: '1937-',
      bio: 'Teoría del procesamiento emocional: la exposición requiere activación de la estructura de miedo más información incompatible. Craske actualiza: el objetivo es maximizar la violación de expectativas.',
      keyContributions: ['Procesamiento emocional (1986)', 'Exposición prolongada para TEPT', 'PTSD Symptom Scale'],
    },
  ],
  theoreticalSummary: 'El registro emocional en TCC se fundamenta en la escala SUDs de Wolpe (0-100), el modelo tripartito de Lang (cognitivo, fisiológico, conductual) y el modelo de regulación emocional de Gross (selección situacional, modificación, despliegue atencional, cambio cognitivo, modulación de respuesta). Foa y Kozak aportan la teoría del procesamiento emocional: la exposición requiere activación de la estructura de miedo más información correctiva. Craske actualiza: el objetivo no es la reducción de SUDs sino maximizar la violación de expectativas.',
  exercises: [
    {
      id: 'registro_emocional_diario',
      title: 'Registro Emocional Diario (Wolpe / Lang / Gross)',
      instruction: 'Registrá tu estado emocional descomponiendo la emoción en sus tres componentes: cognitivo, fisiológico y conductual.',
      fields: [
        { id: 'emocion', label: 'Emoción predominante — nombrala con la mayor precisión posible', type: 'textarea', placeholder: '' },
        { id: 'suds', label: 'Intensidad SUDs (Wolpe)', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Sin malestar', scaleMaxLabel: 'Máximo malestar' },
        { id: 'componente_cognitivo', label: 'Componente cognitivo: ¿qué pensamientos acompañan a esta emoción?', type: 'textarea', placeholder: '' },
        { id: 'componente_fisiologico', label: 'Componente fisiológico (Lang): ¿cómo se manifiesta en el cuerpo?', type: 'checkbox', options: [
          'Taquicardia / corazón acelerado',
          'Tensión muscular',
          'Opresión en pecho / garganta',
          'Náuseas / malestar digestivo',
          'Sudoración / temblor',
          'Fatiga / pesadez',
          'Inquietud / necesidad de mover el cuerpo',
        ] },
        { id: 'componente_conductual', label: 'Componente conductual: ¿qué tendiste a hacer — o a evitar?', type: 'textarea', placeholder: '' },
        { id: 'estrategia_regulacion', label: 'Estrategia de regulación usada (Gross)', type: 'radio', options: [
          'La evité / suprimí',
          'La acepté sin actuar',
          'La reevalué / cambié mi perspectiva',
          'Usé técnica de relajación',
          'Actué según mis valores a pesar de la emoción',
        ] },
        { id: 'suds_post', label: 'SUDs después de la estrategia', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0', scaleMaxLabel: '100' },
        { id: 'situacion_disparadora', label: 'Situación disparadora (A del modelo ABC)', type: 'textarea', placeholder: '' },
        { id: 'pensamiento_mediador', label: 'Pensamiento mediador (B del modelo)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 4: REGISTRO DE PENSAMIENTOS ───────────────────
const section4_RegistroPensamientos: CbtSection = {
  id: 'cbt_unconscious',
  menuId: 'unconscious',
  title: 'Registro de Pensamientos',
  subtitle: 'Diario cognitivo: pensamientos automáticos, rumiación, preocupación y metacognición',
  quote: 'La mente produce pensamientos constantemente — podemos aprender a observarlos, no a obedecerlos.',
  quoteAuthor: 'Hayes',
  authors: [
    {
      name: 'Aaron Beck & Ann Weissman',
      years: '',
      bio: 'La Dysfunctional Attitude Scale (DAS, 1978) mide actitudes y creencias disfuncionales subyacentes que diferencian personas vulnerables a la depresión.',
      keyContributions: ['DAS (1978)', 'Registro de pensamientos disfuncionales'],
    },
    {
      name: 'Susan Nolen-Hoeksema',
      years: '1959-2013',
      bio: 'La rumiación es el foco repetitivo y pasivo en los síntomas de malestar y sus posibles causas. Es mantenedor crítico de la depresión — no es preocupación (orientada al futuro) sino orientada al pasado.',
      keyContributions: ['Response Styles Theory (1991)', 'Rumiación vs. distracción'],
    },
    {
      name: 'Thomas Borkovec',
      years: '1940-',
      bio: 'La preocupación es pensamiento verbal anticipatorio sobre eventos futuros negativos. Funciona como regulación emocional a corto plazo (menos activadora que las imágenes), lo que refuerza el hábito.',
      keyContributions: ['Modelo de la preocupación (1994)', 'Técnica del tiempo de preocupación'],
    },
    {
      name: 'Adrian Wells',
      years: '1962-',
      bio: 'Las metacogniciones — creencias sobre los propios pensamientos — son lo que mantiene los trastornos emocionales. Modelo S-REF: fusión pensamiento-acción, metacreencias positivas y negativas sobre la preocupación.',
      keyContributions: ['Terapia metacognitiva (1995)', 'Modelo S-REF', 'Metacreencias'],
    },
  ],
  theoreticalSummary: 'El diario cognitivo registra pensamientos automáticos distinguiendo tres tipos: pensamientos situacionales, rumiación (Nolen-Hoeksema — foco repetitivo en el pasado/síntomas) y preocupación (Borkovec — anticipación verbal de eventos futuros negativos). Wells añade la dimensión metacognitiva: las creencias sobre los propios pensamientos ("debo controlar este pensamiento", "preocuparme me prepara") son las que mantienen los trastornos, más que los pensamientos de primer orden.',
  exercises: [
    {
      id: 'diario_cognitivo',
      title: 'Diario Cognitivo Diario',
      instruction: 'Registrá un pensamiento significativo identificando si es un pensamiento automático situacional, rumiación o preocupación.',
      fields: [
        { id: 'situacion', label: 'Situación: ¿qué estaba pasando?', type: 'textarea', placeholder: '' },
        { id: 'pensamiento_auto', label: 'Pensamiento automático: ¿qué cruzó por tu mente?', type: 'textarea', placeholder: '' },
        { id: 'fuerza', label: 'Fuerza de creencia en el pensamiento', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: '0%', scaleMaxLabel: '100%' },
        { id: 'tipo_pensamiento', label: '¿Es rumiación, preocupación o pensamiento situacional?', type: 'radio', options: [
          'Rumiación: estoy dando vueltas sobre algo del pasado o mis síntomas',
          'Preocupación: estoy anticipando un evento futuro negativo',
          'Pensamiento automático situacional: respuesta a una situación presente',
          'No lo sé',
        ] },
        { id: 'rumiacion_wells', label: 'Si es rumiación: ¿estoy resolviendo algo o solo amplifico el malestar? (Wells)', type: 'textarea', placeholder: '' },
        { id: 'preocupacion_borkovec', label: 'Si es preocupación: ¿es sobre algo que puedo controlar? (Borkovec)', type: 'radio', options: [
          'Sí → ¿qué acción concreta puedo tomar?',
          'No → ¿qué gano con seguir preocupándome?',
        ] },
        { id: 'metacognicion', label: '¿Tenés alguna creencia sobre este pensamiento mismo? (Wells — metacognición)', type: 'checkbox', options: [
          '"Debo controlar este pensamiento"',
          '"Tener este pensamiento significa algo sobre mí"',
          '"Si me preocupo, estoy preparado/a"',
          '"No puedo parar de pensar en esto"',
        ] },
        { id: 'utilidad_metacreencia', label: '¿Es útil o rígida esa metacreencia?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 5: ALIANZA TERAPÉUTICA ────────────────────────
const section5_AlianzaTerapeutica: CbtSection = {
  id: 'cbt_alliance',
  menuId: 'alliance',
  title: 'Alianza Terapéutica',
  subtitle: 'Empirismo colaborativo, rupturas de alianza y retroalimentación sistemática',
  quote: 'El terapeuta y el paciente son co-investigadores de las hipótesis del paciente.',
  quoteAuthor: 'Beck',
  authors: [
    {
      name: 'Aaron Beck',
      years: '1921-2021',
      bio: 'El empirismo colaborativo: terapeuta y paciente son co-investigadores que evalúan juntos las hipótesis cognitivas. El terapeuta no corrige — diseña experimentos.',
      keyContributions: ['Empirismo colaborativo', 'Descubrimiento guiado'],
    },
    {
      name: 'Jeremy Safran & Zindel Segal',
      years: '',
      bio: 'Investigaron las rupturas de alianza en TCC: momentos de deterioro relacional que son tanto obstáculo como oportunidad terapéutica. Las rupturas se correlacionan con las mismas creencias interpersonales del paciente.',
      keyContributions: ['Rupturas de alianza (1990)', 'Ruptura de confrontación vs. retirada'],
    },
    {
      name: 'Scott Miller',
      years: '1960-',
      bio: 'Desarrolló el Feedback-Informed Treatment (FIT): sin retroalimentación sistemática, los terapeutas no detectan el deterioro del paciente mejor que el azar. ORS y SRS como instrumentos breves.',
      keyContributions: ['FIT', 'ORS — Outcome Rating Scale', 'SRS — Session Rating Scale'],
    },
  ],
  theoreticalSummary: 'La alianza terapéutica en TCC se basa en el empirismo colaborativo de Beck: terapeuta y paciente como co-investigadores. Safran y Segal investigaron las rupturas de alianza — momentos de deterioro relacional que replican los patrones interpersonales del paciente y que, cuando se resuelven, constituyen momentos terapéuticos potentes. Miller desarrolló el FIT (Feedback-Informed Treatment) con escalas breves (ORS y SRS) para detectar deterioro precozmente.',
  exercises: [
    {
      id: 'registro_post_sesion_tcc',
      title: 'Registro Post-Sesión (Miller / Safran)',
      instruction: 'Evaluá cómo fue la sesión usando las escalas de resultados y alianza, e identificá si hubo rupturas.',
      fields: [
        { id: 'ors_individual', label: 'ORS — Bienestar personal (última semana)', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Muy mal', scaleMaxLabel: 'Muy bien' },
        { id: 'ors_interpersonal', label: 'ORS — Relaciones cercanas', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Muy mal', scaleMaxLabel: 'Muy bien' },
        { id: 'ors_social', label: 'ORS — Trabajo, estudio, vida cotidiana', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Muy mal', scaleMaxLabel: 'Muy bien' },
        { id: 'ors_general', label: 'ORS — Bienestar general', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Muy mal', scaleMaxLabel: 'Muy bien' },
        { id: 'srs_escuchado', label: 'SRS — ¿Te sentiste escuchado/a, comprendido/a y respetado/a?', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'No del todo', scaleMaxLabel: 'Completamente' },
        { id: 'srs_tema', label: 'SRS — ¿Trabajamos en lo que querías trabajar?', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'No del todo', scaleMaxLabel: 'Completamente' },
        { id: 'srs_enfoque', label: 'SRS — ¿El enfoque del terapeuta te pareció apropiado?', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'No del todo', scaleMaxLabel: 'Completamente' },
        { id: 'srs_general', label: 'SRS — ¿Fue la sesión lo que necesitabas?', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'No del todo', scaleMaxLabel: 'Completamente' },
        { id: 'ruptura', label: '¿Hubo algún momento de ruptura? (Safran & Segal)', type: 'radio', options: ['No', 'Sí — pude expresarlo', 'Sí — no pude expresarlo'] },
        { id: 'ruptura_descripcion', label: 'Si hubo ruptura, describila', type: 'textarea', placeholder: '' },
        { id: 'tarea_lleva', label: '¿Qué tarea te llevás?', type: 'textarea', placeholder: '' },
        { id: 'tarea_claridad', label: '¿Qué tan comprensible y relevante te parece esa tarea?', type: 'scale', scaleMin: 0, scaleMax: 10, scaleMinLabel: 'Nada clara', scaleMaxLabel: 'Muy clara y relevante' },
      ],
    },
  ],
};

// ─── SECCIÓN 6: LÍNEA DE VIDA ──────────────────────────────
const section6_LineaDeVida: CbtSection = {
  id: 'cbt_timeline',
  menuId: 'timeline',
  title: 'Línea de Vida',
  subtitle: 'Historia de aprendizaje, esquemas disfuncionales tempranos y trauma',
  quote: 'Los patrones actuales fueron soluciones aprendidas en contextos pasados.',
  quoteAuthor: 'Young',
  authors: [
    {
      name: 'Stephen Haynes & William O\'Brien',
      years: '',
      bio: 'El análisis funcional longitudinal reconstruye la historia de aprendizaje que estableció los patrones actuales: cuándo y en qué contexto se aprendió, qué la reforzó, por qué persiste.',
      keyContributions: ['Análisis funcional longitudinal (1990)'],
    },
    {
      name: 'Joseph LeDoux',
      years: '1949-',
      bio: 'Demostró las dos vías del miedo condicionado: la vía corta (tálamo→amígdala, rápida, preconsciente) y la vía larga (tálamo→corteza→amígdala, contextual). En el trauma, la vía corta queda hiperactiva.',
      keyContributions: ['The Emotional Brain (1996)', 'Vía corta y vía larga del miedo'],
    },
    {
      name: 'Jeffrey Young',
      years: '1950-',
      bio: 'Los Esquemas Disfuncionales Tempranos son patrones emocionales y cognitivos amplios, desarrollados en la infancia y disfuncionales. 18 esquemas en 5 dominios.',
      keyContributions: ['Terapia de Esquemas (2003)', '18 EDT: abandono, desconfianza, privación emocional, defectuosidad, fracaso, dependencia, subyugación, normas inalcanzables...'],
    },
  ],
  theoreticalSummary: 'La línea de vida en TCC integra el análisis funcional longitudinal (Haynes): para cada problema actual se identifica cuándo se aprendió y qué lo reforzó. LeDoux demostró las dos vías del miedo condicionado — en el trauma, la vía corta (subcortical) queda hiperactiva. Young extendió la TCC para trastornos de personalidad con los 18 Esquemas Disfuncionales Tempranos organizados en cinco dominios: desconexión, autonomía deteriorada, límites deteriorados, tendencia al otro, hipervigilancia.',
  exercises: [
    {
      id: 'mapa_temporal_aprendizaje',
      title: 'Mapa Temporal de Aprendizaje (Haynes / Young)',
      instruction: 'Reconstruí tu historia de aprendizaje identificando experiencias tempranas, patrones de condicionamiento y esquemas que se instalaron.',
      fields: [
        { id: 'experiencia_temprana', label: 'Experiencia de aprendizaje temprana (condicionamiento, modelado)', type: 'textarea', placeholder: 'Edad y descripción...' },
        { id: 'trauma_significativo', label: 'Trauma o evento significativo que estableció creencias centrales', type: 'textarea', placeholder: '' },
        { id: 'inicio_patron', label: 'Inicio del patrón problema: ¿cuándo comenzó la conducta / el síntoma?', type: 'textarea', placeholder: '' },
        { id: 'momento_cambio', label: 'Momentos de cambio o recursos: experiencias que fortalecieron recursos', type: 'textarea', placeholder: '' },
        { id: 'evento_precipitante', label: 'Evento precipitante del episodio actual', type: 'textarea', placeholder: '' },
        { id: 'creencia_instalada', label: 'Creencia que quedó instalada de estas experiencias', type: 'textarea', placeholder: '' },
        { id: 'patron_conductual', label: 'Patrón de conducta resultante', type: 'textarea', placeholder: '' },
        { id: 'esquemas_young', label: 'Esquemas identificados (Young): ¿cuáles se repiten en tu historia?', type: 'checkbox', options: [
          'Abandono / inestabilidad',
          'Desconfianza / abuso',
          'Privación emocional',
          'Defectuosidad / vergüenza',
          'Fracaso',
          'Dependencia',
          'Subyugación',
          'Normas inalcanzables',
        ] },
        { id: 'origen_esquema', label: '¿En qué contextos de tu historia se originó este esquema?', type: 'textarea', placeholder: '' },
        { id: 'manifestacion_hoy', label: '¿Cómo se manifiesta hoy?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 7: TAREAS ENTRE SESIONES ──────────────────────
const section7_TareasSesiones: CbtSection = {
  id: 'cbt_tasks',
  menuId: 'tasks',
  title: 'Tareas entre Sesiones',
  subtitle: 'Exposición gradual, activación conductual, registro y experimentos entre sesiones',
  quote: 'El aprendizaje fuera del consultorio es el que generaliza.',
  quoteAuthor: 'Kazantzis',
  authors: [
    {
      name: 'Nikolaos Kazantzis',
      years: '1970-',
      bio: 'Su meta-análisis demostró que las tareas entre sesiones predicen significativamente mejores resultados en TCC. Factores clave: colaboración en el diseño, relevancia percibida, dificultad calibrada, revisión en sesión.',
      keyContributions: ['Meta-análisis tareas TCC (2000)', 'Adherencia a tareas'],
    },
    {
      name: 'David Barlow',
      years: '1942-',
      bio: 'Principios de exposición gradual: gradualidad, duración suficiente, frecuencia alta, sin conductas de seguridad. La violación de expectativas es más importante que la habituación.',
      keyContributions: ['Anxiety and Its Disorders (2002)', 'Protocolo Unificado transdiagnóstico (2011)'],
    },
    {
      name: 'Christopher Martell',
      years: '',
      bio: 'La activación conductual (BA) demuestra que la depresión reduce la actividad → la reducción de actividad mantiene la depresión. El tratamiento rompe el ciclo programando actividades placenteras y de maestría.',
      keyContributions: ['Depression in Context (2001)', 'Activación conductual'],
    },
  ],
  theoreticalSummary: 'Las tareas entre sesiones son el mecanismo de generalización en TCC. Kazantzis demostró que predicen mejores resultados. Barlow estableció los principios de exposición gradual: gradualidad, duración, frecuencia y sin conductas de seguridad. Martell desarrolló la activación conductual: programar actividades placenteras y de maestría para romper el ciclo de la depresión. Marlatt aporta la prevención de recaídas: identificar situaciones de alto riesgo, señales de alerta y planes de contingencia.',
  exercises: [
    {
      id: 'tarea_semanal_tcc',
      title: 'Tarea de la Semana',
      instruction: 'Registrá la tarea acordada con tu terapeuta, completala durante la semana, y anotá los resultados.',
      fields: [
        { id: 'tipo_tarea', label: '¿Qué tipo de tarea es?', type: 'select', options: [
          'Registro de pensamientos — completar RPD (Beck)',
          'Experimento conductual — probar una predicción',
          'Exposición gradual — enfrentar algo evitado (Barlow)',
          'Activación conductual — programar actividades (Martell)',
          'Práctica de habilidad DBT (Linehan)',
          'Ejercicio de defusión (Hayes / ACT)',
          'Práctica de autocompasión (Neff / Gilbert)',
          'Mindfulness — práctica formal o informal',
          'Práctica de relajación — respiración, PMR (Jacobson)',
        ] },
        { id: 'descripcion_tarea', label: 'Descripción específica de la tarea', type: 'textarea', placeholder: '' },
        { id: 'dificultad_predicha', label: 'Dificultad predicha', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Muy fácil', scaleMaxLabel: 'Muy difícil' },
        { id: 'completada', label: '¿Pudiste completarla?', type: 'radio', options: ['Sí, completamente', 'Parcialmente', 'No'] },
        { id: 'dificultad_real', label: 'Dificultad real', type: 'scale', scaleMin: 0, scaleMax: 100, scaleMinLabel: 'Muy fácil', scaleMaxLabel: 'Muy difícil' },
        { id: 'obstaculos', label: '¿Qué obstáculos aparecieron? (cognitivos, emocionales, situacionales)', type: 'textarea', placeholder: '' },
        { id: 'aprendizaje', label: '¿Qué aprendiste de esta experiencia?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 8: LOGROS TERAPÉUTICOS ────────────────────────
const section8_LogrosTerapeuticos: CbtSection = {
  id: 'cbt_rewards',
  menuId: 'rewards',
  title: 'Logros Terapéuticos',
  subtitle: 'Evidencia de progreso, creencias alternativas, prevención de recaídas',
  quote: 'Cada pequeño logro es evidencia que debilita la creencia negativa.',
  quoteAuthor: 'Beck',
  authors: [
    {
      name: 'Aaron Beck',
      years: '1921-2021',
      bio: 'Los logros terapéuticos son evidencia que modifica directamente las creencias centrales. La acumulación de evidencia contraria a la creencia disfuncional es el mecanismo central del cambio.',
      keyContributions: ['Creencias centrales', 'Acumulación de evidencia'],
    },
    {
      name: 'G. Alan Marlatt',
      years: '1941-2011',
      bio: 'Desarrolló el modelo de prevención de recaídas: identificar situaciones de alto riesgo, señales de alerta temprana y planes de contingencia. La recaída no es fracaso — es información.',
      keyContributions: ['Relapse Prevention (1985)', 'Situaciones de alto riesgo'],
    },
    {
      name: 'Albert Bandura',
      years: '1925-2021',
      bio: 'La autoeficacia percibida — creencia en la propia capacidad — se fortalece principalmente mediante logros de ejecución directa. Cada logro aumenta la autoeficacia para desafíos similares.',
      keyContributions: ['Autoeficacia (1977)', 'Logros de ejecución como fuente primaria'],
    },
  ],
  theoreticalSummary: 'Los logros terapéuticos en TCC no son solo hitos de progreso — son evidencia empírica que modifica directamente las creencias centrales (Beck). Bandura demuestra que los logros de ejecución son la fuente más poderosa de autoeficacia. Marlatt aporta el modelo de prevención de recaídas: la sostenibilidad del cambio requiere identificar señales de alerta temprana y planes de contingencia.',
  exercises: [
    {
      id: 'registro_logro_tcc',
      title: 'Registro de Logro Terapéutico',
      instruction: 'Cada logro es evidencia contra la creencia disfuncional. Registralo con detalle — la evidencia concreta es más poderosa que la verbal.',
      fields: [
        { id: 'tipo_logro', label: '¿Qué tipo de logro fue?', type: 'checkbox', options: [
          'Identifiqué un pensamiento automático en el momento',
          'Cuestioné una creencia y encontré evidencia en contra',
          'Hice algo que venía evitando (exposición)',
          'Completé una actividad a pesar del bajo ánimo (activación conductual)',
          'Toleré malestar sin intentar eliminarlo (ACT / aceptación)',
          'Actué según mis valores a pesar de la emoción difícil',
          'Me traté con autocompasión en vez de autocrítica',
          'Sostuve un logro durante más de una semana',
        ] },
        { id: 'descripcion_logro', label: '¿Qué hiciste exactamente?', type: 'textarea', placeholder: '' },
        { id: 'dificultad_superada', label: '¿Qué obstáculo interno (pensamiento, emoción, impulso de evitar) tuviste que atravesar?', type: 'textarea', placeholder: '' },
        { id: 'creencia_negativa', label: 'Creencia negativa que este logro desafía', type: 'textarea', placeholder: '' },
        { id: 'evidencia_genera', label: 'Este logro demuestra que...', type: 'textarea', placeholder: '' },
        { id: 'senal_alerta', label: 'Plan de mantenimiento (Marlatt): señal de alerta temprana si este logro se revierte', type: 'textarea', placeholder: '' },
        { id: 'primera_accion', label: 'Primera acción ante esa señal', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 9: MONITOREO DE RESULTADOS ────────────────────
const section9_MonitoreoResultados: CbtSection = {
  id: 'cbt_monitoring',
  menuId: 'monitoring',
  title: 'Monitoreo de Resultados',
  subtitle: 'PHQ-9, GAD-7, fases del cambio y medición sistemática del progreso',
  quote: 'Lo que no se mide no se puede mejorar.',
  quoteAuthor: 'Eysenck',
  authors: [
    {
      name: 'James Prochaska & Carlo DiClemente',
      years: '',
      bio: 'Modelo de las fases del cambio: precontemplación, contemplación, preparación, acción y mantenimiento. Las intervenciones deben adaptarse a la fase.',
      keyContributions: ['Modelo transteórico del cambio (1983)', 'Cinco fases del cambio'],
    },
    {
      name: 'Aaron Beck & Robert Steer',
      years: '',
      bio: 'El BDI-II (21 ítems, 0-63) evalúa gravedad de la depresión. El BAI (21 ítems, 0-63) evalúa síntomas de ansiedad. Estándares internacionales de medición en TCC.',
      keyContributions: ['BDI-II (1996)', 'BAI (1993)'],
    },
    {
      name: 'Robert Spitzer & Kurt Kroenke',
      years: '',
      bio: 'PHQ-9 (9 ítems) y GAD-7 (7 ítems): instrumentos breves, gratuitos y con excelentes propiedades psicométricas para seguimiento sesión a sesión.',
      keyContributions: ['PHQ-9 (2002)', 'GAD-7 (2006)'],
    },
  ],
  theoreticalSummary: 'La TCC se distingue por su compromiso con la medición sistemática del progreso. El modelo de Prochaska y DiClemente identifica cinco fases del cambio con intervenciones diferenciadas. Los instrumentos estándar incluyen BDI-II y BAI (Beck), PHQ-9 y GAD-7 (Spitzer/Kroenke). La medición sesión a sesión permite detectar deterioro precoz — sin retroalimentación, los terapeutas no detectan el deterioro mejor que el azar (Miller).',
  exercises: [
    {
      id: 'evaluacion_semanal',
      title: 'Evaluación Semanal Rápida (PHQ-9 / GAD-7)',
      instruction: 'Completá estas escalas breves semanalmente. La medición permite detectar progreso y deterioro precozmente.',
      fields: [
        { id: 'fase_cambio', label: '¿En qué fase del cambio sentís que estás? (Prochaska)', type: 'radio', options: [
          'Precontemplación: no estoy seguro/a de tener un problema',
          'Contemplación: veo el problema pero tengo dudas sobre cambiar',
          'Preparación: quiero cambiar y estoy dando pequeños pasos',
          'Acción: estoy haciendo cambios activos y sostenidos',
          'Mantenimiento: estoy consolidando los cambios logrados',
        ] },
        { id: 'phq_1', label: 'PHQ-9: Poco interés o placer en hacer cosas', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_2', label: 'PHQ-9: Sentirte decaído/a, deprimido/a o sin esperanza', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_3', label: 'PHQ-9: Dificultad para dormir o dormir demasiado', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_4', label: 'PHQ-9: Sentirte cansado/a o con poca energía', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_5', label: 'PHQ-9: Poco apetito o comer en exceso', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_6', label: 'PHQ-9: Sentirte mal con vos mismo/a o que sos un fracaso', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_7', label: 'PHQ-9: Dificultad para concentrarte', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_8', label: 'PHQ-9: Moverte/hablar más lento o estar muy agitado/a', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'phq_9', label: 'PHQ-9: Pensamientos de que estarías mejor muerto/a o de hacerte daño', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_1', label: 'GAD-7: Sentirte nervioso/a, ansioso/a o al límite', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_2', label: 'GAD-7: No poder dejar de preocuparte', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_3', label: 'GAD-7: Preocuparte demasiado por diferentes cosas', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_4', label: 'GAD-7: Dificultad para relajarte', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_5', label: 'GAD-7: Estar tan inquieto/a que es difícil quedarte quieto/a', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_6', label: 'GAD-7: Enojarte o irritarte fácilmente', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'gad_7', label: 'GAD-7: Sentir miedo de que algo terrible pudiera pasar', type: 'scale', scaleMin: 0, scaleMax: 3, scaleMinLabel: 'Nunca', scaleMaxLabel: 'Casi todos los días' },
        { id: 'funcionamiento', label: '¿En qué medida estos problemas dificultaron tu funcionamiento general?', type: 'radio', options: ['Nada', 'Algo difícil', 'Muy difícil', 'Extremadamente difícil'] },
      ],
    },
  ],
};

// ─── SECCIÓN 10: LAURA — ASISTENTE COGNITIVO ───────────────
const section10_LauraAsistenteCognitivo: CbtSection = {
  id: 'cbt_assistant',
  menuId: 'assistant',
  title: 'Laura — Asistente Cognitivo',
  subtitle: 'Acompañamiento entre sesiones desde el modelo cognitivo-conductual: reestructuración, experimentos y psicoeducación',
  quote: 'El objetivo no es pensar positivo — es pensar con precisión.',
  quoteAuthor: 'Beck',
  theoreticalSummary:
    'Desde la TCC, Laura funciona como un recurso de psicoeducación y práctica guiada entre sesiones. Utiliza preguntas socráticas (Beck) para guiar el descubrimiento — no da la respuesta. Facilita la identificación de pensamientos automáticos, la evaluación de evidencia a favor y en contra, y la generación de pensamientos alternativos. Puede guiar experimentos conductuales planificados y activación conductual. Desde la tercera ola, Laura puede facilitar ejercicios de defusión cognitiva (Hayes/ACT), mindfulness informal y autocompasión (Neff/Gilbert). Limitación: Laura no reemplaza la conceptualización del caso ni la alianza terapéutica. Los experimentos conductuales requieren supervisión profesional.',
  authors: [
    { name: 'Aaron T. Beck', years: '1921-2021', bio: 'El empirismo colaborativo y las preguntas socráticas son el motor del cambio cognitivo. Laura usa este método para guiar el autodescubrimiento.', keyContributions: ['Preguntas socráticas', 'Empirismo colaborativo', 'Reestructuración cognitiva'] },
    { name: 'Steven Hayes', years: '1948-', bio: 'La defusión cognitiva cambia la relación con los pensamientos sin intentar modificar su contenido. Laura puede facilitar ejercicios de desliteralización.', keyContributions: ['Defusión cognitiva', 'ACT', 'Hexaflex'] },
    { name: 'Nikolaos Kazantzis', years: '', bio: 'Las tareas entre sesiones son el mecanismo principal de generalización del aprendizaje terapéutico. Laura facilita la adherencia y el seguimiento.', keyContributions: ['Tareas terapéuticas', 'Generalización', 'Adherencia'] },
  ],
  exercises: [],
};

// ─── EXPORT ────────────────────────────────────────────────
export const CBT_SECTIONS: CbtSection[] = [
  section1_HistoriaClinica,
  section2_EntrenamientoCognitivo,
  section3_TermometroEmocional,
  section4_RegistroPensamientos,
  section5_AlianzaTerapeutica,
  section6_LineaDeVida,
  section7_TareasSesiones,
  section8_LogrosTerapeuticos,
  section9_MonitoreoResultados,
  section10_LauraAsistenteCognitivo,
];
