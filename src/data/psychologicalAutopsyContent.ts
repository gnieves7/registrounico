/**
 * Contenido académico-forense de la sección "Autopsia Psicológica" (módulo Acompañar).
 * Redacción técnica en español rioplatense. Referencias en APA 7.
 */

export interface APTheoryAxis {
  key: string;
  title: string;
  body: string;
  bullets?: string[];
}

export const AP_OVERVIEW = {
  definition:
    'La Autopsia Psicológica (AP) es un procedimiento pericial retrospectivo, sistemático y multifuente, destinado a reconstruir el estado mental, los factores de riesgo y la trayectoria vital del fallecido en el período que precede a una muerte equívoca. Operacionalmente integra entrevistas semiestructuradas a informantes clave, análisis documental (historia clínica, registros judiciales, redes sociales, notas) y articulación con la pericia tanatológica.',
  objectives: [
    'Caracterizar el estado mental del fallecido durante los días/meses previos al deceso.',
    'Identificar factores de riesgo, precipitantes y protectores asociados.',
    'Aportar elementos técnicos que orienten la clasificación NASH (Natural / Accidental / Suicida / Homicida) cuando la modalidad de muerte es equívoca.',
    'Asistir al magistrado en la valoración de hipótesis sin sustituir su determinación.',
  ],
  modalities: [
    {
      name: 'AP clínica',
      desc: 'Orientada a investigación epidemiológica y prevención (estudios IASP/OMS); no produce prueba pericial.',
    },
    {
      name: 'AP médico-legal',
      desc: 'Auxilia a la medicina legal en la determinación de la causa de muerte (complementaria a la autopsia médica).',
    },
    {
      name: 'AP forense',
      desc: 'Pericial, encuadrada en el proceso judicial (CPPN / CPP Santa Fe Ley 12.734); aporta indicadores probabilísticos al juez.',
    },
  ],
  contexts: [
    'Muerte equívoca (modalidad indeterminada).',
    'Suicidio consumado: confirmación etiológica y caracterización del proceso.',
    'Sospecha de homicidio enmascarado.',
    'Accidentes con sospecha de componente autoagresivo.',
    'Muertes en custodia (instituciones penitenciarias, salud mental, residencias).',
  ],
  role:
    'El psicólogo forense se desempeña como perito (oficial, de oficio o de parte) o consultor técnico. Diseña el protocolo, conduce las entrevistas, integra fuentes, redacta el informe pericial y sostiene su criterio en audiencia. No emite diagnóstico póstumo categórico ni se pronuncia sobre la modalidad legal de muerte: aporta indicadores con valor probabilístico-orientativo.',
  epistemic:
    'La AP opera con datos retrospectivos, mediados por testigos y por el sesgo de hindsight; carece de gold standard. Por eso sus resultados deben formularse en términos probabilísticos, con explicitación de limitaciones, fuentes consultadas y nivel de convergencia entre ellas.',
};

