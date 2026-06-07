import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ClipboardList, FileText, ChevronRight, ExternalLink, FileDown, Eye, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PsicodiagnosticaForm } from "@/components/interview/psicodiagnostica/PsicodiagnosticaForm";
import { PsicodiagPreviewDialog } from "@/components/interview/psicodiagnostica/PsicodiagPreviewDialog";
import { EMPTY_PSICODIAG, type PsicodiagFormData } from "@/components/interview/psicodiagnostica/types";
import { exportPsicodiagPdf } from "@/lib/psicodiagnosticaPdf";
import { toast } from "@/hooks/use-toast";
import { validatePsicodiag } from "@/hooks/usePsicodiagDraft";
import { onAdminAction } from "@/lib/uiEvents";

const DRAFT_PREFIX = "psi_planilla_psicodiag_draft";
const ACTIVE_PATIENT_KEY = "psi_planilla_active_patient";

function patientSlug(patientId: string | undefined | null) {
  const s = (patientId ?? "").trim().toLowerCase();
  if (!s) return "__global__";
  return s.replace(/[^a-z0-9_-]+/g, "_").slice(0, 64);
}

function loadDraft(patientId: string): PsicodiagFormData | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}:${patientSlug(patientId)}`);
    if (!raw) return null;
    return { ...EMPTY_PSICODIAG, ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

type ActiveModel = null | "psicodiag";

interface Props {
  onBack?: () => void;
}

const PDF_TEMPLATES = [
  {
    title: "CI-05 — Consentimiento Psicodiagnóstico NNA",
    description: "Modelo descargable y editable para niñas, niños y adolescentes.",
    href: "/templates/CI-05_Psicodiag_NNA.pdf",
  },
  {
    title: "CI-06 — Evaluación Neuropsicológica",
    description: "Consentimiento para procesos neuropsicológicos.",
    href: "/templates/CI-06_Neuropsicologica.pdf",
  },
  {
    title: "CI-07 — Portación de Arma Reglamentaria",
    description: "Consentimiento para evaluación de portación de arma.",
    href: "/templates/CI-07_Arma_Reglamentaria.pdf",
  },
];

export function AdminInterviewModelsSection({ onBack }: Props) {
  const [active, setActive] = useState<ActiveModel>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PsicodiagFormData>(EMPTY_PSICODIAG);
  const [patientId, setPatientId] = useState<string>(() => {
    try { return localStorage.getItem(ACTIVE_PATIENT_KEY) ?? ""; } catch { return ""; }
  });

  useEffect(() => {
    try { localStorage.setItem(ACTIVE_PATIENT_KEY, patientId); } catch {}
  }, [patientId]);

  // Contextual action: open the interview form
  useEffect(() => {
    return onAdminAction("new-interview", () => setActive("psicodiag"));
  }, []);

  const handleQuickExport = () => {
    const draft = loadDraft(patientId);
    if (!draft) {
      toast({
        title: "Sin borrador",
        description: "No hay borrador guardado para este paciente. Abrí el formulario primero.",
        variant: "destructive",
      });
      setActive("psicodiag");
      return;
    }
    setPreviewData(draft);
    setPreviewOpen(true);
  };

  const confirmExport = () => {
    const { isValid, missing } = validatePsicodiag(previewData);
    if (!isValid) {
      toast({
        title: "Faltan campos obligatorios",
        description: `${missing.length} requeridos sin completar.`,
        variant: "destructive",
      });
      return;
    }
    try {
      exportPsicodiagPdf(previewData);
      setPreviewOpen(false);
      toast({ title: "PDF generado", description: "Se descargó la planilla psicodiagnóstica." });
    } catch (e: any) {
      toast({ title: "Error al generar PDF", description: e?.message ?? "", variant: "destructive" });
    }
  };

  if (active === "psicodiag") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" variant="ghost" onClick={() => setActive(null)} className="h-8 gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver a modelos
          </Button>
          {onBack && (
            <Button size="sm" variant="ghost" onClick={onBack} className="h-8 gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Inicio
            </Button>
          )}
        </div>
        <PsicodiagnosticaForm
          onClose={() => setActive(null)}
          patientId={patientId || null}
          patientLabel={patientId || "Borrador general (sin paciente)"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 flex-wrap">
        {onBack && (
          <Button size="sm" variant="ghost" onClick={onBack} className="h-8 gap-1 -ml-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Inicio
          </Button>
        )}
        <div className="rounded-lg bg-amber-500/10 p-2.5">
          <ClipboardList className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Modelos de entrevista e informes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Planillas estructuradas y modelos descargables para procesos psicodiagnósticos, clínicos y forenses.
          </p>
        </div>
      </div>

      <Card className="border-border bg-muted/30">
        <CardContent className="p-3 flex items-center gap-3 flex-wrap">
          <UserRound className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="active-patient" className="text-[11px] font-medium">
              Paciente activo (identificador local)
            </Label>
            <Input
              id="active-patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Ej.: iniciales + nro (M.G. 0421) o id interno"
              className="h-8 text-sm mt-1"
            />
          </div>
          <p className="text-[10px] text-muted-foreground max-w-xs leading-tight">
            El borrador y las versiones de la planilla se guardan por paciente en este dispositivo.
          </p>
        </CardContent>
      </Card>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Planillas interactivas
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Card className="border-border hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <button
                onClick={() => setActive("psicodiag")}
                className="flex items-start gap-3 w-full text-left group"
              >
                <div className="rounded-md bg-amber-500/10 p-2 shrink-0">
                  <FileText className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold">Entrevista psicodiagnóstica (Partes I–VI)</p>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Identificación, motivo, historia, EEM, áreas clínicas e impresión diagnóstica.
                    Borrador local + exportación PDF profesional.
                  </p>
                </div>
              </button>
              <div className="mt-3 flex flex-wrap gap-2 pl-9">
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => setActive("psicodiag")}>
                  <FileText className="h-3 w-3" /> Abrir formulario
                </Button>
                <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={handleQuickExport}>
                  <Eye className="h-3 w-3" /> Previsualizar
                </Button>
                <Button size="sm" className="h-7 gap-1 text-xs" onClick={handleQuickExport}>
                  <FileDown className="h-3 w-3" /> Exportar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Modelos PDF descargables
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PDF_TEMPLATES.map((tpl) => (
            <Card key={tpl.href} className="border-border hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <a
                  href={tpl.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="rounded-md bg-primary/10 p-2 shrink-0">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold">{tpl.title}</p>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{tpl.description}</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <PsicodiagPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={previewData}
        onConfirmExport={confirmExport}
      />
    </div>
  );
}