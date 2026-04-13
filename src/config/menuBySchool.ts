import type { LucideIcon } from 'lucide-react';
import {
  Home, User, Brain, Moon, Thermometer, BookOpen, Calendar, MessageCircle,
  FileText, Handshake, Clock, ClipboardList, BarChart3, Award, Send,
  ScrollText, Waves, Link, Pin, Milestone, TrendingUp, Target, Trophy,
  CheckSquare, Clipboard, Heart, Star, Leaf, Sprout, Circle,
  Activity, StickyNote, Hexagon, FolderOpen, Network, GitMerge, CloudSun,
  RefreshCw, Share2, Repeat, Sparkles, Users, BookMarked, FileBarChart,
  Hourglass, FileEdit,
} from 'lucide-react';
import type { SchoolType } from './schools';

export interface SchoolMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  url: string;
  tooltip?: string;
}

export interface SchoolHeaderConfig {
  subtitle: string;
}

// Map menu item id → actual route in the app
const ROUTE_MAP: Record<string, string> = {
  home: '/dashboard',
  history: '/psychobiography',
  training: '/anxiety-record',
  emotional: '/emotional-thermometer',
  unconscious: '/dream-record',
  alliance: '/therapeutic-alliance',
  timeline: '/life-timeline',
  tasks: '/micro-tasks',
  rewards: '/symbolic-awards',
  telegram: '/telegram',
  monitoring: '/outcome-monitoring',
  appointments: '/sessions',
  notebook: '/notebook',
  assistant: '/laura',
  reports: '/documents',
  profile: '/professional-profile',
};

function r(id: string) { return ROUTE_MAP[id] || '/dashboard'; }

export const SCHOOL_HEADER: Record<SchoolType, SchoolHeaderConfig> = {
  psychoanalytic: { subtitle: 'Área Clínica · Encuadre Psicoanalítico' },
  behavioral: { subtitle: 'Área Clínica · Encuadre Conductual' },
  humanistic: { subtitle: 'Área Clínica · Encuadre Humanista' },
  cognitive_behavioral: { subtitle: 'Área Clínica · Encuadre Cognitivo-Conductual' },
  systemic: { subtitle: 'Área Clínica · Encuadre Sistémico' },
};

