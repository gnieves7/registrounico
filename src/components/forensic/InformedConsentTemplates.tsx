import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Info, Pencil } from "lucide-react";

const TEMPLATES = [
  {
    id: "ci-08",
    title: "CI-08 · Consentimiento Informado — Pericia Civil",
    description:
      "Modelo base para evaluaciones psicológicas en fuero civil (daños y perjuicios, familia, capacidad, etc.).",
    file: "/templates/CI-08_Pericia_Civil.docx",
    filename: "CI-08_Pericia_Civil.docx",
  },
  {
    id: "ci-09",
    title: "CI-09 · Consentimiento Informado — Pericia Penal",
    description:
      "Modelo base para evaluaciones psicológicas en fuero penal (víctima, imputado, testigos, etc.).",
    file: "/templates/CI-09_Pericia_Penal.docx",
    filename: "CI-09_Pericia_Penal.docx",
  },
] as const;

export function InformedConsentTemplates() {
  return (
    <Card className="p-4 md:p-5 space-y-4 border-primary/20">
      <div className="flex items-start gap-2.5">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold md:text-base">
            Modelos descargables de Consentimiento Informado
          </h3>
          <p className="text-xs text-muted-foreground md:text-sm">
            Plantillas profesionales en formato Word, listas para personalizar.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-300/60 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30 p-3">
        <div className="flex items-start gap-2 text-xs md:text-sm text-amber-900 dark:text-amber-200">
          <Pencil className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>Importante:</strong> Estos documentos son <em>modelos editables</em> de
            referencia. Cada profesional debe adaptarlos a sus datos personales y matrícula,
            su criterio clínico-pericial y los honorarios acordados conforme al arancel
            ético vigente del Colegio de Psicólogos correspondiente.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {TEMPLATES.map((tpl) => (
          <li
            key={tpl.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card/50 p-3 md:flex-row md:items-center md:justify-between md:gap-4 md:p-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium md:text-base">{tpl.title}</p>
                <Badge variant="outline" className="text-[10px]">
                  DOCX · Editable
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">{tpl.description}</p>
            </div>
            <Button asChild size="sm" className="shrink-0">
              <a href={tpl.file} download={tpl.filename}>
                <Download className="mr-1.5 h-4 w-4" />
                Descargar
              </a>
            </Button>
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground md:text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p>
          Conforme al Código de Ética del Psicodiagnosticador (Art. 1º, 2º, 3º, 6º, 8º, 9º, 10º)
          y a las Pautas Internacionales para el Uso de los Tests (versión Adeip).
        </p>
      </div>
    </Card>
  );
}
