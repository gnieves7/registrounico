import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  NotebookPen, User, BookOpen, Handshake, Activity, Thermometer,
  ArrowRight, Search, Loader2,
} from "lucide-react";
import { listPatients, type PatientLite } from "@/lib/adminPatients";
import { useActiveSchool } from "@/hooks/useActiveSchool";

const tools = [
  { title: "Psicobiografía", description: "Historia personal estructurada del paciente.", href: "/psychobiography", icon: User },
  { title: "Mi Cuaderno", description: "Notas y reflexiones compartidas por el paciente.", href: "/notebook", icon: BookOpen },
  { title: "Alianza terapéutica", description: "Vínculo, rupturas y reparación clínica.", href: "/therapeutic-alliance", icon: Handshake },
  { title: "Línea de vida", description: "Eventos vitales y ventanas de vulnerabilidad.", href: "/life-timeline", icon: Activity },
  { title: "Termómetro emocional", description: "Registro EMA del estado emocional diario.", href: "/emotional-thermometer", icon: Thermometer },
];

const getInitials = (name: string | null) =>
  name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

export function AdminClinicalNotesSection() {
  const navigate = useNavigate();
  const { school } = useActiveSchool();
  const [patients, setPatients] = useState<PatientLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold tracking-tight">Notas clínicas</h2>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
              style={{ background: `${school.color}15`, color: school.color }}
            >
              Escuela activa · {school.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Abrí la ficha del paciente para escribir, editar y exportar notas. Las plantillas sugeridas se adaptan a tu escuela.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Card key={t.href} className="border-border hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <Link to={t.href} className="flex items-start gap-3 group">
                <div className="rounded-md bg-primary/10 p-2 shrink-0">
                  <t.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient search & list */}
      <Card className="border-border">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
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
