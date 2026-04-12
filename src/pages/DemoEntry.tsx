import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, Scale, ArrowRight, ChevronRight } from "lucide-react";
import { setStoredSystemArea, applySystemTheme, type SystemArea } from "@/lib/systemBranding";
import { SCHOOL_LIST, type SchoolType } from "@/config/schools";
import { motion, AnimatePresence } from "framer-motion";

const systems: { key: SystemArea; label: string; subtitle: string; icon: typeof Brain; color: string }[] = [
  { key: "reflexionar", label: "Reflexionar", subtitle: "Área Clínica", icon: Brain, color: "bg-blue-500/10 text-blue-600" },
  { key: "evaluar", label: "Evaluar", subtitle: "Área Psicodiagnóstica", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
  { key: "acompanar", label: "Acompañar", subtitle: "Área Forense", icon: Scale, color: "bg-amber-500/10 text-amber-600" },
];

export default function DemoEntry() {
  const { enterDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  const [step, setStep] = useState<"school" | "system">("school");
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);

  useEffect(() => {
    enterDemoMode();
    setEntered(true);
  }, [enterDemoMode]);

  const handleSchoolSelect = (id: SchoolType) => {
    setSelectedSchool(id);
    sessionStorage.setItem("psi_active_school", id);
    setTimeout(() => setStep("system"), 300);
  };

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
      <AnimatePresence mode="wait">
        {step === "school" ? (
          <motion.div
            key="school"
            className="w-full max-w-lg space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <motion.h1
                className="font-serif text-2xl font-bold text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                ¿Desde qué marco teórico ejercés tu práctica?
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-muted-foreground max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Tu elección adapta la terminología, las plantillas de informe y los instrumentos disponibles.
                Podés cambiarlo por caso o actualizarlo cuando quieras.
              </motion.p>
            </div>

            <div className="space-y-2.5">
              {SCHOOL_LIST.map((school, i) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, type: "spring", stiffness: 140 }}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer transition-all hover:shadow-md"
                    style={{
                      borderColor: selectedSchool === school.id ? school.color : undefined,
                      borderWidth: selectedSchool === school.id ? 2 : 1,
                      background: selectedSchool === school.id ? school.colorSoft : undefined,
                    }}
                    onClick={() => handleSchoolSelect(school.id)}
                  >
                    <CardContent className="flex items-start gap-3 p-4">
                      <span className="text-xl mt-0.5">{school.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[15px]" style={{ color: school.color }}>
                          {school.name}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                          {school.authors.slice(0, 4).map(a => a.name).join(' · ')}
                        </p>
                        <p className="text-[12px] text-muted-foreground mt-0.5">
                          Terminología: <span className="font-medium">{school.terms.patient}</span>,{" "}
                          <span className="font-medium">{school.terms.intake}</span>,{" "}
                          <span className="font-medium">{school.terms.diagnosis}</span>
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedSchool && (
              <motion.p
                className="text-center text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                💡 Podés asignar una escuela diferente a cada caso individualmente.
              </motion.p>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="system"
            className="w-full max-w-lg space-y-6"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <motion.h1
                className="font-serif text-2xl font-bold text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Elegí el sistema a explorar
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Podés cambiar en cualquier momento desde el dashboard.
              </motion.p>
              <motion.button
                className="mt-1 text-xs text-primary underline"
                onClick={() => setStep("school")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                ← Cambiar escuela teórica
              </motion.button>
            </div>

            <div className="space-y-3">
              {systems.map((sys, i) => (
                <motion.div
                  key={sys.key}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 120 }}
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
              transition={{ delay: 0.7 }}
            >
              Navegación de solo lectura · No se modifican datos reales
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
