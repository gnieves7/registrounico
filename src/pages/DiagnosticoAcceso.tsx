import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Row { label: string; value: any; ok?: boolean; }

export default function DiagnosticoAcceso() {
  const navigate = useNavigate();
  const { user, session, profile, isAdmin, isApproved, isLoading, signOut } = useAuth();
  const access = useProfessionalAccess();
  const [dbProfile, setDbProfile] = useState<any>(null);
  const [dbRoles, setDbRoles] = useState<any[]>([]);
  const [dbSub, setDbSub] = useState<any>(null);
  const [dbConsent, setDbConsent] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: p }, { data: r }, { data: s }, { data: c }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_roles").select("*").eq("user_id", user.id),
        supabase.from("professional_subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("professional_consents").select("*").eq("user_id", user.id).order("accepted_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("activity_log").select("event_type, event_detail, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
      ]);
      setDbProfile(p);
      setDbRoles(r ?? []);
      setDbSub(s);
      setDbConsent(c);
      setActivity(a ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [user?.id]);

  const clearSessionAndReload = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    Object.keys(localStorage).filter(k => k.startsWith("sb-")).forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    toast({ title: "Sesión limpiada", description: "Volvé a iniciar sesión." });
    setTimeout(() => { window.location.href = "/profesional/login"; }, 600);
  };

  // Diagnóstico de bloqueo
  let blockReason = "—";
  let blockKind: "ok" | "warn" | "error" = "ok";
  if (!user) { blockReason = "Sin sesión activa (JWT vencido o ausente). Limpiá sesión y volvé a iniciar."; blockKind = "error"; }
  else if (isAdmin) { blockReason = "Admin: acceso total."; }
  else if (!dbProfile) { blockReason = "No existe profile en la BD."; blockKind = "error"; }
  else if (dbProfile.account_type !== "professional") { blockReason = `account_type='${dbProfile.account_type}' (debería ser 'professional'). Algún trigger lo revirtió o nunca se cambió.`; blockKind = "error"; }
  else if (!dbProfile.consent_accepted_at) { blockReason = "Falta firmar consentimiento informado."; blockKind = "warn"; }
  else if (!dbProfile.is_approved) { blockReason = "Pendiente de aprobación del admin."; blockKind = "warn"; }
  else {
    const jur = (dbProfile.license_jurisdiction ?? "").trim().toLowerCase();
    if (jur === "santa fe") { blockReason = "Santa Fe: acceso gratuito habilitado."; }
    else if (dbSub?.paid_until && new Date(dbSub.paid_until) > new Date()) { blockReason = `Suscripción activa hasta ${new Date(dbSub.paid_until).toLocaleDateString()}.`; }
    else { blockReason = `Jurisdicción '${dbProfile.license_jurisdiction ?? "(vacía)"}' requiere suscripción USD 5/mes.`; blockKind = "warn"; }
  }

  const sessionRows: Row[] = [
    { label: "isLoading (auth)", value: String(isLoading) },
    { label: "user.id", value: user?.id ?? "—", ok: !!user },
    { label: "user.email", value: user?.email ?? "—", ok: !!user?.email },
    { label: "session.expires_at", value: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : "—", ok: !!session },
    { label: "isAdmin", value: String(isAdmin), ok: isAdmin },
    { label: "isApproved (auth ctx)", value: String(isApproved), ok: isApproved },
  ];

  const accessRows: Row[] = [
    { label: "loading", value: String(access.loading) },
    { label: "isProfessional", value: String(access.isProfessional), ok: access.isProfessional || isAdmin },
    { label: "hasAccess", value: String(access.hasAccess), ok: access.hasAccess },
    { label: "needsConsent", value: String(access.needsConsent), ok: !access.needsConsent },
    { label: "needsPayment", value: String(access.needsPayment), ok: !access.needsPayment },
    { label: "isSantaFe", value: String(access.isSantaFe), ok: access.isSantaFe },
    { label: "jurisdiction", value: access.jurisdiction ?? "—" },
  ];

  const dbRows: Row[] = dbProfile ? [
    { label: "account_type", value: dbProfile.account_type, ok: dbProfile.account_type === "professional" },
    { label: "is_approved", value: String(dbProfile.is_approved), ok: dbProfile.is_approved },
    { label: "license_jurisdiction", value: dbProfile.license_jurisdiction ?? "—", ok: (dbProfile.license_jurisdiction ?? "").toLowerCase().trim() === "santa fe" },
    { label: "license_number", value: dbProfile.license_number ?? "—", ok: !!dbProfile.license_number },
    { label: "license_college", value: dbProfile.license_college ?? "—" },
    { label: "consent_accepted_at", value: dbProfile.consent_accepted_at ?? "—", ok: !!dbProfile.consent_accepted_at },
    { label: "consent_signature_name", value: dbProfile.consent_signature_name ?? "—" },
    { label: "approval_decision", value: dbProfile.approval_decision ?? "—", ok: dbProfile.approval_decision === "approved" },
    { label: "approval_reason", value: dbProfile.approval_reason ?? "—" },
    { label: "approval_decided_at", value: dbProfile.approval_decided_at ?? "—" },
    { label: "roles", value: dbRoles.map(r => r.role).join(", ") || "—", ok: dbRoles.some(r => r.role === "admin" || r.role === "patient") },
    { label: "subscription.status", value: dbSub?.status ?? "—" },
    { label: "subscription.plan", value: dbSub?.plan ?? "—" },
    { label: "subscription.paid_until", value: dbSub?.paid_until ?? "—" },
    { label: "consent (último)", value: dbConsent ? `${dbConsent.full_name} · DNI ${dbConsent.dni} · ${new Date(dbConsent.accepted_at).toLocaleString()}` : "—", ok: !!dbConsent },
  ] : [];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Diagnóstico de acceso profesional</h1>
            <p className="text-sm text-muted-foreground">Comparación entre la sesión del navegador y los datos del backend.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refrescar
            </Button>
            <Button variant="outline" size="sm" onClick={clearSessionAndReload}>
              <LogOut className="h-4 w-4 mr-1" /> Limpiar sesión
            </Button>
          </div>
        </div>

        <Card className={blockKind === "error" ? "border-destructive" : blockKind === "warn" ? "border-amber-500" : "border-emerald-500"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {blockKind === "ok" ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : blockKind === "warn" ? <AlertTriangle className="h-5 w-5 text-amber-600" /> : <XCircle className="h-5 w-5 text-destructive" />}
              Resultado del diagnóstico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{blockReason}</p>
            {blockKind === "ok" && (
              <Button className="mt-3" onClick={() => navigate("/dashboard")}>Ir al dashboard</Button>
            )}
          </CardContent>
        </Card>

        <Section title="Sesión (cliente)" rows={sessionRows} />
        <Section title="useProfessionalAccess (cliente)" rows={accessRows} />
        <Section title="Datos en la BD (servidor)" rows={dbRows} />

        <Card>
          <CardHeader><CardTitle>Últimos eventos en activity_log</CardTitle></CardHeader>
          <CardContent>
            {activity.length === 0 ? <p className="text-sm text-muted-foreground">Sin eventos.</p> : (
              <ul className="text-xs space-y-1 font-mono">
                {activity.map((e, i) => (
                  <li key={i} className="flex flex-wrap gap-2">
                    <Badge variant="outline">{e.event_type}</Badge>
                    <span className="text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
                    {e.event_detail && <span className="text-muted-foreground break-all">{JSON.stringify(e.event_detail)}</span>}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-1.5 pr-3 text-muted-foreground w-1/2 md:w-1/3">{r.label}</td>
                <td className="py-1.5 font-mono text-xs break-all flex items-center gap-2">
                  {r.ok === true && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                  {r.ok === false && <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                  <span>{String(r.value)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
