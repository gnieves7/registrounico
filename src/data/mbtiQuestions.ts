// Preguntas del test MBTI basadas en el documento original
// Cada pregunta tiene un ID, texto y las dimensiones que mide

export interface MbtiQuestion {
  id: number;
  text: string;
  // Qué dimensión favorece si se marca esta pregunta
  dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export const mbtiQuestions: MbtiQuestion[] = [
  // Thinking (T) vs Feeling (F)
  { id: 1, text: "Se enorgullece de su objetividad -a pesar que algunos lo acusan de ser frío e indiferente.", dimension: 'T' },
  { id: 4, text: "No le importa realizar decisiones difíciles y no comprende por qué alguna gente se altera por cosas que no son relevantes para el asunto que se están tratando.", dimension: 'T' },
  { id: 18, text: "Considera más importante tener razón que caer bien; no cree necesario que la gente deba caerle bien para poder trabajar con ella y realizar un buen trabajo.", dimension: 'T' },
  { id: 20, text: "Tiende a dar más crédito a cosas que son lógicas y científicas; por ej. hasta que no reciba más información que justifique los beneficios de este test, se mantendrá escéptico acerca de su utilidad.", dimension: 'T' },
  { id: 26, text: "Suelen acusarlo de estar enojado cuando no lo está; es sólo su manera de expresar su opinión.", dimension: 'T' },
  { id: 48, text: "Le gusta demostrar su punto de vista por motivos de claridad; es habitual en Ud. discutir ambos puntos de vista en un debate simplemente para ampliar su horizonte intelectual.", dimension: 'T' },
  { id: 50, text: "Es capaz de mantenerse frío calmado y objetivo en situaciones donde todo el mundo está alterado.", dimension: 'T' },
  { id: 55, text: "Preferiría resolver un conflicto basándose en lo que es justo y verdadero más que en lo que hace feliz a la gente.", dimension: 'T' },
  { id: 58, text: "Es una persona de ideas firmes que de corazón tierno; si Ud. está en desacuerdo con las personas prefiere decirlo que callar y que crean que está de acuerdo.", dimension: 'T' },
  
  // Feeling (F)
  { id: 3, text: "Cree que el amor no puede ser definido; se siente ofendido por los que tratan de hacerlo.", dimension: 'F' },
  { id: 8, text: "Considera como una buena decisión la que toma en cuenta los sentimientos de otros.", dimension: 'F' },
  { id: 11, text: "No duda en retirar lo dicho si Ud. percibe que ha ofendido a alguien; como consecuencia Ud. es acusado de no tener convicciones.", dimension: 'F' },
  { id: 14, text: "Prefiere la armonía a la claridad; el conflicto lo abruma y trata de evitarlo (cambiemos de tema, o démonos las manos y seamos todos amigos).", dimension: 'F' },
  { id: 27, text: "Disfruta prestando servicios necesarios a la gente aunque algunos se aprovechen de Ud.", dimension: 'F' },
  { id: 31, text: "Se extralimita tratando de satisfacer las necesidades de otros; hará casi cualquier cosa para acomodar a otros incluso a expensas de su propio confort.", dimension: 'F' },
  { id: 33, text: "Se pone en el lugar de los demás; Ud. es quien en una reunión probablemente pregunta cómo afectará esto a la gente involucrada.", dimension: 'F' },
  { id: 35, text: "A menudo se pregunta si alguien se preocupa por lo que Ud. desea aunque tenga dificultad en decírselo a alguien.", dimension: 'F' },
  { id: 61, text: "Necesita aprobación de los colegas superiores y subordinados acerca de quién es Ud., de lo que hace, cómo luce y casi sobre todo lo demás.", dimension: 'F' },
  { id: 65, text: "Es percibido como un gran escucha pero siente que otros toman ventaja de ello y se aprovechan.", dimension: 'F' },
  
  // Introversion (I)
  { id: 2, text: "Necesita recargar energías solo, después de reuniones, llamadas telefónicas o socialización; cuanto más intenso es el encuentro más agotado se siente posteriormente.", dimension: 'I' },
  { id: 9, text: "Ensaya las cosas antes de decirlas; a menudo contesta con 'lo tendré que pensar o le contesto más tarde'.", dimension: 'I' },
  { id: 10, text: "No le importa leer o tener una conversación mientras se desarrolla otra actividad; en realidad puede permanecer indiferente a distracciones.", dimension: 'I' },
  { id: 49, text: "Le gusta expresar sus pensamientos o ideas sin interrupciones; deja que otros hagan lo mismo, esperando que sea recíproco.", dimension: 'I' },
  { id: 54, text: "Desearía imponer sus ideas con más fuerza. Le molesta que otros digan antes cosas que Ud. estaba por decir.", dimension: 'I' },
  { id: 63, text: "Es posible que Ud. crea que los que hablan mucho, sean charlatanes; cuando escucha otros conversando puede venirle a la mente que están perdiendo el tiempo.", dimension: 'I' },
  { id: 67, text: "A veces lo han calificado de tímido; esté o no de acuerdo, puede parecer a otros como alguien reservado y pensativo.", dimension: 'I' },
  { id: 69, text: "Le gusta compartir ocasiones especiales sólo con alguna otra persona o quizás con algunos amigos íntimos.", dimension: 'I' },
  { id: 72, text: "Disfruta de la paz y la tranquilidad de tener tiempo para Ud. mismo; halla que su tiempo privado se encuentra fácilmente invadido.", dimension: 'I' },
  
  // Extraversion (E)
  { id: 5, text: "Tiende a hablar primero y pensar después; con frecuencia se reprocha a sí mismo con cosas como '¿aprenderé alguna vez a mantener mi boca cerrada?'", dimension: 'E' },
  { id: 7, text: "Conoce mucha gente y a muchos de ellos los considera como amigos íntimos; le gusta incluir tanta gente como sea posible en sus actividades.", dimension: 'E' },
  { id: 13, text: "Es accesible y traba conversación fácilmente con amigos, compañeros del trabajo y extraños teniendo quizás un papel dominante en la conversación.", dimension: 'E' },
  { id: 23, text: "Encuentra que escuchar es más difícil que hablar; le gusta ser la estrella de la conversación, y se aburre cuando no puede participar activamente en ella.", dimension: 'E' },
  { id: 25, text: "Prefiere generar ideas en un grupo que por su cuenta; se siente agotado si pasa mucho tiempo reflexionando sin tener la oportunidad de intercambiar sus ideas con otros.", dimension: 'E' },
  { id: 68, text: "Considera que las llamadas telefónicas son interrupciones bienvenidas; no duda en usar el teléfono cuando tiene algo que decir o necesita ver a alguien.", dimension: 'E' },
  { id: 71, text: "Le gusta ir a reuniones y tiende a manifestar su opinión; en realidad se siente frustrado si no le dan la oportunidad de expresar su punto de vista.", dimension: 'E' },
  
  // Sensing (S)
  { id: 6, text: "Recuerda los números y cifras más fácilmente que las caras y los nombres.", dimension: 'S' },
  { id: 15, text: "Se siente frustrado cuando las personas le dan instrucciones poco claras o cuando alguien le dice 'este es el plan general, nos ocuparemos de los detalles después'.", dimension: 'S' },
  { id: 19, text: "No le gustan las sorpresas y esto se lo hace saber a los demás.", dimension: 'S' },
  { id: 45, text: "Usa las palabras en forma literal; a menudo se ve en la necesidad de preguntar si lo que dicen es en serio o es un chiste.", dimension: 'S' },
  { id: 51, text: "Encuentra más fácil ver los árboles que el bosque; es feliz de concentrarse en su tareas y no se preocupa acerca de cómo encajan éstas en un esquema más amplio.", dimension: 'S' },
  { id: 53, text: "Encuentra más satisfactorios aquellos trabajos que producen resultados tangibles; preferiría limpiar su escritorio que pensar en lo que le depara el futuro de su carrera.", dimension: 'S' },
  { id: 56, text: "Prefiere respuestas específicas a preguntas específicas; cuando pregunta la hora, prefiere que le digan 3:42, y no que falta un poco para las 4.", dimension: 'S' },
  { id: 59, text: "Le gusta concentrarse en lo que está haciendo en ese momento y generalmente no le preocupa lo que sigue; es más, prefiere hacer algo que pensar en ello.", dimension: 'S' },
  { id: 66, text: "Piensa que la fantasía es una mala palabra; duda de la gente que parece dedicar demasiado tiempo a jugar con su imaginación.", dimension: 'S' },
  { id: 70, text: "Prefiere resultados con hechos y números que con ideas y teorías; prefiere escuchar las cosas en forma secuencial y no al azar.", dimension: 'S' },
  
  // Intuition (N)
  { id: 16, text: "En una conversación cambia a menudo de tema; el nuevo tema puede ser algo que le viene a la mente o que atrae su atención en ese momento.", dimension: 'N' },
  { id: 21, text: "Encuentra el futuro y sus posibilidades interesantes, más que atemorizantes; generalmente le atrae más a donde va que donde está.", dimension: 'N' },
  { id: 28, text: "Se distrae fácilmente; se 'pierde' en el camino de la puerta de la calle al auto.", dimension: 'N' },
  { id: 30, text: "Adora explorar lo desconocido, aun cuando sea algo tan simple como el camino del trabajo a casa.", dimension: 'N' },
  { id: 37, text: "Cree que hablar de detalles aburridos es una pérdida de tiempo.", dimension: 'N' },
  { id: 47, text: "Le interesa saber cómo funcionan las cosas solo por placer.", dimension: 'N' },
  { id: 52, text: "Tiene inclinación a los juegos de palabras.", dimension: 'N' },
  { id: 57, text: "Prefiere fantasear sobre cómo gastar su próximo sueldo que sentarse a balancear su cuenta bancaria.", dimension: 'N' },
  { id: 62, text: "Encuentra más atractivo buscar las relaciones y conexiones de las cosas, más que aceptarlas tal como aparecen; siempre está preguntando qué es lo que eso significa.", dimension: 'N' },
  { id: 64, text: "Tiende a dar respuestas generales a las preguntas; no comprende por qué tanta gente no puede seguir sus instrucciones.", dimension: 'N' },
  
  // Judging (J)
  { id: 21, text: "Hace listas y las utiliza; si hace algo que no está en su lista puede que lo agregue a las misma sólo para poder tacharlo.", dimension: 'J' },
  { id: 24, text: "Le deleita el orden; tiene su manera especial para guardar las cosas en su escritorio, en sus archivos.", dimension: 'J' },
  { id: 29, text: "Le gusta completar un trabajo hasta acabarlo y sacárselo de encima aún cuando sabe que deberá rehacerlo de nuevo más tarde para hacerlo bien.", dimension: 'J' },
  { id: 34, text: "Tiene un lugar para cada cosa y no se siente satisfecho hasta que cada cosa esté en su sitio.", dimension: 'J' },
  { id: 36, text: "Siempre tiene que esperar a los otros, quienes nunca parecen ser puntuales.", dimension: 'J' },
  { id: 42, text: "Sabe que si cada uno hiciera lo que se supone debe hacer (y en el momento que se supone debe hacerlo) el mundo sería un lugar mejor.", dimension: 'J' },
  { id: 43, text: "Ud. es de la idea que hay que ver para creer; si alguno le dice que llegó el correo, Ud. no lo cree hasta que no está sobre su escritorio.", dimension: 'J' },
  { id: 46, text: "Se despierta por la mañana y sabe bastante bien cómo será su día; tiene una agenda y la sigue; puede alterarse si las cosas no marchan como estaba planeado.", dimension: 'J' },
  
  // Perceiving (P)
  { id: 12, text: "No le gusta que le obliguen a tomar decisiones; prefiere mantener sus opciones abiertas.", dimension: 'P' },
  { id: 17, text: "Tiende a que las cosas no sean definitivas, aunque no siempre.", dimension: 'P' },
  { id: 22, text: "Convierte todo trabajo en una diversión; si un trabajo no puede ser algo entretenido probablemente no sea digno de hacerse.", dimension: 'P' },
  { id: 32, text: "No planifica una tarea hasta ver qué es lo que se requiere; la gente lo acusa de ser desorganizado aunque Ud. sabe mejor qué es lo que hay que hacer.", dimension: 'P' },
  { id: 38, text: "Depende de sus descargas de adrenalina en el último minuto para cumplir con sus fechas límite.", dimension: 'P' },
  { id: 39, text: "Piensa en varias cosas al mismo tiempo; a menudo sus amigos y colegas le señalan que está 'como ausente'.", dimension: 'P' },
  { id: 44, text: "Cree que el tiempo es relativo; no importa la hora a menos que la reunión, cena o evento haya comenzado sin Ud.", dimension: 'P' },
  { id: 60, text: "No cree que la prolijidad sea importante, aunque preferiría tener las cosas en orden; lo importante es la creatividad, la espontaneidad y la capacidad de respuesta.", dimension: 'P' },
];

// Información de preferencias MBTI
export const mbtiPreferences = {
  E: {
    name: "Extroversión",
    letter: "E",
    description: "Obtiene energía del mundo exterior, de la gente y de las experiencias.",
    characteristics: [
      "Enfoca la energía y la atención hacia la ACCIÓN",
      "HACE-PIENSA-HACE",
      "Prefiere comunicarse verbalmente. Piensa alto",
      "Sociable y expresiva",
      "Aprende mejor actuando y discutiendo",
      "Amplitud de intereses",
      "Toma fácilmente la iniciativa en el trabajo y en las relaciones"
    ]
  },
  I: {
    name: "Introversión",
    letter: "I",
    description: "Obtiene energía del mundo interior, de sus reflexiones y pensamientos.",
    characteristics: [
      "Enfoca la energía y la atención hacia la REFLEXIÓN",
      "PIENSA-HACE-PIENSA",
      "Prefiere comunicarse por escrito. Piensa en su interior",
      "Privada y reservada",
      "Aprende mejor por la reflexión y concentración",
      "Profundidad en sus intereses",
      "Toma la iniciativa cuando la situación es muy importante"
    ]
  },
  S: {
    name: "Sensación",
    letter: "S",
    description: "Prefiere poner atención a la información real y tangible.",
    characteristics: [
      "Se enfoca en lo que es real y verdadero",
      "Comprende ideas mediante aplicaciones prácticas",
      "Observa y presta atención a los detalles",
      "Ve lo específico, cada árbol",
      "Requiere información precisa y exacta",
      "Actúa con cuidado y profundidad para llegar a conclusiones",
      "Le gusta el presente, lo actual. Confía en la experiencia"
    ]
  },
  N: {
    name: "Intuición",
    letter: "N",
    description: "Prefiere observar el gran esquema, las relaciones y conexiones.",
    characteristics: [
      "Se enfoca en modelos y significados de la información",
      "Desea aclarar ideas y teorías antes de llevarlas a la práctica",
      "Recuerda detalles cuando se relacionan con modelos",
      "Ve lo global, el bosque",
      "Valora imaginación y perspicacia",
      "Se mueve rápidamente siguiendo corazonadas",
      "Vive en anticipar el futuro. Confía en la inspiración"
    ]
  },
  T: {
    name: "Pensamiento",
    letter: "T",
    description: "Prefiere tomar decisiones basadas en la lógica y la objetividad.",
    characteristics: [
      "Analiza los pro y contra objetivamente",
      "Busca una norma aplicable en todas las situaciones similares",
      "Analítico y busca un estándar objetivo de verdad",
      "Guiado por razonamiento causa-efecto",
      "Razonable con criterios interpersonales",
      "Crítico: rápido para ver errores y áreas de mejora",
      "Equitativo: desea que todos sean tratados de la misma manera"
    ]
  },
  F: {
    name: "Sentimiento",
    letter: "F",
    description: "Prefiere tomar decisiones basadas en sus valores y convicciones personales.",
    characteristics: [
      "Se mete en la situación para identificarse con todos",
      "Busca crear armonía y tratar a cada persona como individuo único",
      "Comprende los puntos de vista de los demás",
      "Guiado por valores personales",
      "Compasivo. Atiende a circunstancias personales",
      "Rápido para mostrar aprecio y encontrar puntos en común",
      "Busca la armonía e interacciones positivas"
    ]
  },
  J: {
    name: "Juicio",
    letter: "J",
    description: "Prefiere vivir de una forma planeada y ordenada.",
    characteristics: [
      "Disfruta cerrando y siendo decisivo",
      "Evita las prisas y estrés de última hora",
      "Le gusta hacer planes y seguirlos hasta el final",
      "Organizado y metódico",
      "Controlado: le gusta tener las cosas decididas",
      "Estructurado, paso a paso",
      "Deriva energía al conseguir hacer las cosas"
    ]
  },
  P: {
    name: "Percepción",
    letter: "P",
    description: "Prefiere vivir de manera espontánea y flexible.",
    characteristics: [
      "Disfruta manteniendo opciones abiertas",
      "Necesita las prisas y el estrés del último minuto",
      "Le gusta adaptarse a los cambios y responder a ellos",
      "Flexible y abierto",
      "Le gustan las cosas indeterminadas y abiertas al cambio",
      "Sigue la corriente, 50 procesos abiertos",
      "Deriva energía de su facultad de adaptarse a las demandas del momento"
    ]
  }
};

// Tabla de niveles de preferencia
export const preferenceStrengthLevels = [
  { min: 0, max: 10, label: "Leve", color: "text-muted-foreground" },
  { min: 11, max: 20, label: "Moderado", color: "text-blue-600" },
  { min: 21, max: 30, label: "Fuerte", color: "text-primary" },
  { min: 31, max: 100, label: "Muy Fuerte", color: "text-destructive" }
];

export function getPreferenceStrength(difference: number): { label: string; color: string } {
  const level = preferenceStrengthLevels.find(l => difference >= l.min && difference <= l.max);
  return level || preferenceStrengthLevels[preferenceStrengthLevels.length - 1];
}

// Descripciones completas de los 16 tipos de personalidad MBTI
export interface MbtiTypeDescription {
  title: string;
  subtitle: string;
  description: string;
  contributions: string[];
  leadershipStyle: string[];
  preferredEnvironment: string[];
  potentialDangers: string[];
  developmentSuggestions: string[];
}

export const mbtiDescriptions: Record<string, MbtiTypeDescription> = {
  ISTJ: {
    title: "Inspector",
    subtitle: "Introvertido / Sensitivo / Reflexivo / Juicio",
    description: "Son minuciosos, sistemáticos, esmerados, trabajadores, detallistas, serios y tranquilos. Alcanzan el éxito mediante la concentración y la minuciosidad. Práctico, ordenado, lógico, realista y formal. Se asegura de que todo está bien organizado. Asume la responsabilidad. Decide lo que debería conseguirse y trabaja para alcanzarlo, a pesar de las protestas y las distracciones.",
    contributions: [
      "Hacen las cosas con seguridad y en plazo",
      "Destacan en el cuidado de los detalles",
      "Tienen las cosas a tiempo y en su sitio",
      "Trabajan bien dentro de la estructura de la organización",
      "Se puede confiar en que realizarán lo que se les encomiende"
    ],
    leadershipStyle: [
      "Usan la experiencia y el conocimiento de los hechos para tomar decisiones",
      "Respetan los enfoques tradicionales y jerárquicos",
      "Se basan en resultados fiables, estables y consistentes",
      "Recompensan a quienes hacen su trabajo y respetan las reglas"
    ],
    preferredEnvironment: [
      "Incluye personas trabajadoras dirigidas a la consecución de logros",
      "Proporciona seguridad y recompensa la constancia",
      "Está estructurado y orientado a las tareas",
      "Permite concentrarse en su trabajo sin interrupciones"
    ],
    potentialDangers: [
      "Olvidar las implicaciones a largo plazo, pensando en el día a día",
      "Menospreciar las necesidades interpersonales",
      "Llegar a ser rígidos y tener fama de inflexibles",
      "Exigir adecuación a las normas e inhibir la innovación"
    ],
    developmentSuggestions: [
      "Prestar atención a las ramificaciones de los problemas",
      "Considerar el elemento humano y transmitir aprecio por los demás",
      "Probar nuevas soluciones para salir de la rutina",
      "Ejercitar la paciencia con quienes prueban nuevas técnicas"
    ]
  },
  ISFJ: {
    title: "Protector",
    subtitle: "Introvertido / Sensitivo / Emotivo / Juicio",
    description: "Tranquilo, responsable y concienzudo. Trabaja para cumplir sus obligaciones. Proporciona estabilidad a cualquier proyecto o grupo. Meticuloso, laborioso, preciso. Son comprensivos, leales, considerados, amables y capaces de cualquier esfuerzo para acudir en ayuda de los que lo necesitan. Se preocupa por los sentimientos de otras personas.",
    contributions: [
      "Tienen en cuenta las necesidades de los demás",
      "Gran habilidad para conseguir llevar a cabo los objetivos",
      "Son minuciosos y responsables en aspectos de detalle y rutina",
      "Son serviciales y tienen las cosas ordenadas a tiempo"
    ],
    leadershipStyle: [
      "Pueden resistirse a aceptar puestos de mando inicialmente",
      "Acatan y esperan que los demás acaten la estructura y jerarquía",
      "Usan su influencia personal sin alardes",
      "Siguen concienzudamente los métodos tradicionales"
    ],
    preferredEnvironment: [
      "Personas concienzudas trabajando en tareas bien estructuradas",
      "Seguridad y estructura clara",
      "Tranquilo, sosegado y eficiente",
      "Orientado al servicio"
    ],
    potentialDangers: [
      "Ser pesimistas sobre el futuro",
      "No ser suficientemente fuertes al defender sus ideas",
      "Ser infravalorados por su tranquilidad y modestia",
      "No ser suficientemente flexibles"
    ],
    developmentSuggestions: [
      "Ver el futuro en términos positivos y globales",
      "Desarrollar seguridad en sí mismos y ser más directos",
      "Aprender a comunicar y 'vender' sus propios logros",
      "Estar abiertos a nuevas formas de hacer las cosas"
    ]
  },
  INFJ: {
    title: "Consejero",
    subtitle: "Introvertido / Intuitivo / Emotivo / Juicio",
    description: "Consigue el éxito mediante la perseverancia, la originalidad y el deseo de hacer lo que sea necesario. Trabaja de manera concienzuda, preocupándose por los demás. Se le respeta por sus principios firmes. Confían en sus propios puntos de vista, ejercen influencia suavemente, son profundamente compasivos, introspectivos y buscan la armonía.",
    contributions: [
      "Ofrecen perspectivas de futuro dirigidas a satisfacer necesidades humanas",
      "Consiguen compromisos",
      "Trabajan con honestidad y constancia",
      "Prefieren trabajos que requieren soledad y concentración",
      "Organizan relaciones complejas entre personas y tareas"
    ],
    leadershipStyle: [
      "Dirigen a través de su visión de lo que es mejor para la organización",
      "Ganan la cooperación más que pedirla",
      "Utilizan una forma de actuar tranquila pero persistente",
      "Animan a los demás con sus ideales"
    ],
    preferredEnvironment: [
      "Personas interesadas por ideales",
      "Oportunidades para la creatividad",
      "Armonioso, tranquilo y organizado",
      "Deja tiempo y espacio para la reflexión"
    ],
    potentialDangers: [
      "Sentir que sus ideas no son apreciadas o valoradas",
      "No ser claros en la crítica",
      "Temer inmiscuirse en el campo de los demás y aislarse",
      "Concentración unilateral, ignorando otras tareas"
    ],
    developmentSuggestions: [
      "Desarrollar talento político y seguridad para defender sus ideales",
      "Contrastar sus puntos de vista con los de los demás",
      "Relajarse y estar más abiertos a lo realizable actualmente",
      "Ejercer un control constructivo sobre sus subordinados"
    ]
  },
  INTJ: {
    title: "Mente Maestra",
    subtitle: "Introvertido / Intuitivo / Reflexivo / Juicio",
    description: "Cuenta con una mente original y una gran motivación para sus propias ideas y propósitos. Tiene capacidad para organizar un trabajo y finalizarlo con o sin ayuda. Sabe lo que quiere y cómo conseguirlo. Escéptico, crítico, independiente, determinado. Son independientes, individualistas y resueltos; confían en su propia visión.",
    contributions: [
      "Grandes habilidades en tareas de concepción y diseño",
      "Organizan las ideas en forma de planes de acción",
      "Trabajan para eliminar obstáculos que dificultan los objetivos",
      "Tienen ideas claras sobre cómo debe ser la organización",
      "Ayudan a entender los sistemas como conjuntos complejos"
    ],
    leadershipStyle: [
      "Se conducen a sí mismos y a los demás para alcanzar objetivos",
      "Actúan con fuerza en el campo de las ideas",
      "Conciben, diseñan y construyen nuevos modelos",
      "Están dispuestos a reorganizar todo el sistema si es necesario"
    ],
    preferredEnvironment: [
      "Personas intelectualmente competentes",
      "Intimidad para la reflexión",
      "Eficiente, fomenta la autonomía",
      "Concede oportunidades para la creatividad"
    ],
    potentialDangers: [
      "Parecer tan productivos que retraigan a los demás",
      "Ser muy críticos en su lucha por el ideal",
      "Dificultad en abandonar ideas poco prácticas",
      "Ignorar el impacto de sus ideas sobre los demás"
    ],
    developmentSuggestions: [
      "Pedir opiniones y sugerencias de los demás",
      "Aprender a valorar a los demás",
      "Aprender a abandonar las ideas inviables",
      "Atender más al impacto de sus ideas sobre los demás"
    ]
  },
  ISTP: {
    title: "Artesano",
    subtitle: "Introvertido / Sensitivo / Reflexivo / Percepción",
    description: "Observador frío, tranquilo, reservado, analiza la vida con curiosidad imparcial y con momentos inesperados de humor original. Interesado en la causa y el efecto, el cómo y por qué funcionan las cosas. Son capaces de manejar situaciones, son conscientes de los hechos, realistas y difíciles de convencer si no es mediante el razonamiento.",
    contributions: [
      "Actúan como 'apaga-fuegos' en función de las necesidades del momento",
      "Son un compendio ambulante de información",
      "Hacen las cosas a pesar de las normas",
      "Permanecen tranquilos en las crisis, estabilizando a los demás",
      "Inclinación natural hacia los temas técnicos"
    ],
    leadershipStyle: [
      "Dirigen a través de la acción, dando ejemplo",
      "Prefieren un equipo donde todos sean tratados como iguales",
      "Responden de inmediato ante dificultades",
      "Dejan libertad y prefieren un control mínimo"
    ],
    preferredEnvironment: [
      "Personas activas ocupadas en acciones inmediatas",
      "Orientado a la realización de proyectos",
      "Escasa regulación normativa",
      "Fomenta la independencia y la acción"
    ],
    potentialDangers: [
      "Guardar para sí temas importantes y parecer despreocupado",
      "Cambiar de tema antes que el anterior haya dado frutos",
      "Ser precipitados y tomar 'atajos' peligrosos",
      "Parecer indecisos o indisciplinados"
    ],
    developmentSuggestions: [
      "Abrirse y compartir información con los demás",
      "Desarrollar la perseverancia",
      "Planificarse y mantener el esfuerzo hasta conseguir resultados",
      "Desarrollar la costumbre de fijar objetivos"
    ]
  },
  ISFP: {
    title: "Compositor",
    subtitle: "Introvertido / Sensitivo / Emotivo / Percepción",
    description: "Tranquilo, amistoso, sensible, amable, modesto con respecto a sus habilidades. Rehúye los desacuerdos. No trata de inculcar sus opiniones a otras personas. Son amables, considerados, compasivos hacia los más necesitados y tienen una mente abierta y flexible.",
    contributions: [
      "Atienden a las necesidades de las personas",
      "Actúan para garantizar el bienestar de los demás",
      "Infunden alegría en su trabajo",
      "Integran bien las tareas y las personas",
      "Atienden a los aspectos humanos de la organización"
    ],
    leadershipStyle: [
      "Prefieren el trabajo en equipo",
      "Usan la lealtad personal como forma de motivar",
      "Más aptos para alabar que para criticar",
      "Persuaden suavemente apelando a las buenas intenciones"
    ],
    preferredEnvironment: [
      "Personas colaboradoras que disfrutan con su trabajo",
      "Atiende a los aspectos personales",
      "Flexible y estéticamente atractivo",
      "Compañeros atentos y bien integrados"
    ],
    potentialDangers: [
      "Ser demasiado ingenuos y crédulos",
      "No criticar cuando es necesario, siendo demasiado autocríticos",
      "No ver más allá de las realidades presentes",
      "Sentirse heridos y abandonar con excesiva facilidad"
    ],
    developmentSuggestions: [
      "Desarrollar escepticismo y espíritu crítico",
      "Exigir más de otros y apreciar más los propios logros",
      "Desarrollar una mayor visión de futuro",
      "Ser más directos y seguros de sí"
    ]
  },
  INFP: {
    title: "Sanador",
    subtitle: "Introvertido / Intuitivo / Emotivo / Percepción",
    description: "Lleno de entusiasmo y lealtad. Se preocupa por el aprendizaje, las ideas, el lenguaje y los proyectos independientes. Tienen una mente abierta, son idealistas, perspicaces y flexibles. Quieren que su trabajo contribuya a algo valioso.",
    contributions: [
      "Intentan encontrar un sitio para cada persona",
      "Son persuasivos en relación con sus ideas",
      "Integran a las personas con relación a un propósito común",
      "Buscan nuevas ideas y posibilidades",
      "Presionan para establecer valores de la organización"
    ],
    leadershipStyle: [
      "Tienden a facilitar",
      "Prefieren papeles directivos especiales a los convencionales",
      "Trabajan con independencia hacia sus ideales",
      "Animan a otros a seguir sus ideales"
    ],
    preferredEnvironment: [
      "Personas empeñadas en valores importantes",
      "Ambiente de colaboración e intimidad",
      "Flexible, no burocrático",
      "Tranquilo con tiempo y lugar para reflexión"
    ],
    potentialDangers: [
      "Retrasarse en la tarea por perfeccionismo",
      "Intentar agradar a demasiada gente al mismo tiempo",
      "No adecuarse a los hechos y la lógica del momento",
      "Gastar más tiempo en reflexión que en acción"
    ],
    developmentSuggestions: [
      "Ser realista y no pensar tanto en la solución ideal",
      "Desarrollar la capacidad de decir 'no'",
      "Reforzar su lógica y objetividad",
      "Desarrollar e implantar planes de acción"
    ]
  },
  INTP: {
    title: "Arquitecto",
    subtitle: "Introvertido / Intuitivo / Reflexivo / Percepción",
    description: "Tranquilo y reservado. Disfruta de tareas teóricas o científicas. Le gusta resolver problemas mediante la lógica y el análisis. Son racionales, curiosos, teóricos, abstractos y prefieren trabajar con ideas más que con personas o situaciones.",
    contributions: [
      "Diseñan sistemas lógicos y complejos",
      "Demuestran pericia para resolver problemas complejos",
      "Tienen perspicacia intelectual a corto y largo plazo",
      "Aplican capacidad de lógica, análisis y pensamiento crítico",
      "Van directamente al núcleo del problema"
    ],
    leadershipStyle: [
      "Dirigen mediante el análisis conceptual de problemas y objetivos",
      "Aplican criterios lógicos y sistemáticos",
      "Prefieren dirigir a otros tipos independientes",
      "Se relacionan atendiendo más a la pericia que a la posición"
    ],
    preferredEnvironment: [
      "Pensadores independientes dedicados a resolver problemas complejos",
      "Concede intimidad y fomenta la independencia",
      "Flexible, tranquilo y poco estructurado",
      "Premia la autonomía"
    ],
    potentialDangers: [
      "Ser demasiado abstractos y poco realistas",
      "Ser demasiado intelectuales y teóricos en exposiciones",
      "Prestar excesiva atención a incoherencias menores",
      "Dirigir su pensamiento crítico hacia las personas"
    ],
    developmentSuggestions: [
      "Fijarse en detalles prácticos y desarrollar capacidad de llevar a cabo",
      "Expresar las cosas con sencillez",
      "Mostrar aprecio por las acciones de los demás",
      "Mejorar conocimiento de aspectos profesionales y personales de los demás"
    ]
  },
  ESTP: {
    title: "Promotor",
    subtitle: "Extrovertido / Sensitivo / Reflexivo / Percepción",
    description: "Es bueno para resolver problemas que se presentan de repente. Disfruta del momento. Adaptable, tolerante, generalmente con valores conservadores. Es flexible y sabe ajustarse a las necesidades del grupo. Están orientados hacia la acción; son pragmáticos, realistas y con recursos.",
    contributions: [
      "Negocian y buscan compromisos para que las cosas avancen",
      "Ayudan a que los hechos se produzcan",
      "Aportan un enfoque realista",
      "Gustan del riesgo",
      "Captan y retienen información sobre los hechos"
    ],
    leadershipStyle: [
      "Se responsabilizan con rapidez en momentos de crisis",
      "Persuaden a otros de sus puntos de vista",
      "Tienen un estilo directo y confiado",
      "Buscan acción y resultados inmediatos"
    ],
    preferredEnvironment: [
      "Personas animosas interesadas por los resultados",
      "Poco burocrático con tiempo para la diversión",
      "Facilita flexibilidad y tiene aspectos técnicos",
      "Se ajusta a las necesidades del momento"
    ],
    potentialDangers: [
      "Parecer bruscos o insensibles al actuar rápidamente",
      "Confiar con exceso en la improvisación",
      "Sacrificar lo mediato a los problemas inmediatos",
      "Quedarse en los aspectos materialistas"
    ],
    developmentSuggestions: [
      "Suavizar su firmeza atendiendo a los sentimientos de los otros",
      "Considerar aspectos más amplios, planificar a más largo plazo",
      "Mirar más allá de los placeres inmediatos",
      "Desarrollar su fidelidad"
    ]
  },
  ESFP: {
    title: "Actor",
    subtitle: "Extrovertido / Sensación / Emotivo / Percepción",
    description: "Extrovertido, amistoso, disfruta con todo y hace que las cosas sean divertidas para los demás. Está al corriente de lo que ocurre y le gusta participar. Son joviales, simpáticos y naturalmente inclinados hacia las personas.",
    contributions: [
      "Producen entusiasmo y colaboración",
      "Presentan una imagen positiva de la organización",
      "Ofrecen acción y emoción",
      "Integran personas y recursos",
      "Aceptan y tratan a las personas tal como son"
    ],
    leadershipStyle: [
      "Dirigen promoviendo la buena voluntad y el trabajo en equipo",
      "Resuelven bien las crisis",
      "Facilitan situaciones tensas mejorando el contacto",
      "Facilitan interacciones positivas entre las personas"
    ],
    preferredEnvironment: [
      "Personas enérgicas y tolerantes",
      "Animado y orientado a la acción",
      "Armónico y personalizado",
      "Personas adaptables y ambiente atractivo"
    ],
    potentialDangers: [
      "Sobrevalorar los aspectos subjetivos",
      "Ser irreflexivos",
      "Gastar mucho tiempo en temas sociales olvidando tareas",
      "No acabar lo que empiezan"
    ],
    developmentSuggestions: [
      "Incluir más lógica en sus decisiones",
      "Planificar más a largo plazo al gestionar proyectos",
      "Equilibrar atención a las tareas con atención a las personas",
      "Mejorar la gestión de su tiempo"
    ]
  },
  ESTJ: {
    title: "Supervisor",
    subtitle: "Extrovertido / Sensitivo / Reflexivo / Juicio",
    description: "Práctico, realista, con habilidad natural para los negocios. Le gusta organizar y dirigir actividades. Puede ser un buen administrador. Es rápido tomando decisiones. Respeta las jerarquías. Son lógicos, analíticos, con capacidad de decisión, resistentes y capaces de organizar hechos y operaciones con antelación.",
    contributions: [
      "Prevén los fallos con anticipación",
      "Critican los planes de forma lógica",
      "Buenos organizadores de trabajos y personas",
      "Comprueban si los trabajos son realizados",
      "Llevan a cabo los trabajos paso a paso"
    ],
    leadershipStyle: [
      "Gustan de mandar y se responsabilizan con rapidez",
      "Aplican experiencias pasadas a la resolución de problemas",
      "Van directamente al núcleo del tema",
      "Actúan como jefes tradicionales, respetando la jerarquía"
    ],
    preferredEnvironment: [
      "Personas muy trabajadoras",
      "Orientado hacia las tareas y organizado",
      "Estructurado con estabilidad y planificación",
      "Recompensa la consecución de metas"
    ],
    potentialDangers: [
      "Decidir precipitadamente",
      "Olvidar la necesidad de cambiar",
      "Ser algo chapuceros",
      "Verse sorprendidos por sus sentimientos después de ignorarlos"
    ],
    developmentSuggestions: [
      "Sopesar todos los aspectos antes de decidir, incluido el factor humano",
      "Precisar de estímulos para ver los beneficios del cambio",
      "Hacer esfuerzo especial para mostrar aprecio por los demás",
      "Necesitan tiempo para reflexionar e identificar sentimientos y valores"
    ]
  },
  ESFJ: {
    title: "Proveedor",
    subtitle: "Extrovertido / Sensitivo / Emotivo / Juicio",
    description: "Bondadoso, hablador, popular, concienzudo, colaborador nato. Necesita armonía y puede ser bueno a la hora de crearla. Siempre está haciendo algo bueno por alguien. Su principal interés reside en las cosas que afectan de forma directa a la vida de las personas. Son útiles, delicados, compasivos, ordenados y valoran en alto grado las relaciones humanas.",
    contributions: [
      "Trabajan bien con otros, principalmente en equipo",
      "Atienden a las necesidades y deseos de las personas",
      "Terminan las tareas con precisión y oportunidad",
      "Respetan las normas y la autoridad",
      "Manejan eficazmente las tareas del día a día"
    ],
    leadershipStyle: [
      "Dirigen mediante la atención personal a los demás",
      "Consiguen buena voluntad mediante buenas relaciones",
      "Mantienen a la gente informada",
      "Dan ejemplo en el trabajo y mantienen tradiciones"
    ],
    preferredEnvironment: [
      "Personas concienzudas y colaboradoras",
      "Sistemas orientados a la consecución de metas",
      "Bien organizado y amistoso",
      "Personas agradecidas y sensibles"
    ],
    potentialDangers: [
      "Evitar conflictos y esconder los problemas",
      "Dejarse llevar por su afán de agradar",
      "Pensar que saben lo que es bueno para todos",
      "Perder de vista el conjunto"
    ],
    developmentSuggestions: [
      "Aprender a manejar y gestionar los conflictos",
      "Tener en cuenta sus propias necesidades",
      "Escuchar lo que realmente los demás quieren o necesitan",
      "Tener en cuenta las implicaciones globales y lógicas"
    ]
  },
  ENFP: {
    title: "Campeón",
    subtitle: "Extrovertido / Intuitivo / Emotivo / Percepción",
    description: "Cálidamente entusiasta, animoso, ingenioso, imaginativo. Capaz de hacer casi cualquier cosa que le interese. Encuentra con rapidez soluciones a las dificultades. Son entusiastas, perspicaces, innovadores, versátiles e incansables en la búsqueda de nuevas posibilidades.",
    contributions: [
      "Promueven cambios",
      "Piensan en diversas posibilidades",
      "Transmiten energía mediante su entusiasmo contagioso",
      "Conciben proyectos",
      "Valoran a los demás"
    ],
    leadershipStyle: [
      "Dirigen con energía y entusiasmo",
      "Les gusta llevar la fase inicial",
      "Son portavoces de los valores referentes a las personas",
      "Intentan integrar y apoyar a los demás"
    ],
    preferredEnvironment: [
      "Personas imaginativas atentas a posibilidades humanas",
      "Variado y participativo",
      "Ofrece variedad y estímulos",
      "Creativo, sin limitaciones, animado"
    ],
    potentialDangers: [
      "Cambiar de proyectos sin completar los anteriores",
      "Olvidar detalles relevantes",
      "Intentar abarcar demasiado",
      "Puede incurrir en dilaciones"
    ],
    developmentSuggestions: [
      "Fijar prioridades y establecer sistemas de seguimiento",
      "Atender a los detalles importantes",
      "Evaluar proyectos antes de lanzarse a todo lo atractivo",
      "Aplicar técnicas de organización del propio tiempo"
    ]
  },
  ENTP: {
    title: "Inventor",
    subtitle: "Extrovertido / Intuitivo / Reflexivo / Percepción",
    description: "Rápido, ingenioso, con habilidad para muchas cosas. Resulta una compañía estimulante, abierta y franca. Tiene recursos para resolver problemas nuevos y difíciles. Valora a quienes asumen riesgos. Son innovadores, individualistas, versátiles, analíticos y emprendedores.",
    contributions: [
      "Ven las limitaciones como retos a superar",
      "Indican nuevas formas de hacer las cosas",
      "Dan esquemas conceptuales para resolver problemas",
      "Toman iniciativas y estimulan a los demás",
      "Disfrutan con retos difíciles"
    ],
    leadershipStyle: [
      "Planean sistemas teóricos de organización",
      "Animan a los demás a actuar con independencia",
      "Aplican sistemas de pensamiento lógico",
      "Actúan como catalizadores entre personas y sistemas"
    ],
    preferredEnvironment: [
      "Personas independientes que resuelven problemas complejos",
      "Flexible y estimulante",
      "Orientado al cambio con personas competentes",
      "Recompensa la asunción de riesgos, fomenta la autonomía"
    ],
    potentialDangers: [
      "Perderse en el modelo, olvidando la realidad",
      "Ser muy competitivos y olvidar las aportaciones de los demás",
      "Pueden ser egocéntricos",
      "Adaptarse con dificultad a normas y procedimientos"
    ],
    developmentSuggestions: [
      "Prestar atención al aquí y ahora",
      "Reconocer la valía y aportaciones de los otros",
      "Fijar prioridades y plazos realistas",
      "Aprender a trabajar dentro del sistema"
    ]
  },
  ENFJ: {
    title: "Profesor",
    subtitle: "Extrovertido / Intuitivo / Emotivo / Juicio",
    description: "Necesita las relaciones interpersonales, tiene empatía y favorece la comunicación en el grupo. Sabe establecer relaciones cordiales. Es animador y mediador. Sociable, popular, compasivo. Innovador, fomenta el cambio. Gustan de las relaciones interpersonales, son comprensivos, tolerantes y favorecedores de la comunicación.",
    contributions: [
      "Introducen ideales sobre cómo tratar a las personas",
      "Les gusta dirigir y animar equipos",
      "Fomentan la cooperación",
      "Transmiten los valores de la organización",
      "Conducen los temas hacia conclusiones fructíferas"
    ],
    leadershipStyle: [
      "Dirigen mediante su personal entusiasmo",
      "Toman una postura participativa",
      "Responden a las necesidades de los subordinados",
      "Retan a la organización a ser consecuente con sus valores"
    ],
    preferredEnvironment: [
      "Individuos abiertos al cambio para mejora de los demás",
      "Orientado hacia las personas",
      "Fomenta actividades sociales y expresión personal",
      "Espíritu de armonía, ordenado y asentado"
    ],
    potentialDangers: [
      "Idealizar a los demás y sufrir por lealtad ciega",
      "Esconder la cabeza ante los conflictos",
      "Desatender las tareas en beneficio de las relaciones",
      "Tomar la crítica como algo personal"
    ],
    developmentSuggestions: [
      "Reconocer las limitaciones de los demás",
      "Aprender a gestionar los conflictos eficazmente",
      "Prestar tanta atención a las tareas como a las personas",
      "Limitar la autocrítica y atender a información objetiva"
    ]
  },
  ENTJ: {
    title: "Mariscal de Campo",
    subtitle: "Extrovertido / Intuitivo / Reflexivo / Juicio",
    description: "Cordial, franco, tajante, líder en actividades. Diestro en cualquier cosa que requiera razonamiento o conversación inteligente. Suele estar bien informado. Organizado, objetivo y resolutivo. Desarrolla planes lógicos y diseña estrategias para conseguir los objetivos. Son lógicos, organizados, estructurados, objetivos y resolutivos.",
    contributions: [
      "Desarrollan planes bien concebidos",
      "Ayudan a estructurar la organización",
      "Diseñan estrategias dirigidas a objetivos globales",
      "Se responsabilizan con rapidez",
      "Atacan directamente problemas causados por confusión o ineficacia"
    ],
    leadershipStyle: [
      "Postura enérgica y orientada a la acción",
      "Dan perspectivas de largo alcance",
      "Gestionan directamente y son duros cuando es necesario",
      "Sacan el máximo partido de la organización"
    ],
    preferredEnvironment: [
      "Personas independientes y capaces de resolver problemas complejos",
      "Orientado hacia las metas",
      "Sistemas y personas eficientes",
      "Recompensa la capacidad de decisión"
    ],
    potentialDangers: [
      "Descuidar las necesidades de la gente",
      "Olvidar consideraciones prácticas y limitaciones",
      "Decidir demasiado rápido y parecer impacientes",
      "Ignorar y suprimir sus propios sentimientos"
    ],
    developmentSuggestions: [
      "Atender más al factor humano",
      "Comprobar recursos disponibles y aspectos prácticos antes de lanzarse",
      "Tomar tiempo para reflexionar y considerar todas las facetas",
      "Aprender a identificar y valorar los sentimientos"
    ]
  }
};
