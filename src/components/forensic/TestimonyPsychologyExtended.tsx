/**
 * Vista extendida para la sección "Psicología del Testimonio" (10) del módulo Acompañar.
 * Renderiza marco teórico, investigaciones, instrumentos y fichas plantilla.
 */
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import {
  TESTIMONY_THEORY,
  TESTIMONY_RESEARCH,
  CBCA_CRITERIA,
  SVA_VALIDITY_CHECKLIST,
  TESTIMONY_REPORT_TEMPLATE,
  TESTIMONY_INSTRUMENTS,
  FORM_TEMPLATES,
} from '@/data/testimonyPsychologyContent';

const ACCENT = '244 55% 38%';

export const TestimonyPsychologyExtended = () => {
  return (
    <div className="space-y-5">
      {/* Aviso epistemológico */}
      <Card className="flex items-start gap-3 border-amber-500/40 bg-amber-500/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-amber-900 dark:text-amber-200">
          <strong>Distinción crítica:</strong> el psicólogo evalúa indicadores
          de credibilidad con valor <em>probabilístico-orientativo</em>, nunca
          diagnóstico absoluto. La determinación de la verdad procesal
          corresponde exclusivamente al órgano judicial.
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

      {/* [6] Plantillas de fichas */}
      <Card className="p-4 md:p-5">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold md:text-lg">
          <ClipboardList className="h-5 w-5" style={{ color: `hsl(${ACCENT})` }} />
          Planillas y fichas profesionales
        </h3>

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

      <p className="text-center text-[11px] italic text-muted-foreground">
        <BookOpen className="mr-1 inline h-3 w-3" />
        Referencias bibliográficas detalladas disponibles en la sección
        "Documentos y enlaces".
      </p>
    </div>
  );
};