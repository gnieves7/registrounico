import { InformedConsentTemplates, type ConsentTemplate } from "@/components/forensic/InformedConsentTemplates";

const REFLEXIONAR_TEMPLATES: ConsentTemplate[] = [
  {
    id: "ci-01",
    title: "CI-01 · Terapia Psicológica — Adultos",
    description:
      "Modelo de consentimiento informado para procesos psicoterapéuticos con personas adultas.",
    file: "/templates/CI-01_Terapia_Adulto.docx",
    filename: "CI-01_Terapia_Adulto.docx",
  },
  {
    id: "ci-02",
    title: "CI-02 · Terapia Psicológica — Niñas, Niños y Adolescentes (NNA)",
    description:
      "Modelo para procesos terapéuticos con NNA, con autorización de progenitores o tutores.",
    file: "/templates/CI-02_Terapia_NNA.docx",
    filename: "CI-02_Terapia_NNA.docx",
  },
  {
    id: "ci-03",
    title: "CI-03 · Terapia con Indicadores de Riesgo",
    description:
      "Modelo específico para tratamientos con indicadores clínicos de riesgo (ideación suicida, autolesiones, etc.).",
    file: "/templates/CI-03_Terapia_Riesgo.docx",
    filename: "CI-03_Terapia_Riesgo.docx",
  },
];

export default function ReflexionarInformedConsent() {
  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-3xl">Consentimiento Informado</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Modelos descargables para encuadres terapéuticos clínicos.
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
