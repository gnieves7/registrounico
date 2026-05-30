import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SCHOOL_CONFIG, type SchoolType } from "@/config/schools";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import { PsiLogo } from "@/components/ui/PsiLogo";
import Footer from "@/components/layout/Footer";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ORDER: SchoolType[] = [
  "psychoanalytic",
  "cognitive_behavioral",
  "humanistic",
  "systemic",
  "behavioral",
];

export default function SchoolSelection() {
  const navigate = useNavigate();
  const { setSchool } = useActiveSchool();
  const { isAdmin, isApproved, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) navigate("/login", { replace: true });
    else if (!isAdmin && !isApproved) navigate("/login", { replace: true });
  }, [user, isAdmin, isApproved, isLoading, navigate]);

  const choose = (id: SchoolType) => {
    setSchool(id);
    sessionStorage.setItem("school_chosen_at", String(Date.now()));
    navigate(isAdmin ? "/admin/dashboard" : "/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <PsiLogo size="lg" />
            <h1 className="mt-4 font-serif text-2xl font-bold text-foreground md:text-3xl">
              Elegí tu escuela psicológica
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              La interfaz, la terminología clínica y los recursos se adaptan a la escuela seleccionada.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORDER.map((id) => {
              const s = SCHOOL_CONFIG[id];
              return (
                <button
                  key={id}
                  onClick={() => choose(id)}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary/50 hover:shadow-lg"
                  style={{ borderTop: `3px solid ${s.color}` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-2xl"
                      style={{ background: `${s.color}15`, color: s.color }}
                    >
                      {s.icon}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <h2 className="text-base font-semibold tracking-tight" style={{ color: s.color }}>
                    {s.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {s.authors.slice(0, 3).map((a) => a.name).join(" · ")}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Podés cambiar de escuela cuando quieras desde tu perfil profesional.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}