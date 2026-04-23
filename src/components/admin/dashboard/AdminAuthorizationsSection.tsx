import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle, MapPin, Mail, IdCard, Calendar, Inbox } from "lucide-react";
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
}

export function AdminAuthorizationsSection() {
  const [pending, setPending] = useState<PendingPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [subsByUser, setSubsByUser] = useState<Record<string, { status: string; paid_until: string | null }>>({});

  const fetchPending = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, license_number, license_jurisdiction, created_at, approval_decision")
      .eq("account_type", "professional")
      .eq("is_approved", false)
      .is("approval_decided_at", null)
      .order("created_at", { ascending: true });
    const list = (data || []) as PendingPro[];
    setPending(list);

    if (list.length) {
      const { data: subs } = await supabase
        .from("professional_subscriptions")
        .select("user_id, status, paid_until")
        .in("user_id", list.map((p) => p.user_id));
      const map: Record<string, { status: string; paid_until: string | null }> = {};
      (subs || []).forEach((s: any) => {
        map[s.user_id] = { status: s.status, paid_until: s.paid_until };
      });
      setSubsByUser(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const isSantaFe = (j: string | null) => (j || "").trim().toLowerCase() === "santa fe";

  const decide = async (userId: string, approve: boolean) => {
    setProcessing(userId);
    const reason = reasons[userId]?.trim() || null;
    const { error } = await supabase
      .from("profiles")
      .update({
        is_approved: approve,
        approval_decision: approve ? "approved" : "rejected",
        approval_decided_at: new Date().toISOString(),
        approval_reason: reason,
      })
      .eq("user_id", userId);
    setProcessing(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: approve ? "Profesional aprobado" : "Profesional rechazado",
      description: approve ? "La cuenta ya puede operar." : "Se registró el rechazo.",
    });
    fetchPending();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium">No hay autorizaciones pendientes</p>
          <p className="text-xs text-muted-foreground mt-1">
            Todas las cuentas profesionales activas ya fueron revisadas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {pending.length} {pending.length === 1 ? "profesional pendiente" : "profesionales pendientes"} de revisión.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {pending.map((p) => {
          const sf = isSantaFe(p.license_jurisdiction);
          const sub = subsByUser[p.user_id];
          return (
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
                  {sf ? (
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Gratuito (SF)</Badge>
                  ) : (
                    <Badge variant="secondary">Pago · USD 5/mes</Badge>
                  )}
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

                <div className="text-xs">
                  <span className="text-muted-foreground">Suscripción actual: </span>
                  <Badge variant="outline" className="text-[10px]">
                    {sub?.status || "pending"}
                  </Badge>
                </div>

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
                    disabled={processing === p.user_id}
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
          );
        })}
      </div>
    </div>
  );
}