export const AP_THEORY: APTheoryAxis[] = [
  {
    key: 'tanato',
    title: '2.1 Fundamentos tanatológicos y suicidológicos',
    body:
      'La clasificación NASH (Natural, Accidental, Suicida, Homicida) constituye el marco médico-legal básico. Cuando los hallazgos físicos resultan insuficientes, la muerte se categoriza como equívoca o indeterminada (undetermined death) y la AP forense aporta elementos para reducir la incertidumbre. Las teorías nucleares del suicidio que orientan la lectura clínica son: el modelo de perturbación psíquica de Shneidman (psychache, túnel cognitivo, constricción del campo); la Teoría Interpersonal-Psicológica de Joiner (pertenencia frustrada, percepción de carga, capacidad adquirida para el suicidio); y el modelo de escape del yo de Baumeister (autoconciencia aversiva y desinhibición cognitiva).',
    bullets: [
      'NASH + categoría "indeterminada" como punto de entrada de la AP.',
      'Shneidman (1985, 1996): psychache y constricción cognitiva.',
      'Joiner (2005): TIP — pertenencia, carga, capacidad adquirida.',
      'Baumeister (1990): suicidio como huida del yo.',
    ],
  },
  {
    key: 'psicopato',
    title: '2.2 Fundamentos psicopatológicos',
    body:
      'Los estudios de AP convergen en que más del 90 % de los suicidios consumados se asocia a al menos un trastorno mental: depresión mayor y trastorno bipolar (especialmente en fases mixtas), trastornos por uso de sustancias, esquizofrenia, TEPT y trastornos de personalidad del cluster B. La AP debe relevar también factores de riesgo distales (antecedentes familiares, intentos previos, abuso infantil), proximales (eventos vitales adversos, pérdidas, acceso a método letal) y protectores (vínculos significativos, creencias, hijos a cargo). El concepto de crisis suicida —escalada de ideación, planificación, ensayo conductual y acto— estructura la lectura temporal.',
    bullets: [
      'Trastornos prevalentes: depresión, bipolaridad, TUS, esquizofrenia, TEPT.',
      'Riesgo distal vs. proximal vs. inminente.',
      'Factores protectores explícitos (Reasons for Living — Linehan).',
      'Crisis suicida y escalada conductual: ideación → plan → ensayo → acto.',
    ],
  },
  {
    key: 'metodo',
    title: '2.3 Fundamentos metodológicos',
    body:
      'La AP es un método retrospectivo, indirecto y multifuente. Su validez depende de la triangulación entre testimonios de informantes (familia, pareja, equipo de salud, empleadores), documentos clínicos, registros judiciales/policiales, escritos del fallecido (diarios, notas, mensajes, posteos) y, cuando corresponde, de la articulación con la autopsia médico-legal y toxicología. Las amenazas principales a su fiabilidad son el sesgo retrospectivo (hindsight bias) y la memoria reconstructiva del informante, el sesgo de selección de informantes y la ausencia de un grupo control. Los protocolos contemporáneos buscan estandarizar el procedimiento (Conner et al., 2011) para mejorar la fiabilidad inter-jueces.',
    bullets: [
      'Triangulación obligatoria de fuentes.',
      'Reportar nivel de convergencia y discrepancias.',
      'Hacer explícitos los sesgos del informante.',
      'Estandarización (Conner et al., 2011) y entrenamiento del entrevistador.',
    ],
  },
];

export const AP_REFERENTS = {
  founders: [
    {
      name: 'Edwin S. Shneidman & Norman Farberow',
      contribution:
        'Acuñaron el término "autopsia psicológica" en el Los Angeles Suicide Prevention Center (1958) a pedido del coroner para clarificar muertes equívocas. Fundadores de la suicidología moderna.',
    },
    {
      name: 'Robert E. Litman',
      contribution: 'Sistematizó el protocolo inicial de AP y formalizó el rol del equipo interdisciplinario.',
    },
  ],
  international: [
    {
      name: 'Antoon A. Leenaars (Canadá)',
      contribution: 'Análisis sistemático de notas suicidas; reelaboración contemporánea del modelo de Shneidman.',
    },
    {
      name: 'Diego De Leo (Italia / Australia)',
      contribution: 'AP multicéntrica, escalas de riesgo y crítica metodológica (Pouliot & De Leo, 2006).',
    },
    {
      name: 'Danuta Wasserman (Suecia)',
      contribution: 'AP transcultural; programas comunitarios de prevención y guías europeas (EPA).',
    },
    {
      name: 'Keith Hawton (Oxford)',
      contribution: 'Revisión metodológica clásica de la AP; trastorno mental, métodos letales y restricción de acceso.',
    },
    {
      name: 'René F. W. Diekstra',
      contribution: 'Epidemiología del suicidio en Europa; AP comparada en adolescentes.',
    },
  ],
  latam: [
    {
      name: 'José Carlos Mingote Adán (España / Iberoamérica)',
      contribution: 'Salud mental del profesional sanitario; AP aplicada a suicidio en colectivos vulnerables.',
    },
    {
      name: 'Sergio Pérez Barrero (Cuba)',
      contribution: 'Suicidología hispanoamericana; manuales de prevención y formación en AP.',
    },
    {
      name: 'Teresita García Pérez (Cuba)',
      contribution: 'Modelo cubano de Autopsia Psicológica con fines forenses (MAPI).',
    },
    {
      name: 'Línea argentina (Mauricio Abadi y continuadores)',
      contribution: 'Tradición psicoanalítica argentina sobre suicidio; aportes desde la psicología jurídica (UBA, UNLP, CONICET).',
    },
  ],
};

