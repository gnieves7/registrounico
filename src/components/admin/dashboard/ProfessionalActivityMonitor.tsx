import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Activity, LogIn, UserPlus, FileSignature, CheckCircle2, XCircle, Edit3, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Row {
  id: string;
  created_at: string;
  event_type: string;
  event_detail: any;
  user_id: string;
  user_name?: string;
  user_email?: string;
}

const EVENT_META: Record<string, { label: string; icon: any; tone: string }> = {
  login: { label: "Inicio de sesión", icon: LogIn, tone: "bg-blue-50 text-blue-700 border-blue-200" },
  signup: { label: "Cuenta creada", icon: UserPlus, tone: "bg-violet-50 text-violet-700 border-violet-200" },
  consent_signed: { label: "Consentimiento firmado", icon: FileSignature, tone: "bg-amber-50 text-amber-700 border-amber-200" },
  professional_approved: { label: "Aprobado por admin", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  professional_rejected: { label: "Rechazado por admin", icon: XCircle, tone: "bg-rose-50 text-rose-700 border-rose-200" },
  profile_updated: { label: "Datos modificados", icon: Edit3, tone: "bg-slate-50 text-slate-700 border-slate-200" },
  pdf_code_issued: { label: "Código PDF emitido", icon: FileSignature, tone: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  pdf_code_consumed: { label: "PDF descargado", icon: CheckCircle2, tone: "bg-teal-50 text-teal-700 border-teal-200" },
};

export function ProfessionalActivityMonitor() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const reload = async () => {
    setLoading(true);
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("account_type", "professional");
      const ids = (profs || []).map((p: any) => p.user_id);
      if (!ids.length) { setRows([]); setLoading(false); return; }
      const { data: logs } = await supabase
        .from("activity_log")
        .select("*")
        .in("user_id", ids)
        .order("created_at", { ascending: false })
        .limit(150);
      const byId: Record<string, any> = Object.fromEntries((profs || []).map((p: any) => [p.user_id, p]));
      setRows(((logs || []) as any[]).map((l) => ({
        ...l,
        user_name: byId[l.user_id]?.full_name,
        user_email: byId[l.user_id]?.email,
      })));
      setLoading(false);
  };

  useEffect(() => { reload(); }, []);

  const visible = filter
    ? rows.filter((r) =>
        (r.user_name || "").toLowerCase().includes(filter.toLowerCase()) ||
        (r.user_email || "").toLowerCase().includes(filter.toLowerCase()) ||
        r.event_type.toLowerCase().includes(filter.toLowerCase())
      )
    : rows;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-primary" /> Monitoreo de actividad profesional
          </CardTitle>
          <div className="flex items-center gap-2">
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar por nombre, email o evento…"
              className="h-8 text-xs w-56"
            />
            <Button size="sm" variant="outline" onClick={reload} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Actualizar
            </Button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          Últimos 150 eventos: registros, modificaciones, decisiones de aprobación, descargas y firma de consentimiento.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin text-primary" /></div>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">Sin actividad registrada.</p>
        ) : (
          <div className="space-y-2 max-h-[28rem] overflow-y-auto">
            {visible.map((r) => {
              const meta = EVENT_META[r.event_type] || { label: r.event_type, icon: Activity, tone: "bg-muted text-muted-foreground border-border" };
              const Icon = meta.icon;
              const reason = r.event_detail?.reason || r.event_detail?.summary || "";
              return (
                <div key={r.id} className="flex items-start justify-between gap-3 rounded-md border border-border p-2.5 text-xs hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className={`shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md border ${meta.tone}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{r.user_name || r.user_email || r.user_id.slice(0, 8)}</p>
                      {reason && <p className="text-muted-foreground line-clamp-2 mt-0.5">{reason}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant="outline" className={`text-[10px] ${meta.tone}`}>{meta.label}</Badge>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString("es-AR")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}