import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileDown, Save, RotateCcw, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { exportPsicodiagPdf } from "@/lib/psicodiagnosticaPdf";
import { EMPTY_PSICODIAG, type PsicodiagFormData } from "./types";

const STORAGE_KEY = "psi_planilla_psicodiag_draft";

type FieldKey = keyof PsicodiagFormData;
type FieldSpec = { key: FieldKey; label: string; type?: "input" | "textarea" | "date"; rows?: number; placeholder?: string };

const PARTS: { id: string; title: string; fields: FieldSpec[] }[] = [
  {
    id: "p1",
    title: "PARTE I — Datos de identificación y encuadre",
    fields: [
      { key: "fullName", label: "Apellido/s y nombre/s" },
      { key: "birthDate", label: "Fecha de nacimiento", type: "date" },
      { key: "age", label: "Edad" },
      { key: "gender", label: "Género (autopercibido)" },
      { key: "dni", label: "DNI / Documento" },
      { key: "nationality", label: "Nacionalidad" },
      { key: "maritalStatus", label: "Estado civil" },
      { key: "education", label: "Nivel educativo" },
      { key: "occupation", label: "Ocupación / Profesión" },
      { key: "address", label: "Domicilio (localidad y provincia)" },
      { key: "phone", label: "Teléfono de contacto" },
      { key: "email", label: "Correo electrónico" },
      { key: "insurance", label: "Obra social / Prepaga" },
      { key: "referredBy", label: "Remitido/a por" },
      { key: "sessionDate", label: "Fecha y hora de la sesión" },
      { key: "modality", label: "Modalidad (presencial / virtual / mixta)" },
      { key: "encounterType", label: "Carácter del encuentro" },
      { key: "consentSigned", label: "Consentimiento informado firmado" },
      { key: "householdComposition", label: "Composición del grupo conviviente", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "p2",
    title: "PARTE II — Motivo de consulta y demanda",
    fields: [
      { key: "motiveOwn", label: "Motivo en palabras del/la consultante (verbatim)", type: "textarea", rows: 4 },
      { key: "motiveProf", label: "Motivo según el profesional (reformulación)", type: "textarea", rows: 4 },
      { key: "priorTherapy", label: "¿Tratamiento psicológico previo?" },
      { key: "priorTherapyType", label: "Tipo(s) de abordaje previo" },
      { key: "psychiatric", label: "Tratamiento psiquiátrico actual/previo" },
      { key: "medication", label: "Medicación psicotrópica actual" },
      { key: "urgencySubj", label: "Urgencia subjetiva (muy alta–muy baja)" },
      { key: "urgencyObj", label: "Urgencia objetiva (muy alta–muy baja)" },
      { key: "insight", label: "Nivel de insight" },
      { key: "motivation", label: "Motivación para el proceso" },
    ],
  },
  {
    id: "p3",
    title: "PARTE III — Historia personal y desarrollo evolutivo",
    fields: [
      { key: "earlyHistory", label: "Historia perinatal y primera infancia", type: "textarea", rows: 4 },
      { key: "familyHistory", label: "Historia familiar y vincular", type: "textarea", rows: 4 },
      { key: "educationHistory", label: "Trayectoria educativa", type: "textarea", rows: 3 },
      { key: "workHistory", label: "Historia laboral", type: "textarea", rows: 3 },
      { key: "relationshipHistory", label: "Historia afectiva y de pareja", type: "textarea", rows: 3 },
      { key: "traumaHistory", label: "Eventos traumáticos / vitales relevantes", type: "textarea", rows: 4 },
    ],
  },
  {
    id: "p4",
    title: "PARTE IV — Examen del estado mental",
    fields: [
      { key: "eemAppearance", label: "Presentación y aspecto" },
      { key: "eemAttitude", label: "Actitud y colaboración" },
      { key: "eemConsciousness", label: "Conciencia y orientación" },
      { key: "eemAttention", label: "Atención y memoria" },
      { key: "eemSpeech", label: "Lenguaje y curso del pensamiento" },
      { key: "eemThoughtContent", label: "Contenido del pensamiento (ideas, delirios)" },
      { key: "eemPerception", label: "Sensopercepción (alucinaciones, ilusiones)" },
      { key: "eemMood", label: "Estado de ánimo y afecto" },
      { key: "eemJudgment", label: "Juicio e insight" },
      { key: "eemSuicidal", label: "Ideación suicida / autolesiva (sí/no, plan, medios)" },
    ],
  },
  {
    id: "p5",
    title: "PARTE V — Áreas clínicas específicas",
    fields: [
      { key: "sleep", label: "Esfera del sueño", type: "textarea", rows: 3 },
      { key: "eating", label: "Alimentación", type: "textarea", rows: 3 },
      { key: "sexuality", label: "Sexualidad", type: "textarea", rows: 3 },
      { key: "substances", label: "Consumos / sustancias", type: "textarea", rows: 3 },
      { key: "socialNetwork", label: "Red de apoyo social", type: "textarea", rows: 3 },
      { key: "resources", label: "Recursos personales y resiliencia", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "p6",
    title: "PARTE VI — Impresión diagnóstica provisional y plan",
    fields: [
      { key: "diagnosticHypothesis", label: "Hipótesis diagnóstica provisional", type: "textarea", rows: 4 },
      { key: "diagnosticCode", label: "Referencia nosográfica (CIE-10 / DSM-5)" },
      { key: "evaluationPlan", label: "Plan de evaluación / batería sugerida", type: "textarea", rows: 4 },
      { key: "recommendations", label: "Indicaciones / derivaciones", type: "textarea", rows: 3 },
      { key: "nextStep", label: "Próximo paso acordado con el/la consultante" },
      { key: "followUpDate", label: "Fecha aproximada de devolución / informe", type: "date" },
      { key: "observations", label: "Observaciones clínicas generales", type: "textarea", rows: 4 },
    ],
  },
  {
    id: "close",
    title: "Cierre y firma profesional",
    fields: [
      { key: "professionalName", label: "Lic./Esp. (nombre y apellido)" },
      { key: "professionalLicense", label: "Matrícula N°" },
      { key: "signatureDate", label: "Fecha de la firma", type: "date" },
    ],
  },
];

interface Props {
  onClose?: () => void;
}

export function PsicodiagnosticaForm({ onClose }: Props) {
  const [data, setData] = useState<PsicodiagFormData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...EMPTY_PSICODIAG, ...JSON.parse(raw) };
    } catch {}
    return EMPTY_PSICODIAG;
  });

  // Autosave to localStorage
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [data]);

  const set = (k: FieldKey, v: string) => setData((d) => ({ ...d, [k]: v }));

  const reset = () => {
    if (confirm("¿Borrar el borrador actual de la planilla?")) {
      setData(EMPTY_PSICODIAG);
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      toast({ title: "Borrador eliminado" });
    }
  };

  const saveDraft = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
    toast({ title: "Borrador guardado", description: "Se almacena en este dispositivo." });
  };

  const exportPdf = () => {
    try {
      exportPsicodiagPdf(data);
      toast({ title: "PDF generado", description: "Se descargó la planilla completa." });
    } catch (e: any) {
      toast({ title: "Error al generar PDF", description: e?.message ?? "", variant: "destructive" });
    }
  };

  const renderField = (f: FieldSpec) => {
    const value = (data[f.key] ?? "") as string;
    if (f.type === "textarea") {
      return (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-xs font-medium">{f.label}</Label>
          <Textarea
            rows={f.rows ?? 3}
            value={value}
            placeholder={f.placeholder}
            onChange={(e) => set(f.key, e.target.value)}
            className="text-sm"
          />
        </div>
      );
    }
    return (
      <div key={f.key} className="space-y-1.5">
        <Label className="text-xs font-medium">{f.label}</Label>
        <Input
          type={f.type === "date" ? "date" : "text"}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => set(f.key, e.target.value)}
          className="h-9 text-sm"
        />
      </div>
    );
  };

  return (
    <Card className="border-border">
      <CardContent className="p-4 md:p-6 space-y-5">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="rounded-lg bg-amber-500/10 p-2.5">
            <FileText className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold tracking-tight">
              Planilla de Primera Entrevista Psicodiagnóstica
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Versión genérica (Partes I a VI). Completá durante o inmediatamente después de la primera entrevista.
              Se guarda borrador local en este dispositivo y se exporta a PDF profesional.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="ghost" onClick={reset} className="h-8 gap-1">
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar
            </Button>
            <Button size="sm" variant="outline" onClick={saveDraft} className="h-8 gap-1">
              <Save className="h-3.5 w-3.5" /> Guardar borrador
            </Button>
            <Button size="sm" onClick={exportPdf} className="h-8 gap-1">
              <FileDown className="h-3.5 w-3.5" /> Exportar PDF
            </Button>
            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose} className="h-8">Cerrar</Button>
            )}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["p1"]} className="space-y-2">
          {PARTS.map((part) => (
            <AccordionItem key={part.id} value={part.id} className="border border-border rounded-md px-3">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {part.title}
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                <div className="grid gap-3 md:grid-cols-2">
                  {part.fields.map(renderField)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}