export const AP_RESEARCH = [
  {
    title: 'The next generation of psychological autopsy studies',
    authors: 'Conner, K. R., Beautrais, A. L., et al.',
    year: 2011,
    source: 'Suicide and Life-Threatening Behavior, 41(6), 594-613.',
    method:
      'Revisión metodológica que evalúa diseños AP de las últimas tres décadas y propone estándares (selección de controles, entrenamiento, instrumentos comunes).',
    forensic:
      'Provee criterios mínimos de calidad metodológica que el perito argentino puede invocar para sostener la rigurosidad de su procedimiento ante el tribunal.',
  },
  {
    title: 'Psychological autopsy studies of suicide: A systematic review',
    authors: 'Cavanagh, J. T. O., Carson, A. J., Sharpe, M., & Lawrie, S. M.',
    year: 2003,
    source: 'Psychological Medicine, 33(3), 395-405.',
    method:
      'Revisión sistemática de 76 estudios AP. Halla trastorno mental Eje I en > 90 % de los suicidios consumados.',
    forensic:
      'Sustenta empíricamente la hipótesis de etiología suicida cuando la AP releva trastorno mental documentado y antecedentes de tratamiento.',
  },
  {
    title: 'The psychological autopsy approach to studying suicide: A review of methodological issues',
    authors: 'Hawton, K., Appleby, L., Platt, S., et al.',
    year: 1998,
    source: 'Journal of Affective Disorders, 50(2-3), 269-276.',
    method:
      'Revisión crítica de fiabilidad inter-jueces, sesgo del informante y validez retrospectiva en estudios AP.',
    forensic:
      'Marco obligatorio para discutir limitaciones del informe pericial; aporta lenguaje técnico para comunicar incertidumbre al juez.',
  },
  {
    title: 'Critical issues in psychological autopsy studies',
    authors: 'Pouliot, L., & De Leo, D.',
    year: 2006,
    source: 'Suicide and Life-Threatening Behavior, 36(5), 491-510.',
    method:
      'Análisis de heterogeneidad de protocolos AP; propone criterios de estandarización y selección de informantes.',
    forensic: 'Sostiene la necesidad de explicitar el protocolo aplicado para que la AP sea reproducible y discutible en sede judicial.',
  },
  {
    title: 'Suicide in prisoners: A systematic review of risk factors',
    authors: 'Fazel, S., Cartwright, J., Norman-Nott, A., & Hawton, K.',
    year: 2008,
    source: 'Journal of Clinical Psychiatry, 69(11), 1721-1731.',
    method:
      'Metaanálisis de 34 estudios sobre suicidio en custodia. Identifica factores de riesgo específicos (aislamiento, ingreso reciente, antecedentes).',
    forensic:
      'Indispensable para AP en muertes en custodia: provee tasa-base y factores de riesgo institucionales para contraste pericial.',
  },
  {
    title: 'Psychological autopsy of completed suicide in children and adolescents',
    authors: 'Brent, D. A., Perper, J. A., Moritz, G., et al.',
    year: 1993,
    source: 'American Journal of Psychiatry, 150(4), 521-529.',
    method:
      'Estudio caso-control AP con 67 adolescentes (suicidio consumado vs. controles comunitarios pareados).',
    forensic:
      'Referencia central para AP infanto-juvenil; identifica trastornos del ánimo, abuso de sustancias y conflictos interpersonales como predictores.',
  },
  {
    title: 'Reliability of psychological autopsies: A comparison of expert assessments',
    authors: 'Kelly, T. M., & Mann, J. J.',
    year: 1996,
    source: 'American Journal of Psychiatry, 153(11), 1459-1462.',
    method:
      'Estudio de fiabilidad inter-jueces sobre 50 casos AP evaluados por dos peritos independientes.',
    forensic:
      'Sostiene niveles aceptables de acuerdo cuando se aplican entrevistas semiestructuradas y criterios DSM operacionalizados.',
  },
  {
    title: 'Modelo de Autopsia Psicológica Integrada con fines forenses (MAPI)',
    authors: 'García Pérez, T.',
    year: 2007,
    source: 'Editorial Ciencias Médicas, La Habana.',
    method:
      'Desarrolla y valida en Cuba el modelo MAPI: protocolo estructurado para muertes equívocas con uso pericial.',
    forensic:
      'Antecedente latinoamericano de mayor circulación regional; modelo compatible con la práctica argentina y santafesina.',
  },
  {
    title: 'Psychological autopsy: A review of methodological reliability and validity',
    authors: 'Snider, J. E., Hane, S., & Berman, A. L.',
    year: 2006,
    source: 'Death Studies, 30(6), 535-554.',
    method:
      'Síntesis cualitativa de la fiabilidad y validez de la AP; revisa fuentes de error y soluciones metodológicas.',
    forensic: 'Marco para discutir, en el informe pericial, la validez del método y el alcance de las conclusiones.',
  },
  {
    title: 'Suicide following deinstitutionalization in Argentina: A psychological autopsy study',
    authors: 'Stagnaro, J. C., Cía, A. H., et al. [verificar referencia exacta]',
    year: 2018,
    source: 'Vertex Revista Argentina de Psiquiatría [verificar volumen].',
    method:
      'Aplicación argentina de AP en pacientes con trastorno mental severo en proceso de externación (línea CONICET / APSA).',
    forensic:
      'Antecedente local relevante para AP en contextos de salud mental pública (Ley 26.657) y muertes en residencias.',
  },
];

