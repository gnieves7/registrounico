import { InformedConsentTemplates, type ConsentTemplate } from "@/components/forensic/InformedConsentTemplates";
import { REFLEXIONAR_MODELS } from "@/lib/consentTemplates";

const REFLEXIONAR_TEMPLATES: ConsentTemplate[] = REFLEXIONAR_MODELS.map((m) => ({
  id: m.id,
  title: m.title,
  description: m.description,
  file: m.file,
  filename: m.filename,
}));

export default function ReflexionarInformedConsent() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-3xl">Consentimiento Informado</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Modelos descargables para encuadres terapéuticos clínicos. Cada tarjeta incluye una guía
          contextual sobre <strong>qué incluye</strong>, <strong>cómo adaptarlo</strong> y{" "}
          <strong>cuándo corresponde usarlo</strong>, además de la opción de pre-llenar y firmar
          el documento desde la plataforma.
        </p>
      </div>

      <InformedConsentTemplates
        templates={REFLEXIONAR_TEMPLATES}
        heading="Modelos de Consentimiento Informado — Proceso Terapéutico"
        subheading="Plantillas profesionales en formato Word, listas para descargar y personalizar."
      />
    </div>
  );
}
