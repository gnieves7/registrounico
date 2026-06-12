import { describe, it, expect } from 'vitest';
import {
  SESSION_NOTE_TEMPLATES,
  FULL_TEMPLATE_BY_SCHOOL,
  equivalentTemplateInSchool,
  getMissingRequiredFields,
  parseStoredNote,
  serializeNote,
  plainTextFromNote,
  getTemplatesForSchool,
} from './sessionNoteTemplates';
import type { SchoolType } from '@/config/schools';

const SCHOOLS: SchoolType[] = [
  'cognitive_behavioral',
  'psychoanalytic',
  'systemic',
  'humanistic',
  'behavioral',
];

const fullTemplate = (school: SchoolType) => {
  const id = FULL_TEMPLATE_BY_SCHOOL[school];
  const tpl = getTemplatesForSchool(school).find((t) => t.id === id);
  if (!tpl) throw new Error(`Missing full template for ${school}`);
  return tpl;
};

describe('sessionNoteTemplates', () => {
  describe('required fields per school (Indicaciones/Hitos/Evolución)', () => {
    it.each(SCHOOLS)('school %s exposes tasks/rewards/monitoring as required', (school) => {
      const tpl = fullTemplate(school);
      const required = tpl.fields.filter((f) => f.required).map((f) => f.key).sort();
      expect(required).toEqual(['monitoring', 'rewards', 'tasks']);
    });

    it.each(SCHOOLS)('school %s blocks save when required fields are empty', (school) => {
      const tpl = fullTemplate(school);
      const missing = getMissingRequiredFields(tpl, {});
      expect(missing.map((m) => m.key).sort()).toEqual(['monitoring', 'rewards', 'tasks']);
    });

    it.each(SCHOOLS)('school %s blocks save when required fields are whitespace only', (school) => {
      const tpl = fullTemplate(school);
      const missing = getMissingRequiredFields(tpl, {
        tasks: '   ',
        rewards: '\n\t',
        monitoring: '',
      });
      expect(missing).toHaveLength(3);
    });

    it.each(SCHOOLS)('school %s allows save when all required fields are filled', (school) => {
      const tpl = fullTemplate(school);
      const missing = getMissingRequiredFields(tpl, {
        tasks: 'Indicación de trabajo',
        rewards: 'Hito alcanzado',
        monitoring: 'PHQ-9 = 6',
      });
      expect(missing).toHaveLength(0);
    });

    it('reports only the missing required fields', () => {
      const tpl = fullTemplate('humanistic');
      const missing = getMissingRequiredFields(tpl, { tasks: 'ok', rewards: '   ', monitoring: 'ok' });
      expect(missing.map((m) => m.key)).toEqual(['rewards']);
    });
  });

  describe('equivalentTemplateInSchool', () => {
    it('keeps "free" across schools', () => {
      for (const s of SCHOOLS) expect(equivalentTemplateInSchool('free', s)).toBe('free');
    });

    it('maps any *_full template to the new school *_full', () => {
      for (const from of SCHOOLS) {
        for (const to of SCHOOLS) {
          expect(equivalentTemplateInSchool(FULL_TEMPLATE_BY_SCHOOL[from], to)).toBe(
            FULL_TEMPLATE_BY_SCHOOL[to],
          );
        }
      }
    });

    it('falls back to the first template id when the current one does not exist in the new school', () => {
      const next = equivalentTemplateInSchool('cbt_phq', 'systemic');
      const first = getTemplatesForSchool('systemic')[0].id;
      expect(next).toBe(first);
    });
  });

  describe('school marker is persisted per session', () => {
    it('round-trips schoolId via serializeNote / parseStoredNote', () => {
      const tpl = fullTemplate('systemic');
      const values = { tasks: 'Ritual', rewards: 'Cambio', monitoring: 'FACES-IV' };
      const raw = serializeNote(tpl.id, tpl, values, 'systemic');
      const parsed = parseStoredNote(raw);
      expect(parsed.schoolId).toBe('systemic');
      expect(parsed.templateId).toBe(tpl.id);
      expect(parsed.values.tasks).toBe('Ritual');
      expect(parsed.values.rewards).toBe('Cambio');
      expect(parsed.values.monitoring).toBe('FACES-IV');
    });

    it('returns schoolId=null when no marker is present (legacy notes)', () => {
      const parsed = parseStoredNote('<!-- template: cbt_full -->\n## [tasks] X\nA');
      expect(parsed.schoolId).toBeNull();
      expect(parsed.templateId).toBe('cbt_full');
    });

    it('migrates labels when reopened in a different school without losing values', () => {
      // Saved under CBT
      const cbt = fullTemplate('cognitive_behavioral');
      const values = { focus: 'Foco', intervention: 'Activación', tasks: 'T', rewards: 'R', monitoring: 'M' };
      const raw = serializeNote(cbt.id, cbt, values, 'cognitive_behavioral');
      const parsed = parseStoredNote(raw);

      // Pretend the user switches to Systemic
      const nextId = equivalentTemplateInSchool(parsed.templateId, 'systemic');
      const nextTpl = fullTemplate('systemic');
      expect(nextId).toBe(nextTpl.id);

      // Same keys, new labels: content is preserved.
      expect(parsed.values.tasks).toBe('T');
      expect(parsed.values.rewards).toBe('R');
      expect(parsed.values.monitoring).toBe('M');

      const tasksLabel = nextTpl.fields.find((f) => f.key === 'tasks')?.label;
      const rewardsLabel = nextTpl.fields.find((f) => f.key === 'rewards')?.label;
      const monitoringLabel = nextTpl.fields.find((f) => f.key === 'monitoring')?.label;
      expect(tasksLabel).toMatch(/Prescripciones/i);
      expect(rewardsLabel).toMatch(/Cambios del sistema/i);
      expect(monitoringLabel).toMatch(/Cambio relacional/i);
    });
  });

  describe('plainTextFromNote uses the active school labels (for PDF export)', () => {
    it('exports systemic labels when the systemic *_full template is used', () => {
      const tpl = fullTemplate('systemic');
      const body = plainTextFromNote(tpl.id, tpl, {
        tasks: 'Ritual nocturno',
        rewards: 'Reorganización',
        monitoring: 'FACES-IV mejora',
      });
      expect(body).toMatch(/PRESCRIPCIONES Y RITUALES/);
      expect(body).toMatch(/CAMBIOS DEL SISTEMA/);
      expect(body).toMatch(/CAMBIO RELACIONAL/);
      expect(body).toMatch(/Ritual nocturno/);
    });

    it('exports humanistic labels when the humanistic *_full template is used', () => {
      const tpl = fullTemplate('humanistic');
      const body = plainTextFromNote(tpl.id, tpl, {
        tasks: 'Explorar el silencio',
        rewards: 'Reconocer logro',
        monitoring: 'Ryff +',
      });
      expect(body).toMatch(/INVITACIONES DE EXPLORACIÓN/);
      expect(body).toMatch(/CELEBRACIÓN DEL CRECIMIENTO/);
      expect(body).toMatch(/PROCESO DE CRECIMIENTO/);
    });
  });

  it('every school defines a "_full" template registered in FULL_TEMPLATE_BY_SCHOOL', () => {
    for (const s of SCHOOLS) {
      const id = FULL_TEMPLATE_BY_SCHOOL[s];
      expect(SESSION_NOTE_TEMPLATES[s].some((t) => t.id === id)).toBe(true);
    }
  });
});