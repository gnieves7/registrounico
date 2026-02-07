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

// Descripciones de los tipos de personalidad MBTI
export const mbtiDescriptions: Record<string, { title: string; description: string }> = {
  INTJ: {
    title: "El Arquitecto",
    description: "Pensadores estratégicos e imaginativos con un plan para todo. Independientes, decididos y altamente analíticos."
  },
  INTP: {
    title: "El Lógico",
    description: "Inventores innovadores con una sed insaciable de conocimiento. Creativos, analíticos y objetivos."
  },
  ENTJ: {
    title: "El Comandante",
    description: "Líderes audaces, imaginativos y de voluntad fuerte. Eficientes, enérgicos y muy decididos."
  },
  ENTP: {
    title: "El Innovador",
    description: "Pensadores inteligentes y curiosos que no pueden resistir un desafío intelectual. Ingeniosos y estratégicos."
  },
  INFJ: {
    title: "El Defensor",
    description: "Idealistas silenciosos y místicos, pero muy inspiradores e incansables. Perspicaces y principistas."
  },
  INFP: {
    title: "El Mediador",
    description: "Personas poéticas, amables y altruistas, siempre dispuestas a ayudar en una buena causa. Idealistas y empáticos."
  },
  ENFJ: {
    title: "El Protagonista",
    description: "Líderes carismáticos e inspiradores, capaces de cautivar a su audiencia. Altruistas y confiables."
  },
  ENFP: {
    title: "El Activista",
    description: "Espíritus libres entusiastas, creativos y sociables. Optimistas y apasionados."
  },
  ISTJ: {
    title: "El Logístico",
    description: "Individuos prácticos y orientados a los hechos, cuya fiabilidad no se puede cuestionar. Responsables y dedicados."
  },
  ISFJ: {
    title: "El Protector",
    description: "Protectores muy dedicados y cálidos, siempre listos para defender a sus seres queridos. Leales y considerados."
  },
  ESTJ: {
    title: "El Ejecutivo",
    description: "Excelentes administradores, insuperables en la gestión de cosas o personas. Organizados y líderes naturales."
  },
  ESFJ: {
    title: "El Cónsul",
    description: "Personas extraordinariamente cuidadosas, sociales y populares. Cooperativos y armoniosos."
  },
  ISTP: {
    title: "El Virtuoso",
    description: "Experimentadores audaces y prácticos, maestros de todo tipo de herramientas. Analíticos y adaptables."
  },
  ISFP: {
    title: "El Aventurero",
    description: "Artistas flexibles y encantadores, siempre listos para explorar y experimentar algo nuevo. Sensibles y curiosos."
  },
  ESTP: {
    title: "El Emprendedor",
    description: "Personas inteligentes, enérgicas y muy perceptivas que disfrutan vivir al límite. Directos y pragmáticos."
  },
  ESFP: {
    title: "El Animador",
    description: "Animadores espontáneos, enérgicos y entusiastas. Sociables y amantes de la diversión."
  }
};
