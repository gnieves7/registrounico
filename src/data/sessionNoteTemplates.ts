import type { SchoolType } from '@/config/schools';

export interface NoteTemplateField {
  key: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
}

export interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  fields: NoteTemplateField[];
}

const FREE: NoteTemplate = {
  id: 'free',
  name: 'Nota libre',
  description: 'Sin estructura previa, un solo cuerpo de notas.',
  fields: [
    { key: 'notes', label: 'Notas de sesión', rows: 14, placeholder: 'Escribí libremente lo trabajado en sesión…' },
  ],
};

export const SESSION_NOTE_TEMPLATES: Record<SchoolType, NoteTemplate[]> = {
  cognitive_behavioral: [
    FREE,
    {
      id: 'cbt_abcde',
      name: 'ABCDE + SUDs',
      description: 'Modelo cognitivo de Ellis con escalado SUDs y tarea entre sesiones.',
      fields: [
        { key: 'a', label: 'A · Situación activadora', rows: 3 },
        { key: 'b', label: 'B · Pensamientos / creencias', rows: 3 },
        { key: 'c', label: 'C · Consecuencia emocional y conductual', rows: 3 },
        { key: 'd', label: 'D · Disputa / reestructuración', rows: 3 },
        { key: 'e', label: 'E · Efecto nuevo', rows: 3 },
        { key: 'suds', label: 'SUDs (0-10) inicio → final', rows: 1, placeholder: 'Ej: 8 → 3' },
        { key: 'task', label: 'Tarea entre sesiones', rows: 3 },
      ],
    },
    {
      id: 'cbt_phq',
      name: 'Seguimiento PHQ-9 / GAD-7',
      description: 'Monitoreo de síntomas y ajuste de plan.',
      fields: [
        { key: 'scores', label: 'Puntajes (PHQ-9 / GAD-7)', rows: 1 },
        { key: 'symptoms', label: 'Síntomas trabajados', rows: 3 },
        { key: 'intervention', label: 'Intervención aplicada', rows: 4 },
        { key: 'plan', label: 'Plan / próxima sesión', rows: 3 },
      ],
    },
    {
      id: 'cbt_full',
      name: 'Sesión completa (con seguimiento)',
      description: 'Incluye Tareas entre Sesiones, Logros Terapéuticos y Monitoreo de Resultados (requeridos).',
      fields: [
        { key: 'focus', label: 'Foco de sesión', rows: 3 },
        { key: 'intervention', label: 'Intervención aplicada', rows: 4 },
        { key: 'tasks', label: 'Tareas entre sesiones', rows: 3, required: true, hint: 'Tareas asignadas para practicar entre sesiones.' },
        { key: 'rewards', label: 'Logros terapéuticos', rows: 3, required: true, hint: 'Evidencias de cambio o aprendizajes.' },
        { key: 'monitoring', label: 'Monitoreo de resultados', rows: 3, required: true, hint: 'PHQ-9, GAD-7 u otra escala de seguimiento.' },
      ],
    },
  ],
  psychoanalytic: [
    FREE,
    {
      id: 'psy_session',
      name: 'Sesión analítica',
      description: 'Material asociativo, transferencia y formación del inconsciente.',
      fields: [
        { key: 'material', label: 'Material asociativo / discurso', rows: 4 },
        { key: 'transference', label: 'Transferencia / contratransferencia', rows: 3 },
        { key: 'formations', label: 'Formaciones del inconsciente (sueños, actos fallidos, síntomas)', rows: 3 },
        { key: 'apres_coup', label: 'Lectura à après-coup', rows: 3 },
        { key: 'intervention', label: 'Intervención del analista', rows: 3 },
      ],
    },
    {
      id: 'psy_full',
      name: 'Sesión completa (con seguimiento)',
      description: 'Incluye Indicaciones de Trabajo, Hitos del Proceso y Evolución del Proceso (requeridos).',
      fields: [
        { key: 'material', label: 'Material asociativo / discurso', rows: 4 },
        { key: 'transference', label: 'Vínculo transferencial', rows: 3 },
        { key: 'tasks', label: 'Indicaciones de trabajo', rows: 3, required: true, hint: 'Encuadre, abstinencia, variaciones técnicas indicadas.' },
        { key: 'rewards', label: 'Hitos del proceso', rows: 3, required: true, hint: 'Indicadores de elaboración o cambio estructural.' },
        { key: 'monitoring', label: 'Evolución del proceso', rows: 3, required: true, hint: 'Lectura clínica longitudinal (RF-S, OQ-45, indicadores).' },
      ],
    },
  ],
  systemic: [
    FREE,
    {
      id: 'sys_session',
      name: 'Sesión sistémica',
      description: 'Hipótesis, intervención y reencuadre relacional.',
      fields: [
        { key: 'present', label: 'Asistentes y miembros presentes', rows: 2 },
        { key: 'hypothesis', label: 'Hipótesis sistémica', rows: 3 },
        { key: 'interaction', label: 'Patrón interaccional observado', rows: 3 },
        { key: 'intervention', label: 'Intervención / reencuadre', rows: 3 },
        { key: 'task', label: 'Tarea / prescripción', rows: 3 },
      ],
    },
    {
      id: 'sys_full',
      name: 'Sesión completa (con seguimiento)',
      description: 'Incluye Prescripciones y Rituales, Cambios del Sistema y Cambio Relacional (requeridos).',
      fields: [
        { key: 'present', label: 'Asistentes y miembros presentes', rows: 2 },
        { key: 'hypothesis', label: 'Hipótesis sistémica', rows: 3 },
        { key: 'tasks', label: 'Prescripciones y rituales', rows: 3, required: true, hint: 'Tareas, rituales o prescripciones invariables asignadas al sistema.' },
        { key: 'rewards', label: 'Cambios del sistema', rows: 3, required: true, hint: 'Reorganizaciones o cambios no lineales observados.' },
        { key: 'monitoring', label: 'Cambio relacional', rows: 3, required: true, hint: 'FACES-IV, SCORE-15 u observación cualitativa.' },
      ],
    },
  ],
  humanistic: [
    FREE,
    {
      id: 'hum_session',
      name: 'Sesión humanística',
      description: 'Foco vivencial, presencia y experiencia significativa.',
      fields: [
        { key: 'focus', label: 'Foco vivencial / tema emergente', rows: 3 },
        { key: 'experience', label: 'Experiencia significativa en sesión', rows: 4 },
        { key: 'presence', label: 'Presencia del terapeuta / vínculo', rows: 3 },
        { key: 'meaning', label: 'Sentido construido por el consultante', rows: 3 },
      ],
    },
    {
      id: 'hum_full',
      name: 'Sesión completa (con seguimiento)',
      description: 'Incluye Invitaciones de Exploración, Celebración del Crecimiento y Proceso de Crecimiento (requeridos).',
      fields: [
        { key: 'focus', label: 'Foco vivencial / tema emergente', rows: 3 },
        { key: 'experience', label: 'Experiencia significativa en sesión', rows: 4 },
        { key: 'tasks', label: 'Invitaciones de exploración', rows: 3, required: true, hint: 'Experimentos o aperturas propuestas al consultante.' },
        { key: 'rewards', label: 'Celebración del crecimiento', rows: 3, required: true, hint: 'Lo que ya existe y merece ser nombrado.' },
        { key: 'monitoring', label: 'Proceso de crecimiento', rows: 3, required: true, hint: 'Ryff, SWLS, PIL u observación cualitativa.' },
      ],
    },
  ],
  behavioral: [
    FREE,
    {
      id: 'beh_abc',
      name: 'ABC funcional',
      description: 'Antecedente · Conducta · Consecuencia con reforzadores.',
      fields: [
        { key: 'a', label: 'A · Antecedente', rows: 3 },
        { key: 'b', label: 'B · Conducta objetivo', rows: 3 },
        { key: 'c', label: 'C · Consecuencia / reforzador', rows: 3 },
        { key: 'plan', label: 'Plan de modificación', rows: 4 },
        { key: 'task', label: 'Tarea entre sesiones', rows: 3 },
      ],
    },
    {
      id: 'beh_full',
      name: 'Sesión completa (con seguimiento)',
      description: 'Incluye Tareas Conductuales, Reforzadores de Logro y Datos de Intervención (requeridos).',
      fields: [
        { key: 'analysis', label: 'Análisis funcional', rows: 4 },
        { key: 'tasks', label: 'Tareas conductuales', rows: 3, required: true, hint: 'Exposición, activación, contrato o autoregistro.' },
        { key: 'rewards', label: 'Reforzadores de logro', rows: 3, required: true, hint: 'DRI/DRA, FCT, autoeficacia observada.' },
        { key: 'monitoring', label: 'Datos de intervención', rows: 3, required: true, hint: 'Línea de base, A-B-A-B, CBCL, BRIEF.' },
      ],
    },
  ],
};

