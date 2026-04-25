import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MessageSquarePlus, Search, CheckCircle2, Inbox } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PatientProposal {
  id: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
  user_id: string;
  section_key: string | null;
  section_label: string | null;
  patient?: { full_name: string | null; email: string | null } | null;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "nueva", label: "Pendiente" },
  { value: "en_revision", label: "En revisión" },
  { value: "implementada", label: "Atendida" },
  { value: "descartada", label: "Descartada" },
];

const STATUS_COLOR: Record<string, string> = {
  nueva: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300",
  en_revision: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-300",
  implementada: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300",
  descartada: "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300",
};

/**
 * Panel para el psicólogo / admin: muestra los temas y preguntas que los pacientes
 * dejaron desde las secciones informativas (Acompañar / Reflexionar / Evaluar).
 * Las propuestas se almacenan en `suggestions` con category='pregunta_sesion'.
 */
export function AdminPatientProposalsSection() {
  const [items, setItems] = useState<PatientProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pendientes");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suggestions")
      .select("id, title, message, status, created_at, user_id, section_key, section_label")
      .eq("category", "pregunta_sesion")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error al cargar", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const ids = Array.from(new Set((data || []).map((s) => s.user_id)));
    let profiles: Record<string, { full_name: string | null; email: string | null }> = {};
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", ids);
      profiles = Object.fromEntries(
        (profs || []).map((p) => [p.user_id, { full_name: p.full_name, email: p.email }])
      );
    }
    setItems(
      (data || []).map((s) => ({
        ...(s as PatientProposal),
        patient: profiles[s.user_id] || null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const sections = useMemo(() => {
    const set = new Map<string, string>();
    items.forEach((i) => {
      if (i.section_key) set.set(i.section_key, i.section_label || i.section_key);
    });
    return Array.from(set.entries());
  }, [items]);

  const filtered = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = norm(search.trim());
    return items.filter((i) => {
      if (statusFilter === "pendientes" && (i.status === "implementada" || i.status === "descartada")) return false;
      if (statusFilter !== "all" && statusFilter !== "pendientes" && i.status !== statusFilter) return false;
      if (sectionFilter !== "all" && i.section_key !== sectionFilter) return false;
      if (!q) return true;
      const hay = [
        i.title,
        i.message,
        i.section_label,
        i.patient?.full_name,
        i.patient?.email,
      ]
        .filter(Boolean)
        .map((x) => norm(String(x)))
        .join(" ");
      return hay.includes(q);
    });
  }, [items, statusFilter, sectionFilter, search]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("suggestions")
      .update({
        status,
        ...(status === "implementada" ? { approved_at: new Date().toISOString() } : {}),
        ...(status === "descartada" ? { rejected_at: new Date().toISOString() } : {}),
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Estado actualizado" });
    load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          Preguntas y temas de pacientes
        </h2>
        <p className="text-sm text-muted-foreground">
          Propuestas dejadas por pacientes desde secciones informativas (Acompañar, Reflexionar, Evaluar)
          para abordar en la próxima sesión.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por paciente, sección o texto…"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[170px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pendientes">Pendientes</SelectItem>
            <SelectItem value="all">Todas</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sección" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las secciones</SelectItem>
            {sections.map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
            <Inbox className="h-8 w-8 opacity-50" />
            No hay propuestas para este filtro.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <Card key={p.id}>
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{p.title}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {p.patient?.full_name || p.patient?.email || p.user_id.slice(0, 8)} ·{" "}
                      {new Date(p.created_at).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.section_label && (
                      <Badge variant="outline" className="text-[10px]">
                        {p.section_label}
                      </Badge>
                    )}
                    <Badge className={`border text-[10px] ${STATUS_COLOR[p.status] || ""}`}>
                      {STATUS_OPTIONS.find((o) => o.value === p.status)?.label || p.status}
                    </Badge>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm">{p.message}</p>
                <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-2">
                  <Select value={p.status} onValueChange={(v) => updateStatus(p.id, v)}>
                    <SelectTrigger className="h-8 w-[170px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {p.status !== "implementada" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      onClick={() => updateStatus(p.id, "implementada")}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Marcar atendida
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}