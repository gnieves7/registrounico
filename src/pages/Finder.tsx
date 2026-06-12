import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listPatients, type PatientLite } from "@/lib/adminPatients";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, FolderOpen, Users, Calendar, FileText, Sparkles, ChevronRight, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_SECTIONS = [
  { id: "patients", label: "Pacientes", icon: Users },
  { id: "today", label: "Sesiones de hoy", icon: Calendar },
  { id: "documents", label: "Documentos", icon: FileText },
  { id: "tests", label: "Tests", icon: Sparkles },
];

export default function Finder() {
  const navigate = useNavigate();
  const [section, setSection] = useState<string>("patients");
  const [patients, setPatients] = useState<PatientLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PatientLite | null>(null);

  useEffect(() => {
    listPatients()
      .then((rows) => setPatients(rows))
      .catch((e) => console.error("Finder listPatients", e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) =>
      [p.full_name, p.email].filter(Boolean).some((v) => v!.toLowerCase().includes(q)),
    );
  }, [patients, search]);

  const initials = (name: string | null) =>
    (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="grid h-full grid-cols-12 gap-0 text-sm">
      {/* Sidebar */}
      <aside className="col-span-3 border-r border-border/60 bg-muted/30 p-3 md:col-span-2">
        <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Star className="h-3 w-3" /> Favoritos
        </div>
        <nav className="space-y-0.5">
          {SIDEBAR_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-accent",
                section === s.id && "bg-primary/15 font-medium text-primary",
              )}
            >
              <s.icon className="h-4 w-4" />
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* List */}
      <section className="col-span-5 flex min-h-0 flex-col border-r border-border/60 md:col-span-6">
        <div className="border-b border-border/60 bg-background/60 px-4 py-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar paciente, email…"
              className="pl-9 h-8 rounded-full bg-background"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <FolderOpen className="mb-2 h-10 w-10 opacity-50" />
              <p>No hay pacientes que coincidan.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {filtered.map((p) => (
                <li
                  key={p.user_id}
                  onClick={() => setSelected(p)}
                  onDoubleClick={() => navigate(`/admin/patient/${p.user_id}`)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-4 py-2 transition-colors hover:bg-accent/60",
                    selected?.user_id === p.user_id && "bg-primary/12",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={p.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/15 text-[11px]">{initials(p.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.full_name || "—"}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.email}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Quick Look */}
      <aside className="col-span-4 flex min-h-0 flex-col bg-muted/20 p-5 md:col-span-4">
        {selected ? (
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 ring-2 ring-primary/20">
              <AvatarImage src={selected.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/15 text-lg">{initials(selected.full_name)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-3 font-serif text-lg font-semibold">{selected.full_name || "—"}</h3>
            <p className="text-xs text-muted-foreground">{selected.email}</p>
            <span className={cn(
              "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              selected.is_approved ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700",
            )}>
              {selected.is_approved ? "Activo" : "Pendiente"}
            </span>

            <button
              onClick={() => navigate(`/admin/patient/${selected.user_id}`)}
              className="mt-5 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Abrir ficha
            </button>

            <div className="mt-4 w-full space-y-1 text-left text-xs text-muted-foreground">
              <p><span className="font-medium text-foreground">Alta:</span> {new Date(selected.created_at).toLocaleDateString("es-AR")}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
            <FolderOpen className="mb-2 h-10 w-10 opacity-40" />
            <p className="text-sm">Seleccioná un paciente para previsualizar</p>
          </div>
        )}
      </aside>
    </div>
  );
}