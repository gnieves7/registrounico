/**
 * Catálogo central de modelos de Consentimiento Informado.
 * Incluye contenido clínico-legal base para generación dinámica de DOCX/PDF
 * y guías de adaptación contextual para los drawers de detalle.
 *
 * Marco normativo: Ley 25.326 (datos personales), Ley 26.657 (salud mental),
 * Ley 26.529 (derechos del paciente), Código de Ética FePRA y Adeip.
 */

export type ConsentModelId =
  // Reflexionar (clínico)
  | "ci-01" | "ci-02" | "ci-03"
  // Evaluar (psicodiagnóstico)
  | "ci-04" | "ci-05" | "ci-06" | "ci-07"
  // Acompañar (forense)
  | "ci-08" | "ci-09";

export interface ConsentModelMeta {
  id: ConsentModelId;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  file: string;
  filename: string;
  system: "reflexionar" | "evaluar" | "acompanar";
  /** Bloques narrativos que componen el cuerpo del consentimiento */
  sections: { heading: string; body: string }[];
  /** ¿Qué incluye este modelo? */
  includes: string[];
  /** Cómo adaptarlo */
  adaptationTips: string[];
  /** Cuándo corresponde usarlo */
  whenToUse: string[];
  /** Marco legal específico */
  legalFrame: string[];
}

const FOOTER_LEGAL_GENERAL = [
  "Ley 26.529 (Derechos del Paciente, Historia Clínica y Consentimiento Informado).",
  "Ley 26.657 (Salud Mental).",
  "Ley 25.326 (Protección de Datos Personales).",
  "Código de Ética FePRA y del Colegio de Psicólogos correspondiente.",
];

const FOOTER_LEGAL_PERICIAL = [
  ...FOOTER_LEGAL_GENERAL,
  "Pautas Internacionales para el Uso de los Tests (versión Adeip).",
  "Código de Ética del Psicodiagnosticador (Adeip), arts. 1°, 2°, 3°, 6°, 8°, 9° y 10°.",
];

