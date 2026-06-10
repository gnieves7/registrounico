import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SchoolSwitcher } from "@/components/SchoolSwitcher";
import {
  NotebookPen, User, BookOpen, Handshake, Activity, Thermometer,
  ArrowRight, Search, Loader2, Pin, Milestone, TrendingUp,
} from "lucide-react";
import { listPatients, type PatientLite } from "@/lib/adminPatients";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import { MENU_BY_SCHOOL } from "@/config/menuBySchool";
import { onAdminAction } from "@/lib/uiEvents";

type Tool = { id: string; fallbackTitle: string; href: string; icon: typeof User };
type ToolGroup = { id: string; label: string; tools: Tool[] };
const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "historia",
    label: "Historia y vínculo",
    tools: [
      { id: "history",  fallbackTitle: "Psicobiografía",       href: "/psychobiography",       icon: User },
      { id: "timeline", fallbackTitle: "Línea de vida",        href: "/life-timeline",         icon: Activity },
      { id: "alliance", fallbackTitle: "Alianza terapéutica",  href: "/therapeutic-alliance",  icon: Handshake },
    ],
  },
  {
    id: "registros",
    label: "Registros del paciente",
    tools: [
      { id: "notebook",  fallbackTitle: "Mi Cuaderno",          href: "/notebook",              icon: BookOpen },
      { id: "emotional", fallbackTitle: "Termómetro emocional", href: "/emotional-thermometer", icon: Thermometer },
    ],
  },
  {
    id: "seguimiento",
    label: "Indicaciones · Hitos · Evolución",
    tools: [
      { id: "tasks",      fallbackTitle: "Micro-tareas",            href: "/micro-tasks",         icon: Pin },
      { id: "rewards",    fallbackTitle: "Premios simbólicos",      href: "/symbolic-awards",     icon: Milestone },
      { id: "monitoring", fallbackTitle: "Monitoreo de resultados", href: "/outcome-monitoring",  icon: TrendingUp },
    ],
  },
];

const getInitials = (name: string | null) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

export function AdminClinicalNotesSection() {
  const navigate = useNavigate();
  const { school, schoolId } = useActiveSchool();
  const groups = useMemo(() => {
    const menu = MENU_BY_SCHOOL[schoolId] ?? [];
    const lookup = (id: string, fallback: string) =>
      menu.find((x) => x.id === id)?.label ?? fallback;
    return TOOL_GROUPS.map((g) => ({
      ...g,
      tools: g.tools.map((t) => ({ ...t, title: lookup(t.id, t.fallbackTitle) })),
    }));
  }, [schoolId]);
  const [patients, setPatients] = useState<PatientLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const data = await listPatients();
        if (!cancel) setPatients(data);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Contextual action from layout: focus patient search so the pro can pick a patient
  useEffect(() => {
    return onAdminAction("new-note", () => {
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return patients.filter((p) => {
      const matchSearch = !q ||
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "approved" ? p.is_approved : !p.is_approved);
      return matchSearch && matchStatus;
    });
  }, [patients, search, statusFilter]);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 flex-wrap">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <NotebookPen className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Notas clínicas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Plantillas, registros y seguimiento se adaptan a tu escuela activa.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
            style={{ background: `${school.color}15`, color: school.color }}
          >
            {school.name}
          </span>
          <SchoolSwitcher compact />
        </div>
      </div>

      <Card className="border-border">
        <CardContent className="p-2">
          <Accordion type="multiple" defaultValue={["seguimiento"]} className="w-full">
            {groups.map((g) => (
              <AccordionItem key={g.id} value={g.id} className="border-b last:border-b-0">
                <AccordionTrigger className="px-2 py-2.5 hover:no-underline">
                  <span className="text-sm font-medium">{g.label}</span>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-2">
                  <ul className="divide-y divide-border">
                    {g.tools.map((t) => (
                      <li key={t.href}>
                        <Link
                          to={t.href}
                          className="flex items-center gap-3 py-2 px-1 hover:bg-muted/50 rounded-md transition-colors group"
                        >
                          <div className="rounded-md bg-primary/10 p-1.5 shrink-0">
                            <t.icon className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="flex-1 text-sm">{(t as any).title}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Patient search & list */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Buscar paciente por nombre o email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="approved">Activos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando pacientes…
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">
              No hay pacientes que coincidan con la búsqueda.
            </p>
          ) : (
            <ul className="divide-y divide-border max-h-[420px] overflow-y-auto">
              {filtered.map((p) => (
                <li key={p.user_id}>
                  <button
                    onClick={() => navigate(`/admin/patient/${p.user_id}`)}
                    className="flex items-center gap-3 w-full py-2 px-1 text-left hover:bg-muted/50 rounded-md transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={p.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                        {getInitials(p.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.full_name || "Sin nombre"}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{p.email}</p>
                    </div>
                    <Badge
                      variant={p.is_approved ? "default" : "secondary"}
                      className={`text-[10px] ${p.is_approved ? "bg-emerald-600 text-white" : "bg-yellow-500 text-white"}`}
                    >
                      {p.is_approved ? "Activo" : "Pendiente"}
                    </Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
