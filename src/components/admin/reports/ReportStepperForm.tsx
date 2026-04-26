import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, FileText, Download, Eye, Printer, Loader2, Save, AlertCircle,
} from "lucide-react";
import { PsiPdfEngine, type ReportFormData } from "@/lib/pdf/pdfEngine";
import { REPORT_TYPE_LABELS, type ReportType } from "@/lib/pdf/constants";

interface Patient {
  user_id: string;
  full_name: string | null;
  email: string | null;
}

export function ReportStepperForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("clinical");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ReportFormData>>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("user_id, full_name, email").then(({ data }) => {
      setPatients(data || []);
    });
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (!selectedPatient || currentStep === 0) return;
    const timer = setTimeout(() => saveDraft(), 2000);
    return () => clearTimeout(timer);
  }, [formData, currentStep]);

  const saveDraft = async () => {
    if (!selectedPatient) return;
    setSaving(true);
    try {
      const payload = {
        patient_id: selectedPatient,
        report_type: reportType,
        current_step: currentStep,
        form_data: JSON.parse(JSON.stringify(formData)),
        status: "draft" as const,
        cuij: formData.cuij || null,
        court_name: formData.courtName || null,
        court_division: formData.courtDivision || null,
        case_caption: formData.caseCaption || null,
        report_title: REPORT_TYPE_LABELS[reportType],
      };

      if (draftId) {
        await supabase.from("report_drafts").update(payload).eq("id", draftId);
      } else {
        const { data } = await supabase.from("report_drafts").insert(payload).select("id").single();
        if (data) setDraftId(data.id);
      }
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Steps definition per type
  const steps = useMemo(() => {
    const base = [{ label: "Tipo y Paciente", key: "setup" }];

    if (reportType === "clinical") {
      return [...base,
        { label: "Datos del paciente", key: "patient" },
        { label: "Motivo y técnicas", key: "clinical1" },
        { label: "Observaciones y resultados", key: "clinical2" },
        { label: "Diagnóstico y conclusiones", key: "clinical3" },
        { label: "Resumen y generación", key: "summary" },
      ];
    }
    if (reportType === "forensic") {
      return [...base,
        { label: "Datos de la causa", key: "case" },
        { label: "Objeto y metodología", key: "forensic1" },
        { label: "Desarrollo técnico", key: "forensic2" },
        { label: "Conclusiones periciales", key: "forensic3" },
        { label: "Resumen y generación", key: "summary" },
      ];
    }
    // corporate
    return [...base,
      { label: "Datos del evaluado", key: "patient" },
      { label: "Objetivo e instrumentos", key: "corporate1" },
      { label: "Competencias y síntesis", key: "corporate2" },
      { label: "Recomendación", key: "corporate3" },
      { label: "Resumen y generación", key: "summary" },
    ];
  }, [reportType]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const canGenerate = (): boolean => {
    return !!(formData.patientName && formData.evaluationDate);
  };

  const handleGenerate = async () => {
    if (!canGenerate()) {
      toast.error("Faltan campos obligatorios: nombre del paciente y fecha de evaluación.");
      return;
    }

    setGenerating(true);
    try {
      const engine = new PsiPdfEngine({
        ...formData,
        reportType,
        patientName: formData.patientName || "",
        patientLastName: formData.patientLastName || "",
        evaluationDate: formData.evaluationDate || "",
      } as ReportFormData);

      const { blob, fileName } = engine.generate();

      // Save to storage
      const storagePath = `informes/${selectedPatient}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(storagePath, blob, {
        contentType: "application/pdf",
        upsert: true,
      });

      if (uploadError) {
        console.error("Upload error:", uploadError);
      }

      // Record in informes_pdf
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("informes_pdf").insert({
          user_id: selectedPatient,
          test_type: REPORT_TYPE_LABELS[reportType],
          storage_path: storagePath,
          generated_by: user.id,
        });
        const { logReportEvent } = await import("@/lib/activityLogger");
        await logReportEvent(user.id, "report_created", {
          report_type: REPORT_TYPE_LABELS[reportType],
          patient_id: selectedPatient,
          storage_path: storagePath,
          draft_id: draftId ?? null,
        });
      }

      // Update draft status
      if (draftId) {
        await supabase.from("report_drafts").update({ status: "generated" }).eq("id", draftId);
      }

      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Informe PDF generado exitosamente.");
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el PDF.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = () => {
    if (!canGenerate()) {
      toast.error("Completá los campos obligatorios antes de la vista previa.");
      return;
    }
    try {
      const engine = new PsiPdfEngine({
        ...formData,
        reportType,
        patientName: formData.patientName || "",
        patientLastName: formData.patientLastName || "",
        evaluationDate: formData.evaluationDate || "",
      } as ReportFormData);
      const url = engine.generatePreviewUrl();
      setPreviewUrl(url);
      setShowPreview(true);
    } catch {
      toast.error("Error generando vista previa.");
    }
  };

  const patientName = patients.find(p => p.user_id === selectedPatient)?.full_name || "";

  // ── Step content renderers ──
  const renderStep0 = () => (
    <div className="space-y-4">
      <div>
        <Label>Paciente / Evaluado</Label>
        <Select value={selectedPatient} onValueChange={(v) => {
          setSelectedPatient(v);
          const p = patients.find(x => x.user_id === v);
          if (p?.full_name) {
            const parts = p.full_name.split(" ");
            updateField("patientLastName", parts.length > 1 ? parts.slice(-1).join(" ") : "");
            updateField("patientName", parts.length > 1 ? parts.slice(0, -1).join(" ") : p.full_name);
          }
        }}>
          <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
          <SelectContent>
            {patients.map(p => (
              <SelectItem key={p.user_id} value={p.user_id}>
                {p.full_name || p.email || p.user_id.slice(0, 8)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tipo de informe</Label>
        <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="clinical">Informe Clínico Psicológico</SelectItem>
            <SelectItem value="forensic">Informe Pericial / Técnico de Parte</SelectItem>
            <SelectItem value="corporate">Informe de Evaluación Corporativa / Laboral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Fecha de evaluación *</Label>
        <Input type="date" value={formData.evaluationDate || ""} onChange={e => updateField("evaluationDate", e.target.value)} />
      </div>
      <div>
        <Label>Fecha de emisión</Label>
        <Input type="date" value={formData.emissionDate || ""} onChange={e => updateField("emissionDate", e.target.value)} />
      </div>
    </div>
  );

  const renderPatientStep = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Nombre *</Label>
        <Input value={formData.patientName || ""} onChange={e => updateField("patientName", e.target.value)} />
      </div>
      <div>
        <Label>Apellido *</Label>
        <Input value={formData.patientLastName || ""} onChange={e => updateField("patientLastName", e.target.value)} />
      </div>
      <div>
        <Label>DNI</Label>
        <Input value={formData.patientDni || ""} onChange={e => updateField("patientDni", e.target.value)} />
      </div>
      <div>
        <Label>Edad</Label>
        <Input value={formData.patientAge || ""} onChange={e => updateField("patientAge", e.target.value)} />
      </div>
      <div>
        <Label>Género</Label>
        <Select value={formData.patientGender || ""} onValueChange={v => updateField("patientGender", v)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Masculino">Masculino</SelectItem>
            <SelectItem value="Femenino">Femenino</SelectItem>
            <SelectItem value="No binario">No binario</SelectItem>
            <SelectItem value="Prefiere no decir">Prefiere no decir</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Domicilio</Label>
        <Input value={formData.patientAddress || ""} onChange={e => updateField("patientAddress", e.target.value)} />
      </div>
    </div>
  );

  const renderForensicCaseStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>CUIJ (Expediente)</Label>
          <Input placeholder="Ej: 21-12345678-9" value={formData.cuij || ""} onChange={e => updateField("cuij", e.target.value)} />
        </div>
        <div>
          <Label>Juzgado</Label>
          <Input value={formData.courtName || ""} onChange={e => updateField("courtName", e.target.value)} />
        </div>
        <div>
          <Label>Fuero / Secretaría</Label>
          <Input value={formData.courtDivision || ""} onChange={e => updateField("courtDivision", e.target.value)} />
        </div>
        <div>
          <Label>Carátula</Label>
          <Input value={formData.caseCaption || ""} onChange={e => updateField("caseCaption", e.target.value)} />
        </div>
      </div>
      {renderPatientStep()}
    </div>
  );

  const renderTextArea = (label: string, field: keyof ReportFormData, placeholder?: string) => (
    <div>
      <Label>{label}</Label>
      <Textarea
        className="min-h-[120px]"
        placeholder={placeholder}
        value={(formData[field] as string) || ""}
        onChange={e => updateField(field, e.target.value)}
      />
    </div>
  );

  const renderClinical1 = () => (
    <div className="space-y-4">
      {renderTextArea("Motivo de consulta", "consultationReason", "Describir el motivo de la derivación o consulta...")}
      {renderTextArea("Técnicas administradas", "techniques", "Listar los instrumentos y técnicas aplicadas con fecha de administración...")}
    </div>
  );

  const renderClinical2 = () => (
    <div className="space-y-4">
      {renderTextArea("Observaciones clínicas", "clinicalObservations", "Descripción conductual y observaciones durante la evaluación...")}
      {renderTextArea("Resultados e interpretación", "resultsInterpretation", "Análisis integrado de los resultados obtenidos...")}
    </div>
  );

  const renderClinical3 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderTextArea("Diagnóstico presuntivo", "diagnosis", "Diagnóstico clínico...")}
        <div>
          <Label>Codificación CIE-10 / CIE-11</Label>
          <Input placeholder="Ej: F41.1 — Trastorno de ansiedad generalizada" value={formData.diagnosisCode || ""} onChange={e => updateField("diagnosisCode", e.target.value)} />
        </div>
      </div>
      {renderTextArea("Conclusiones clínicas", "clinicalConclusions")}
      {renderTextArea("Recomendaciones terapéuticas", "therapeuticRecommendations")}
    </div>
  );

  const renderForensic1 = () => (
    <div className="space-y-4">
      {renderTextArea("Objeto de la pericia", "expertiseObject", "Describir el objetivo pericial...")}
      {renderTextArea("Puntos periciales propuestos", "expertisePoints", "Listar cada punto pericial...")}
      {renderTextArea("Metodología utilizada", "methodology", "Detallar la metodología y técnicas empleadas...")}
    </div>
  );

  const renderForensic2 = () => (
    <div className="space-y-4">
      {renderTextArea("Antecedentes del caso", "caseBackground", "Fuentes consultadas y antecedentes relevantes...")}
      {renderTextArea("Desarrollo y fundamentos técnicos", "technicalDevelopment")}
      {renderTextArea("Análisis de indicadores evaluados", "indicatorAnalysis")}
    </div>
  );

  const renderForensic3 = () => (
    <div className="space-y-4">
      {renderTextArea("Conclusiones periciales", "expertConclusions", "Responder punto por punto los puntos propuestos...")}
      {renderTextArea("Reservas y limitaciones metodológicas", "reservations")}
    </div>
  );

  const renderCorporate1 = () => (
    <div className="space-y-4">
      {renderTextArea("Objetivo de la evaluación", "evaluationObjective")}
      {renderTextArea("Instrumentos aplicados", "instrumentsApplied")}
    </div>
  );

  const renderCorporate2 = () => (
    <div className="space-y-4">
      {renderTextArea("Perfil de competencias observadas", "competencyProfile")}
      {renderTextArea("Síntesis integradora", "integrativeSynthesis")}
    </div>
  );

  const renderCorporate3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Recomendación</Label>
        <Select value={formData.recommendation || ""} onValueChange={v => updateField("recommendation", v)}>
          <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="APTO">Apto</SelectItem>
            <SelectItem value="APTO CON RESERVAS">Apto con reservas</SelectItem>
            <SelectItem value="NO APTO">No apto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderTextArea("Fundamentación de la recomendación", "recommendationRationale")}
    </div>
  );

  const renderSummary = () => {
    const summaryFields: [string, string | undefined][] = [
      ["Tipo de informe", REPORT_TYPE_LABELS[reportType]],
      ["Paciente", `${formData.patientName || ""} ${formData.patientLastName || ""}`.trim()],
      ["DNI", formData.patientDni],
      ["Fecha de evaluación", formData.evaluationDate],
      ["CUIJ", formData.cuij],
    ];

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Resumen del informe</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {summaryFields.map(([label, value]) =>
              value ? (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{label}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>

        {!canGenerate() && (
          <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            Faltan campos obligatorios (nombre del paciente, fecha de evaluación).
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={handlePreview} disabled={!canGenerate()}>
            <Eye className="h-4 w-4" />
            Vista previa
          </Button>
          <Button className="gap-2" onClick={handleGenerate} disabled={generating || !canGenerate()}>
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {generating ? "Generando PDF..." : "Generar y descargar PDF"}
          </Button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    const stepKey = steps[currentStep]?.key;
    switch (stepKey) {
      case "setup": return renderStep0();
      case "patient": return renderPatientStep();
      case "case": return renderForensicCaseStep();
      case "clinical1": return renderClinical1();
      case "clinical2": return renderClinical2();
      case "clinical3": return renderClinical3();
      case "forensic1": return renderForensic1();
      case "forensic2": return renderForensic2();
      case "forensic3": return renderForensic3();
      case "corporate1": return renderCorporate1();
      case "corporate2": return renderCorporate2();
      case "corporate3": return renderCorporate3();
      case "summary": return renderSummary();
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Paso {currentStep + 1} de {steps.length}
        </span>
        {saving && (
          <Badge variant="secondary" className="gap-1 text-xs">
            <Save className="h-3 w-3" /> Guardando...
          </Badge>
        )}
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap gap-1">
        {steps.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(i)}
            className={`text-xs px-2 py-1 rounded-full transition-colors ${
              i === currentStep
                ? "bg-primary text-primary-foreground"
                : i < currentStep
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {steps[currentStep]?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCurrentStep()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(s => s - 1)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        {currentStep < steps.length - 1 && (
          <Button
            size="sm"
            onClick={() => setCurrentStep(s => s + 1)}
            className="gap-1"
            disabled={currentStep === 0 && !selectedPatient}
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Vista previa del informe
              <Button
                size="sm"
                variant="outline"
                className="ml-auto gap-1"
                onClick={() => {
                  const iframe = document.getElementById("pdf-preview-iframe") as HTMLIFrameElement;
                  iframe?.contentWindow?.print();
                }}
              >
                <Printer className="h-3.5 w-3.5" /> Imprimir
              </Button>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe
              id="pdf-preview-iframe"
              src={previewUrl}
              className="w-full flex-1 rounded-lg border"
              title="Vista previa PDF"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
