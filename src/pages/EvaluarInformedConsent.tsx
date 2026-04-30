import { InformedConsentTemplates, type ConsentTemplate } from "@/components/forensic/InformedConsentTemplates";
import { EVALUAR_MODELS } from "@/lib/consentTemplates";

const EVALUAR_TEMPLATES: ConsentTemplate[] = EVALUAR_MODELS.map((m) => ({
  id: m.id,
  title: m.title,
  description: m.description,
  file: m.file,
  filename: m.filename,
}));

export default function EvaluarInformedConsent() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-3xl">Consentimiento Informado</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Modelos descargables para procesos de <strong>evaluación psicodiagnóstica</strong>:
          NNA (CI-05), evaluación neuropsicológica (CI-06) y portación de arma reglamentaria
          (CI-07). Cada tarjeta incluye guía de <strong>qué incluye</strong>,{" "}
          <strong>cómo adaptarlo</strong> y <strong>cuándo corresponde usarlo</strong>, además
          de la opción de pre-llenar y firmar el documento desde la plataforma.
        </p>
      </div>

      <InformedConsentTemplates
        templates={EVALUAR_TEMPLATES}
        heading="Modelos de Consentimiento Informado — Evaluación Psicodiagnóstica"
        subheading="Modelos en PDF listos para descargar y adaptar con tus datos, criterio clínico y honorarios."
      />
    </div>
  );
}
