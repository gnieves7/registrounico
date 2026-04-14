// ============================================================
// CONTENIDO CLÍNICO COMPLETO — ENFOQUE PSICOANALÍTICO
// Sistema Reflexionar · .PSI. · 2026
// ============================================================

import type { HumanisticSection } from './humanisticContent';

// Re-export shared type
export type PsychoanalyticSection = HumanisticSection;

// ─── MARCO EPISTEMOLÓGICO ───────────────────────────────────
export const PSYCHOANALYTIC_EPISTEMOLOGY = {
  title: 'Las cuatro generaciones del psicoanálisis',
  description: 'El psicoanálisis no es una teoría — es un campo en permanente tensión interna. Desde Freud hasta los desarrollos contemporáneos, cada generación no solo amplió la anterior sino que la cuestionó en sus fundamentos.',
  generations: [
    {
      name: 'Primera Generación — Freud y la metapsicología clásica (1895-1939)',
      principle: 'El objeto es el inconsciente. El método es la interpretación.',
      authors: 'Sigmund Freud',
      concepts: [
        'Primera tópica: Inconsciente (proceso primario), Preconsciente, Consciente',
        'Segunda tópica: Ello (pulsiones), Yo (defensa), Superyó (ideal y prohibición)',
        'Pulsiones de vida (Eros) vs. pulsión de muerte (Tánatos)',
        'Compulsión de repetición: los pacientes repiten en lugar de recordar',
        'Asociación libre, atención flotante, interpretación, transferencia, contratransferencia',
        'Complejo de Edipo como núcleo de la estructuración subjetiva',
        'Mecanismos de defensa: represión, proyección, formación reactiva, aislamiento, sublimación',
      ],
    },
    {
      name: 'Segunda Generación — Relaciones de objeto (1920-1960)',
      principle: 'El objeto es la relación con el otro. El conflicto se sitúa en la temprana infancia.',
      authors: 'Anna Freud, Melanie Klein, Donald Winnicott',
      concepts: [
        'Anna Freud: sistematización de defensas, identificación con el agresor, líneas del desarrollo, perfil metapsicológico',
        'Klein: posición esquizo-paranoide y depresiva, identificación proyectiva, envidia primaria, reparación',
        'Winnicott: self verdadero y falso, holding/handling/object-presenting, espacio transicional, capacidad de estar solo',
      ],
    },
    {
      name: 'Tercera Generación — Psicología del Self (1960-1990)',
      principle: 'El objeto es la cohesión del self y la organización de la personalidad.',
      authors: 'Heinz Kohut, Otto Kernberg, Bion',
      concepts: [
        'Kohut: necesidades de self-objeto (especular, idealización, gemelar), falla empática, internalización transmutadora',
        'Kernberg: organización neurótica/limítrofe/psicótica, difusión de identidad, TFP',
        'Bion: función alfa/elementos beta, capacidad de reverie, tolerancia a la no-comprensión',
      ],
    },
    {
      name: 'Cuarta Generación — Intersubjetividad y mentalización (1990-presente)',
      principle: 'El objeto es la intersubjetividad y la regulación afectiva.',
      authors: 'Peter Fonagy, Thomas Ogden, Mark Solms, Jaak Panksepp',
      concepts: [
        'Fonagy: mentalización (función reflexiva), MBT, modos pre-mentalizantes (equivalencia psíquica, modo simulado, modo teleológico)',
        'Ogden: tercero analítico subjetivo, reverie analítica como instrumento clínico',
        'Solms: neuropsicoanálisis, correlatos neurobiológicos de la pulsión (sistema SEEKING)',
        'Panksepp: siete sistemas emocionales primarios (SEEKING, RAGE, FEAR, LUST, CARE, PANIC/GRIEF, PLAY)',
      ],
    },
  ],
};

// ─── AFECTOS PSICOANALÍTICOS ────────────────────────────────
export const PSYCHOANALYTIC_AFFECTS = {
  primary: [
    { emoji: '😰', label: 'Angustia', description: 'Señal de peligro del yo ante una moción pulsional amenazante (Freud, 1926)' },
    { emoji: '💔', label: 'Culpa', description: 'Angustia depresiva por haber dañado al objeto amado (Klein — posición depresiva)' },
    { emoji: '😶', label: 'Vergüenza', description: 'Exposición del yo ante la mirada del ideal — ser visto en la propia deficiencia' },
    { emoji: '🕳️', label: 'Vacío', description: 'Ausencia de investidura, empobrecimiento del yo (Kohut — déficit narcisista)' },
    { emoji: '😤', label: 'Hostilidad', description: 'Agresión dirigida al objeto interno o externo — pulsión de muerte (Freud/Klein)' },
    { emoji: '🌑', label: 'Melancolía', description: 'La sombra del objeto cae sobre el yo — pérdida que no puede elaborarse (Freud, 1917)' },
    { emoji: '🎭', label: 'Manía', description: 'Defensa maníaca ante la angustia depresiva — negación omnipotente del duelo (Klein)' },
    { emoji: '❤️', label: 'Amor de objeto', description: 'Investidura libidinal del objeto — genuino interés por el otro como sujeto' },
  ],
  defensive_destinos: [
    { label: 'Represión del afecto', description: 'La representación se reprime pero el afecto busca otro destino' },
    { label: 'Conversión somática', description: 'El afecto se corporiza — el cuerpo habla lo que la palabra no puede' },
    { label: 'Desplazamiento', description: 'El afecto se transfiere a una representación sustitutiva' },
    { label: 'Transformación en lo contrario', description: 'El afecto se invierte — el odio deviene amor excesivo' },
    { label: 'Angustia flotante', description: 'El quantum de afecto queda libre, sin representación — angustia sin objeto' },
  ],
};

