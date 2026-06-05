import { NotebookPen, CalendarClock, Sparkles, ArrowRight, ClipboardList, ShieldCheck, Brain, HeartHandshake, ClipboardCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import { ProNextSessionCard } from "./ProNextSessionCard";

interface Props {
  onNavigateSection?: (section: string) => void;
}

type QuickItem = {
  key: string;
  title: string;
  description: string;
  icon: typeof NotebookPen;
  accent: string;
};

type Category = {
  id: "reflexionar" | "evaluar" | "acompanar";
  title: string;
  caption: string;
  icon: typeof Brain;
  color: string;
  items: QuickItem[];
};

export function AdminDashboardHome({ onNavigateSection }: Props = {}) {
  const { profile } = useAuth();
  const { school } = useActiveSchool();

  const categories: Category[] = [
    {
      id: "reflexionar",
      title: "Reflexionar",
      caption: "Escucha clínica, psicobiografía y narrativa del/la consultante.",
      icon: Brain,
      color: "hsl(25 90% 55%)",
      items: [
        {
          key: "clinical_notes",
          title: "Notas clínicas",
          description: "Psicobiografía, cuaderno del paciente, alianza terapéutica y línea de vida.",
          icon: NotebookPen,
          accent: "from-primary/10 to-primary/5",
        },
      ],
    },
    {
      id: "evaluar",
      title: "Evaluar",
      caption: "Planillas, psicodiagnóstico, informes y autorizaciones profesionales.",
      icon: ClipboardCheck,
      color: "hsl(200 85% 50%)",
      items: [
        {
          key: "interview_models",
          title: "Modelos de entrevista e informes",
          description: "Primera entrevista psicodiagnóstica y modelos PDF descargables/rellenables.",
          icon: ClipboardList,
          accent: "from-amber-500/10 to-amber-500/5",
        },
        {
          key: "authorizations",
          title: "Autorizaciones de profesionales",
          description: "Aprobá, rechazá y auditá el acceso de colegas a la plataforma.",
          icon: ShieldCheck,
          accent: "from-rose-500/10 to-rose-500/5",
        },
      ],
    },
    {
      id: "acompanar",
      title: "Acompañar",
      caption: "Agenda, recursos simbólicos y vínculo terapéutico sostenido.",
      icon: HeartHandshake,
      color: "hsl(155 65% 40%)",
      items: [
        {
          key: "booking",
          title: "Reserva de turnos",
          description: "Generá un nuevo turno y accedé a tu Google Calendar.",
          icon: CalendarClock,
          accent: "from-sky-500/10 to-sky-500/5",
        },
        {
          key: "symbolic",
          title: "Recursos simbólicos",
          description: "Cámara Gesell, consentimientos, red de síntomas, informes y más.",
          icon: Sparkles,
          accent: "from-emerald-500/10 to-emerald-500/5",
        },
      ],
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
            Tu workspace organizado en los tres ejes clínicos: Reflexionar · Evaluar · Acompañar.
          </p>
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2.5 py-1"
          style={{ background: `${school.color}15`, color: school.color }}
        >
          Escuela activa · {school.name}
        </span>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <section key={cat.id} className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-md"
                style={{ background: `${cat.color}18`, color: cat.color }}
              >
                <cat.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: cat.color }}>
                  {cat.title}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-tight">{cat.caption}</p>
              </div>
              <div className="flex-1 h-px bg-border ml-2" />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {cat.items.map((q) => (
                <button
                  key={q.key}
                  onClick={() => onNavigateSection?.(q.key)}
                  className={`group relative overflow-hidden rounded-xl border border-border bg-gradient-to-br ${q.accent} p-5 text-left transition-all hover:border-primary/40 hover:shadow-md`}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="rounded-lg bg-background/80 p-2 shadow-sm">
                      <q.icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h4 className="text-base font-semibold tracking-tight mb-0.5">{q.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{q.description}</p>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ProNextSessionCard />
    </div>
  );
}
