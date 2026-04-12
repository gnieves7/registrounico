/**
 * Datos ficticios para el modo demostración profesional.
 * Permite explorar la plataforma con contenido realista sin necesidad de autenticación.
 */

export const demoPatients = [
  {
    id: "demo-patient-1",
    full_name: "María García López",
    email: "maria.garcia@demo.psi",
    avatar_url: null,
    is_approved: true,
    phone: "+54 342 555-1234",
    created_at: "2025-03-15T10:00:00Z",
  },
  {
    id: "demo-patient-2",
    full_name: "Juan Pérez Rodríguez",
    email: "juan.perez@demo.psi",
    avatar_url: null,
    is_approved: true,
    phone: "+54 342 555-5678",
    created_at: "2025-06-01T14:00:00Z",
  },
  {
    id: "demo-patient-3",
    full_name: "Lucía Fernández",
    email: "lucia.fernandez@demo.psi",
    avatar_url: null,
    is_approved: false,
    phone: "+54 342 555-9012",
    created_at: "2026-04-01T09:00:00Z",
  },
];

export const demoSessions = [
  {
    id: "demo-session-1",
    patient_id: "demo-patient-1",
    session_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    topic: "Seguimiento de ansiedad laboral",
    patient_notes: "Me sentí mejor esta semana, pero tuve un episodio el jueves.",
    patient_questions: "¿Podemos hablar sobre técnicas de respiración?",
    is_editable_by_patient: true,
    calendar_link: null,
    clinical_notes: "Paciente muestra mejoría progresiva. Continuar con TCC.",
  },
  {
    id: "demo-session-2",
    patient_id: "demo-patient-1",
    session_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    topic: "Exploración de vínculos familiares",
    patient_notes: "Reflexioné sobre la relación con mi madre.",
    patient_questions: null,
    is_editable_by_patient: false,
    calendar_link: null,
    clinical_notes: "Se trabajó genograma familiar. Identificación de patrones de evitación.",
  },
  {
    id: "demo-session-3",
    patient_id: "demo-patient-2",
    session_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    topic: "Primera entrevista de admisión",
    patient_notes: null,
    patient_questions: "¿Cuánto dura cada sesión?",
    is_editable_by_patient: true,
    calendar_link: null,
    clinical_notes: "Motivo de consulta: dificultades en relaciones interpersonales.",
  },
  {
    id: "demo-session-4",
    patient_id: "demo-patient-1",
    session_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    topic: "Revisión de objetivos terapéuticos",
    patient_notes: "Logré hacer la tarea de exposición.",
    patient_questions: null,
    is_editable_by_patient: false,
    calendar_link: null,
    clinical_notes: "Buena adherencia al tratamiento. Se refuerza autoeficacia.",
  },
];

export const demoEmotionalRecords = [
  { id: "demo-emo-1", user_id: "demo-patient-1", emoji: "😊", mood_score: 8, record_date: new Date().toISOString().split("T")[0], reflection: "Hoy me sentí tranquila después de la sesión.", created_at: new Date().toISOString() },
  { id: "demo-emo-2", user_id: "demo-patient-1", emoji: "😐", mood_score: 5, record_date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0], reflection: "Día normal, algo de cansancio.", created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "demo-emo-3", user_id: "demo-patient-1", emoji: "😢", mood_score: 3, record_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0], reflection: "Discusión con mi pareja, me sentí muy mal.", created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "demo-emo-4", user_id: "demo-patient-1", emoji: "😊", mood_score: 7, record_date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0], reflection: "Salí a caminar y me hizo bien.", created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "demo-emo-5", user_id: "demo-patient-1", emoji: "😰", mood_score: 2, record_date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0], reflection: "Tuve una crisis de ansiedad en el trabajo.", created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "demo-emo-6", user_id: "demo-patient-2", emoji: "😊", mood_score: 6, record_date: new Date().toISOString().split("T")[0], reflection: "Empecé terapia, me siento esperanzado.", created_at: new Date().toISOString() },
];

export const demoNotebookEntries = [
  {
    id: "demo-nb-1",
    user_id: "demo-patient-1",
    title: "Reflexión sobre la sesión de hoy",
    content: "Hoy trabajamos sobre mis miedos. Me di cuenta de que muchos vienen de la infancia. Quiero seguir explorando esto.",
    shared_with_therapist: true,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-nb-2",
    user_id: "demo-patient-1",
    title: "Sueño recurrente",
    content: "Volví a soñar con la casa de mi abuela. Siempre es el mismo pasillo largo y oscuro. Me despierto con angustia.",
    shared_with_therapist: false,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export const demoDreamRecords = [
  {
    id: "demo-dream-1",
    user_id: "demo-patient-1",
    title: "El vuelo sobre el mar",
    dream_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    dream_content: "Soñé que volaba sobre un mar infinito. El agua era cristalina y podía ver peces de colores. Me sentía libre y en paz. De repente, el cielo se oscureció y comencé a caer lentamente hacia el agua.",
    dream_emojis: ["✈️", "🌊", "😊", "😨"],
    interpretation: "El vuelo puede representar un deseo de libertad y autonomía. La caída sugiere temor a perder el control. El mar cristalino indica claridad emocional momentánea.",
    interpretation_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "demo-dream-2",
    user_id: "demo-patient-1",
    title: "La casa abandonada",
    dream_date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    dream_content: "Estaba en una casa vieja que parecía conocida pero no podía recordar de dónde. Las paredes se caían y había plantas creciendo dentro. Escuchaba voces de mi familia pero no podía encontrarlos.",
    dream_emojis: ["🏠", "👥", "😨", "🌲"],
    interpretation: null,
    interpretation_date: null,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export const demoPsychobiography = {
  id: "demo-psycho-1",
  user_id: "demo-patient-1",
  birth_date: "1990-03-15",
  birth_place: "Santa Fe, Argentina",
  nationality: "Argentina",
  address: "Bv. Gálvez 1234, Santa Fe",
  education_level: "universitario",
  occupation: "Contadora",
  marital_status: "casado",
  consultation_reason: "Ansiedad generalizada y dificultades en relaciones familiares",
  treatment_start_date: "2025-03-15",
  sessions_attended: 12,
  sessions_absent: 1,
  referred_by: "Dra. Martínez (médica clínica)",
  is_complete: false,
  family_data: {
    parents: {
      father: { name: "Roberto García", age: 65, occupation: "Jubilado", relationship: "Distante", alive: true },
      mother: { name: "Ana López", age: 62, occupation: "Docente", relationship: "Conflictiva", alive: true },
    },
    siblings: [{ name: "Carlos García", age: 28, relationship: "Buena" }],
    familyDynamics: "Familia con dificultades de comunicación. Patrón de evitación emocional.",
  },
  medical_history: {
    currentConditions: ["Migrañas tensionales"],
    medications: [{ name: "Ibuprofeno", dose: "400mg", frequency: "A demanda" }],
    allergies: ["Penicilina"],
  },
  psychological_history: {
    previousTherapy: true,
    previousTherapyDetails: "Terapia cognitivo-conductual durante 6 meses en 2022.",
    psychiatricHistory: false,
  },
  lifestyle_data: {
    exercise: "Camina 3 veces por semana",
    sleep: "Insomnio ocasional, 6 horas promedio",
    nutrition: "Alimentación irregular por estrés laboral",
    socialLife: "Grupo reducido de amigos. Tendencia al aislamiento.",
  },
  created_at: "2025-03-15T10:00:00Z",
  updated_at: "2026-04-01T14:30:00Z",
};
