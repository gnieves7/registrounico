import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, TrendingDown, Users2, Loader2, Ban } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format, startOfMonth } from "date-fns";
import { es } from "date-fns/locale";

interface ProSub {
  user_id: string;
  full_name: string | null;
  email: string | null;
  license_number: string | null;
  license_jurisdiction: string | null;
  is_approved: boolean;
  sub_status: string | null;
  paid_until: string | null;
  last_payment_at: string | null;
  last_payment_id: string | null;
  trial_started_at: string | null;
  created_at: string;
}

const isSantaFe = (j: string | null) => (j || "").trim().toLowerCase() === "santa fe";

export function AdminSubscriptionsSection() {
  const [rows, setRows] = useState<ProSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: pros } = await supabase
      .from("profiles")
      .select("user_id, full_name, email, license_number, license_jurisdiction, is_approved, created_at")
      .eq("account_type", "professional");
    const list = pros || [];
    const { data: subs } = await supabase
      .from("professional_subscriptions")
      .select("user_id, status, paid_until, last_payment_at, last_payment_id, trial_started_at");
    const subMap: Record<string, any> = {};
    (subs || []).forEach((s: any) => {
      subMap[s.user_id] = s;
    });
    const merged: ProSub[] = list.map((p: any) => ({
      ...p,
      sub_status: subMap[p.user_id]?.status ?? null,
      paid_until: subMap[p.user_id]?.paid_until ?? null,
      last_payment_at: subMap[p.user_id]?.last_payment_at ?? null,
      last_payment_id: subMap[p.user_id]?.last_payment_id ?? null,
      trial_started_at: subMap[p.user_id]?.trial_started_at ?? null,
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const santaFe = useMemo(() => rows.filter((r) => isSantaFe(r.license_jurisdiction)), [rows]);
  const others = useMemo(() => rows.filter((r) => !isSantaFe(r.license_jurisdiction)), [rows]);

  const now = Date.now();
  const activePaid = others.filter(
    (r) => r.paid_until && new Date(r.paid_until).getTime() > now
  );
  const monthStart = startOfMonth(new Date()).getTime();
  const cancelledThisMonth = others.filter(
    (r) => r.sub_status === "cancelled" && r.last_payment_at && new Date(r.last_payment_at).getTime() >= monthStart
  );
  const estimatedMonthlyUsd = activePaid.length * 5;

  const cancelSub = async (userId: string) => {
    setCancelling(userId);
    const { error } = await supabase
      .from("professional_subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", userId);
    setCancelling(null);
    if (error) {
      toast({ title: "Error al cancelar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Suscripción cancelada", description: "El acceso se bloqueará al vencimiento del período pago." });
    load();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="rounded-xl bg-blue-500/10 p-2.5"><Users2 className="h-5 w-5 text-blue-500" /></div>
            <div>
              <p className="text-2xl font-bold">{activePaid.length}</p>
              <p className="text-xs text-muted-foreground">Suscripciones pagas activas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="rounded-xl bg-emerald-500/10 p-2.5"><DollarSign className="h-5 w-5 text-emerald-500" /></div>
            <div>
              <p className="text-2xl font-bold">USD {estimatedMonthlyUsd}</p>
              <p className="text-xs text-muted-foreground">Ingresos estimados del mes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-5">
            <div className="rounded-xl bg-amber-500/10 p-2.5"><TrendingDown className="h-5 w-5 text-amber-500" /></div>
            <div>
              <p className="text-2xl font-bold">{cancelledThisMonth.length}</p>
              <p className="text-xs text-muted-foreground">Bajas este mes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="santafe">
        <TabsList>
          <TabsTrigger value="santafe">Gratuitas (Santa Fe) · {santaFe.length}</TabsTrigger>
          <TabsTrigger value="others">Pagas (Otras provincias) · {others.length}</TabsTrigger>
        </TabsList>

        <TabsContent value="santafe" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Profesionales de Santa Fe</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Fecha inicio</TableHead>
                      <TableHead>Estado cuenta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {santaFe.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                          Sin profesionales registrados en Santa Fe.
                        </TableCell>
                      </TableRow>
                    )}
                    {santaFe.map((p) => (
                      <TableRow key={p.user_id}>
                        <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                        <TableCell className="text-xs">{p.email}</TableCell>
                        <TableCell className="text-xs">{p.license_number || "—"}</TableCell>
                        <TableCell className="text-xs">{format(new Date(p.created_at), "d MMM yyyy", { locale: es })}</TableCell>
                        <TableCell>
                          {p.is_approved ? (
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Activa</Badge>
                          ) : (
                            <Badge variant="secondary">Pendiente</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="others" className="mt-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Profesionales con plan pago</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Provincia</TableHead>
                      <TableHead>Suscripción</TableHead>
                      <TableHead>Inicio</TableHead>
                      <TableHead>Próx. vencimiento</TableHead>
                      <TableHead>ID pago</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {others.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-xs text-muted-foreground py-8">
                          Sin suscripciones pagas registradas.
                        </TableCell>
                      </TableRow>
                    )}
                    {others.map((p) => {
                      const active = p.paid_until && new Date(p.paid_until).getTime() > now;
                      return (
                        <TableRow key={p.user_id}>
                          <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                          <TableCell className="text-xs">{p.email}</TableCell>
                          <TableCell className="text-xs">{p.license_jurisdiction || "—"}</TableCell>
                          <TableCell>
                            {active ? (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">🔵 Activa</Badge>
                            ) : p.sub_status === "cancelled" ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">🔴 Cancelada</Badge>
                            ) : (
                              <Badge variant="secondary">⏳ Pendiente</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {p.trial_started_at ? format(new Date(p.trial_started_at), "d MMM yyyy", { locale: es }) : "—"}
                          </TableCell>
                          <TableCell className="text-xs">
                            {p.paid_until ? format(new Date(p.paid_until), "d MMM yyyy", { locale: es }) : "—"}
                          </TableCell>
                          <TableCell className="text-xs font-mono truncate max-w-[120px]">
                            {p.last_payment_id || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-destructive hover:text-destructive"
                              disabled={cancelling === p.user_id || !active}
                              onClick={() => cancelSub(p.user_id)}
                            >
                              <Ban className="h-3.5 w-3.5" />
                              Cancelar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}