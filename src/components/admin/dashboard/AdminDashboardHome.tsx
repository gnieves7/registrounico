import { NotebookPen, CalendarClock, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import { ProNextSessionCard } from "./ProNextSessionCard";

interface Props {
  onNavigateSection?: (section: string) => void;
}

export function AdminDashboardHome({ onNavigateSection }: Props = {}) {
  const { profile } = useAuth();
  const { school } = useActiveSchool();

  const quickAccess = [
    {
      key: "clinical_notes",
      title: "Notas clínicas",
      description: "Psicobiografía, cuaderno del paciente, alianza terapéutica, línea de vida y termómetro emocional.",
      icon: NotebookPen,
      accent: "from-primary/10 to-primary/5",
    },
    {
      key: "booking",
      title: "Reserva de turnos",
      description: "Generá un nuevo turno para terapia y accedé a tu Google Calendar.",
      icon: CalendarClock,
      accent: "from-sky-500/10 to-sky-500/5",
    },
    {
      key: "symbolic",
      title: "Recursos simbólicos",
      description: "Personalidad, recursos psicoforenses, Cámara Gesell, informes, consentimientos, red de síntomas y más.",
      icon: Sparkles,
      accent: "from-emerald-500/10 to-emerald-500/5",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Hola{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}.
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Elegí por dónde empezar tu jornada clínica.
          </p>
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1"
          style={{ background: `${school.color}15`, color: school.color }}
        >
          Escuela activa · {school.name}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickAccess.map((q) => (
          <button
            key={q.key}
            onClick={() => onNavigateSection?.(q.key)}
            className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${q.accent} p-6 text-left transition-all hover:border-primary/40 hover:shadow-md`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg bg-background/80 p-2.5 shadow-sm">
                <q.icon className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold tracking-tight mb-1">{q.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{q.description}</p>
          </button>
        ))}
      </div>

      <ProNextSessionCard />
    </div>
  );
}
