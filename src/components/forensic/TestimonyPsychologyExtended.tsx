/**
 * Vista extendida para la sección "Psicología del Testimonio" (10) del módulo Acompañar.
 * Renderiza marco teórico, investigaciones, instrumentos y fichas plantilla.
 */
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Brain,
  BookOpen,
  Microscope,
  Wrench,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Download,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TESTIMONY_THEORY,
  TESTIMONY_RESEARCH,
  CBCA_CRITERIA,
  SVA_VALIDITY_CHECKLIST,
  TESTIMONY_REPORT_TEMPLATE,
  TESTIMONY_INSTRUMENTS,
  FORM_TEMPLATES,
} from '@/data/testimonyPsychologyContent';
import { useAuth } from '@/hooks/useAuth';
import {
  downloadTestimonyTemplate,
  type TestimonyTemplateKind,
} from '@/lib/pdf/testimonyTemplatesPdf';
import { toast } from 'sonner';

const ACCENT = '244 55% 38%';

interface PendingDownload {
  kind: TestimonyTemplateKind;
  label: string;
}

export const TestimonyPsychologyExtended = () => {
  const { profile } = useAuth();
  const [pending, setPending] = useState<PendingDownload | null>(null);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [license, setLicense] = useState('');
  const [role, setRole] = useState('Perito de parte');
  const [accepted, setAccepted] = useState(false);

  const openDownloadDialog = (kind: TestimonyTemplateKind, label: string) => {
    setFullName(profile?.full_name ?? '');
    setAccepted(false);
    setPending({ kind, label });
  };

  const confirmDownload = () => {
    if (!pending) return;
    if (!fullName.trim() || !license.trim() || !accepted) {
      toast.error('Completá nombre, matrícula y aceptación de uso orientativo');
      return;
    }
    try {
      downloadTestimonyTemplate(pending.kind, {
        professionalName: fullName.trim(),
        professionalLicense: license.trim(),
        professionalRole: role.trim() || null,
        professionalCollege: 'Colegio de Psicólogos de la Provincia de Santa Fe',
      });
      toast.success(`${pending.label} descargada`);
      setPending(null);
    } catch (e) {
      console.error(e);
      toast.error('No se pudo generar el PDF');
    }
  };

  return (
    <div className="space-y-5">
      {/* Aviso epistemológico */}
      <Card className="flex items-start gap-3 border-amber-500/40 bg-amber-500/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-900 dark:text-amber-200">
          <strong>Distinción crítica:</strong> el psicólogo evalúa indicadores
          de credibilidad con valor <em>probabilístico-orientativo</em>, nunca
          diagnóstico absoluto. La determinación de la verdad procesal
          corresponde exclusivamente al órgano judicial (CPP Santa Fe — Ley
          12.734).
        </p>
      </Card>

      {/* [2] Marco teórico */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Brain className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Marco teórico
        </h3>
        <Accordion type="multiple" className="w-full">
          {TESTIMONY_THEORY.map((axis) => (
            <AccordionItem key={axis.key} value={axis.key}>
              <AccordionTrigger className="text-left text-sm md:text-base">
                {axis.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>{axis.body}</p>
                {axis.bullets && (
                  <ul className="ml-4 list-disc space-y-1.5">
                    {axis.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* [4] Investigaciones relevantes */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Microscope className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Investigaciones relevantes (últimos 15 años)
        </h3>
        <div className="space-y-3">
          {TESTIMONY_RESEARCH.map((r, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card/40 p-3 md:p-4"
            >
              <Badge variant="outline" className="mb-2 text-[10px]">
                {r.axis}
              </Badge>
              <p className="text-xs italic text-muted-foreground md:text-sm">
                {r.citation}
              </p>
              <p className="mt-2 text-sm">
                <strong className="text-foreground">→ Hallazgo:</strong>{' '}
                <span className="text-muted-foreground">{r.finding}</span>
              </p>
              <p className="mt-1 text-sm">
                <strong className="text-foreground">→ Implicancia forense:</strong>{' '}
                <span className="text-muted-foreground">
                  {r.forensicImplication}
                </span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* [5] Instrumentos validados */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Wrench className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Instrumentos validados
        </h3>

        {/* SVA */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold md:text-base">
            A) {TESTIMONY_INSTRUMENTS.sva.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {TESTIMONY_INSTRUMENTS.sva.purpose}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Componentes
              </p>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                {TESTIMONY_INSTRUMENTS.sva.components.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Fundamento teórico
              </p>
              <p className="text-sm">{TESTIMONY_INSTRUMENTS.sva.foundation}</p>
            </div>
          </div>

          <div className="rounded-md border border-border p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Procedimiento de aplicación
            </p>
            <ol className="space-y-1 text-sm">
              {TESTIMONY_INSTRUMENTS.sva.procedure.map((step, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* CBCA criteria table */}
          <div className="rounded-md border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Criterios CBCA (19 criterios en 5 categorías)
            </p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-xs">#</TableHead>
                    <TableHead className="text-xs">Criterio</TableHead>
                    <TableHead className="text-xs">Categoría</TableHead>
                    <TableHead className="text-xs">Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CBCA_CRITERIA.map((c) => (
                    <TableRow key={c.number}>
                      <TableCell className="text-xs font-semibold">{c.number}</TableCell>
                      <TableCell className="text-xs font-medium">{c.name}</TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">
                        {c.category}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {c.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Limitaciones
              </p>
              <p className="text-xs text-muted-foreground md:text-sm">
                {TESTIMONY_INSTRUMENTS.sva.limitations}
              </p>
            </div>
            <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                Validez en contexto judicial argentino
              </p>
              <p className="text-xs text-muted-foreground md:text-sm">
                {TESTIMONY_INSTRUMENTS.sva.argentineValidity}
              </p>
            </div>
          </div>
        </div>

        {/* GSS */}
        <div className="space-y-3 border-t pt-5">
          <h4 className="text-sm font-semibold md:text-base">
            B) {TESTIMONY_INSTRUMENTS.gss.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {TESTIMONY_INSTRUMENTS.gss.purpose}
          </p>

          <div className="rounded-md border border-border p-3">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Subescalas
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {TESTIMONY_INSTRUMENTS.gss.subscales.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Interpretación clínico-forense
              </p>
              <p className="text-sm">{TESTIMONY_INSTRUMENTS.gss.interpretation}</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Baremos disponibles en español
              </p>
              <p className="text-sm">{TESTIMONY_INSTRUMENTS.gss.spanishNorms}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Marco normativo Santa Fe */}
      <Card className="border-l-4 p-4 md:p-5" style={{ borderLeftColor: `hsl(${ACCENT})` }}>
        <h3 className="mb-3 flex items-center gap-2 text-base font-semibold md:text-lg">
          <Scale className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Marco normativo procesal — Provincia de Santa Fe
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="https://www.santafe.gov.ar/normativa/getFile.php?id=219070&item=109564&cod=2c1c4afc8b8f9bcf1c8b9ad5cf6a86b1"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Ley provincial 12.734 — Código Procesal Penal de Santa Fe
            </a>
            <p className="text-xs text-muted-foreground">
              Encuadre del peritaje psicológico, prueba pericial y resguardos
              para testigos vulnerables.
            </p>
          </li>
          <li>
            <a
              href="https://www.santafe.gob.ar/normativa/item.php?id=109563&cod=cffd80a3a4d2b5a55fb12e0d47c8a58a"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Código Procesal Civil y Comercial (CPCC) Santa Fe
            </a>
            <p className="text-xs text-muted-foreground">
              Régimen pericial en fueros civil, familia y laboral.
            </p>
          </li>
          <li>
            <a
              href="https://www.mpa.santafe.gov.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Resolución MPA 147/2020 — 100 Reglas de Brasilia (víctimas vulnerables)
            </a>
            <p className="text-xs text-muted-foreground">
              Estándares reforzados para entrevistas a NNyA, personas con
              discapacidad y víctimas de violencia de género.
            </p>
          </li>
        </ul>
      </Card>

      {/* [6] Plantillas de fichas */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <ClipboardList className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Planillas y fichas profesionales
        </h3>

        <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Las plantillas son <strong>instrumentos de registro orientativos</strong>;
            los resultados deben interpretarse en clave probabilística y nunca
            sustituyen la valoración judicial.
          </p>
        </div>

        <Accordion type="multiple" className="w-full">
          {/* Ficha CBCA */}
          <AccordionItem value="cbca-form">
            <AccordionTrigger className="text-left text-sm md:text-base">
              a) {FORM_TEMPLATES.cbcaForm.title}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {FORM_TEMPLATES.cbcaForm.description}
              </p>
              <Button
                size="sm"
                onClick={() => openDownloadDialog('cbca', 'Ficha CBCA')}
                className="gap-1.5"
                aria-label="Descargar Ficha CBCA en formato PDF"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar ficha en PDF
              </Button>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {FORM_TEMPLATES.cbcaForm.columns.map((col) => (
                        <TableHead key={col} className="text-xs">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {CBCA_CRITERIA.slice(0, 3).map((c) => (
                      <TableRow key={c.number}>
                        <TableCell className="text-xs font-semibold">{c.number}</TableCell>
                        <TableCell className="text-xs">{c.name}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {c.category}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          [Sí / No / Parcial]
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">[1-3]</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          [observación]
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          [línea/min]
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-[11px] italic text-muted-foreground">
                        … (continúa con los 19 criterios completos)
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Checklist de Validez */}
          <AccordionItem value="validity-checklist">
            <AccordionTrigger className="text-left text-sm md:text-base">
              b) {FORM_TEMPLATES.validityChecklist.title}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {FORM_TEMPLATES.validityChecklist.description}
              </p>
              <Button
                size="sm"
                onClick={() => openDownloadDialog('validity', 'Checklist SVA')}
                className="gap-1.5"
                aria-label="Descargar Checklist de Validez SVA en formato PDF"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar checklist en PDF
              </Button>
              <div className="space-y-3">
                {SVA_VALIDITY_CHECKLIST.map((block) => (
                  <div key={block.section} className="rounded-md border border-border p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {block.section}
                    </p>
                    <ul className="space-y-1.5 text-sm">
                      {block.items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded border border-border" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Informe síntesis */}
          <AccordionItem value="report-synthesis">
            <AccordionTrigger className="text-left text-sm md:text-base">
              c) {FORM_TEMPLATES.reportSynthesis.title}
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {FORM_TEMPLATES.reportSynthesis.description}
              </p>
              <Button
                size="sm"
                onClick={() => openDownloadDialog('report', 'Informe-síntesis')}
                className="gap-1.5"
                aria-label="Descargar plantilla de Informe-síntesis en formato PDF"
              >
                <Download className="h-3.5 w-3.5" />
                Descargar plantilla de informe en PDF
              </Button>
              <ol className="space-y-2">
                {TESTIMONY_REPORT_TEMPLATE.map((s, i) => (
                  <li
                    key={i}
                    className="rounded-md border border-border bg-card/40 p-3"
                  >
                    <p className="text-sm font-semibold">{s.section}</p>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      {s.content}
                    </p>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      {/* Aviso epistemológico repetido al final */}
      <Card className="flex items-start gap-3 border-amber-500/40 bg-amber-500/5 p-4 text-xs md:text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-900 dark:text-amber-200">
          <strong>Recordatorio ético:</strong> SVA, CBCA y GSS rinden indicadores
          probabilístico-orientativos. No corresponden al psicólogo
          pronunciamientos sobre verdad/falsedad de los hechos investigados;
          esa función es exclusivamente jurisdiccional (CPP Santa Fe — Ley
          12.734; Código de Ética FePRA).
        </p>
      </Card>

      <p className="text-center text-[11px] italic text-muted-foreground">
        <BookOpen className="mr-1 inline h-3 w-3" />
        Referencias bibliográficas detalladas disponibles en la sección
        "Documentos y enlaces".
      </p>

      <Dialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Datos del profesional firmante</DialogTitle>
            <DialogDescription>
              Estos datos se incorporarán al pie del PDF de{' '}
              <strong>{pending?.label}</strong>. Confirmá la aceptación del uso
              probabilístico-orientativo del instrumento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="pdf-name">Nombre y apellido</Label>
              <Input
                id="pdf-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Lic. Nombre Apellido"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pdf-license">Matrícula profesional</Label>
              <Input
                id="pdf-license"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="Mat. ___ — Colegio de Psicólogos Santa Fe"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pdf-role">Rol pericial</Label>
              <Input
                id="pdf-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Perito de parte / Consultor técnico / Perito oficial"
              />
            </div>
            <label
              htmlFor="pdf-accept"
              className="flex cursor-pointer items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200"
            >
              <Checkbox
                id="pdf-accept"
                checked={accepted}
                onCheckedChange={(v) => setAccepted(v === true)}
                className="mt-0.5"
              />
              <span>
                Declaro conocer que SVA/CBCA/GSS rinden indicadores{' '}
                <strong>probabilístico-orientativos</strong> y que la
                determinación de verdad/falsedad corresponde exclusivamente al
                órgano jurisdiccional (CPP Santa Fe — Ley 12.734).
              </span>
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPending(null)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmDownload}
              disabled={!fullName.trim() || !license.trim() || !accepted}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              Generar PDF firmado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};