export const AP_INSTRUMENTS = [
  {
    name: 'Psychological Autopsy Interview (PAI)',
    authors: 'Clark, D. C. & Horton-Deutsch, S. (1992)',
    purpose: 'Entrevista semiestructurada a informantes para reconstruir estado mental y psicopatología previa.',
    structure: 'Bloques sobre psicopatología (DSM), estresores, conducta suicida previa, tratamiento, vínculos.',
    validation: 'Validación original en EE. UU.; traducciones parciales al español [verificar normas locales].',
    access: 'Acceso técnico — requiere capacitación en entrevista clínica forense.',
    forensic: 'Núcleo de la AP en formato de entrevista; adaptable a formato pericial argentino con consentimiento informado.',
  },
  {
    name: 'Structured Interview for Psychological Autopsy (SIPA)',
    authors: 'Werlang, B. G. & Botega, N. J. (2003, Brasil)',
    purpose: 'Entrevista estructurada en portugués para AP en suicidios; adaptable al castellano.',
    structure: 'Secciones sobre datos sociodemográficos, evento, psicopatología, conducta suicida, factores precipitantes.',
    validation: 'Validada en Brasil; antecedente cono-sur de mayor circulación.',
    access: 'Libre acceso académico (Werlang & Botega, 2003).',
    forensic: 'Recomendada para AP en Argentina por proximidad cultural y disponibilidad en lengua latina.',
  },
  {
    name: 'Lethality of Suicide Attempt Rating Scale (LSARS)',
    authors: 'Smith, K., Conroy, R. W., & Ehler, B. D. (1984)',
    purpose: 'Cuantifica letalidad médica del método empleado.',
    structure: 'Escala de 0 a 10 con anclajes médicos.',
    validation: 'Validación original en EE. UU.; uso retrospectivo en AP.',
    access: 'Libre acceso.',
    forensic: 'Útil para sustentar la intencionalidad mediante el componente objetivo de letalidad del método.',
  },
  {
    name: 'Columbia Suicide Severity Rating Scale (C-SSRS) — uso retrospectivo',
    authors: 'Posner, K., Brown, G. K., Stanley, B., et al. (2011)',
    purpose: 'Clasificación de ideación y conducta suicida; aplicable retrospectivamente sobre informantes y registros.',
    structure: 'Subescalas de ideación, intensidad, conducta y letalidad.',
    validation: 'Validación internacional amplia, incluyendo versiones en español.',
    access: 'Libre acceso (columbiapsychiatry.org/scientific-research/sssrs).',
    forensic: 'Estándar internacional; permite homologar el lenguaje pericial con la literatura científica vigente.',
  },
  {
    name: 'Beck Scale for Suicidal Ideation (BSS) — uso documental',
    authors: 'Beck, A. T., Kovacs, M., & Weissman, A. (1979)',
    purpose: 'Evalúa intensidad y características de la ideación suicida.',
    structure: '21 ítems autoaplicados.',
    validation: 'Validación en español (Beck & Steer; adaptaciones argentinas).',
    access: 'Comercial (Pearson); disponible en consultorios.',
    forensic: 'En AP se utiliza sobre registros previos del fallecido; no se autoaplica retrospectivamente.',
  },
  {
    name: 'Suicide Intent Scale (SIS)',
    authors: 'Pierce, D. W. (1977); Beck et al. (1974)',
    purpose: 'Evalúa la intencionalidad del intento (planificación, expectativa de letalidad, encubrimiento).',
    structure: '15 ítems puntuados sobre el episodio.',
    validation: 'Validación internacional; versiones españolas.',
    access: 'Libre acceso académico.',
    forensic: 'Indicador clave para sostener hipótesis suicida en muertes equívocas.',
  },
  {
    name: 'Reasons for Living Inventory (RFL)',
    authors: 'Linehan, M. M., Goodstein, J. L., Nielsen, S. L., & Chiles, J. A. (1983)',
    purpose: 'Releva factores protectores subjetivos contra el suicidio.',
    structure: '48 ítems; subescalas (sobrevivencia, responsabilidad familiar, miedo al suicidio, miedo a la desaprobación social, objeciones morales).',
    validation: 'Validaciones en español (España, México).',
    access: 'Libre acceso académico.',
    forensic: 'Cuando se aplica sobre registros previos, permite documentar erosión de factores protectores en el período crítico.',
  },
  {
    name: 'Modelo de Autopsia Psicológica Integrada (MAPI)',
    authors: 'García Pérez, T. (Cuba, 2007)',
    purpose: 'Protocolo estructurado de AP con fines forenses, ampliamente difundido en Iberoamérica.',
    structure: 'Bloques sobre datos del occiso, signos de personalidad, estado mental, evento, fuentes y conclusiones.',
    validation: 'Validación cubana; uso pericial en varios países latinoamericanos.',
    access: 'Documentación en bibliografía especializada.',
    forensic: 'Modelo compatible con la práctica forense argentina; lenguaje pericial homologable.',
  },
  {
    name: 'Formato de Autopsia Psicológica del INMLCF (Colombia)',
    authors: 'Instituto Nacional de Medicina Legal y Ciencias Forenses (Colombia)',
    purpose: 'Protocolo oficial colombiano para AP en muertes equívocas.',
    structure: 'Guía estructurada con secciones equiparables al MAPI.',
    validation: 'Uso institucional documentado en Colombia [verificar última versión].',
    access: 'Documento institucional (medicinalegal.gov.co).',
    forensic: 'Referencia regional para diseñar protocolos institucionales en provincias argentinas.',
  },
  {
    name: 'Guías AAS — American Association of Suicidology',
    authors: 'AAS — Berman, A. L. y col.',
    purpose: 'Lineamientos profesionales para AP y certificación de "Psychological Autopsy Investigator".',
    structure: 'Guía de procedimiento, ética y reporte.',
    validation: 'Estándar profesional internacional.',
    access: 'suicidology.org (acceso parcial, formación arancelada).',
    forensic: 'Encuadre ético-procedimental de referencia internacional.',
  },
];

