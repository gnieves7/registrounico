import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileDown, Eye, ShieldAlert, AlertCircle } from "lucide-react";
import type { PsicodiagFormData } from "./types";
import { validatePsicodiag } from "@/hooks/usePsicodiagDraft";

function maskDni(v: string) {
  const s = (v || "").replace(/\D/g, "");
  if (s.length < 4) return v ? "•••" : "—";
  return `••• ••• ${s.slice(-3)}`;
}
function maskPhone(v: string) {
  const s = (v || "").trim();
  if (!s) return "—";
  return s.replace(/.(?=.{3})/g, "•");
}
function maskEmail(v: string) {
  const s = (v || "").trim();
  if (!s.includes("@")) return s || "—";
  const [u, d] = s.split("@");
  const uu = u.length <= 2 ? u[0] + "•" : u[0] + "•••" + u.slice(-1);
  return `${uu}@${d}`;
}
function maskAddress(v: string) {
  const s = (v || "").trim();
  if (!s) return "—";
  // Keep only the last token (provincia/localidad), mask rest.
  const parts = s.split(/,\s*/);
  if (parts.length === 1) return "•••";
  return `•••, ${parts[parts.length - 1]}`;
}
function truncate(v: string, n = 220) {
  const s = (v || "").trim();
  if (!s) return "—";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: PsicodiagFormData;
  onConfirmExport: () => void;
}

export function PsicodiagPreviewDialog({ open, onOpenChange, data, onConfirmExport }: Props) {
  const { missing, isValid } = validatePsicodiag(data);
  const rows: { label: string; value: string }[] = [
    { label: "Apellido y nombre", value: data.fullName || "—" },
    { label: "Edad", value: data.age || "—" },
    { label: "DNI (enmascarado)", value: maskDni(data.dni) },
    { label: "Teléfono (enmascarado)", value: maskPhone(data.phone) },
    { label: "Email (enmascarado)", value: maskEmail(data.email) },
    { label: "Domicilio (parcial)", value: maskAddress(data.address) },
    { label: "Modalidad", value: data.modality || "—" },
    { label: "Consentimiento firmado", value: data.consentSigned || "—" },
    { label: "Motivo (resumen)", value: truncate(data.motiveProf || data.motiveOwn, 220) },
    { label: "Hipótesis diagnóstica", value: truncate(data.diagnosticHypothesis, 220) },
    { label: "Próximo paso", value: data.nextStep || "—" },
    { label: "Profesional", value: data.professionalName || "—" },
    { label: "Matrícula", value: data.professionalLicense || "—" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> Vista previa segura — Planilla psicodiagnóstica
          </DialogTitle>
          <DialogDescription>
            Resumen con datos sensibles enmascarados. El PDF final contendrá la información clínica completa
            y debe manejarse bajo secreto profesional.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5 flex items-start gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Esta previsualización oculta DNI, teléfono, email y dirección. Si vas a compartirla con el/la
            consultante o derivante, confirmá que estás autorizado/a a hacerlo (Ley 26.529 y Código de Ética).
          </p>
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
                  Completalos para habilitar la descarga del PDF.
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

        <ScrollArea className="max-h-[55vh] pr-3">
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[160px_1fr] gap-3 py-1.5 border-b border-border/50 last:border-0">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{r.label}</span>
                <span className="text-sm">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="text-[10px]">Partes I–VI</Badge>
            <Badge variant="outline" className="text-[10px]">Confidencial</Badge>
            <Badge variant="outline" className="text-[10px]">Uso profesional</Badge>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onConfirmExport} disabled={!isValid} className="gap-1.5">
            <FileDown className="h-4 w-4" /> Confirmar y descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}