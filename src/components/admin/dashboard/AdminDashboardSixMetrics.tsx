import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, MapPin, CreditCard, UserPlus, ShieldAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";

interface Metrics {
  totalPatients: number;
  activePros: number;
  santaFePros: number;
  paidPros: number;
  newThisWeek: number;
  pendingAuth: number;
}

interface RecentEvent {
  id: string;
  user_id: string;
  event_type: string;
  created_at: string;
  event_detail: any;
  actor_name?: string;
  actor_type?: string;
}

const eventLabels: Record<string, string> = {
  login: "Inicio de sesión",
  logout: "Cierre de sesión",
  test_start: "Inició un test",
  test_complete: "Completó un test",
  profile_update: "Actualizó perfil",
  emotional_record: "Registro emocional",
  dream_record: "Registro de sueño",
  notebook_entry: "Nota de cuaderno",
  pdf_code_issued: "Emitió código PDF",
  pdf_code_consumed: "Código PDF consumido",
  professional_approved: "Profesional aprobado",
  professional_rejected: "Profesional rechazado",
};

const isSantaFe = (j: string | null) => (j || "").trim().toLowerCase() === "santa fe";

export function AdminDashboardSixMetrics() {
  const [m, setM] = useState<Metrics>({
    totalPatients: 0,
    activePros: 0,
    santaFePros: 0,
    paidPros: 0,
    newThisWeek: 0,
    pendingAuth: 0,
  });
  const [recent, setRecent] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const weekAgo = subDays(new Date(), 7).toISOString();
      const now = new Date().toISOString();

      const [{ data: allProfiles }, { data: subs }, { data: events }] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, account_type, is_approved, license_jurisdiction, created_at, approval_decided_at"),
        supabase.from("professional_subscriptions").select("user_id, paid_until, status"),
        supabase.from("activity_log").select("id, user_id, event_type, event_detail, created_at").order("created_at", { ascending: false }).limit(10),
      ]);

      const profiles = allProfiles || [];
      const totalPatients = profiles.filter((p: any) => p.account_type !== "professional").length;
      const proList = profiles.filter((p: any) => p.account_type === "professional");
      const activePros = proList.filter((p: any) => p.is_approved).length;
      const santaFePros = proList.filter((p: any) => p.is_approved && isSantaFe(p.license_jurisdiction)).length;
      const pendingAuth = proList.filter((p: any) => !p.is_approved && !p.approval_decided_at).length;
      const paidUserIds = new Set(
        (subs || [])
          .filter((s: any) => s.paid_until && new Date(s.paid_until).getTime() > Date.now())
          .map((s: any) => s.user_id)
      );
      const paidPros = proList.filter((p: any) => paidUserIds.has(p.user_id)).length;
      const newThisWeek = profiles.filter((p: any) => new Date(p.created_at) >= new Date(weekAgo)).length;

      setM({ totalPatients, activePros, santaFePros, paidPros, newThisWeek, pendingAuth });

      // Enriquecer recent con nombre y tipo
      const nameMap: Record<string, { name: string; type: string }> = {};
      profiles.forEach((p: any) => {
        nameMap[p.user_id] = { name: p.full_name || "Usuario", type: p.account_type };
      });
      const enriched = (events || []).map((e: any) => ({
        ...e,
        actor_name: nameMap[e.user_id]?.name || "—",
        actor_type: nameMap[e.user_id]?.type || "—",
      }));
      setRecent(enriched);

      setLoading(false);
    };
    load();
  }, []);

  const cards = [
    { label: "Pacientes registrados", value: m.totalPatients, icon: Users, color: "text-blue-500" },
    { label: "Profesionales activos", value: m.activePros, icon: Briefcase, color: "text-emerald-500" },
    { label: "Santa Fe (gratuitos)", value: m.santaFePros, icon: MapPin, color: "text-teal-500" },
    { label: "Otras provincias (pagos)", value: m.paidPros, icon: CreditCard, color: "text-indigo-500" },
    { label: "Nuevos esta semana", value: m.newThisWeek, icon: UserPlus, color: "text-purple-500" },
    { label: "Autorizaciones pendientes", value: m.pendingAuth, icon: ShieldAlert, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <CardContent className="flex flex-col items-start gap-2 py-4">
                <div className="rounded-lg bg-muted p-2">
                  <c.icon className={`h-4 w-4 ${c.color}`} />
                </div>
                <p className="text-2xl font-bold">{loading ? "—" : c.value}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">{c.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Actividad reciente</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead className="text-right">Fecha y hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                      Sin actividad reciente.
                    </TableCell>
                  </TableRow>
                )}
                {recent.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-sm font-medium">{e.actor_name}</TableCell>
                    <TableCell className="text-xs capitalize text-muted-foreground">
                      {e.actor_type === "professional" ? "Profesional" : "Paciente"}
                    </TableCell>
                    <TableCell className="text-xs">{eventLabels[e.event_type] || e.event_type}</TableCell>
                    <TableCell className="text-xs text-right text-muted-foreground">
                      {format(new Date(e.created_at), "d MMM HH:mm", { locale: es })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}