export const AP_BIBLIOGRAPHY = {
  books: [
    {
      ref: 'Shneidman, E. S. (1996). The Suicidal Mind. Oxford University Press. ISBN 978-0195103663.',
      note: 'Síntesis teórica del concepto de psychache y del enfoque shneidmaniano.',
    },
    {
      ref: 'Shneidman, E. S. (1985). Definition of Suicide. John Wiley & Sons.',
      note: 'Obra fundacional para la definición operacional del suicidio en AP.',
    },
    {
      ref: 'Leenaars, A. A. (1999). Lives and Deaths: Selections from the Works of Edwin S. Shneidman. Brunner/Mazel.',
      note: 'Antología comentada útil para el marco teórico.',
    },
    {
      ref: 'Hawton, K. & van Heeringen, K. (Eds.) (2000). The International Handbook of Suicide and Attempted Suicide. Wiley. ISBN 978-0471983675.',
      note: 'Obra de referencia internacional; capítulos específicos sobre AP.',
    },
    {
      ref: 'Joiner, T. (2005). Why People Die by Suicide. Harvard University Press. ISBN 978-0674025493.',
      note: 'Teoría Interpersonal-Psicológica del suicidio.',
    },
    {
      ref: 'Gutheil, T. G. & Drogin, E. Y. (2013). The Mental Health Professional in Court. APA Books.',
      note: 'Manual sobre testimonio pericial y AP en el contexto judicial.',
    },
    {
      ref: 'García Pérez, T. (2007). Pensando en la Autopsia Psicológica. Editorial Ciencias Médicas, La Habana.',
      note: 'Manual cubano de mayor circulación regional sobre AP forense (MAPI).',
    },
    {
      ref: 'Folino, J. O. (2015). Evaluación de riesgo de violencia y peritaje psicológico. Interfase Forense [verificar edición exacta].',
      note: 'Referencia argentina para encuadrar peritajes psicológicos forenses.',
    },
  ],
  articles: [
    'Shneidman, E. S. (1981). The psychological autopsy. SLTB. https://doi.org/10.1111/j.1943-278X.1981.tb00019.x',
    'Cavanagh, J. T. O. et al. (2003). Psychological autopsy studies of suicide: A systematic review. Psychological Medicine. https://doi.org/10.1017/S0033291702006943',
    'Hawton, K. et al. (1998). The psychological autopsy approach to studying suicide. JAD. https://doi.org/10.1016/S0165-0327(98)00056-2',
    'Conner, K. R. et al. (2011). The next generation of psychological autopsy studies. SLTB. https://doi.org/10.1111/j.1943-278X.2011.00038.x',
    'Pouliot, L. & De Leo, D. (2006). Critical issues in psychological autopsy studies. SLTB. https://doi.org/10.1521/suli.2006.36.5.491',
  ],
  institutions: [
    { name: 'IASP — International Association for Suicide Prevention', url: 'https://www.iasp.info/' },
    { name: 'AAS — American Association of Suicidology', url: 'https://suicidology.org/' },
    { name: 'OMS — Suicidio y prevención', url: 'https://www.who.int/health-topics/suicide' },
    { name: 'Asociación Argentina de Prevención del Suicidio (AAPS)', url: 'https://www.aaps.org.ar/' },
    { name: 'Ley Nacional 27.130 — Prevención del Suicidio', url: 'https://servicios.infoleg.gob.ar/infolegInternet/anexos/245000-249999/245618/norma.htm' },
    { name: 'Ley Provincial 12.734 — CPP Santa Fe', url: 'https://www.santafe.gov.ar/index.php/web/content/view/full/111291' },
  ],
};

export const AP_ETHICS =
  'El perito en Autopsia Psicológica debe (a) restringir sus conclusiones a indicadores probabilístico-orientativos, sin pronunciarse sobre la modalidad legal de muerte; (b) explicitar fuentes, método, limitaciones y nivel de convergencia en cada inferencia; (c) preservar la dignidad del fallecido y de los informantes (Código de Ética del Colegio de Psicólogos de la Provincia de Santa Fe; Código FePRA); (d) requerir consentimiento informado a los informantes y resguardar el secreto profesional respecto de información no relevante para los puntos de pericia; (e) abstenerse de actuar cuando exista conflicto de interés o vínculo previo significativo con el fallecido o su familia (lineamientos APA Specialty Guidelines for Forensic Psychology, 2013; ULAPSI, 2007).';
