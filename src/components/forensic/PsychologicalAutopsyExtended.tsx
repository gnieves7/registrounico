/**
 * Vista extendida para la sección "Autopsia Psicológica" (11) del módulo Acompañar.
 * Renderiza descripción general, marco teórico, referentes, investigaciones,
 * instrumentos, bibliografía y consideraciones ético-deontológicas.
 */
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Brain,
  BookOpen,
  Microscope,
  Wrench,
  AlertTriangle,
  Scale,
  FileText,
  Users,
  ShieldAlert,
  Download,
} from 'lucide-react';
import {
  AP_OVERVIEW,
  AP_THEORY,
  AP_REFERENTS,
  AP_RESEARCH,
  AP_INSTRUMENTS,
  AP_BIBLIOGRAPHY,
  AP_ETHICS,
} from '@/data/psychologicalAutopsyContent';
import { useAuth } from '@/hooks/useAuth';
import { downloadPsychologicalAutopsyPdf } from '@/lib/pdf/psychologicalAutopsyPdf';
import { toast } from 'sonner';

const ACCENT = '348 60% 32%';

interface PsychologicalAutopsyExtendedProps {
  viewMode?: 'patient' | 'professional';
}

export const PsychologicalAutopsyExtended = ({
  viewMode = 'professional',
}: PsychologicalAutopsyExtendedProps) => {
  const isPatientView = viewMode === 'patient';
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [license, setLicense] = useState('');
  const [role, setRole] = useState('Perito de parte');
  const [accepted, setAccepted] = useState(false);

  const openDialog = () => {
    setFullName(profile?.full_name ?? '');
    setAccepted(false);
    setOpen(true);
  };

  const confirmDownload = () => {
    if (!fullName.trim() || !license.trim() || !accepted) {
      toast.error('Completá nombre, matrícula y aceptación de uso orientativo');
      return;
    }
    try {
      downloadPsychologicalAutopsyPdf({
        professionalName: fullName.trim(),
        professionalLicense: license.trim(),
        professionalRole: role.trim() || null,
        professionalCollege: 'Colegio de Psicólogos de la Provincia de Santa Fe',
      });
      toast.success('Compendio de Autopsia Psicológica descargado');
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error('No se pudo generar el PDF');
    }
  };

  return (
    <div className="space-y-5" role="region" aria-label="Sección Autopsia Psicológica">
      {/* Acción principal: descarga del compendio (solo profesionales) */}
      {!isPatientView && (
      <Card className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">Compendio académico-pericial completo</p>
          <p className="text-xs text-muted-foreground">
            Descargá el contenido íntegro de la sección en PDF, con tu identidad
            profesional y pie de página con aviso ético orientativo.
          </p>
        </div>
        <Button
          onClick={openDialog}
          className="gap-1.5"
          aria-label="Descargar compendio de Autopsia Psicológica en PDF"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Descargar compendio en PDF
        </Button>
      </Card>
      )}

      {/* Aviso epistemológico */}
      <Card
        role="note"
        aria-label="Aviso epistemológico"
        className="flex items-start gap-3 border-amber-500/40 bg-amber-500/5 p-4 text-sm"
      >
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
          aria-hidden="true"
        />
        <p className="text-amber-900 dark:text-amber-200">
          <strong>Distinción crítica:</strong> la Autopsia Psicológica aporta
          indicadores <em>probabilístico-orientativos</em> sobre el estado
          mental del fallecido. No determina la modalidad legal de muerte
          (NASH); esa atribución corresponde al órgano judicial (CPP Santa Fe
          — Ley 12.734).
        </p>
      </Card>

      {/* 1. Descripción general */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold md:text-lg">
          <FileText className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          1. Descripción general
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {AP_OVERVIEW.definition}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-border p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Objetivos del procedimiento
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {AP_OVERVIEW.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contextos de aplicación
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {AP_OVERVIEW.contexts.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-border p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Modalidades de AP
          </p>
          <ul className="space-y-2 text-sm">
            {AP_OVERVIEW.modalities.map((m) => (
              <li key={m.name}>
                <strong>{m.name}.</strong>{' '}
                <span className="text-muted-foreground">{m.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-md border border-border p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rol del psicólogo forense
            </p>
            <p className="text-sm leading-relaxed">{AP_OVERVIEW.role}</p>
          </div>
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Estatus epistemológico y limitaciones
            </p>
            <p className="text-sm leading-relaxed">{AP_OVERVIEW.epistemic}</p>
          </div>
        </div>
      </Card>

      {/* 2. Marco teórico */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Brain className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          2. Marco teórico
        </h3>
        <Accordion type="multiple" className="w-full">
          {AP_THEORY.map((axis) => (
            <AccordionItem key={axis.key} value={axis.key}>
              <AccordionTrigger className="text-left text-sm md:text-base">
                {axis.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>{axis.body}</p>
                {axis.bullets && (
                  <ul className="ml-4 list-disc space-y-1.5">
                    {axis.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Bloques 3–6: técnicos, exclusivos del profesional */}
      {!isPatientView && (
      <>
      {/* 3. Referentes */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Users className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          3. Exponentes y referentes
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Fundadores históricos', items: AP_REFERENTS.founders },
            { label: 'Referentes contemporáneos internacionales', items: AP_REFERENTS.international },
            { label: 'Referentes latinoamericanos', items: AP_REFERENTS.latam },
          ].map((group) => (
            <div key={group.label} className="rounded-md border border-border p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-2 text-sm">
                {group.items.map((a) => (
                  <li key={a.name}>
                    <strong>{a.name}.</strong>{' '}
                    <span className="text-muted-foreground">{a.contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. Investigaciones */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Microscope className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          4. Investigaciones relevantes
        </h3>
        <div className="space-y-3">
          {AP_RESEARCH.map((r, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card/40 p-3 md:p-4">
              <Badge variant="outline" className="mb-2 text-[10px]">
                {r.year}
              </Badge>
              <p className="text-sm font-semibold">{r.title}</p>
              <p className="text-xs italic text-muted-foreground md:text-sm">
                {r.authors} ({r.year}). {r.source}
              </p>
              <p className="mt-2 text-sm">
                <strong className="text-foreground">→ Método:</strong>{' '}
                <span className="text-muted-foreground">{r.method}</span>
              </p>
              <p className="mt-1 text-sm">
                <strong className="text-foreground">→ Relevancia forense:</strong>{' '}
                <span className="text-muted-foreground">{r.forensic}</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Instrumentos */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Wrench className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          5. Instrumentos, cuestionarios y planillas
        </h3>
        <Accordion type="multiple" className="w-full">
          {AP_INSTRUMENTS.map((ins, i) => (
            <AccordionItem key={i} value={`ins-${i}`}>
              <AccordionTrigger className="text-left text-sm md:text-base">
                {ins.name}
              </AccordionTrigger>
              <AccordionContent className="space-y-2 text-sm">
                <p><strong>Autores / año:</strong> <span className="text-muted-foreground">{ins.authors}</span></p>
                <p><strong>Propósito:</strong> <span className="text-muted-foreground">{ins.purpose}</span></p>
                <p><strong>Estructura:</strong> <span className="text-muted-foreground">{ins.structure}</span></p>
                <p><strong>Validación / normas:</strong> <span className="text-muted-foreground">{ins.validation}</span></p>
                <p><strong>Accesibilidad:</strong> <span className="text-muted-foreground">{ins.access}</span></p>
                <p><strong>Pertinencia forense:</strong> <span className="text-muted-foreground">{ins.forensic}</span></p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* 6. Bibliografía */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <BookOpen className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          6. Bibliografía y recursos recomendados
        </h3>

        <div className="space-y-4">
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              6.1 Libros fundamentales
            </p>
            <ul className="space-y-2 text-sm">
              {AP_BIBLIOGRAPHY.books.map((b, i) => (
                <li key={i}>
                  <p className="text-sm">{b.ref}</p>
                  <p className="text-xs italic text-muted-foreground">{b.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              6.2 Artículos de acceso libre
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              {AP_BIBLIOGRAPHY.articles.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>

          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              6.3 Recursos institucionales y normativa
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {AP_BIBLIOGRAPHY.institutions.map((it) => (
                <li key={it.url}>
                  <a
                    href={it.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-2 hover:underline"
                  >
                    {it.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      </>
      )}

      {/* Marco normativo Santa Fe */}
      <Card className="border-l-4 p-4 md:p-5" style={{ borderLeftColor: `hsl(${ACCENT})` }}>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Scale className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Marco normativo argentino aplicable
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <strong>Ley Nacional 27.130</strong> — Prevención del Suicidio.
            Marco de políticas públicas y abordaje interdisciplinario.
          </li>
          <li>
            <strong>Ley Nacional 26.657</strong> — Salud Mental. Marco de
            derechos del paciente psiquiátrico, especialmente relevante en
            muertes en instituciones.
          </li>
          <li>
            <strong>Ley Provincial 12.734 — CPP Santa Fe.</strong> Encuadre
            del peritaje psicológico en el sistema acusatorio provincial.
          </li>
          <li>
            <strong>Resolución MPA 147/2020</strong> — 100 Reglas de Brasilia
            para informantes en condición de vulnerabilidad.
          </li>
        </ul>
      </Card>

      {/* Ética profesional (oculta para pacientes) */}
      {!isPatientView && (
      <Card className="border-l-4 border-l-amber-500 p-4 md:p-5">
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold md:text-lg">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          Consideraciones éticas y deontológicas del perito en AP
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{AP_ETHICS}</p>
      </Card>
      )}

      {!isPatientView && (
      <p className="text-center text-[11px] italic text-muted-foreground">
        <BookOpen className="mr-1 inline h-3 w-3" aria-hidden="true" />
        Referencias bibliográficas adicionales y enlaces verificables disponibles
        en la sección "Documentos y enlaces".
      </p>
      )}

      {!isPatientView && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Datos del profesional firmante</DialogTitle>
            <DialogDescription>
              Estos datos se incorporarán al pie del compendio PDF de Autopsia
              Psicológica. Confirmá la aceptación del uso probabilístico-orientativo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ap-pdf-name">Nombre y apellido</Label>
              <Input
                id="ap-pdf-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lic. Nombre Apellido"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-pdf-license">Matrícula profesional</Label>
              <Input
                id="ap-pdf-license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="Mat. ___ — Colegio de Psicólogos Santa Fe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-pdf-role">Rol pericial</Label>
              <Input
                id="ap-pdf-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Perito de parte / Consultor técnico / Perito oficial"
              />
            </div>
            <label
              htmlFor="ap-pdf-accept"
              className="flex cursor-pointer items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200"
            >
              <Checkbox
                id="ap-pdf-accept"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
                className="mt-0.5"
              />
              <span>
                Declaro conocer que la Autopsia Psicológica rinde indicadores{' '}
                <strong>probabilístico-orientativos</strong> y que la
                determinación de la modalidad legal de muerte (NASH) corresponde
                exclusivamente al órgano jurisdiccional (CPP Santa Fe — Ley 12.734).
              </span>
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDownload}
              disabled={!fullName.trim() || !license.trim() || !accepted}
              className="gap-1.5"
              aria-label="Generar y descargar PDF firmado"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Generar PDF firmado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
};
