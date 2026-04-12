import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, Scale, ArrowRight } from "lucide-react";
import { setStoredSystemArea, applySystemTheme, type SystemArea } from "@/lib/systemBranding";
import { motion } from "framer-motion";

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
      <motion.div
        className="w-full max-w-lg space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h1
            className="font-serif text-2xl font-bold text-foreground"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Modo Demostración
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Seleccioná el sistema que querés explorar. Podés cambiar en cualquier momento.
          </motion.p>
        </div>

        <div className="space-y-3">
          {systems.map((sys, i) => (
            <motion.div
              key={sys.key}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="cursor-pointer transition-shadow hover:shadow-md hover:border-primary/30"
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
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Navegación de solo lectura · No se modifican datos reales
        </motion.p>
      </motion.div>
    </div>
  );
}