// ─── SECCIÓN 1: HISTORIA DEL SUJETO ────────────────────────
const section1_HistoriaDelSujeto: PsychoanalyticSection = {
  id: 'psychoanalytic_history',
  menuId: 'history',
  title: 'Historia del Sujeto',
  subtitle: 'Construcción subjetiva del pasado, cronología del conflicto y resignificación (après-coup)',
  quote: 'El pasado no está detrás de nosotros — está dentro de nosotros, transformándonos sin que lo sepamos.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'Fundador del psicoanálisis. La historia en Freud no es registro cronológico sino construcción subjetiva: el concepto de Nachträglichkeit (après-coup) establece que los eventos adquieren significación patógena retroactivamente.',
      keyContributions: ['Nachträglichkeit (après-coup)', 'Construcciones en el análisis (1937)', 'Compulsión de repetición', 'Complejo de Edipo'],
    },
    {
      name: 'Anna Freud',
      years: '1895-1982',
      bio: 'Sistematizadora de la psicología del yo. Su concepto de líneas del desarrollo permite evaluar la historia no como eventos sino como progresión a lo largo de ejes relacionales específicos.',
      keyContributions: ['Líneas del desarrollo', 'Perfil metapsicológico (1962)', 'Disarmonías del desarrollo', 'Identificación con el agresor'],
    },
    {
      name: 'John Bowlby',
      years: '1907-1990',
      bio: 'Demostró que la calidad del vínculo temprano con los cuidadores determina los modelos operativos internos: representaciones de las relaciones que organizan las expectativas vinculares futuras.',
      keyContributions: ['Teoría del apego', 'Modelos operativos internos', 'Attachment and Loss (3 vols.)'],
    },
    {
      name: 'Peter Fonagy',
      years: '1952-',
      bio: 'Integró psicoanálisis con teoría del apego. Operacionalizó la coherencia narrativa: la forma en que un adulto relata su historia de apego predice la seguridad del apego de sus hijos.',
      keyContributions: ['Mentalización / función reflexiva', 'Adult Attachment Interview (con Mary Main)', 'MBT'],
    },
  ],
  theoreticalSummary: 'En psicoanálisis la historia no es una línea causal directa del pasado al presente. El concepto de Nachträglichkeit (après-coup, posterioridad) es fundamental: los eventos del pasado adquieren su significación patógena retroactivamente, cuando un evento posterior les da un nuevo sentido. La historia que se construye en análisis no es un descubrimiento de lo que "realmente ocurrió" — es una construcción que tiene efectos terapéuticos por sí misma (Construcciones en el análisis, Freud 1937). Anna Freud propone organizar la historia siguiendo las líneas del desarrollo. Bowlby y Fonagy demuestran que la coherencia narrativa con que un adulto relata su historia de apego es más informativa que el contenido de los eventos.',
  exercises: [
    {
      id: 'cronologia_conflicto_freud',
      title: 'Cronología del Conflicto (Freud / Anna Freud)',
      instruction: 'En psicoanálisis la historia no se registra como hechos cronológicos sino como construcción subjetiva de significados. No hay versión "correcta" — hay versión actual, que puede transformarse.',
      fields: [
        { id: 'periodo_temprano', label: '¿Qué sabés o te contaron de tu primera infancia? ¿Cuál es el primer recuerdo que tenés — aunque sea fragmentario?', type: 'textarea', placeholder: 'Primeros recuerdos, ambiente familiar temprano...' },
        { id: 'ambiente_temprano', label: '¿Cómo era el ambiente familiar temprano? ¿Quiénes estaban? ¿Cómo estaban?', type: 'textarea', placeholder: 'Describí el clima emocional...' },
        { id: 'perdida_temprana', label: '¿Hubo situaciones de pérdida, separación o inestabilidad temprana?', type: 'textarea', placeholder: '' },
        { id: 'periodo_edipico', label: '¿Cómo era la relación con cada uno de los padres / figuras parentales? ¿Recuerdos, escenas, sensaciones del período edípico?', type: 'textarea', placeholder: 'Relaciones con figuras parentales entre los 3-6 años...' },
        { id: 'rivalidad_celos', label: '¿Hubo momentos de rivalidad, celos, exclusión?', type: 'textarea', placeholder: '' },
        { id: 'latencia_adolescencia', label: '¿Cómo fue la escolaridad, vínculos con pares? ¿Cómo fue la pubertad — primeras experiencias sexuales o amorosas?', type: 'textarea', placeholder: '' },
        { id: 'patrones_repeticion', label: '¿Qué patrones reconocés en tus relaciones significativas? ¿Hay algo que se repite? (Freud — compulsión de repetición)', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'lineas_desarrollo_anna_freud',
      title: 'Líneas del Desarrollo (Anna Freud)',
      instruction: 'Evaluá cómo fue la progresión en cada área del desarrollo. No se trata de patología — se trata de comprender el recorrido.',
      fields: [
        { id: 'dependencia_autonomia', label: '¿Cómo fue el proceso de separación/individuación respecto a los padres?', type: 'textarea', placeholder: '' },
        { id: 'dependencia_scale', label: '¿Dónde te ubicarías hoy en la línea dependencia-autonomía?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Muy dependiente', scaleMaxLabel: 'Autónomo/a' },
        { id: 'juego_trabajo', label: '¿Cómo fue el desarrollo de capacidades de logro, concentración y trabajo (sublimación)?', type: 'textarea', placeholder: '' },
        { id: 'relaciones_objetales', label: '¿Tus vínculos actuales son más del orden de necesitar al otro (narcisista) o de genuino interés por el otro como sujeto?', type: 'textarea', placeholder: '' },
        { id: 'disarmonias', label: '¿Identificás áreas donde el desarrollo fue más lento o más rápido que en otras? (Ej: muy desarrollado intelectualmente, menos afectivamente)', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'historia_apego_bowlby_fonagy',
      title: 'Historia de Apego (Bowlby / Fonagy)',
      instruction: 'Explorá tu vínculo temprano con las figuras de cuidado y cómo esos patrones se reflejan en tus relaciones actuales.',
      fields: [
        { id: 'cuidador_primario', label: '¿Quién fue el cuidador principal en tus primeros años? ¿Cómo describirías esa relación?', type: 'textarea', placeholder: '' },
        { id: 'estilo_apego', label: 'Estilo de apego percibido (Mary Ainsworth / Mary Main)', type: 'radio', options: [
          'Apego seguro: me sentía seguro/a de que el cuidador estaría disponible. Podía explorar y volver.',
          'Apego ansioso-ambivalente: nunca sabía si el cuidador estaría disponible. Estaba muy pendiente de sus estados de ánimo.',
          'Apego evitativo: aprendí que era mejor no pedir. Me hice autosuficiente. Las emociones se sentían peligrosas.',
          'Apego desorganizado: no hay estrategia coherente. La figura de apego era a la vez fuente de seguridad y de miedo.',
        ] },
        { id: 'reflejo_actual', label: '¿Cómo se refleja este patrón en tus relaciones actuales?', type: 'textarea', placeholder: '' },
        { id: 'coherencia_narrativa', label: 'Al contar tu historia de infancia, ¿cómo es tu narrativa? (Adult Attachment Interview — Main)', type: 'radio', options: [
          'Tiendo a idealizar — "todo era perfecto" aunque haya habido dificultades',
          'Tiendo a devaluar / confundirme — me cuesta dar una narrativa coherente',
          'Hay episodios que no puedo narrar con continuidad — hay lagunas',
          'Puedo narrarla con balance y coherencia',
        ] },
      ],
    },
    {
      id: 'apres_coup_freud',
      title: 'Après-coup / Posterioridad (Freud)',
      instruction: 'El trauma no está en el pasado — está en la resignificación posterior. Explorá cómo el presente transforma la lectura del pasado.',
      fields: [
        { id: 'resignificacion', label: '¿Hubo algún evento que en su momento no comprendiste y que ahora tiene un sentido diferente?', type: 'textarea', placeholder: '' },
        { id: 'resignificacion_analisis', label: '¿Hay algo de tu historia que se resignificó durante el proceso analítico?', type: 'textarea', placeholder: '' },
        { id: 'transmision_generacional', label: '¿Reconocés en vos algo que pertenece a generaciones anteriores? (un mandato, un sufrimiento, un patrón que no elegiste pero heredaste)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 2: TRABAJO DE ELABORACIÓN ─────────────────────
const section2_TrabajoElaboracion: PsychoanalyticSection = {
  id: 'psychoanalytic_training',
  menuId: 'training',
  title: 'Trabajo de Elaboración',
  subtitle: 'Durcharbeitung: el trabajo psíquico que permite asimilar una interpretación y producir cambio',
  quote: 'Comprender no es suficiente. Hay un trabajo que hacer con lo comprendido.',
  quoteAuthor: 'Freud (Recordar, repetir y reelaborar, 1914)',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'La elaboración (Durcharbeitung) no es suficiente con la comprensión intelectual — se necesita un trabajo de tiempo y de afecto para que la interpretación produzca cambio.',
      keyContributions: ['Recordar, repetir y reelaborar (1914)', 'Durcharbeitung', 'Regla de abstinencia'],
    },
    {
      name: 'James Strachey',
      years: '1887-1967',
      bio: 'Propuso que el cambio terapéutico ocurre mediante interpretaciones mutativas: en un momento de activación transferencial, el analista señala la diferencia entre la expectativa y la realidad.',
      keyContributions: ['Interpretación mutativa (1934)', 'Desinvestidura del objeto interno arcaico'],
    },
    {
      name: 'Donald Winnicott',
      years: '1896-1971',
      bio: 'El juego no es el equivalente infantil de la asociación libre — es el modo original de toda elaboración. La psicoterapia es jugar. Estar en el espacio transicional donde se puede crear y destruir sin consecuencias definitivas.',
      keyContributions: ['Playing and Reality (1971)', 'Espacio transicional', 'Juego como elaboración'],
    },
    {
      name: 'Melanie Klein',
      years: '1882-1960',
      bio: 'La elaboración es el trabajo de pasar de la posición esquizo-paranoide a la depresiva — tolerando la ambivalencia, la culpa y el duelo. Este movimiento se conquista y se pierde repetidamente.',
      keyContributions: ['Working through kleiniano', 'Posición depresiva', 'Reparación'],
    },
    {
      name: 'Peter Fonagy',
      years: '1952-',
      bio: 'El trabajo analítico contemporáneo no solo produce insight — produce mentalización: la capacidad de entender los propios estados mentales y los del otro.',
      keyContributions: ['Elaboración como restauración de la mentalización', 'MBT'],
    },
  ],
  theoreticalSummary: 'La elaboración (Durcharbeitung) es el concepto técnico central del psicoanálisis: el trabajo psíquico necesario para que una interpretación produzca cambio real. Freud lo distingue del insight intelectual — comprender no es suficiente. Strachey precisa que el cambio ocurre en interpretaciones mutativas durante la activación transferencial. Para Klein, elaborar es tolerar la ambivalencia sin escindir. Winnicott aporta que jugar es el modo original de toda elaboración — estar en el espacio transicional. Fonagy actualiza: cada sesión que restaura la mentalización es elaborativa.',
  exercises: [
    {
      id: 'registro_material_sesion',
      title: 'Registro de Material de Sesión',
      instruction: 'Registrá el material que emergió en la última sesión, sin interpretarlo todavía. La elaboración comienza por dejar que el material resuene.',
      fields: [
        { id: 'material_emergido', label: '¿Hubo algún recuerdo, imagen, sueño o pensamiento significativo? (No des explicaciones — solo describí lo que apareció)', type: 'textarea', placeholder: 'Describí el material sin interpretarlo...' },
        { id: 'afecto_asociado', label: '¿Qué emoción o sensación corporal acompañó ese material?', type: 'textarea', placeholder: '' },
        { id: 'novedad_repeticion', label: '¿Fue algo nuevo o algo que se repite?', type: 'radio', options: [
          'Apareció por primera vez',
          'Lo reconocí — ya había aparecido antes',
          'Es la misma sensación / imagen / pensamiento de siempre, pero esta vez fue diferente',
        ] },
        { id: 'que_hiciste', label: '¿Pudiste hablarlo en sesión o lo cortaste/callaste? ¿Qué pasó justo antes del corte?', type: 'textarea', placeholder: '' },
        { id: 'resonancia_post', label: '¿Algo de la sesión siguió resonando después? ¿Apareció en sueños, asociaciones, o en situaciones cotidianas?', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'analisis_defensa_anna_freud',
      title: 'Análisis de la Defensa (Anna Freud / Vaillant)',
      instruction: 'Observá qué mecanismo de defensa operó ante una situación que generó malestar. Toda defensa tiene una función — no es solo un obstáculo.',
      fields: [
        { id: 'situacion_malestar', label: 'Situación que generó malestar', type: 'textarea', placeholder: '' },
        { id: 'afecto_primero', label: '¿Qué sentiste primero? (antes de cualquier operación defensiva — lo que estaba debajo)', type: 'textarea', placeholder: '' },
        { id: 'mecanismo_defensa', label: '¿Qué hiciste con ese afecto / esa representación?', type: 'checkbox', options: [
          'Lo empujé fuera de la conciencia (represión)',
          'Lo atribuí a otra persona — "el que siente eso es él/ella" (proyección)',
          'Sentí exactamente lo contrario de lo que amenazaba sentir (formación reactiva)',
          'Lo pensé sin sentirlo — lo hablé como si no me afectara (aislamiento del afecto)',
          'Hice algo que "deshacía" lo anterior (anulación retroactiva)',
          'Lo justifiqué con argumentos lógicos (racionalización)',
          'Me identifiqué con quien me asustaba (identificación con el agresor — A. Freud)',
          'Lo transformé en algo socialmente valorado (sublimación)',
        ] },
        { id: 'funcion_defensa', label: '¿Para qué sirvió esa defensa en ese momento?', type: 'textarea', placeholder: '' },
        { id: 'tolerancia_actual', label: '¿Hay algo de ese afecto original que pueda tolerar ahora, que antes no podía?', type: 'textarea', placeholder: '' },
      ],
    },
    {
      id: 'espacio_juego_winnicott',
      title: 'Espacio de Juego / Asociación Libre (Winnicott / Freud)',
      instruction: 'Este espacio no tiene estructura. Es para escribir lo que se te ocurra, sin censura, sin coherencia, sin un objetivo específico. Podés escribir asociaciones, imágenes, fragmentos de sueños, palabras sueltas. La única regla: no te censures.',
      fields: [
        { id: 'asociacion_libre', label: 'Escribí libremente — sin censura, sin coherencia, sin objetivo', type: 'textarea', placeholder: 'Dejá que las palabras fluyan...' },
        { id: 'algo_inesperado', label: '¿Apareció algo inesperado?', type: 'textarea', placeholder: '' },
        { id: 'repeticion_palabra', label: '¿Hay alguna palabra o imagen que se repite?', type: 'textarea', placeholder: '' },
        { id: 'autocensura', label: '¿Algo que hayas estado a punto de escribir y hayas cortado? (eso puede ser lo más importante)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 3: REGISTRO AFECTIVO ──────────────────────────
const section3_RegistroAfectivo: PsychoanalyticSection = {
  id: 'psychoanalytic_emotional',
  menuId: 'emotional',
  title: 'Registro Afectivo',
  subtitle: 'Estado afectivo, angustia, destinos del afecto y corporización',
  quote: 'El afecto que no puede ser sentido busca otro destino.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'Distinguió el afecto (vivencia subjetiva) de la representación (contenido psíquico). En la represión, la representación puede reprimirse pero el afecto busca otros destinos: conversión, desplazamiento, transformación. Su segunda teoría de la angustia (1926) la reformula como señal de peligro del yo.',
      keyContributions: ['Quantum de afecto', 'Angustia señal (1926)', 'Conversión somática', 'Inhibición, síntoma y angustia'],
    },
    {
      name: 'Melanie Klein',
      years: '1882-1960',
      bio: 'Diferenció la angustia persecutoria (posición esquizo-paranoide) de la angustia depresiva (culpa por haber dañado al objeto amado). La defensa maníaca protege de la angustia depresiva mediante negación omnipotente.',
      keyContributions: ['Angustia persecutoria vs. depresiva', 'Defensa maníaca', 'Culpa reparatoria'],
    },
    {
      name: 'Peter Fonagy',
      years: '1952-',
      bio: 'El desarrollo normal de la regulación afectiva requiere un cuidador que espeje los estados afectivos del bebé de manera marcada (modulada). Cuando el espejamiento falla, el bebé no desarrolla representaciones de sus propios estados internos.',
      keyContributions: ['Regulación afectiva (con Target, 1997)', 'Espejamiento marcado', 'Mentalización de afectos'],
    },
    {
      name: 'Peter Sifneos',
      years: '1920-2008',
      bio: 'Acuñó el término alexitimia: "sin palabras para los afectos". Dificultad para identificar sentimientos, distinguirlos de sensaciones corporales, pensamiento concreto y vida fantasmática empobrecida.',
      keyContributions: ['Alexitimia (1973)', 'Somatización', 'Pensamiento operatorio'],
    },
  ],
  theoreticalSummary: 'En psicoanálisis, el afecto no es solo emoción — es un quantum de energía que inviste las representaciones. Freud distingue el afecto de la representación: en la represión, la representación puede reprimirse pero el afecto busca otros destinos (conversión somática, desplazamiento, transformación en lo contrario, angustia flotante). La segunda teoría de la angustia (1926) la reformula como señal de peligro del yo. Klein diferencia angustia persecutoria de angustia depresiva. Fonagy demuestra que la capacidad de regular afectos depende del espejamiento marcado del cuidador temprano. Sifneos describe la alexitimia como la imposibilidad de poner palabras al afecto.',
  exercises: [
    {
      id: 'registro_afectivo_diario',
      title: 'Registro Afectivo Diario',
      instruction: 'No lo expliques todavía. Solo nombralo — aunque sea impreciso. Si no encontrás palabras, buscá en el cuerpo o en una imagen.',
      fields: [
        { id: 'estado_afectivo', label: 'Estado afectivo predominante — nombralo sin explicarlo', type: 'textarea', placeholder: 'Nombrar sin analizar...' },
        { id: 'sensacion_corporal', label: 'Si no encontrás palabras: ¿hay alguna sensación corporal que lo exprese? ¿Dónde? ¿Cómo es?', type: 'textarea', placeholder: '' },
        { id: 'imagen_asociada', label: '¿Hay alguna imagen que lo capture?', type: 'textarea', placeholder: '' },
        { id: 'afecto_diferenciado', label: '¿Reconocés alguno de estos estados afectos? (Freud / Klein / Kohut)', type: 'checkbox', options: [
          'Angustia: sensación de peligro sin objeto claro, anticipación difusa',
          'Culpa: sensación de haber dañado a alguien amado (Klein — posición depresiva)',
          'Vergüenza: sensación de exposición, de ser visto en la propia deficiencia',
          'Melancolía: pérdida que no puede elaborarse, sombra del objeto sobre el yo (Freud, 1917)',
          'Vacío: ausencia de investidura, ni amor ni odio — empobrecimiento del yo',
          'Hostilidad: agresión hacia un objeto interno o externo',
          'Euforia / Manía: defensa maníaca ante la angustia depresiva (Klein)',
          'Amor de objeto: investidura libidinal genuina',
        ] },
        { id: 'afecto_reprimido', label: '¿Hay algo que "debería" sentir pero no sentís? ¿O algo que sentís pero no sabés de dónde viene?', type: 'textarea', placeholder: '' },
        { id: 'corporizacion', label: '¿Hay síntomas corporales que acompañan el estado afectivo? (Freud — conversión / Winnicott — psicosoma)', type: 'textarea', placeholder: '' },
        { id: 'situacion_asociada', label: 'Situación asociada (si la hay — no siempre la hay)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 4: REGISTRO INCONSCIENTE ──────────────────────
const section4_RegistroInconsciente: PsychoanalyticSection = {
  id: 'psychoanalytic_unconscious',
  menuId: 'unconscious',
  title: 'Registro Inconsciente',
  subtitle: 'Sueños, actos fallidos, lapsus y formaciones del inconsciente',
  quote: 'Los sueños son la vía regia al conocimiento de lo inconsciente.',
  quoteAuthor: 'Freud (La interpretación de los sueños, 1900)',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'La interpretación de los sueños es el texto fundacional del psicoanálisis. El sueño es la realización disfrazada de un deseo inconsciente reprimido. El trabajo del sueño transforma contenido latente en manifiesto mediante condensación, desplazamiento, representabilidad y elaboración secundaria.',
      keyContributions: ['La interpretación de los sueños (1900)', 'Contenido manifiesto/latente', 'Trabajo del sueño', 'Psicopatología de la vida cotidiana (1901)'],
    },
    {
      name: 'Wilfred Bion',
      years: '1897-1979',
      bio: 'Reformuló la función del sueño: soñar no es solo desear — es pensar. La función alfa transforma impresiones sensoriales y emocionales brutas (elementos beta) en elementos pensables. Quien no puede soñar, no puede pensar emocionalmente.',
      keyContributions: ['Función alfa / elementos beta', 'Soñar como pensar', 'Learning from Experience (1962)'],
    },
    {
      name: 'Thomas Ogden',
      years: '1946-',
      bio: 'Los sueños de la sesión analítica pertenecen al campo analítico: no son solo del paciente ni solo del analista, sino del tercero analítico creado conjuntamente.',
      keyContributions: ['Tercero analítico', 'Sueños del campo intersubjetivo', 'Reverie and Interpretation'],
    },
  ],
  theoreticalSummary: 'Freud estableció que el sueño es la realización disfrazada de un deseo inconsciente reprimido. El contenido manifiesto encubre el contenido latente mediante condensación, desplazamiento, representabilidad y elaboración secundaria. Los actos fallidos (lapsus, olvidos, coincidencias) expresan el deseo o conflicto inconsciente en la vida cotidiana. Bion reformuló la función del sueño: la función alfa transforma impresiones brutas (elementos beta) en elementos pensables. Quien no puede soñar no puede procesar emocionalmente la experiencia. Ogden aporta que los sueños en análisis pertenecen al campo intersubjetivo — al tercero analítico.',
  exercises: [
    {
      id: 'registro_onico',
      title: 'Registro Onírico Psicoanalítico (Freud / Bion)',
      instruction: 'Registrá el sueño lo más cerca posible del despertar. No lo interpretes — el sueño trabaja por sí mismo. Simplemente registrá con todo el detalle posible.',
      fields: [
        { id: 'contenido_manifiesto', label: 'Contenido manifiesto: ¿qué soñaste? (todo lo que recuerdes, sin editar)', type: 'textarea', placeholder: 'Describí el sueño tal como lo recordás...' },
        { id: 'afecto_onico', label: '¿Qué afecto predominaba en el sueño? ¿Y al despertar?', type: 'textarea', placeholder: '' },
        { id: 'personajes', label: '¿Qué personajes aparecen? ¿Los conocés? ¿Tienen rasgos de personas reales mezclados? (condensación)', type: 'textarea', placeholder: '' },
        { id: 'elementos_extraños', label: '¿Hay elementos incongruentes, absurdos o que no encajan? (pueden ser los más significativos)', type: 'textarea', placeholder: '' },
        { id: 'restos_diurnos', label: '¿Reconocés restos diurnos? (algo del día anterior que se coló en el sueño)', type: 'textarea', placeholder: '' },
        { id: 'asociaciones', label: 'Primera asociación: sin pensar mucho, ¿qué te viene a la mente con este sueño?', type: 'textarea', placeholder: '' },
        { id: 'sueno_recurrente', label: '¿Es un sueño recurrente o tiene elementos que ya aparecieron antes?', type: 'radio', options: ['Primera vez', 'Recurrente', 'Elementos que se repiten'] },
        { id: 'sueno_sesion', label: '¿Lo soñaste la noche antes o después de una sesión?', type: 'radio', options: ['Antes de sesión', 'Después de sesión', 'Sin relación temporal directa'] },
      ],
    },
    {
      id: 'actos_fallidos',
      title: 'Registro de Actos Fallidos (Freud, 1901)',
      instruction: 'Los lapsus, olvidos, actos fallidos y coincidencias no son accidentales — expresan el deseo o el conflicto inconsciente. Registrá cualquier formación del inconsciente de la vida cotidiana.',
      fields: [
        { id: 'tipo_formacion', label: 'Tipo de formación del inconsciente', type: 'radio', options: [
          'Lapsus linguae (dije una cosa queriendo decir otra)',
          'Olvido significativo (olvidé algo que probablemente no quería recordar)',
          'Acto fallido (hice algo que no pretendía hacer)',
          'Coincidencia significativa (algo que "casualmente" ocurrió)',
        ] },
        { id: 'descripcion', label: '¿Qué pasó exactamente?', type: 'textarea', placeholder: '' },
        { id: 'intencion', label: '¿Qué pretendías decir / hacer?', type: 'textarea', placeholder: '' },
        { id: 'emergente', label: '¿Qué emergió en su lugar?', type: 'textarea', placeholder: '' },
        { id: 'primera_asociacion', label: 'Primera asociación: ¿qué te viene a la mente sobre lo que emergió?', type: 'textarea', placeholder: '' },
        { id: 'resonancia_actual', label: '¿Hay algo en tu vida actual que resuene con esto?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 5: VÍNCULO TRANSFERENCIAL ─────────────────────
const section5_VinculoTransferencial: PsychoanalyticSection = {
  id: 'psychoanalytic_alliance',
  menuId: 'alliance',
  title: 'Vínculo Transferencial',
  subtitle: 'Transferencia, contratransferencia y la relación analítica como campo de trabajo',
  quote: 'La transferencia no es un error — es la memoria del cuerpo y el afecto.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'Descubrió la transferencia como obstáculo y la reformuló como motor del análisis. La neurosis de transferencia permite trabajar el conflicto en el aquí y ahora.',
      keyContributions: ['Neurosis de transferencia', 'Escritos técnicos (1911-1915)', 'Transferencia positiva y negativa'],
    },
    {
      name: 'Paula Heimann',
      years: '1899-1982',
      bio: 'Rehabilitó la contratransferencia: no es solo obstáculo sino el instrumento más sensible del que dispone el analista. Las respuestas emocionales del analista son comunicaciones del inconsciente del paciente.',
      keyContributions: ['On Countertransference (1950)', 'Contratransferencia como instrumento'],
    },
    {
      name: 'Donald Winnicott',
      years: '1896-1971',
      bio: 'El analista tiene respuestas emocionales genuinas al paciente — incluyendo negativas. Negar estas respuestas es menos analítico que reconocerlas y contenerlas.',
      keyContributions: ['El odio en la contratransferencia (1949)', 'Holding analítico'],
    },
    {
      name: 'Otto Kernberg',
      years: '1928-',
      bio: 'En pacientes limítrofes, la transferencia es masiva y primitiva. Las díadas de relaciones de objeto escindidas se activan: el analista es totalmente bueno o totalmente malo.',
      keyContributions: ['TFP — Terapia Focalizada en la Transferencia', 'Díadas transferenciales escindidas'],
    },
    {
      name: 'Heinz Kohut',
      years: '1913-1981',
      bio: 'Con pacientes narcisistas no hay neurosis de transferencia clásica sino transferencias de self-objeto: especular, idealizante y gemelar. La tarea es reconocer estas necesidades, no frustrarlas.',
      keyContributions: ['Transferencia especular', 'Transferencia idealizante', 'Transferencia gemelar'],
    },
    {
      name: 'Peter Fonagy',
      years: '1952-',
      bio: 'El campo transferencial es donde la mentalización falla de manera más visible y más terapéuticamente accesible. Las activaciones transferenciales son oportunidades para restaurar la mentalización.',
      keyContributions: ['Mentalización en la transferencia', 'MBT'],
    },
  ],
  theoreticalSummary: 'Freud descubrió la transferencia como obstáculo y la reformuló como motor del análisis: el paciente desplaza su conflicto neurótico al campo analítico. Heimann rehabilitó la contratransferencia como instrumento clínico. Winnicott señaló que el analista tiene respuestas emocionales genuinas — incluyendo odio — que deben reconocerse. Kernberg trabaja con las díadas escindidas que se activan en la transferencia limítrofe. Kohut describe transferencias de self-objeto (especular, idealizante, gemelar) que no deben frustrarse sino elaborarse. Fonagy identifica el campo transferencial como el lugar donde la mentalización puede restaurarse.',
  exercises: [
    {
      id: 'registro_transferencial',
      title: 'Registro Post-Sesión — Transferencia',
      instruction: 'Explorá cómo viviste al analista durante la última sesión. No lo que "debería" sentir — lo que sentiste realmente.',
      fields: [
        { id: 'llegada_sesion', label: '¿Cómo llegaste a la sesión? ¿Con qué disposición / anticipación / afecto?', type: 'textarea', placeholder: '' },
        { id: 'partida_sesion', label: '¿Cómo te fuiste?', type: 'textarea', placeholder: '' },
        { id: 'imagen_analista', label: '¿Cómo viviste al analista hoy?', type: 'checkbox', options: [
          'Presente y disponible',
          'Distante / lejano/a',
          'Amenazante / crítico/a',
          'Indiferente',
          'Admirado/a / idealizado/a',
          'Como alguien que no comprende',
          'Como alguien que sabe demasiado / penetra demasiado',
          'Cálido/a / contenedor/a',
        ] },
        { id: 'recuerda_alguien', label: '¿Esa imagen recuerda a alguien? (sin que tengas que explicar por qué — solo si hay resonancia)', type: 'textarea', placeholder: '' },
        { id: 'no_dicho', label: '¿Hubo algo que no pudiste decir? ¿Algo que estuviste a punto de decir y no dijiste?', type: 'textarea', placeholder: '' },
        { id: 'existe_indecible', label: '¿Hay algo que no le dirías al analista bajo ningún concepto? (no tenés que decir qué — solo notar que existe)', type: 'radio', options: ['Sí', 'No'] },
        { id: 'cuerpo_sesion', label: '¿Notaste algo en tu cuerpo durante la sesión? Tensión, relajación, somnolencia, frío, calor...', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 6: CRONOLOGÍA DEL CONFLICTO ───────────────────
const section6_CronologiaConflicto: PsychoanalyticSection = {
  id: 'psychoanalytic_timeline',
  menuId: 'timeline',
  title: 'Cronología del Conflicto',
  subtitle: 'Puntos de fijación, regresión, repetición y trauma en la historia subjetiva',
  quote: 'No repetimos lo que recordamos — recordamos lo que empezamos a elaborar.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'La neurosis surge de un conflicto estructural entre fuerzas pulsionales y fuerzas defensivas. La fijación es la detención en una fase del desarrollo libidinal; la regresión es el retorno a ese punto bajo frustración.',
      keyContributions: ['Conflicto estructural', 'Puntos de fijación', 'Regresión', 'Fases del desarrollo libidinal'],
    },
    {
      name: 'Sándor Ferenczi',
      years: '1873-1933',
      bio: 'Pionero en insistir en la realidad del trauma. Su concepto de confusión de lenguas: el adulto habla el lenguaje de la pasión hacia el niño que solo conoce el lenguaje de la ternura. El abuso produce escisión traumática.',
      keyContributions: ['Confusión de lenguas (1933)', 'Realidad del trauma', 'Escisión traumática'],
    },
    {
      name: 'Judith Herman',
      years: '1942-',
      bio: 'El trauma complejo (TEPT-C) — trauma crónico en vínculos de dependencia — produce alteraciones en regulación afectiva, conciencia, percepción del self y relaciones con otros.',
      keyContributions: ['Trauma and Recovery (1992)', 'Trauma complejo / TEPT-C'],
    },
    {
      name: 'Bessel van der Kolk',
      years: '1943-',
      bio: 'El trauma se almacena en el cuerpo, no solo en la narrativa. Las memorias traumáticas son sensoriales y procedurales, fragmentadas y sin cronología.',
      keyContributions: ['The Body Keeps the Score (2014)', 'Memoria corporal del trauma'],
    },
  ],
  theoreticalSummary: 'La neurosis no surge de un evento traumático único sino de un conflicto estructural entre fuerzas pulsionales y defensivas. La fijación es la detención o exceso de investidura en una fase del desarrollo libidinal; la regresión es el retorno a ese punto bajo frustración. Ferenczi insistió en la realidad del trauma y la confusión de lenguas. Herman describió el trauma complejo (TEPT-C) en vínculos de dependencia. Van der Kolk demostró que el trauma se almacena en el cuerpo — las memorias traumáticas son sensoriales, procedurales, fragmentadas y sin cronología.',
  exercises: [
    {
      id: 'mapa_conflicto',
      title: 'Mapa del Conflicto en el Tiempo',
      instruction: 'Mapeá los momentos donde el conflicto central de tu vida se hizo visible. No son necesariamente los momentos más dramáticos — pueden ser pequeños momentos donde algo se reveló.',
      fields: [
        { id: 'primera_senal', label: '¿Cuándo sentiste por primera vez algo de lo que hoy traés a análisis? (aunque no lo llamaras así entonces)', type: 'textarea', placeholder: 'Edad aproximada y descripción...' },
        { id: 'puntos_fijacion', label: '¿En qué área del desarrollo sentís que algo "quedó"?', type: 'checkbox', options: [
          'Muy temprano — necesidades de cuidado y sostenimiento básico (oral / holding)',
          'Control, autonomía, vergüenza (anal)',
          'Rivalidad, deseo, exclusión, triangularidad (edípico)',
          'Logro, competencia, pertenencia a pares (latencia)',
          'Identidad, sexualidad, separación (adolescencia)',
        ] },
        { id: 'fijacion_detalle', label: 'Describí cómo se manifiesta esa fijación', type: 'textarea', placeholder: '' },
        { id: 'momento_repeticion_1', label: 'Momento de repetición 1: ¿cuándo reconocés que el conflicto se repitió?', type: 'textarea', placeholder: '' },
        { id: 'momento_repeticion_2', label: 'Momento de repetición 2', type: 'textarea', placeholder: '' },
        { id: 'momento_repeticion_3', label: 'Momento de repetición 3', type: 'textarea', placeholder: '' },
        { id: 'guion_repetitivo', label: '¿Hay un "guión" que se repite? ¿Cómo lo nombrarías?', type: 'textarea', placeholder: '' },
        { id: 'momentos_elaboracion', label: '¿Hubo momentos en que algo se movió — en que el conflicto se vio diferente o la respuesta fue diferente a la habitual?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 7: INDICACIONES DE TRABAJO ────────────────────
const section7_IndicacionesTrabajo: PsychoanalyticSection = {
  id: 'psychoanalytic_tasks',
  menuId: 'tasks',
  title: 'Indicaciones de Trabajo',
  subtitle: 'Indicaciones analíticas entre sesiones: observación, registro y tolerancia a la incertidumbre',
  quote: 'Entre sesión y sesión, el análisis continúa en la vida.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Sigmund Freud',
      years: '1856-1939',
      bio: 'La regla de abstinencia: el analista no gratifica directamente las necesidades transferenciales. Las indicaciones analíticas no resuelven — crean condiciones para el trabajo.',
      keyContributions: ['Regla de abstinencia', 'Regla fundamental (asociación libre)'],
    },
    {
      name: 'Sándor Ferenczi',
      years: '1873-1933',
      bio: 'Pionero de las variaciones técnicas: relajación activa, análisis mutuo. Sus experimentos anticiparon muchas técnicas contemporáneas de trabajo con trauma.',
      keyContributions: ['Técnica activa', 'Relajación activa', 'Análisis mutuo'],
    },
    {
      name: 'Wilfred Bion',
      years: '1897-1979',
      bio: 'La indicación más genuinamente analítica: tolerar la incertidumbre sin buscar resolución prematura. Capacidad negativa (Keats): estar en la incertidumbre y la duda sin buscar ansiosamente los hechos y la razón.',
      keyContributions: ['Capacidad negativa', 'Tolerancia a la no-comprensión', 'Sin memoria ni deseo'],
    },
  ],
  theoreticalSummary: 'El psicoanálisis clásico no asigna tareas — la sesión es el espacio de trabajo y la vida cotidiana es donde lo elaborado se prueba. Sin embargo, hay indicaciones que emergen del proceso. Freud establece la regla de abstinencia: las indicaciones no resuelven sino que crean condiciones para el trabajo. Ferenczi fue pionero de variaciones técnicas. Bion aporta la indicación más analítica: tolerar la incertidumbre — la capacidad negativa de Keats — sin buscar resolución prematura.',
  exercises: [
    {
      id: 'indicacion_semanal',
      title: 'Indicación de Trabajo Semanal',
      instruction: 'Las indicaciones analíticas no son tareas a cumplir — son invitaciones a observar, registrar y tolerar lo que emerge.',
      fields: [
        { id: 'indicacion_tipo', label: '¿Qué tipo de indicación trabajás esta semana?', type: 'select', options: [
          'Registro de sueños — anotá inmediatamente al despertar sin interpretar',
          'Observación de actos fallidos — qué pretendías hacer/decir y qué emergió',
          'Trabajo con la defensa — identificar en qué momentos cortás una emoción',
          'Trabajo transferencial — observar cómo llegás a cada sesión y qué anticipás',
          'Tolerancia a la incertidumbre (Bion) — resistir el impulso de explicación rápida',
          'Espacio de juego (Winnicott) — 10 minutos sin objetivo: escribir, dibujar, moverte',
        ] },
        { id: 'registro_semana', label: '¿Pudiste llevar adelante la indicación?', type: 'radio', options: ['Sí', 'Parcialmente', 'No'] },
        { id: 'obstaculo', label: '¿Qué obstáculo apareció? (en psicoanálisis, los obstáculos son tan informativos como los logros)', type: 'textarea', placeholder: '' },
        { id: 'emergente', label: '¿Qué emergió — esperado o inesperado?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 8: HITOS DEL PROCESO ──────────────────────────
const section8_HitosProceso: PsychoanalyticSection = {
  id: 'psychoanalytic_rewards',
  menuId: 'rewards',
  title: 'Hitos del Proceso',
  subtitle: 'Momentos de elaboración, insight, cambio estructural y ampliación de la vida psíquica',
  quote: 'El análisis no cura el sufrimiento — amplía la capacidad de habitarlo.',
  quoteAuthor: 'Winnicott',
  authors: [
    {
      name: 'Jean Laplanche & Jean-Bertrand Pontalis',
      years: '1924-2012 / 1924-2013',
      bio: 'El proceso analítico avanza en espiral, no en línea recta. Lo que se elaboró puede volver — pero con mayor profundidad de procesamiento.',
      keyContributions: ['Diccionario de psicoanálisis (1967)', 'Elaboración como movimiento en espiral'],
    },
    {
      name: 'Peter Fonagy & Anthony Bateman',
      years: '1952- / 1953-',
      bio: 'Los marcadores de progreso contemporáneos incluyen: mayor curiosidad sobre estados mentales, mayor tolerancia a la incertidumbre, menor equivalencia psíquica, mayor capacidad de ver la propia perspectiva como perspectiva.',
      keyContributions: ['Indicadores de cambio mentalizador', 'MBT para TLP'],
    },
    {
      name: 'Otto Kernberg',
      years: '1928-',
      bio: 'El objetivo de la TFP no es reducción de síntomas sino cambio estructural: integración de representaciones escindidas del self y del objeto, consolidación de la identidad.',
      keyContributions: ['Cambio estructural', 'Integración de la identidad', 'TFP'],
    },
  ],
  theoreticalSummary: 'El cambio analítico no es la desaparición de síntomas — es la transformación de la economía psíquica: la distribución de investiduras, la calidad de las relaciones de objeto, la capacidad de mentalizar y elaborar. Laplanche y Pontalis señalan que el proceso avanza en espiral. Fonagy identifica indicadores de cambio mentalizador. Kernberg define el cambio como integración de las representaciones escindidas del self y del objeto.',
  exercises: [
    {
      id: 'registro_hito_analitico',
      title: 'Registro de Hito Analítico',
      instruction: 'El cambio analítico genuino tiene correlato somático y relacional. No es lineal ni acumulativo — es un movimiento que se conquista y se reconquista.',
      fields: [
        { id: 'tipo_movimiento', label: 'Tipo de movimiento', type: 'checkbox', options: [
          'Pude sentir algo que antes solo pensaba',
          'Reconocí en mí algo que antes proyectaba en otros',
          'Toleré una ambivalencia que antes necesitaba resolver rápido',
          'Vi un patrón de repetición mientras ocurría — no solo después',
          'Sentí culpa genuina (no persecutoria) por algo que dañé',
          'Pude estar con la incertidumbre sin resolver ansiosamente',
          'Algo del pasado se resignificó — el après-coup de algo anterior',
          'Me sorprendí siendo diferente en una situación habitual',
          'Pude decir en sesión algo que nunca había dicho en voz alta',
        ] },
        { id: 'descripcion_hito', label: '¿Qué ocurrió exactamente?', type: 'textarea', placeholder: '' },
        { id: 'conexion_trabajo', label: '¿A qué parte del trabajo analítico anterior se conecta? (¿interpretación, sueño, algo que vino madurando?)', type: 'textarea', placeholder: '' },
        { id: 'correlato_somatico', label: '¿Cómo se sintió en el cuerpo? (los movimientos analíticos genuinos tienen correlato somático)', type: 'textarea', placeholder: '' },
        { id: 'cambio_vincular', label: '¿Algo cambió en tus relaciones externas? (el cambio intrapsíquico suele manifestarse en los vínculos)', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 9: EVOLUCIÓN DEL PROCESO ──────────────────────
const section9_EvolucionProceso: PsychoanalyticSection = {
  id: 'psychoanalytic_monitoring',
  menuId: 'monitoring',
  title: 'Evolución del Proceso',
  subtitle: 'Evaluación mensual de la función reflexiva, riqueza de vida psíquica e indicadores de cambio',
  quote: 'El criterio del cambio analítico no es el bienestar — es la ampliación de la vida psíquica.',
  quoteAuthor: 'Freud',
  authors: [
    {
      name: 'Peter Fonagy',
      years: '1952-',
      bio: 'La escala de función reflexiva (RF-S) evalúa la calidad de la mentalización en la narrativa del sujeto. Escala de -1 a 9, desde función reflexiva activamente negativa hasta elaboración sofisticada.',
      keyContributions: ['Reflective Functioning Scale (1998)', 'Indicadores de mentalización'],
    },
    {
      name: 'Michael Lambert',
      years: '1945-',
      bio: 'El OQ-45 permite seguimiento sesión a sesión con tres subescalas: funcionamiento sintomático, relaciones interpersonales, rol social. Detecta deterioro precoz.',
      keyContributions: ['Outcome Questionnaire OQ-45 (1996)', 'Detección de deterioro precoz'],
    },
    {
      name: 'Jonathan Shedler & Drew Westen',
      years: '1961- / 1957-',
      bio: 'El SWAP-200 produce un perfil de personalidad psicodinámico completado por el clínico. Supera las limitaciones de autoinformes para la evaluación de personalidad profunda.',
      keyContributions: ['SWAP-200 (1999)', 'Perfil de personalidad psicodinámico'],
    },
  ],
  theoreticalSummary: 'El psicoanálisis tiene una tensión inherente con la medición cuantitativa: su objeto no es directamente observable ni cuantificable. Sin embargo, desarrollos contemporáneos han producido instrumentos compatibles. La Reflective Functioning Scale de Fonagy evalúa la mentalización. El OQ-45 de Lambert permite seguimiento sesión a sesión. El SWAP-200 de Shedler y Westen produce un perfil psicodinámico que puede rastrear cambios en la organización de personalidad a lo largo del tratamiento.',
  exercises: [
    {
      id: 'evaluacion_mensual_proceso',
      title: 'Evaluación Mensual — Indicadores de Proceso',
      instruction: 'Evaluá el estado actual de tu proceso analítico en las dimensiones centrales: función reflexiva, riqueza de vida psíquica y relaciones de objeto.',
      fields: [
        { id: 'reconocer_emociones', label: '¿Podés reconocer y nombrar tus estados emocionales?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'razones_conducta', label: '¿Podés pensar en las razones de tu propia conducta — incluyendo razones no completamente conscientes?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'perspectivas_incomodas', label: '¿Podés tolerar perspectivas sobre vos mismo/a que te resultan incómodas?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'estados_mentales_otros', label: '¿Podés pensar en los estados mentales de personas cercanas — incluso cuando están enojados o difíciles?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'perspectiva_otro', label: '¿Podés mantener la perspectiva del otro aunque estés muy activado/a emocionalmente?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'traer_analisis', label: '¿Podés traer al análisis cosas que antes no podías decir?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Casi nunca', scaleMaxLabel: 'Con frecuencia' },
        { id: 'movimiento_proceso', label: '¿El análisis se siente como un espacio donde algo se mueve?', type: 'scale', scaleMin: 1, scaleMax: 10, scaleMinLabel: 'Estancado', scaleMaxLabel: 'En movimiento' },
        { id: 'vida_onirica', label: '¿Cómo está tu vida de sueños? ¿Recordás sueños? ¿Son elaborados?', type: 'textarea', placeholder: '' },
        { id: 'vida_creativa', label: '¿Cómo está tu vida creativa / imaginativa / lúdica?', type: 'textarea', placeholder: '' },
        { id: 'relaciones_objeto', label: '¿Cómo están tus relaciones de objeto — las relaciones significativas?', type: 'textarea', placeholder: '' },
        { id: 'sintesis_mes', label: '¿Cómo describirías el movimiento del proceso en este período?', type: 'textarea', placeholder: '' },
      ],
    },
  ],
};

// ─── SECCIÓN 10: LAURA — ESCUCHA ANALÍTICA ─────────────────
const section10_LauraEscuchaAnalitica: PsychoanalyticSection = {
  id: 'psychoanalytic_assistant',
  menuId: 'assistant',
  title: 'Laura — Escucha Analítica',
  subtitle: 'Acompañamiento entre sesiones desde la escucha psicoanalítica: asociación libre, elaboración y contención',
  quote: 'La cura psicoanalítica no se da a través de la sugestión sino a través de la elaboración.',
  quoteAuthor: 'Freud',
  theoreticalSummary:
    'Desde la perspectiva psicoanalítica, Laura opera como un espacio transicional (Winnicott) entre sesiones: un lugar donde el sujeto puede depositar fragmentos de pensamiento, emociones difusas o material onírico sin la presión de la coherencia. No interpreta — acompaña la asociación libre del sujeto, devuelve preguntas que abren el discurso y sostiene la ambigüedad sin cerrarla prematuramente. Funciona como un objeto que sobrevive (Winnicott): el paciente puede usarla, atacarla, abandonarla — Laura permanece disponible. Limitación fundamental: Laura no reemplaza la transferencia analítica ni la presencia del analista. No hay inconsciente sin otro que escuche.',
  authors: [
    { name: 'Donald Winnicott', years: '1896-1971', bio: 'El espacio transicional es el área intermedia entre la realidad interna y la externa donde ocurre el juego, la creatividad y — por extensión — la elaboración.', keyContributions: ['Espacio transicional', 'Objeto que sobrevive', 'Holding'] },
    { name: 'Wilfred Bion', years: '1897-1979', bio: 'La función alfa transforma elementos beta (experiencias brutas) en pensamientos pensables. Laura puede funcionar como un continente provisorio para material preelaborado.', keyContributions: ['Función alfa', 'Reverie', 'Capacidad negativa'] },
    { name: 'Sigmund Freud', years: '1856-1939', bio: 'La regla fundamental — decir todo lo que venga a la mente sin censura — es el motor del proceso analítico. Laura invita a la escritura libre como forma de asociación.', keyContributions: ['Asociación libre', 'Elaboración', 'Regla fundamental'] },
  ],
  exercises: [],
};

// ─── EXPORT TODAS LAS SECCIONES ────────────────────────────
export const PSYCHOANALYTIC_SECTIONS: PsychoanalyticSection[] = [
  section1_HistoriaDelSujeto,
  section2_TrabajoElaboracion,
  section3_RegistroAfectivo,
  section4_RegistroInconsciente,
  section5_VinculoTransferencial,
  section6_CronologiaConflicto,
  section7_IndicacionesTrabajo,
  section8_HitosProceso,
  section9_EvolucionProceso,
  section10_LauraEscuchaAnalitica,
];
