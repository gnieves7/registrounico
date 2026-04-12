import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Scale, ArrowRight } from "lucide-react";
import { setStoredSystemArea, applySystemTheme, type SystemArea } from "@/lib/systemBranding";

const systems: { key: SystemArea; label: string; subtitle: string; icon: typeof Brain; color: string }[] = [
  { key: "reflexionar", label: "Reflexionar", subtitle: "Área Clínica", icon: Brain, color: "bg-blue-500/10 text-blue-600" },
  { key: "evaluar", label: "Evaluar", subtitle: "Área Psicodiagnóstica", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
  { key: "acompanar", label: "Acompañar", subtitle: "Área Forense", icon: Scale, color: "bg-amber-500/10 text-amber-600" },
];

export default function DemoEntry() {
  const { enterDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    enterDemoMode();
    setEntered(true);
  }, [enterDemoMode]);

  const selectSystem = (area: SystemArea) => {
    setStoredSystemArea(area);
    applySystemTheme(area, false);
    navigate("/dashboard", { replace: true });
  };

  if (!entered) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Preparando demostración…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-foreground">Modo Demostración</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seleccioná el sistema que querés explorar. Podés cambiar en cualquier momento.
          </p>
        </div>

        <div className="space-y-3">
          {systems.map((sys) => (
            <Card
              key={sys.key}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => selectSystem(sys.key)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${sys.color}`}>
                  <sys.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{sys.label}</p>
                  <p className="text-sm text-muted-foreground">{sys.subtitle}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Navegación de solo lectura · No se modifican datos reales
        </p>
      </div>
    </div>
  );
}