export const CONSENT_MODELS: Record<ConsentModelId, ConsentModelMeta> = {
  // ───────── REFLEXIONAR ─────────
  "ci-01": {
    id: "ci-01",
    code: "CI-01",
    title: "CI-01 · Terapia Psicológica — Adultos",
    shortTitle: "Terapia con Adultos",
    description:
      "Modelo de consentimiento informado para procesos psicoterapéuticos con personas adultas.",
    file: "/templates/CI-01_Terapia_Adulto.docx",
    filename: "CI-01_Terapia_Adulto.docx",
    system: "reflexionar",
    includes: [
      "Datos de identificación del/la profesional y del/la consultante.",
      "Encuadre terapéutico: frecuencia, duración, modalidad (presencial / virtual).",
      "Objetivos generales del proceso y enfoque teórico de trabajo.",
      "Confidencialidad y excepciones legales (riesgo cierto e inminente, requerimiento judicial).",
      "Honorarios, modalidad de pago y política de cancelación.",
      "Derecho a interrumpir el tratamiento y a solicitar derivación.",
    ],
    adaptationTips: [
      "Personalizá nombre, matrícula nacional y provincial, especialidad, dirección y teléfono.",
      "Definí claramente la frecuencia semanal y la duración estimada del proceso.",
      "Aclarará el honorario por sesión y la política de cancelación (24/48 hs).",
      "Especificá el enfoque teórico predominante (TCC, psicoanalítico, sistémico, humanista, etc.).",
      "Si trabajás de forma virtual, agregá la cláusula de uso de plataformas seguras y resguardo de datos.",
    ],
    whenToUse: [
      "Pacientes mayores de edad (18 años o más) en proceso terapéutico individual.",
      "Tratamientos en consultorio o por videollamada.",
      "Casos sin indicadores agudos de riesgo autolítico o heteroagresivo.",
    ],
    legalFrame: FOOTER_LEGAL_GENERAL,
    sections: [
      {
        heading: "1. Naturaleza del proceso terapéutico",
        body:
          "El presente documento formaliza el inicio de un proceso de psicoterapia, entendido como un espacio profesional confidencial orientado a favorecer el bienestar psíquico del/la consultante. El tratamiento se sustenta en el marco teórico que el/la profesional declara a continuación y se desarrolla mediante entrevistas pautadas regularmente.",
      },
      {
        heading: "2. Encuadre, frecuencia y modalidad",
        body:
          "Las sesiones tendrán una duración aproximada de 50 minutos y una frecuencia semanal, salvo modificación acordada. La modalidad podrá ser presencial o por videollamada utilizando plataformas con encriptación adecuada. La continuidad del proceso depende del compromiso conjunto y será evaluada periódicamente.",
      },
      {
        heading: "3. Confidencialidad",
        body:
          "Toda la información compartida está amparada por el secreto profesional (Código de Ética FePRA y Ley 26.529). Las únicas excepciones contempladas son: (a) riesgo cierto e inminente para la vida del/la consultante o de terceros, (b) requerimiento judicial expreso y fundado, (c) supervisión clínica en formato anonimizado.",
      },
      {
        heading: "4. Honorarios y forma de pago",
        body:
          "El honorario por sesión es de $__________ y se abona al inicio o final de cada encuentro, según se convenga. Las sesiones canceladas con menos de 24 horas de aviso se considerarán realizadas y serán facturadas, salvo causa de fuerza mayor debidamente acreditada.",
      },
      {
        heading: "5. Derechos del/la consultante",
        body:
          "Tiene derecho a interrumpir el tratamiento en cualquier momento, a solicitar derivación a otro/a profesional, a acceder a información clara sobre el proceso, y a la protección integral de sus datos personales conforme a la Ley 25.326.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo leído y comprendido las condiciones expuestas, otorgo mi consentimiento libre, voluntario e informado para iniciar el tratamiento psicológico con el/la profesional firmante.",
      },
    ],
  },
  "ci-02": {
    id: "ci-02",
    code: "CI-02",
    title: "CI-02 · Terapia Psicológica — Niñas, Niños y Adolescentes (NNA)",
    shortTitle: "Terapia con NNA",
    description:
      "Modelo para procesos terapéuticos con NNA, con autorización de progenitores o tutores.",
    file: "/templates/CI-02_Terapia_NNA.docx",
    filename: "CI-02_Terapia_NNA.docx",
    system: "reflexionar",
    includes: [
      "Datos de ambos progenitores o tutores legales y del NNA.",
      "Cláusula de autonomía progresiva (Ley 26.061 y Código Civil y Comercial art. 26).",
      "Resguardo del espacio confidencial del NNA y devoluciones a la familia.",
      "Pautas de comunicación con la escuela y otros profesionales tratantes.",
      "Honorarios, encuadre y política de cancelación.",
    ],
    adaptationTips: [
      "Verificá que figuren ambos progenitores o el/la tutor/a legal con DNI.",
      "Adaptá el lenguaje según la edad del NNA si firma asentimiento.",
      "Definí claramente qué información será compartida con los adultos responsables y qué quedará en el espacio confidencial.",
      "Si hay conflicto parental, consultá las recomendaciones del Colegio antes de aceptar el caso.",
    ],
    whenToUse: [
      "Pacientes entre 0 y 17 años inclusive.",
      "Cualquier modalidad de tratamiento (juego, entrevista, familia).",
      "Especialmente importante en casos de progenitores separados o conflictos de tenencia.",
    ],
    legalFrame: [
      ...FOOTER_LEGAL_GENERAL,
      "Ley 26.061 (Protección Integral de los Derechos de NNA).",
      "Código Civil y Comercial, art. 26 (autonomía progresiva).",
    ],
    sections: [
      {
        heading: "1. Identificación del NNA y responsables legales",
        body:
          "Los/as abajo firmantes, en su carácter de progenitores y/o representantes legales, autorizan el inicio del proceso psicoterapéutico de su hijo/a o tutelado/a con el/la profesional firmante.",
      },
      {
        heading: "2. Autonomía progresiva",
        body:
          "Se respetará la opinión y consentimiento del NNA conforme a su edad y grado de madurez (art. 26 CCyC y Ley 26.061). En adolescentes mayores de 13 años, se solicitará asentimiento informado complementario al consentimiento parental.",
      },
      {
        heading: "3. Confidencialidad y devoluciones a la familia",
        body:
          "El espacio terapéutico del NNA es confidencial. El/la profesional ofrecerá entrevistas periódicas de orientación a los adultos responsables, sin revelar contenidos específicos salvo situaciones de riesgo. La presencia de progenitores en sesión es excepcional y debe ser acordada previamente.",
      },
      {
        heading: "4. Comunicación con escuela y otros profesionales",
        body:
          "Cualquier interconsulta con instituciones educativas, pediatras u otros profesionales tratantes será comunicada y autorizada previamente por los responsables legales, salvo urgencia.",
      },
      {
        heading: "5. Encuadre, honorarios y cancelaciones",
        body:
          "Las sesiones tendrán una frecuencia semanal y una duración de 45 minutos. El honorario es de $__________ por sesión. Las cancelaciones con menos de 24 hs serán facturadas.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido las condiciones del tratamiento, los/as firmantes prestamos consentimiento informado para el inicio del proceso terapéutico.",
      },
    ],
  },
  "ci-03": {
    id: "ci-03",
    code: "CI-03",
    title: "CI-03 · Terapia con Indicadores de Riesgo",
    shortTitle: "Terapia con Riesgo",
    description:
      "Modelo específico para tratamientos con indicadores clínicos de riesgo (ideación suicida, autolesiones, etc.).",
    file: "/templates/CI-03_Terapia_Riesgo.docx",
    filename: "CI-03_Terapia_Riesgo.docx",
    system: "reflexionar",
    includes: [
      "Cláusula explícita sobre limitaciones del secreto profesional ante riesgo cierto e inminente.",
      "Plan de seguridad personalizado y red de apoyo.",
      "Datos de contacto de emergencia (familiar, línea 135 / SAME 107).",
      "Autorización para interconsulta con servicio de guardia o equipo interdisciplinario.",
      "Compromiso de continuidad del tratamiento durante la fase aguda.",
    ],
    adaptationTips: [
      "Completá los datos del referente afectivo y los teléfonos de emergencia activos.",
      "Especificá si el plan incluye psiquiatra tratante, internación domiciliaria u otro recurso.",
      "Documentá en historia clínica cada modificación del plan de seguridad.",
      "Considerá complementar con consentimiento de la familia en casos de adolescencia.",
    ],
    whenToUse: [
      "Casos con ideación suicida, autolesiones (NSSI), intentos previos.",
      "Cuadros con riesgo de heteroagresión o consumo problemático severo.",
      "Cualquier situación que requiera articulación con guardia, internación o equipo ampliado.",
    ],
    legalFrame: [
      ...FOOTER_LEGAL_GENERAL,
      "Ley 27.130 (Prevención del Suicidio).",
      "Resolución 1484/2015 MSAL (Lineamientos para el cuidado integral).",
    ],
    sections: [
      {
        heading: "1. Reconocimiento de indicadores de riesgo",
        body:
          "Las partes reconocen que el cuadro clínico actual presenta indicadores de riesgo (ideación, conducta autolesiva o vulnerabilidad significativa) que requieren un encuadre reforzado y articulación interdisciplinaria.",
      },
      {
        heading: "2. Limitaciones del secreto profesional",
        body:
          "Conforme al art. 2° inc. e) de la Ley 26.529 y al Código de Ética FePRA, el/la profesional podrá comunicar a la red de apoyo o a servicios de emergencia situaciones de riesgo cierto e inminente para la vida del/la consultante o de terceros, sin que ello vulnere el secreto profesional.",
      },
      {
        heading: "3. Plan de seguridad y red de apoyo",
        body:
          "Se elabora junto al/la consultante un plan de seguridad que incluye: señales tempranas, estrategias de afrontamiento, contactos de apoyo (referente afectivo: __________, teléfono: __________) y recursos de emergencia (SAME 107, línea 135 de prevención del suicidio).",
      },
      {
        heading: "4. Articulación interdisciplinaria",
        body:
          "Se autoriza la interconsulta con psiquiatra, médico clínico o servicio de guardia cuando el cuadro lo requiera, así como la coordinación con familiares/referentes designados.",
      },
      {
        heading: "5. Compromiso de continuidad",
        body:
          "El/la consultante se compromete a sostener la frecuencia indicada y a comunicar al/la profesional cualquier modificación del cuadro entre sesiones.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido las condiciones especiales de este encuadre, otorgo mi consentimiento libre e informado para iniciar el tratamiento.",
      },
    ],
  },
  // ───────── EVALUAR ─────────
  "ci-04": {
    id: "ci-04",
    code: "CI-04",
    title: "CI-04 · Psicodiagnóstico — Adultos",
    shortTitle: "Psicodiag. Adultos",
    description: "Consentimiento para evaluación psicodiagnóstica en personas adultas.",
    file: "/templates/CI-04_Psicodiag_Adulto.docx",
    filename: "CI-04_Psicodiag_Adulto.docx",
    system: "evaluar",
    includes: [
      "Objetivos del psicodiagnóstico y motivo de la evaluación.",
      "Listado de técnicas a administrar y fundamentación.",
      "Tiempo estimado y número de encuentros.",
      "Devolución oral y entrega del informe escrito.",
      "Resguardo del material proyectivo y datos personales.",
    ],
    adaptationTips: [
      "Listá las técnicas concretas (MMPI-2, MCMI-III, Bender, HTP, Rorschach, etc.).",
      "Indicá el destinatario del informe (paciente, derivante, ART, juzgado).",
      "Especificá el costo total del proceso y la modalidad de pago.",
    ],
    whenToUse: [
      "Evaluaciones diagnósticas o de personalidad en adultos.",
      "Procesos derivados por médico/a psiquiatra, terapeuta o instancia institucional.",
    ],
    legalFrame: FOOTER_LEGAL_PERICIAL,
    sections: [
      {
        heading: "1. Objetivo del psicodiagnóstico",
        body:
          "El presente proceso tiene como finalidad realizar una evaluación psicológica integral orientada a __________ (motivo de consulta / objetivo derivante), mediante la administración de técnicas validadas y la elaboración de un informe profesional fundamentado.",
      },
      {
        heading: "2. Técnicas a administrar",
        body:
          "Se prevé la utilización de las siguientes técnicas: __________. Las mismas cuentan con respaldo científico y serán seleccionadas y administradas conforme a las Pautas Internacionales para el Uso de los Tests (Adeip).",
      },
      {
        heading: "3. Encuadre y plazos",
        body:
          "El proceso se desarrollará en aproximadamente __ encuentros de hasta 90 minutos. El informe escrito se entregará dentro de los 15 días hábiles posteriores a la última administración, previa devolución oral al/la evaluado/a.",
      },
      {
        heading: "4. Confidencialidad y resguardo",
        body:
          "El material producido (protocolos, registros, informe) es propiedad intelectual del/la profesional y será conservado en archivo seguro por el plazo legal. Su contenido es confidencial y solo se entregará al/la evaluado/a o al/la destinatario/a expresamente autorizado/a.",
      },
      {
        heading: "5. Honorarios",
        body:
          "El costo total del proceso es de $__________, abonado en __________ (modalidad). No incluye administraciones ni informes adicionales solicitados con posterioridad.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido los alcances y limitaciones del proceso, otorgo mi consentimiento informado para su realización.",
      },
    ],
  },
  "ci-05": {
    id: "ci-05",
    code: "CI-05",
    title: "CI-05 · Psicodiagnóstico — NNA",
    shortTitle: "Psicodiag. NNA",
    description: "Consentimiento para evaluación psicodiagnóstica en niñas, niños y adolescentes.",
    file: "/templates/CI-05_Psicodiag_NNA.pdf",
    filename: "CI-05_Psicodiag_NNA.pdf",
    system: "evaluar",
    includes: [
      "Autorización de progenitores/tutores y asentimiento del NNA según edad.",
      "Técnicas adaptadas (Bender, CAT, HTP, dibujo libre, escalas evolutivas).",
      "Entrevista a padres o referentes y observación de juego.",
      "Devolución diferenciada para el NNA y para los adultos responsables.",
    ],
    adaptationTips: [
      "Confirmá que firmen ambos progenitores cuando corresponda.",
      "Adecuá el lenguaje en el documento de asentimiento del NNA.",
      "Especificá si se entregará informe a la escuela u obra social.",
    ],
    whenToUse: [
      "Evaluaciones diagnósticas, derivaciones escolares u obras sociales para NNA.",
    ],
    legalFrame: [...FOOTER_LEGAL_PERICIAL, "Ley 26.061 (Protección Integral de NNA)."],
    sections: [
      {
        heading: "1. Identificación y autorización",
        body:
          "Los/as abajo firmantes, en su carácter de progenitores/representantes legales, autorizan la evaluación psicodiagnóstica del NNA __________, DNI __________.",
      },
      {
        heading: "2. Objetivo y técnicas",
        body:
          "El proceso busca __________ (motivo derivante). Se administrarán técnicas evolutivas, gráficas y proyectivas adaptadas a la edad: __________.",
      },
      {
        heading: "3. Encuadre",
        body:
          "Se prevén __ encuentros con el NNA y entrevistas de anamnesis con los adultos responsables. La duración total estimada es de __ semanas.",
      },
      {
        heading: "4. Devoluciones",
        body:
          "Se realizará una devolución adaptada al NNA y otra ampliada a los adultos. El informe escrito se entregará al destinatario que se acuerde por escrito.",
      },
      {
        heading: "5. Honorarios",
        body:
          "El costo total del proceso es de $__________, modalidad de pago: __________.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido los alcances del proceso, los/as firmantes otorgamos consentimiento informado.",
      },
    ],
  },
  "ci-06": {
    id: "ci-06",
    code: "CI-06",
    title: "CI-06 · Evaluación Neuropsicológica",
    shortTitle: "Neuropsicológica",
    description: "Consentimiento para evaluación neuropsicológica.",
    file: "/templates/CI-06_Neuropsicologica.pdf",
    filename: "CI-06_Neuropsicologica.pdf",
    system: "evaluar",
    includes: [
      "Objetivo neuropsicológico (atención, memoria, funciones ejecutivas, lenguaje).",
      "Batería seleccionada (NEUROPSI, WAIS, WCST, Trail Making, etc.).",
      "Articulación con neurología o psiquiatría tratante.",
      "Informe con perfil cognitivo y recomendaciones.",
    ],
    adaptationTips: [
      "Listá las pruebas exactas según el motivo (sospecha de demencia, TDAH, ACV, etc.).",
      "Solicitá estudios complementarios (RMN, EEG) si corresponde.",
    ],
    whenToUse: [
      "Sospecha de deterioro cognitivo, TDAH adulto, post-ACV, post-TEC, líneas de base.",
    ],
    legalFrame: FOOTER_LEGAL_PERICIAL,
    sections: [
      {
        heading: "1. Objetivo",
        body:
          "Realizar una evaluación neuropsicológica que permita establecer un perfil de fortalezas y debilidades cognitivas con fines diagnósticos, de seguimiento o rehabilitación.",
      },
      {
        heading: "2. Batería de pruebas",
        body:
          "Se administrarán pruebas estandarizadas y validadas para población hispanohablante: __________.",
      },
      {
        heading: "3. Encuadre",
        body:
          "El proceso requiere entre 2 y 4 encuentros de hasta 2 horas. Se solicita acompañante para regreso seguro al domicilio.",
      },
      {
        heading: "4. Articulación interdisciplinaria",
        body:
          "El informe podrá ser compartido con el/la profesional derivante (neurólogo/a, psiquiatra, médico/a clínico/a) con expresa autorización del/la evaluado/a.",
      },
      {
        heading: "5. Honorarios",
        body: "Costo total: $__________. Modalidad: __________.",
      },
      {
        heading: "6. Aceptación",
        body: "Otorgo mi consentimiento informado para la realización del proceso.",
      },
    ],
  },
  "ci-07": {
    id: "ci-07",
    code: "CI-07",
    title: "CI-07 · Aptitud Psicológica para Arma Reglamentaria",
    shortTitle: "Apto Arma",
    description: "Consentimiento para evaluación de aptitud psicológica para portación de arma.",
    file: "/templates/CI-07_Arma_Reglamentaria.pdf",
    filename: "CI-07_Arma_Reglamentaria.pdf",
    system: "evaluar",
    includes: [
      "Marco normativo ANMaC (Ley 25.938 y Decreto 395/75).",
      "Batería específica (MMPI-2, MCMI-III, Bender, entrevista estructurada).",
      "Causales de no aptitud y recurso administrativo.",
    ],
    adaptationTips: [
      "Verificá que el/la usuario/a presente DNI vigente y credencial actualizada.",
      "Documentá toda la batería administrada y los puntajes obtenidos.",
    ],
    whenToUse: [
      "Trámite de tenencia/portación de arma de fuego (legítimo usuario, fuerzas de seguridad).",
    ],
    legalFrame: [
      ...FOOTER_LEGAL_PERICIAL,
      "Ley 25.938 y Decreto 395/75 (ANMaC).",
      "Resolución MS 1484/2015.",
    ],
    sections: [
      {
        heading: "1. Marco normativo",
        body:
          "La presente evaluación se realiza en el marco del trámite ante la ANMaC para acreditar la aptitud psicológica del/la solicitante para la tenencia y/o portación de arma de fuego de uso civil.",
      },
      {
        heading: "2. Batería de pruebas",
        body:
          "Se administrarán: entrevista estructurada, MMPI-2 (validez clínica), MCMI-III (estructura de personalidad), Bender (organicidad) y técnicas complementarias según criterio profesional.",
      },
      {
        heading: "3. Encuadre y duración",
        body:
          "El proceso se realiza en uno o dos encuentros de hasta 3 horas. El informe se entrega al/la solicitante para presentación ante la autoridad competente.",
      },
      {
        heading: "4. Causales de no aptitud",
        body:
          "El/la profesional podrá dictaminar 'no apto/a' ante la presencia de indicadores clínicos compatibles con descontrol impulsivo, ideación suicida/homicida activa, abuso de sustancias o trastornos psicóticos no compensados. El/la solicitante tiene derecho a recurrir el dictamen.",
      },
      {
        heading: "5. Honorarios",
        body: "Costo total del proceso: $__________. Modalidad: __________.",
      },
      {
        heading: "6. Aceptación",
        body: "Otorgo mi consentimiento informado para la realización del proceso.",
      },
    ],
  },
  // ───────── ACOMPAÑAR ─────────
  "ci-08": {
    id: "ci-08",
    code: "CI-08",
    title: "CI-08 · Pericia Psicológica — Fuero Civil",
    shortTitle: "Pericia Civil",
    description: "Consentimiento informado para evaluaciones psicológicas en fuero civil.",
    file: "/templates/CI-08_Pericia_Civil.docx",
    filename: "CI-08_Pericia_Civil.docx",
    system: "acompanar",
    includes: [
      "Designación judicial y carátula del expediente (CUIJ).",
      "Puntos de pericia ofrecidos por las partes y el juzgado.",
      "Naturaleza no terapéutica del vínculo.",
      "Derecho a no autoincriminarse y a contar con consultor técnico.",
    ],
    adaptationTips: [
      "Completá la carátula completa (autos, número, juzgado, secretaría).",
      "Aclará que el informe será elevado al juzgado, no al/la evaluado/a.",
    ],
    whenToUse: [
      "Pericias por daño psíquico, capacidad civil, familia, accidentes, etc.",
    ],
    legalFrame: [
      ...FOOTER_LEGAL_PERICIAL,
      "CPCCN y CPCCSF (peritos).",
      "Ley 7.106 Santa Fe (régimen profesional).",
    ],
    sections: [
      {
        heading: "1. Designación pericial",
        body:
          "El/la suscripto/a, en su carácter de Perito Psicólogo/a designado/a en autos '__________' (CUIJ __________), tramitados ante el Juzgado __________, Secretaría __________, procede a realizar la entrevista pericial.",
      },
      {
        heading: "2. Naturaleza no terapéutica",
        body:
          "El presente acto pericial NO constituye un proceso psicoterapéutico. Su finalidad exclusiva es responder los puntos de pericia propuestos por las partes y/o el juzgado, mediante la administración de técnicas idóneas.",
      },
      {
        heading: "3. Derechos del/la peritado/a",
        body:
          "El/la peritado/a tiene derecho a: (a) ser informado/a de los puntos de pericia, (b) negarse a responder preguntas que lo/la incriminen, (c) contar con consultor técnico de parte, (d) solicitar copia del informe a través de su letrado/a.",
      },
      {
        heading: "4. Confidencialidad relativa",
        body:
          "El material producido será volcado en el informe pericial y elevado al juzgado interviniente. La confidencialidad cede ante la finalidad procesal del acto.",
      },
      {
        heading: "5. Honorarios",
        body:
          "Los honorarios serán regulados judicialmente conforme a la ley arancelaria y al esfuerzo intelectual desplegado.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido los alcances del acto pericial, presto consentimiento informado para su realización.",
      },
    ],
  },
  "ci-09": {
    id: "ci-09",
    code: "CI-09",
    title: "CI-09 · Pericia Psicológica — Fuero Penal",
    shortTitle: "Pericia Penal",
    description: "Consentimiento informado para evaluaciones psicológicas en fuero penal.",
    file: "/templates/CI-09_Pericia_Penal.docx",
    filename: "CI-09_Pericia_Penal.docx",
    system: "acompanar",
    includes: [
      "Identificación de la causa penal y del rol del/la peritado/a (víctima, imputado/a, testigo).",
      "Garantías constitucionales (art. 18 CN).",
      "Cámara Gesell para NNA víctimas (Ley 25.852).",
      "Articulación con Cuerpo Médico Forense.",
    ],
    adaptationTips: [
      "Verificá si el/la peritado/a es víctima, imputado/a o testigo y ajustá las garantías.",
      "Para NNA, aplicá protocolo NICHD/SATAC en Cámara Gesell.",
    ],
    whenToUse: [
      "Pericias en sede penal: víctima de delito, imputabilidad, peligrosidad, credibilidad de testimonio.",
    ],
    legalFrame: [
      ...FOOTER_LEGAL_PERICIAL,
      "Constitución Nacional, art. 18.",
      "Ley 25.852 (Cámara Gesell).",
      "CPPSF y CPPN.",
    ],
    sections: [
      {
        heading: "1. Designación pericial",
        body:
          "El/la suscripto/a, designado/a en la causa penal '__________' (CUIJ __________), tramitada ante el __________ procede a realizar la entrevista pericial al/la peritado/a en su carácter de __________ (víctima / imputado/a / testigo).",
      },
      {
        heading: "2. Garantías constitucionales",
        body:
          "Conforme al art. 18 de la Constitución Nacional, el/la peritado/a no está obligado/a a declarar contra sí mismo/a. Puede negarse a responder cualquier pregunta sin que ello constituya prueba en su contra.",
      },
      {
        heading: "3. Naturaleza no terapéutica",
        body:
          "El acto pericial no configura proceso psicoterapéutico. Su finalidad es responder los puntos periciales y será elevado al órgano judicial requirente.",
      },
      {
        heading: "4. Cámara Gesell (NNA víctimas)",
        body:
          "Cuando el/la peritado/a sea NNA víctima de delito contra la integridad sexual, se aplicará el protocolo de Cámara Gesell (Ley 25.852) y se adoptarán las recomendaciones NICHD/SATAC.",
      },
      {
        heading: "5. Derecho a consultor técnico",
        body:
          "Las partes tienen derecho a designar consultor técnico (perito de parte) que controle el acto pericial y emita su propio dictamen.",
      },
      {
        heading: "6. Aceptación",
        body:
          "Habiendo comprendido los alcances del acto pericial, presto consentimiento informado para su realización.",
      },
    ],
  },
};

export const REFLEXIONAR_MODELS: ConsentModelMeta[] = [
  CONSENT_MODELS["ci-01"],
  CONSENT_MODELS["ci-02"],
  CONSENT_MODELS["ci-03"],
];

export const EVALUAR_MODELS: ConsentModelMeta[] = [
  CONSENT_MODELS["ci-05"],
  CONSENT_MODELS["ci-06"],
  CONSENT_MODELS["ci-07"],
];

export const ACOMPANAR_MODELS: ConsentModelMeta[] = [
  CONSENT_MODELS["ci-08"],
  CONSENT_MODELS["ci-09"],
];
