import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Info, Pencil, FileSignature } from "lucide-react";
import { CONSENT_MODELS, type ConsentModelMeta } from "@/lib/consentTemplates";
import { ConsentDetailDrawer } from "./ConsentDetailDrawer";
import { ConsentSignatureDialog } from "./ConsentSignatureDialog";

/** Compat: forma simple usada en código previo. */
export type ConsentTemplate = {
  id: string;
  title: string;
  description: string;
  file: string;
  filename: string;
};

const DEFAULT_TEMPLATES: ConsentTemplate[] = [
  {
    id: "ci-08",
    title: CONSENT_MODELS["ci-08"].title,
    description: CONSENT_MODELS["ci-08"].description,
    file: CONSENT_MODELS["ci-08"].file,
    filename: CONSENT_MODELS["ci-08"].filename,
  },
  {
    id: "ci-09",
    title: CONSENT_MODELS["ci-09"].title,
    description: CONSENT_MODELS["ci-09"].description,
    file: CONSENT_MODELS["ci-09"].file,
    filename: CONSENT_MODELS["ci-09"].filename,
  },
];

interface InformedConsentTemplatesProps {
  templates?: ConsentTemplate[];
  heading?: string;
  subheading?: string;
}

export function InformedConsentTemplates({
  templates = DEFAULT_TEMPLATES,
  heading = "Modelos descargables de Consentimiento Informado",
  subheading = "Plantillas profesionales en formato Word, listas para personalizar.",
}: InformedConsentTemplatesProps = {}) {
  const [activeModel, setActiveModel] = useState<ConsentModelMeta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Resolver cada template a su metadata extendida (si existe en el catálogo)
  const enriched = useMemo(
    () =>
      templates.map((t) => ({
        template: t,
        meta: (CONSENT_MODELS as Record<string, ConsentModelMeta>)[t.id] ?? null,
      })),
    [templates],
  );

  const openSignDialog = (meta: ConsentModelMeta) => {
    setActiveModel(meta);
    setDialogOpen(true);
  };

  return (
    <Card className="p-4 md:p-5 space-y-4 border-primary/20">
      <div className="flex items-start gap-2.5">
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold md:text-base">{heading}</h3>
          <p className="text-xs text-muted-foreground md:text-sm">{subheading}</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-300/60 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30 p-3">
        <div className="flex items-start gap-2 text-xs md:text-sm text-amber-900 dark:text-amber-200">
          <Pencil className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            <strong>Importante:</strong> Estos documentos son <em>modelos editables</em> de
            referencia. Cada profesional debe adaptarlos a sus datos personales y matrícula, su
            criterio clínico-pericial y los honorarios acordados conforme al arancel ético vigente
            del Colegio de Psicólogos correspondiente.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {enriched.map(({ template: tpl, meta }) => (
          <li
            key={tpl.id}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card/50 p-3 md:p-4"
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

            <div className="flex flex-wrap gap-2">
              {meta && (
                <ConsentDetailDrawer
                  model={meta}
                  trigger={
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Info className="mr-1.5 h-4 w-4" />
                      Ver detalle
                    </Button>
                  }
                />
              )}
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <a href={tpl.file} download={tpl.filename}>
                  <Download className="mr-1.5 h-4 w-4" />
                  Modelo base
                </a>
              </Button>
              {meta && (
                <Button size="sm" className="shrink-0" onClick={() => openSignDialog(meta)}>
                  <FileSignature className="mr-1.5 h-4 w-4" />
                  Pre-llenar y firmar
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2.5 text-[11px] text-muted-foreground md:text-xs">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <p>
          Conforme al Código de Ética del Psicodiagnosticador (Art. 1º, 2º, 3º, 6º, 8º, 9º, 10º) y
          a las Pautas Internacionales para el Uso de los Tests (versión Adeip).
        </p>
      </div>

      <ConsentSignatureDialog
        model={activeModel}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </Card>
  );
}
