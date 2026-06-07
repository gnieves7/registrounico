import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileDown, Save, RotateCcw, FileText, Eye, History, Trash2, RotateCw, GitCompare, AlertCircle, CheckCircle2, Loader2, CloudOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { exportPsicodiagPdf } from "@/lib/psicodiagnosticaPdf";
import { type PsicodiagFormData } from "./types";
import { PsicodiagPreviewDialog } from "./PsicodiagPreviewDialog";
import { usePsicodiagDraft, validatePsicodiag, diffVersions, REQUIRED_FIELDS } from "@/hooks/usePsicodiagDraft";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
  patientId?: string | null;
  patientLabel?: string;
}

export function PsicodiagnosticaForm({ onClose, patientId, patientLabel }: Props) {
  const { data, setField, reset: resetDraft, versions, saveVersion, deleteVersion, restoreVersion, autosaveStatus, lastSavedAt } =
    usePsicodiagDraft(patientId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [diffWith, setDiffWith] = useState<string | null>(null);

  const { isValid, missing } = useMemo(() => validatePsicodiag(data), [data]);
  const missingKeys = useMemo(() => new Set(missing.map((m) => m.key as string)), [missing]);

  const set = (k: FieldKey, v: string) => setField(k, v);

  const reset = () => {
    if (confirm("¿Borrar el borrador actual de la planilla? Las versiones guardadas se mantienen.")) {
      resetDraft();
      toast({ title: "Borrador eliminado" });
    }
  };

  const saveDraft = () => {
    if (!isValid) {
      toast({
        title: "No se puede guardar la versión",
        description: `Faltan ${missing.length} campo${missing.length === 1 ? "" : "s"} obligatorio${missing.length === 1 ? "" : "s"}.`,
        variant: "destructive",
      });
      return;
    }
    const label = prompt("Etiqueta opcional para esta versión (ej.: 'Antes de devolución')") || undefined;
    const v = saveVersion(label);
    toast({ title: "Versión guardada", description: `${v.label ?? "Sin etiqueta"} · ${new Date(v.savedAt).toLocaleString()}` });
  };

  const doExport = () => {
    const { isValid, missing } = validatePsicodiag(data);
    if (!isValid) {
      toast({
        title: "Faltan campos obligatorios",
        description: `${missing.length} campos requeridos sin completar.`,
        variant: "destructive",
      });
      return;
    }
    try {
      exportPsicodiagPdf(data);
      setPreviewOpen(false);
      toast({ title: "PDF generado", description: "Se descargó la planilla completa." });
    } catch (e: any) {
      toast({ title: "Error al generar PDF", description: e?.message ?? "", variant: "destructive" });
    }
  };

  const diffTarget = diffWith ? versions.find((v) => v.id === diffWith) : null;
  const diffs = diffTarget ? diffVersions(diffTarget.data, data) : [];

  const renderField = (f: FieldSpec) => {
    const value = (data[f.key] ?? "") as string;
    const isRequired = REQUIRED_FIELDS.some((r) => r.key === f.key);
    const isMissing = isRequired && missingKeys.has(f.key as string);
    const fieldClass = isMissing
      ? "border-destructive/60 focus-visible:ring-destructive/40"
      : "";
    if (f.type === "textarea") {
      return (
        <div key={f.key} className="space-y-1.5">
          <Label className="text-xs font-medium flex items-center gap-1">
            {f.label}
            {isRequired && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            rows={f.rows ?? 3}
            value={value}
            placeholder={f.placeholder}
            onChange={(e) => set(f.key, e.target.value)}
            className={`text-sm ${fieldClass}`}
          />
          {isMissing && (
            <p className="text-[10px] text-destructive flex items-center gap-1">
              <AlertCircle className="h-2.5 w-2.5" /> Campo obligatorio
            </p>
          )}
        </div>
      );
    }
    return (
      <div key={f.key} className="space-y-1.5">
        <Label className="text-xs font-medium flex items-center gap-1">
          {f.label}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
        <Input
          type={f.type === "date" ? "date" : "text"}
          value={value}
          placeholder={f.placeholder}
          onChange={(e) => set(f.key, e.target.value)}
          className={`h-9 text-sm ${fieldClass}`}
        />
        {isMissing && (
          <p className="text-[10px] text-destructive flex items-center gap-1">
            <AlertCircle className="h-2.5 w-2.5" /> Campo obligatorio
          </p>
        )}
      </div>
    );
  };

  const autosaveLabel = (() => {
    if (autosaveStatus === "saving") return "Guardando…";
    if (autosaveStatus === "error") return "Error al guardar";
    if (autosaveStatus === "saved" && lastSavedAt)
      return `Guardado ${lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    return "Borrador local";
  })();
  const AutosaveIcon =
    autosaveStatus === "saving" ? Loader2 : autosaveStatus === "error" ? CloudOff : CheckCircle2;

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
              Borrador autoguardado por paciente · Versionado local · Exportación PDF profesional.
            </p>
            {(patientLabel || patientId) && (
              <p className="mt-1 text-[11px]">
                <span className="font-medium text-foreground">Paciente activo:</span>{" "}
                <span className="text-muted-foreground">{patientLabel || patientId}</span>
              </p>
            )}
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <AutosaveIcon
                className={`h-3 w-3 ${autosaveStatus === "saving" ? "animate-spin" : ""} ${
                  autosaveStatus === "error" ? "text-destructive" : autosaveStatus === "saved" ? "text-emerald-600" : ""
                }`}
              />
              <span>{autosaveLabel}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="ghost" onClick={reset} className="h-8 gap-1">
              <RotateCcw className="h-3.5 w-3.5" /> Limpiar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setHistoryOpen(true)} className="h-8 gap-1">
              <History className="h-3.5 w-3.5" /> Versiones {versions.length > 0 && <Badge variant="secondary" className="ml-1 h-4 text-[10px]">{versions.length}</Badge>}
            </Button>
            <Button size="sm" variant="outline" onClick={saveDraft} className="h-8 gap-1" disabled={!isValid} title={!isValid ? `Faltan ${missing.length} campos obligatorios` : "Guardar versión"}>
              <Save className="h-3.5 w-3.5" /> Guardar versión
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPreviewOpen(true)} className="h-8 gap-1">
              <Eye className="h-3.5 w-3.5" /> Vista previa
            </Button>
            <Button size="sm" onClick={() => setPreviewOpen(true)} className="h-8 gap-1" disabled={!isValid} title={!isValid ? `Faltan ${missing.length} campos obligatorios` : "Exportar PDF"}>
              <FileDown className="h-3.5 w-3.5" /> Exportar PDF
            </Button>
            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose} className="h-8">Cerrar</Button>
            )}
          </div>
        </div>

        {!isValid && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-2.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-destructive">
                  Faltan {missing.length} campo{missing.length === 1 ? "" : "s"} obligatorio{missing.length === 1 ? "" : "s"}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Completalos para habilitar el guardado de versión y la exportación a PDF.
                </p>
                <ul className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-0.5">
                  {missing.map((m) => (
                    <li key={m.key} className="text-[11px] text-destructive/90 list-disc list-inside">
                      {m.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
      <PsicodiagPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={data}
        onConfirmExport={doExport}
      />

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><History className="h-4 w-4" /> Historial de versiones</DialogTitle>
            <DialogDescription>
              Cada guardado crea una versión local. Restaurá una anterior o comparala contra el borrador actual.
            </DialogDescription>
          </DialogHeader>
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Todavía no guardaste ninguna versión. Usá <span className="font-medium">Guardar versión</span> para crear la primera.
            </p>
          ) : (
            <ScrollArea className="max-h-[55vh] pr-3">
              <div className="space-y-2">
                {versions.map((v, i) => (
                  <div key={v.id} className="border border-border rounded-md p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">
                          {v.label || `Versión ${versions.length - i}`}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{new Date(v.savedAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"
                          onClick={() => setDiffWith(diffWith === v.id ? null : v.id)}>
                          <GitCompare className="h-3 w-3" /> {diffWith === v.id ? "Ocultar" : "Comparar"}
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 gap-1 text-xs"
                          onClick={() => { if (restoreVersion(v.id)) toast({ title: "Versión restaurada" }); }}>
                          <RotateCw className="h-3 w-3" /> Restaurar
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                          onClick={() => { if (confirm("¿Eliminar esta versión?")) deleteVersion(v.id); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {diffWith === v.id && (
                      <div className="rounded bg-muted/40 p-2 text-[11px] space-y-1 max-h-56 overflow-auto">
                        {diffs.length === 0 ? (
                          <p className="text-muted-foreground italic">Sin diferencias con el borrador actual.</p>
                        ) : (
                          diffs.map((d) => (
                            <div key={d.key} className="border-b border-border/30 pb-1 last:border-0">
                              <p className="font-mono text-[10px] text-muted-foreground">{d.key}</p>
                              <p className="text-destructive/80 line-through truncate">{d.from || "—"}</p>
                              <p className="text-emerald-600 dark:text-emerald-400 truncate">{d.to || "—"}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setHistoryOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}