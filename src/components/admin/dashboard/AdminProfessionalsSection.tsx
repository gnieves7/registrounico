import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Briefcase, Download, FileSignature, Loader2, ShieldCheck, CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { ProfessionalActivityMonitor } from "./ProfessionalActivityMonitor";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ProfessionalRow {
  user_id: string;
  full_name: string | null;
  email: string | null;
  dni: string | null;
  license_number: string | null;
  license_college: string | null;
  consent_accepted_at: string | null;
  is_approved: boolean;
  // subscription
  status?: string;
  trial_ends_at?: string;
  paid_until?: string | null;
  plan?: string | null;
  // consent
  pdf_storage_path?: string | null;
  consent_id?: string | null;
  approval_decision?: string | null;
  approval_reason?: string | null;
  approval_decided_at?: string | null;
}

export function AdminProfessionalsSection() {
  const [rows, setRows] = useState<ProfessionalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [decisionDialog, setDecisionDialog] = useState<{ row: ProfessionalRow; mode: "approve" | "reject" } | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [savingDecision, setSavingDecision] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, dni, license_number, license_college, consent_accepted_at, is_approved, account_type, approval_decision, approval_reason, approval_decided_at")
      .eq("account_type", "professional")
      .order("created_at", { ascending: false });

    const ids = (profiles || []).map((p: any) => p.user_id);
    if (ids.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    const [{ data: subs }, { data: consents }] = await Promise.all([
      supabase.from("professional_subscriptions").select("*").in("user_id", ids),
      supabase.from("professional_consents").select("id, user_id, pdf_storage_path, accepted_at").in("user_id", ids),
    ]);

    const merged: ProfessionalRow[] = (profiles || []).map((p: any) => {
      const sub = (subs || []).find((s: any) => s.user_id === p.user_id);
      const con = (consents || []).find((c: any) => c.user_id === p.user_id);
      return {
        ...p,
        status: sub?.status,
        trial_ends_at: sub?.trial_ends_at,
        paid_until: sub?.paid_until,
        plan: sub?.plan,
        pdf_storage_path: con?.pdf_storage_path,
        consent_id: con?.id,
      };
    });
    setRows(merged);
    setLoading(false);
  }

  async function downloadConsent(row: ProfessionalRow) {
    if (!row.pdf_storage_path) {
      toast({ title: "Sin consentimiento", description: "Este profesional aún no firmó el consentimiento.", variant: "destructive" });
      return;
    }
    setDownloadingId(row.user_id);
    try {
      const { data, error } = await supabase.storage
        .from("consentimientos-profesionales")
        .createSignedUrl(row.pdf_storage_path, 600);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (err: any) {
      toast({ title: "Error al descargar", description: err.message, variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  }

  function openDecision(row: ProfessionalRow, mode: "approve" | "reject") {
    setDecisionDialog({ row, mode });
    setDecisionReason(row.approval_reason || "");
  }

  async function saveDecision() {
    if (!decisionDialog) return;
    if (!decisionReason.trim()) {
      toast({ title: "Indicá un motivo", description: "Es obligatorio dejar registrado por qué tomás esta decisión.", variant: "destructive" });
      return;
    }
    setSavingDecision(true);
    const { row, mode } = decisionDialog;
    const approve = mode === "approve";
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        is_approved: approve,
        approval_decision: approve ? "approved" : "rejected",
        approval_reason: decisionReason.trim(),
        approval_decided_at: new Date().toISOString(),
        approval_decided_by: auth.user?.id,
      } as any)
      .eq("user_id", row.user_id);
    setSavingDecision(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: approve ? "Profesional aprobado" : "Acceso rechazado" });
    setDecisionDialog(null);
    setDecisionReason("");
    load();
  }

  function statusBadge(row: ProfessionalRow) {
    const now = Date.now();
    const trial = row.trial_ends_at ? new Date(row.trial_ends_at).getTime() : 0;
    const paid = row.paid_until ? new Date(row.paid_until).getTime() : 0;
    if (paid > now) return <Badge className="bg-emerald-600 hover:bg-emerald-700">Suscripción activa</Badge>;
    if (trial > now) {
      const days = Math.ceil((trial - now) / (1000 * 60 * 60 * 24));
      return <Badge variant="secondary">Prueba ({days}d)</Badge>;
    }
    return <Badge variant="destructive">Vencido</Badge>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-primary" /> Profesionales
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gestión de cuentas profesionales, suscripciones y consentimientos firmados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> {rows.length} profesional{rows.length === 1 ? "" : "es"} registrado{rows.length === 1 ? "" : "s"}
          </CardTitle>
          <CardDescription>
            Aprobá el acceso, descargá los consentimientos firmados y revisá el estado de cada suscripción.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : rows.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">
              Aún no hay profesionales registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Suscripción</TableHead>
                    <TableHead>Consentimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.user_id}>
                      <TableCell>
                        <div className="font-medium">{r.full_name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.email}</div>
                        {r.dni && <div className="text-xs text-muted-foreground">DNI: {r.dni}</div>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {r.license_number ? (
                          <>
                            <div>Mat. {r.license_number}</div>
                            <div className="text-xs text-muted-foreground">{r.license_college}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {statusBadge(r)}
                          {r.trial_ends_at && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              hasta {format(new Date(r.paid_until || r.trial_ends_at), "dd/MM/yyyy", { locale: es })}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {r.consent_accepted_at ? (
                          <Badge variant="outline" className="gap-1">
                            <FileSignature className="h-3 w-3 text-emerald-600" /> Firmado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">Pendiente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {r.is_approved ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-700">Aprobado</Badge>
                        ) : r.approval_decision === "rejected" ? (
                          <Badge variant="destructive">Rechazado</Badge>
                        ) : (
                          <Badge variant="secondary">Pendiente</Badge>
                        )}
                        {r.approval_reason && (
                          <p className="text-[10px] text-muted-foreground mt-1 max-w-[160px] truncate" title={r.approval_reason}>
                            {r.approval_reason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {r.pdf_storage_path && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadConsent(r)}
                            disabled={downloadingId === r.user_id}
                          >
                            {downloadingId === r.user_id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3" />
                            )}
                            <span className="ml-1">PDF</span>
                          </Button>
                        )}
                        {r.is_approved ? (
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => openDecision(r, "reject")}>
                            <XCircle className="h-3 w-3" /> Revocar
                          </Button>
                        ) : (
                          <>
                            <Button size="sm" className="gap-1" onClick={() => openDecision(r, "approve")}>
                              <CheckCircle2 className="h-3 w-3" /> Aprobar
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => openDecision(r, "reject")}>
                              <XCircle className="h-3 w-3" /> Rechazar
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProfessionalActivityMonitor />

      <Dialog open={!!decisionDialog} onOpenChange={(o) => !o && setDecisionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {decisionDialog?.mode === "approve" ? "Aprobar profesional" : "Rechazar / Revocar acceso"}
            </DialogTitle>
            <DialogDescription>
              Dejá constancia del motivo. Quedará registrado en el historial de actividad y será visible para auditoría.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="rounded-md border bg-muted/30 p-3 text-sm">
              <p className="font-semibold">{decisionDialog?.row.full_name || "—"}</p>
              <p className="text-xs text-muted-foreground">{decisionDialog?.row.email}</p>
              {decisionDialog?.row.license_number && (
                <p className="text-xs text-muted-foreground">Mat. {decisionDialog.row.license_number} · {decisionDialog.row.license_college}</p>
              )}
            </div>
            <div>
              <Label htmlFor="reason">Motivo *</Label>
              <Textarea
                id="reason"
                rows={4}
                placeholder={decisionDialog?.mode === "approve"
                  ? "Ej: matrícula verificada en colegio profesional, documentación correcta."
                  : "Ej: matrícula no validada, datos inconsistentes, falta de consentimiento firmado."}
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionDialog(null)}>Cancelar</Button>
            <Button onClick={saveDecision} disabled={savingDecision}>
              {savingDecision && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirmar decisión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