export const MENU_BY_SCHOOL: Record<SchoolType, SchoolMenuItem[]> = {

  psychoanalytic: [
    { id: 'home', label: 'Inicio', icon: Home, url: r('home') },
    { id: 'history', label: 'Historia del Sujeto', icon: ScrollText, url: r('history'), tooltip: 'Construcción de la historia subjetiva, antecedentes significativos y cronología del conflicto' },
    { id: 'training', label: 'Trabajo de Elaboración', icon: RefreshCw, url: r('training'), tooltip: 'Ejercicios de elaboración, asociación libre guiada y trabajo sobre el conflicto' },
    { id: 'emotional', label: 'Registro Afectivo', icon: Waves, url: r('emotional'), tooltip: 'Estado afectivo predominante, angustia y afectos en transferencia' },
    { id: 'unconscious', label: 'Registro Inconsciente', icon: Moon, url: r('unconscious'), tooltip: 'Sueños, actos fallidos, lapsus y formaciones del inconsciente' },
    { id: 'alliance', label: 'Vínculo Transferencial', icon: Link, url: r('alliance'), tooltip: 'Análisis de la transferencia, contratransferencia y alianza de trabajo' },
    { id: 'timeline', label: 'Cronología del Conflicto', icon: Hourglass, url: r('timeline'), tooltip: 'Hitos biográficos, traumas, fijaciones y regresiones en la historia subjetiva' },
    { id: 'tasks', label: 'Indicaciones de Trabajo', icon: Pin, url: r('tasks'), tooltip: 'Indicaciones entre sesiones: lectura, escritura, observación de sueños' },
    { id: 'rewards', label: 'Hitos del Proceso', icon: Milestone, url: r('rewards'), tooltip: 'Momentos de elaboración, insight y avance en el proceso analítico' },
    { id: 'telegram', label: 'Telegram', icon: Send, url: r('telegram') },
    { id: 'monitoring', label: 'Evolución del Proceso', icon: TrendingUp, url: r('monitoring'), tooltip: 'Registro cualitativo de la evolución analítica: insight, elaboración, transferencia' },
    { id: 'appointments', label: 'Mis Sesiones', icon: Clock, url: r('appointments'), tooltip: 'Agenda de sesiones analíticas y frecuencia del encuadre' },
    { id: 'notebook', label: 'Diario de Sueños y Asociaciones', icon: BookOpen, url: r('notebook'), tooltip: 'Sueños, asociaciones libres, recuerdos encubridores y material onírico' },
    { id: 'assistant', label: 'Laura — Escucha Analítica', icon: MessageCircle, url: r('assistant') },
    { id: 'reports', label: 'Informes Clínicos', icon: ScrollText, url: r('reports') },
    { id: 'profile', label: 'Perfil del Profesional', icon: User, url: r('profile') },
  ],

  behavioral: [
    { id: 'home', label: 'Inicio', icon: Home, url: r('home') },
    { id: 'history', label: 'Historia Conductual', icon: Clipboard, url: r('history'), tooltip: 'Antecedentes, historia de aprendizaje y condicionamientos previos' },
    { id: 'training', label: 'Entrenamiento en Habilidades', icon: Target, url: r('training'), tooltip: 'Ejercicios de adquisición y práctica de conductas objetivo' },
    { id: 'emotional', label: 'Registro de Malestar (SUDs)', icon: BarChart3, url: r('emotional'), tooltip: 'Nivel de malestar subjetivo en escala 0-100 por situación' },
    { id: 'unconscious', label: 'Autorregistro ABC', icon: FileEdit, url: r('unconscious'), tooltip: 'Registro de Antecedente — Conducta — Consecuente por episodio' },
    { id: 'alliance', label: 'Relación Terapéutica', icon: Handshake, url: r('alliance'), tooltip: 'Relación funcional terapeuta-cliente y adherencia al tratamiento' },
    { id: 'timeline', label: 'Historia de Aprendizaje', icon: TrendingUp, url: r('timeline'), tooltip: 'Línea temporal de condicionamientos y contextos de adquisición conductual' },
    { id: 'tasks', label: 'Tareas Conductuales', icon: CheckSquare, url: r('tasks'), tooltip: 'Exposición, práctica de habilidades y autorregistro asignados' },
    { id: 'rewards', label: 'Reforzadores de Logro', icon: Trophy, url: r('rewards'), tooltip: 'Logros conductuales alcanzados y reforzamiento simbólico de avances' },
    { id: 'telegram', label: 'Telegram', icon: Send, url: r('telegram') },
    { id: 'monitoring', label: 'Datos de Intervención', icon: BarChart3, url: r('monitoring'), tooltip: 'Frecuencia, duración e intensidad — línea de base vs. intervención' },
    { id: 'appointments', label: 'Mis Sesiones', icon: Calendar, url: r('appointments'), tooltip: 'Agenda de sesiones de intervención y seguimiento' },
    { id: 'notebook', label: 'Cuaderno de Autorregistros', icon: Clipboard, url: r('notebook'), tooltip: 'Registro conductual diario: situaciones, conductas, antecedentes y consecuentes' },
    { id: 'assistant', label: 'Laura — Asistente Conductual', icon: MessageCircle, url: r('assistant') },
    { id: 'reports', label: 'Informes de Intervención', icon: FileBarChart, url: r('reports') },
    { id: 'profile', label: 'Perfil del Profesional', icon: User, url: r('profile') },
  ],

  humanistic: [
    { id: 'home', label: 'Inicio', icon: Home, url: r('home') },
    { id: 'history', label: 'Mi Historia de Vida', icon: Sprout, url: r('history'), tooltip: 'Ciclo vital (Erikson), escenas nucleares (McAdams) y búsqueda de sentido (Frankl). Narrativa autobiográfica con estructura intencional (Bühler).' },
    { id: 'training', label: 'Ejercicios de Autoconciencia', icon: Circle, url: r('training'), tooltip: 'Q-Sort del Self (Rogers), ciclo de la experiencia (Perls), Focusing (Gendlin) y experiencias cumbre (Maslow). Exploración experiencial y contacto con el presente.' },
    { id: 'emotional', label: 'Registro Experiencial', icon: Thermometer, url: r('emotional'), tooltip: 'Diferenciación emocional (Barrett), tipos de emoción (Greenberg/EFT), marcador somático (Damasio). No categoriza malestar — acompaña y diferencia.' },
    { id: 'unconscious', label: 'Diario de Experiencias', icon: BookOpen, url: r('unconscious'), tooltip: 'Escritura expresiva (Pennebaker), preguntas existenciales (Yalom: muerte, libertad, aislamiento, sentido), registro onírico fenomenológico.' },
    { id: 'alliance', label: 'Calidad del Encuentro', icon: Heart, url: r('alliance'), tooltip: 'Relación Yo-Tú (Buber), actitudes rogerianas (congruencia, aceptación, empatía), alianza de trabajo (Bordin). El predictor más robusto del resultado (Wampold).' },
    { id: 'timeline', label: 'Línea de Vida', icon: Leaf, url: r('timeline'), tooltip: 'Estructura intencional del ciclo vital (Bühler), transiciones normativas (Levinson), triángulo trágico (Frankl). Integra lo difícil y lo bello.' },
    { id: 'tasks', label: 'Invitaciones de Exploración', icon: Sprout, url: r('tasks'), tooltip: 'Experimentos gestálticos (Perls), invitaciones de búsqueda interior (Bugental), condiciones para flow (Csikszentmihalyi). No son tareas — son aperturas.' },
    { id: 'rewards', label: 'Celebración del Crecimiento', icon: Star, url: r('rewards'), tooltip: 'Valores del Ser (Maslow), proceso valorativo organísmico (Rogers), ampliación y construcción (Fredrickson). Nombrar lo que ya existe, no reforzar.' },
    { id: 'telegram', label: 'Telegram', icon: Send, url: r('telegram') },
    { id: 'monitoring', label: 'Proceso de Crecimiento', icon: Leaf, url: r('monitoring'), tooltip: 'Bienestar psicológico (Ryff: 6 dimensiones), satisfacción vital (SWLS/Diener), propósito en la vida (PIL/Frankl), congruencia del self (Rogers).' },
    { id: 'appointments', label: 'Mis Encuentros', icon: Calendar, url: r('appointments'), tooltip: 'Agenda de encuentros terapéuticos' },
    { id: 'notebook', label: 'Diario Vivencial', icon: BookOpen, url: r('notebook'), tooltip: 'Espacio de escritura libre para explorar la experiencia presente. La escritura transforma la experiencia en comprensión (Pennebaker).' },
    { id: 'assistant', label: 'Laura — Acompañante', icon: MessageCircle, url: r('assistant'), tooltip: 'Asistente humanista-existencial: congruencia, aceptación incondicional y comprensión empática (Rogers). Reflejo activo y focalización suave (Gendlin).' },
    { id: 'reports', label: 'Informes de Proceso', icon: FileText, url: r('reports') },
    { id: 'profile', label: 'Perfil del Profesional', icon: User, url: r('profile') },
  ],

  cognitive_behavioral: [
    { id: 'home', label: 'Inicio', icon: Home, url: r('home') },
    { id: 'history', label: 'Historia Clínica Cognitiva', icon: FolderOpen, url: r('history'), tooltip: 'Antecedentes y factores predisponentes, precipitantes y mantenedores' },
    { id: 'training', label: 'Entrenamiento Cognitivo', icon: Hexagon, url: r('training'), tooltip: 'Registro de pensamientos automáticos, reestructuración y experimentos conductuales' },
    { id: 'emotional', label: 'Termómetro Emocional', icon: Activity, url: r('emotional'), tooltip: 'Intensidad emocional, activación y SUDs por pensamiento automático' },
    { id: 'unconscious', label: 'Registro de Pensamientos', icon: StickyNote, url: r('unconscious'), tooltip: 'Situación — emoción — pensamiento automático — respuesta alternativa' },
    { id: 'alliance', label: 'Alianza Terapéutica', icon: Handshake, url: r('alliance'), tooltip: 'Acuerdo en tareas, metas y calidad del vínculo terapéutico' },
    { id: 'timeline', label: 'Línea de Vida', icon: Calendar, url: r('timeline'), tooltip: 'Historia del problema: inicio, factores precipitantes y cronología de síntomas' },
    { id: 'tasks', label: 'Tareas entre Sesiones', icon: CheckSquare, url: r('tasks'), tooltip: 'Registro, experimentos conductuales y práctica de técnicas cognitivas' },
    { id: 'rewards', label: 'Logros Terapéuticos', icon: Target, url: r('rewards'), tooltip: 'Objetivos SMART alcanzados y reforzamiento de avances cognitivos' },
    { id: 'telegram', label: 'Telegram', icon: Send, url: r('telegram') },
    { id: 'monitoring', label: 'Monitoreo de Resultados', icon: BarChart3, url: r('monitoring'), tooltip: 'Evolución de escalas: BDI-II, BAI, SUDs, pensamientos automáticos' },
    { id: 'appointments', label: 'Mis Turnos', icon: Calendar, url: r('appointments'), tooltip: 'Agenda de sesiones estructuradas' },
    { id: 'notebook', label: 'Cuaderno de Trabajo', icon: ClipboardList, url: r('notebook'), tooltip: 'Pensamientos, experimentos conductuales y práctica de técnicas' },
    { id: 'assistant', label: 'Laura — Asistente Cognitivo', icon: MessageCircle, url: r('assistant') },
    { id: 'reports', label: 'Informes Clínicos', icon: ClipboardList, url: r('reports') },
    { id: 'profile', label: 'Perfil del Profesional', icon: User, url: r('profile') },
  ],

  systemic: [
    { id: 'home', label: 'Inicio', icon: Home, url: r('home') },
    { id: 'history', label: 'Historia del Sistema', icon: Network, url: r('history'), tooltip: 'Genograma, historia relacional y ciclo vital familiar' },
    { id: 'training', label: 'Ejercicios Relacionales', icon: GitMerge, url: r('training'), tooltip: 'Tareas sistémicas, rituales y prescripciones para el sistema consultante' },
    { id: 'emotional', label: 'Clima Relacional', icon: CloudSun, url: r('emotional'), tooltip: 'Tensión, cohesión y temperatura emocional del sistema' },
    { id: 'unconscious', label: 'Registro de Pautas', icon: RefreshCw, url: r('unconscious'), tooltip: 'Secuencias relacionales, escaladas y pautas comunicacionales' },
    { id: 'alliance', label: 'Vínculo con el Sistema', icon: Share2, url: r('alliance'), tooltip: 'Calidad del vínculo con cada subsistema y posicionamiento terapéutico' },
    { id: 'timeline', label: 'Línea del Sistema', icon: Link, url: r('timeline'), tooltip: 'Historia relacional, ciclo vital familiar y eventos críticos del sistema' },
    { id: 'tasks', label: 'Prescripciones y Rituales', icon: Repeat, url: r('tasks'), tooltip: 'Prescripciones sistémicas, rituales de cambio y tareas para el sistema' },
    { id: 'rewards', label: 'Cambios del Sistema', icon: Sparkles, url: r('rewards'), tooltip: 'Nuevas pautas relacionales y cambios en el sistema consultante' },
    { id: 'telegram', label: 'Telegram', icon: Send, url: r('telegram') },
    { id: 'monitoring', label: 'Cambio Relacional', icon: RefreshCw, url: r('monitoring'), tooltip: 'Evolución de pautas: comunicación, fronteras, cohesión (FACES-IV)' },
    { id: 'appointments', label: 'Sesiones del Sistema', icon: Users, url: r('appointments'), tooltip: 'Agenda de sesiones familiares/de pareja y participantes convocados' },
    { id: 'notebook', label: 'Cuaderno del Sistema', icon: BookMarked, url: r('notebook'), tooltip: 'Pautas observadas, comunicación familiar y cambios relacionales' },
    { id: 'assistant', label: 'Laura — Observadora del Sistema', icon: MessageCircle, url: r('assistant') },
    { id: 'reports', label: 'Informes del Sistema', icon: Network, url: r('reports') },
    { id: 'profile', label: 'Perfil del Profesional', icon: User, url: r('profile') },
  ],
};
