import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Brain, BookOpen, Scale, ArrowRight, ChevronRight, ShieldCheck, LogIn } from "lucide-react";
import { setStoredSystemArea, applySystemTheme, type SystemArea } from "@/lib/systemBranding";
import { SCHOOL_LIST, type SchoolType } from "@/config/schools";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const systems: { key: SystemArea; label: string; subtitle: string; icon: typeof Brain; color: string }[] = [
  { key: "reflexionar", label: "Reflexionar", subtitle: "Área Clínica", icon: Brain, color: "bg-blue-500/10 text-blue-600" },
  { key: "evaluar", label: "Evaluar", subtitle: "Área Psicodiagnóstica", icon: BookOpen, color: "bg-emerald-500/10 text-emerald-600" },
  { key: "acompanar", label: "Acompañar", subtitle: "Área Forense", icon: Scale, color: "bg-amber-500/10 text-amber-600" },
];

export default function DemoEntry() {
  const { enterDemoMode } = useDemoMode();
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"auth" | "school" | "system">("auth");
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | null>(null);
  const [fullName, setFullName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, pre-fill name
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleAuthRequest = async () => {
    if (!fullName.trim()) {
      toast.error("Ingresá tu nombre completo");
      return;
    }
    if (!matricula.trim()) {
      toast.error("Ingresá tu número de matrícula profesional");
      return;
    }

    if (!user) {
      // Need to sign in with Google first
      setIsSubmitting(true);
      try {
        await signInWithGoogle();
        // After redirect, user will come back — we store temp data
        sessionStorage.setItem("psi_demo_request_name", fullName.trim());
        sessionStorage.setItem("psi_demo_request_matricula", matricula.trim());
      } catch (err) {
        toast.error("Error al iniciar sesión con Google");
        setIsSubmitting(false);
      }
      return;
    }

    // User is already logged in — proceed
    proceedAfterAuth();
  };

  const proceedAfterAuth = () => {
    // Store request info for admin review
    sessionStorage.setItem("psi_demo_request_name", fullName.trim());
    sessionStorage.setItem("psi_demo_request_matricula", matricula.trim());

    toast.success("Solicitud registrada", {
      description: "Tu acceso de prueba ha sido habilitado. Un administrador revisará tu solicitud.",
    });

    enterDemoMode();
    setStep("school");
  };

  // Check if returning from Google OAuth
  useEffect(() => {
    const savedName = sessionStorage.getItem("psi_demo_request_name");
    const savedMatricula = sessionStorage.getItem("psi_demo_request_matricula");
    if (user && savedName && savedMatricula) {
      setFullName(savedName);
      setMatricula(savedMatricula);
      proceedAfterAuth();
    }
  }, [user]);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <AnimatePresence mode="wait">
        {step === "auth" ? (
          <motion.div
            key="auth"
            className="w-full max-w-md space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center">
              <motion.div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ShieldCheck className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h1
                className="font-serif text-2xl font-bold text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Solicitud de Acceso Profesional
              </motion.h1>
              <motion.p
                className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Para acceder al modo de prueba, necesitamos verificar tu identidad profesional.
                Un administrador revisará tu solicitud.
              </motion.p>
            </div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Nombre completo
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Ej: Lic. María González"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="matricula" className="text-sm font-medium">
                      Número de matrícula profesional
                    </Label>
                    <Input
                      id="matricula"
                      placeholder="Ej: MP 1889"
                      value={matricula}
                      onChange={(e) => setMatricula(e.target.value)}
                      className="h-11"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Colegio de Psicólogos u organismo habilitante correspondiente
                    </p>
                  </div>

                  <Button
                    onClick={handleAuthRequest}
                    disabled={isSubmitting}
                    className="w-full h-11 gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    {user ? "Solicitar acceso de prueba" : "Continuar con Google"}
                  </Button>

                  {!user && (
                    <p className="text-[11px] text-center text-muted-foreground">
                      Se te pedirá iniciar sesión con tu cuenta de Google para verificar tu identidad
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.p
              className="text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              🔒 Navegación de solo lectura · No se modifican datos reales
            </motion.p>
          </motion.div>
        ) : step === "school" ? (
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
