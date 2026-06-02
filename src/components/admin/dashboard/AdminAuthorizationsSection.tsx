import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, XCircle, MapPin, Mail, IdCard, Calendar, Inbox, FileSignature, History, ShieldOff, AlertCircle, Search, Eye, RefreshCw, AlarmClock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PendingPro {
  user_id: string;
  full_name: string | null;
  email: string | null;
  license_number: string | null;
  license_jurisdiction: string | null;
  created_at: string;
  approval_decision: string | null;
  consent_id: string | null;
  consent_signed_at: string | null;
  consent_pdf_path: string | null;
}

interface AuditRow {
  id: string;
  professional_user_id: string;
  decision: "approved" | "rejected" | "revoked" | "revalidated";
  reason: string | null;
  consent_id: string | null;
  created_at: string;
  decided_by: string | null;
  professional_name: string | null;
  professional_email: string | null;
  decided_by_name: string | null;
  approval_expires_at?: string | null;
  revalidation_required?: boolean;
}

export function AdminAuthorizationsSection() {
  const [pending, setPending] = useState<PendingPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [history, setHistory] = useState<AuditRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [filterDecision, setFilterDecision] = useState<"all" | "approved" | "rejected" | "revoked">("all");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [runningCheck, setRunningCheck] = useState(false);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, license_number, license_jurisdiction, created_at, approval_decision")
      .eq("account_type", "professional")
      .eq("is_approved", false)
      .is("approval_decided_at", null)
      .order("created_at", { ascending: true });
    const ids = (profiles || []).map((p: any) => p.user_id);
    let consentsMap: Record<string, { id: string; accepted_at: string; pdf_storage_path: string | null }> = {};
    if (ids.length) {
      const { data: consents } = await supabase
        .from("professional_consents")
        .select("id, user_id, accepted_at, pdf_storage_path")
        .in("user_id", ids)
        .order("accepted_at", { ascending: false });
      (consents || []).forEach((c: any) => {
        if (!consentsMap[c.user_id]) consentsMap[c.user_id] = { id: c.id, accepted_at: c.accepted_at, pdf_storage_path: c.pdf_storage_path };
      });
    }
    const list: PendingPro[] = (profiles || []).map((p: any) => ({
      ...p,
      consent_id: consentsMap[p.user_id]?.id ?? null,
      consent_signed_at: consentsMap[p.user_id]?.accepted_at ?? null,
      consent_pdf_path: consentsMap[p.user_id]?.pdf_storage_path ?? null,
    }));
    setPending(list);
    setLoading(false);
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    const { data } = await supabase
      .from("authorization_audit_log")
      .select("id, professional_user_id, decision, reason, consent_id, created_at, decided_by")
      .order("created_at", { ascending: false })
      .limit(200);
    const rows = (data || []) as any[];
    const proIds = Array.from(new Set(rows.map((r) => r.professional_user_id)));
    const adminIds = Array.from(new Set(rows.map((r) => r.decided_by).filter(Boolean)));
    const allIds = Array.from(new Set([...proIds, ...adminIds]));
    let pmap: Record<string, { full_name: string | null; email: string | null }> = {};
    let expMap: Record<string, { approval_expires_at: string | null; revalidation_required: boolean }> = {};
    if (allIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, approval_expires_at, revalidation_required")
        .in("user_id", allIds);
      (profs || []).forEach((p: any) => {
        pmap[p.user_id] = { full_name: p.full_name, email: p.email };
        expMap[p.user_id] = { approval_expires_at: p.approval_expires_at, revalidation_required: p.revalidation_required };
      });
    }
    setHistory(
      rows.map((r) => ({
        ...r,
        professional_name: pmap[r.professional_user_id]?.full_name ?? null,
        professional_email: pmap[r.professional_user_id]?.email ?? null,
        decided_by_name: r.decided_by ? pmap[r.decided_by]?.full_name ?? pmap[r.decided_by]?.email ?? null : null,
        approval_expires_at: expMap[r.professional_user_id]?.approval_expires_at ?? null,
        revalidation_required: expMap[r.professional_user_id]?.revalidation_required ?? false,
      })),
    );
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, [fetchPending, fetchHistory]);

  const viewConsent = async (path: string | null, name: string | null) => {
    if (!path) {
      toast({ title: "Sin consentimiento", description: "No hay PDF firmado disponible.", variant: "destructive" });
      return;
    }
    setPreviewLoading(true);
    const { data, error } = await supabase.storage
      .from("consentimientos-profesionales")
      .createSignedUrl(path, 300);
    setPreviewLoading(false);
    if (error || !data?.signedUrl) {
      toast({ title: "Error", description: error?.message || "No se pudo abrir el consentimiento", variant: "destructive" });
      return;
    }
    setPreview({ url: data.signedUrl, name: name || "Consentimiento informado" });
  };

  const decide = async (userId: string, approve: boolean) => {
    setProcessing(userId);
    const reason = reasons[userId]?.trim() || null;
    const rpcName = approve ? "approve_professional" : "reject_professional";
    const { error } = await supabase.rpc(rpcName as any, { _user_id: userId, _reason: reason });
    setProcessing(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // Fire-and-forget email
    supabase.functions.invoke("notify-professional-status", {
      body: { user_id: userId, decision: approve ? "approved" : "rejected", reason },
    }).catch((e) => console.warn("notify-professional-status failed", e));
    toast({
      title: approve ? "Profesional aprobado" : "Profesional rechazado",
      description: approve
        ? "Se asignó el rol profesional y se envió notificación por email."
        : "Se registró la decisión y se notificó al solicitante.",
    });
    setReasons((r) => ({ ...r, [userId]: "" }));
    fetchPending();
    fetchHistory();
  };

  const revoke = async (userId: string) => {
    const reason = window.prompt("Motivo de la revocación (requerido):", "");
    if (!reason || !reason.trim()) {
      toast({ title: "Motivo requerido", variant: "destructive" });
      return;
    }
    setProcessing(userId);
    const { error } = await supabase.rpc("revoke_professional" as any, { _user_id: userId, _reason: reason });
    setProcessing(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    supabase.functions.invoke("notify-professional-status", {
      body: { user_id: userId, decision: "revoked", reason },
    }).catch((e) => console.warn("notify-professional-status failed", e));
    toast({ title: "Acceso revocado", description: "Se quitó el rol profesional y se notificó al usuario." });
    fetchHistory();
    fetchPending();
  };

  const revalidate = async (userId: string) => {
    const reason = window.prompt("Motivo / nota de la revalidación (opcional):", "") ?? "";
    setProcessing(userId);
    const { error } = await supabase.rpc("revalidate_professional" as any, { _user_id: userId, _reason: reason || null });
    setProcessing(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Autorización revalidada", description: "El acceso se extendió por 12 meses." });
    fetchHistory();
  };

  const runExpiryCheck = async () => {
    setRunningCheck(true);
    const { data, error } = await supabase.rpc("expire_overdue_authorizations" as any);
    setRunningCheck(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    const row = Array.isArray(data) ? (data[0] as any) : (data as any);
    toast({
      title: "Verificación de vencimientos",
      description: `${row?.warned ?? 0} próximos a vencer · ${row?.revoked ?? 0} revocados por vencimiento.`,
    });
    fetchHistory();
    fetchPending();
  };

  const filteredHistory = history.filter((h) => {
    if (filterDecision !== "all" && h.decision !== filterDecision) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      if (
        !(h.professional_name || "").toLowerCase().includes(s) &&
        !(h.professional_email || "").toLowerCase().includes(s) &&
        !(h.reason || "").toLowerCase().includes(s)
      ) return false;
    }
    return true;
  });

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Inbox className="h-4 w-4" /> Pendientes
            {pending.length > 0 && <Badge variant="secondary" className="ml-1">{pending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" /> Historial
          </TabsTrigger>
        </TabsList>
        <Button size="sm" variant="outline" className="gap-1.5" disabled={runningCheck} onClick={runExpiryCheck}>
          {runningCheck ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <AlarmClock className="h-3.5 w-3.5" />}
          Verificar vencimientos
        </Button>
      </div>

      <TabsContent value="pending" className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : pending.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No hay autorizaciones pendientes</p>
              <p className="text-xs text-muted-foreground mt-1">
                Todas las cuentas profesionales activas ya fueron revisadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pending.map((p) => (
              <Card key={p.user_id} className="border-amber-200 dark:border-amber-900/40">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{p.full_name || "Sin nombre"}</CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Mail className="h-3 w-3" />
                      {p.email}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Acceso gratuito</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <IdCard className="h-3.5 w-3.5" />
                    <span className="truncate">Matrícula: {p.license_number || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{p.license_jurisdiction || "Sin provincia"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Solicitó el {format(new Date(p.created_at), "d MMM yyyy", { locale: es })}</span>
                  </div>
                </div>

                  {p.consent_id ? (
                    <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-900/40 px-3 py-2 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                        <FileSignature className="h-3.5 w-3.5" />
                        Consentimiento firmado el {format(new Date(p.consent_signed_at!), "d MMM yyyy", { locale: es })}
                      </div>
                      {p.consent_pdf_path && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => viewConsent(p.consent_pdf_path, p.full_name)} disabled={previewLoading}>
                          <Eye className="h-3.5 w-3.5" /> Vista previa
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/40 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Consentimiento informado pendiente — no se puede aprobar
                    </div>
                  )}

                <Textarea
                  placeholder="Motivo de la decisión (opcional, visible en el log de actividad)…"
                  className="text-xs min-h-[60px]"
                  value={reasons[p.user_id] || ""}
                  onChange={(e) => setReasons((r) => ({ ...r, [p.user_id]: e.target.value }))}
                />

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                      disabled={processing === p.user_id || !p.consent_id}
                      title={!p.consent_id ? "Requiere consentimiento firmado" : undefined}
                    onClick={() => decide(p.user_id, true)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Aprobar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1.5 text-destructive hover:text-destructive"
                    disabled={processing === p.user_id}
                    onClick={() => decide(p.user_id, false)}
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="history" className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, email o motivo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <Tabs value={filterDecision} onValueChange={(v) => setFilterDecision(v as any)}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="approved">Aprobadas</TabsTrigger>
              <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
              <TabsTrigger value="revoked">Revocadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Sin registros que coincidan con los filtros.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredHistory.map((h) => {
              const color =
                h.decision === "approved"
                  ? "bg-emerald-100 text-emerald-800"
                  : h.decision === "revoked"
                    ? "bg-orange-100 text-orange-800"
                    : h.decision === "revalidated"
                      ? "bg-sky-100 text-sky-800"
                      : "bg-rose-100 text-rose-800";
              const label =
                h.decision === "approved" ? "Aprobado"
                : h.decision === "revoked" ? "Revocado"
                : h.decision === "revalidated" ? "Revalidado"
                : "Rechazado";
              const exp = h.approval_expires_at ? new Date(h.approval_expires_at) : null;
              const dueSoon = exp && exp.getTime() - Date.now() < 30 * 24 * 3600 * 1000 && exp.getTime() > Date.now();
              const expired = exp && exp.getTime() < Date.now();
              return (
                <Card key={h.id}>
                  <CardContent className="py-3 px-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate">{h.professional_name || h.professional_email || h.professional_user_id}</span>
                        <Badge className={color}>{label}</Badge>
                        {h.decision === "approved" && exp && (
                          <Badge variant="outline" className={expired ? "text-destructive border-destructive/40" : dueSoon ? "text-amber-700 border-amber-300" : ""}>
                            {expired ? "Vencido" : dueSoon ? "Vence pronto" : "Vence"} · {format(exp, "d MMM yyyy", { locale: es })}
                          </Badge>
                        )}
                      </div>
                      {h.professional_email && (
                        <p className="text-xs text-muted-foreground truncate">{h.professional_email}</p>
                      )}
                      {h.reason && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          <span className="font-medium">Motivo:</span> {h.reason}
                        </p>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {format(new Date(h.created_at), "d MMM yyyy, HH:mm", { locale: es })}
                        {h.decided_by_name && <> · por {h.decided_by_name}</>}
                      </p>
                    </div>
                    {h.decision === "approved" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          disabled={processing === h.professional_user_id}
                          onClick={() => revalidate(h.professional_user_id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Revalidar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={processing === h.professional_user_id}
                          onClick={() => revoke(h.professional_user_id)}
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                          Revocar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </TabsContent>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle className="text-base">Consentimiento informado firmado</DialogTitle>
            <DialogDescription className="text-xs">{preview?.name}</DialogDescription>
          </DialogHeader>
          {preview && (
            <iframe
              src={preview.url}
              title="Consentimiento PDF"
              className="flex-1 w-full border-t border-border"
            />
          )}
          <div className="flex justify-end gap-2 p-3 border-t border-border">
            {preview && (
              <Button asChild size="sm" variant="outline">
                <a href={preview.url} target="_blank" rel="noopener noreferrer">Abrir en pestaña nueva</a>
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setPreview(null)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}