export function getTemplatesForSchool(school: SchoolType): NoteTemplate[] {
  return SESSION_NOTE_TEMPLATES[school] ?? [FREE];
}

const TEMPLATE_MARKER_RE = /^<!--\s*template:\s*([a-z0-9_-]+)\s*-->/i;

export function parseStoredNote(content: string | null | undefined): {
  templateId: string;
  values: Record<string, string>;
  raw: string;
} {
  if (!content) return { templateId: 'free', values: { notes: '' }, raw: '' };
  const trimmed = content.trimStart();
  const m = trimmed.match(TEMPLATE_MARKER_RE);
  if (!m) return { templateId: 'free', values: { notes: content }, raw: content };
  const templateId = m[1];
  const body = trimmed.slice(m[0].length).trimStart();
  const values: Record<string, string> = {};
  // Split by "## key — label" headings; we store keys to be robust.
  const parts = body.split(/^##\s+\[([a-z0-9_]+)\][^\n]*\n/im);
  // parts: [pre, key1, content1, key2, content2, ...]
  for (let i = 1; i < parts.length; i += 2) {
    const key = parts[i];
    const val = (parts[i + 1] || '').trim();
    values[key] = val;
  }
  if (Object.keys(values).length === 0) {
    values.notes = body;
  }
  return { templateId, values, raw: content };
}

export function serializeNote(templateId: string, template: NoteTemplate, values: Record<string, string>): string {
  const header = `<!-- template: ${templateId} -->\n`;
  if (templateId === 'free') {
    return header + (values.notes || '').trim();
  }
  const body = template.fields
    .map((f) => `## [${f.key}] ${f.label}\n${(values[f.key] || '').trim()}`)
    .join('\n\n');
  return header + body;
}

export function plainTextFromNote(templateId: string, template: NoteTemplate, values: Record<string, string>): string {
  if (templateId === 'free') return (values.notes || '').trim();
  return template.fields
    .map((f) => {
      const v = (values[f.key] || '').trim();
      if (!v) return null;
      return `${f.label.toUpperCase()}\n${v}`;
    })
    .filter(Boolean)
    .join('\n\n');
}