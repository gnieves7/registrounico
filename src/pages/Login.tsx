import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck, LogOut, Flame, BookOpen, Scale, Calendar,
  ArrowLeft, Building2, MessageCircle, Globe, Mail, Heart,
  Search, Gavel, User, UserX, Briefcase, ChevronDown, Moon, Sun
} from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";
import logoPsi from "@/assets/logo_psi.png";
import heroImage from "@/assets/hero_psi_landing.png";
import logoALPJF from "@/assets/logo_ALPJF.png";
import logoAPFRA from "@/assets/logo_APFRA.png";
import {
  applySystemTheme, getStoredSystemArea, setStoredSystemArea,
  systemBranding, type SystemArea
} from "@/lib/systemBranding";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";
const WHATSAPP_LINK = "https://wa.me/5493426272158";
const EMPRESA_EMAIL = "mailto:pdf.consultas@gmail.com";
const EMPRESA_WEB = "https://www.psicodiagnostico-forense.com.ar";

type View = "main" | "paciente" | "no-paciente" | "question-terapia" | "question-psicodiagnostico" | "question-forense" | "profesional" | "empresa";

const systemCards = [
  {
    id: "reflexionar" as const,
    title: "Sistema Reflexionar",
    area: "Área Clínica",
    icon: Flame,
    image: systemBranding.reflexionar.logo,
    redirect: "/dashboard",
    description: "Abordaje terapéutico, avances, monitoreo del estado de ánimo e intervenciones clínicas.",
    codes: ["Código Clínico", "Código Intervenciones"],
    accentHue: "35",
  },
  {
    id: "evaluar" as const,
    title: "Sistema Evaluar",
    area: "Área Psicodiagnóstica",
    icon: BookOpen,
    image: systemBranding.evaluar.logo,
    redirect: "/dashboard",
    description: "Estudio de la personalidad, perfiles, psicodiagnósticos clínicos y aptitud psíquica.",
    codes: ["Código Personalidad", "Código Rorschach", "Código Aptitud Psíquica", "Código Junta Médica"],
    accentHue: "225",
  },
  {
    id: "acompanar" as const,
    title: "Sistema Acompañar",
    area: "Área Forense",
    icon: Scale,
    image: systemBranding.acompanar.logo,
    redirect: "/dashboard",
    description: "Problemática judicial, pericias, análisis del testimonio en Cámara Gesell y prácticas psico-forenses.",
    codes: ["Código Pericia", "Código Familia", "Código Cámara Gesell", "Código IPP"],
    accentHue: "100",
  },
];

const faqItems = [
  {
    q: "¿Cómo accedo por primera vez a la plataforma?",
    a: "Seleccioná \"Soy Paciente\", elegí el sistema que te indicó tu profesional y autenticáte con tu cuenta de Google. Tu acceso será revisado y aprobado antes de ingresar."
  },
  {
    q: "¿Mis datos son confidenciales?",
    a: "Absolutamente. Toda la información es cifrada, almacenada en servidores seguros y solo accesible por vos y tu profesional tratante. Cumplimos con estándares internacionales de protección de datos en salud."
  },
  {
    q: "¿Puedo usar la plataforma desde el celular?",
    a: "Sí, PSI está optimizada para dispositivos móviles. Podés acceder desde cualquier navegador sin necesidad de instalar una aplicación."
  },
  {
    q: "¿Cómo solicito una consulta o turno?",
    a: "Podés agendar tu consulta directamente desde la plataforma en la sección \"Mis Turnos\", o contactarnos por WhatsApp o email. También podés solicitar turno desde el botón de agenda en la página principal."
  },
  {
    q: "¿Se realizan consultas en modalidad online?",
    a: "Sí, ofrecemos atención tanto presencial como online por videollamada. La modalidad virtual está disponible para seguimiento clínico, psicodiagnóstico y acompañamiento forense, con la misma calidad y confidencialidad que la atención presencial."
  },
  {
    q: "¿Cuánto dura una sesión?",
    a: "Las sesiones clínicas tienen una duración aproximada de 45 a 50 minutos. Las evaluaciones psicodiagnósticas pueden requerir entre 60 y 90 minutos dependiendo del instrumento aplicado. Las entrevistas forenses se ajustan a las necesidades del proceso judicial."
  },
  {
    q: "¿Cuántas sesiones necesito?",
    a: "La cantidad de sesiones varía según cada caso. En la primera consulta se realiza una evaluación inicial y se establece un plan de trabajo conjunto. El proceso puede ser breve (8-12 sesiones) o extenderse según los objetivos terapéuticos acordados."
  },
  {
    q: "¿Qué diferencia hay entre los tres sistemas?",
    a: "El Sistema Reflexionar es el área clínica para terapia y seguimiento emocional. El Sistema Evaluar es el área psicodiagnóstica para tests de personalidad y evaluaciones de aptitud. El Sistema Acompañar es el área forense para acompañamiento en causas judiciales y pericias."
  },
];

const Login = () => {
  const { user, isLoading, isApproved, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("main");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    if (user && !isLoading && isApproved) {
      applySystemTheme(getStoredSystemArea());
      const redirectTo = sessionStorage.getItem("login_redirect");
      if (redirectTo) {
        sessionStorage.removeItem("login_redirect");
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }
    applySystemTheme(null);
  }, [user, isLoading, isApproved, navigate]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleGoogleLogin = async (redirectPath: string, area: SystemArea) => {
    try {
      sessionStorage.setItem("login_redirect", redirectPath);
      setStoredSystemArea(area);
      applySystemTheme(area);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error al iniciar sesión",
        description: "No se pudo conectar con Google. Intentá de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (user && !isApproved) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center rounded-3xl bg-card p-10 shadow-xl border border-border/50 max-w-md text-center">
            <ShieldCheck className="mb-4 h-14 w-14 text-primary" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">Acceso pendiente de autorización</h1>
            <p className="mb-4 text-muted-foreground">Tu solicitud fue recibida y será revisada por el profesional.</p>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (user && isApproved) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center rounded-3xl bg-card p-10 shadow-xl border border-border/50">
            <Flame className="mb-4 h-14 w-14 text-primary" />
            <h1 className="mb-2 text-3xl font-bold text-foreground">¡Hola de nuevo!</h1>
            <p className="mb-8 text-muted-foreground">Ya tenés una sesión activa.</p>
            <Button size="lg" className="rounded-xl" onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderSystemCard = (system: (typeof systemCards)[0], showLogin = true, showTurno = false) => {
    const h = system.accentHue;
    return (
      <div
        key={system.id}
        className="group flex flex-col items-stretch rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        <div className="h-1.5" style={{ background: `hsl(${h}, 55%, 50%)` }} />
        <div className="flex flex-col items-center gap-3 p-5 flex-1">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: `hsl(${h}, 40%, 92%)` }}
          >
            <system.icon className="h-6 w-6" style={{ color: `hsl(${h}, 55%, 35%)` }} />
          </div>
          <div className="text-center flex-1">
            <h3 className="text-sm font-bold text-foreground">{system.title}</h3>
            <p className="text-xs font-semibold text-primary tracking-wide mt-0.5">{system.area}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{system.description}</p>
          </div>
          {showLogin && (
            <button
              onClick={() => handleGoogleLogin(system.redirect, system.id)}
              className="mt-auto w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Acceder
            </button>
          )}
          {showTurno && (
            <div className="w-full space-y-2 mt-auto">
              <a href={CALENDAR_LINK} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]">
                <Calendar className="h-4 w-4" /> Solicitar Turno
              </a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 dark:bg-green-950/30 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-400 transition-all hover:bg-green-100 dark:hover:bg-green-950/50 active:scale-[0.98]">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-950/50 active:scale-[0.98]">
                <Globe className="h-4 w-4" /> Sitio Web
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPatientSystemButton = (system: (typeof systemCards)[0]) => (
    <button
      key={system.id}
      onClick={() => handleGoogleLogin(system.redirect, system.id)}
      className="group flex flex-col items-center gap-4 rounded-[2rem] border border-border/40 bg-card px-6 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border/50 bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-110 md:h-28 md:w-28">
        <img src={system.image} alt={system.title} className="h-full w-full rounded-full object-contain" loading="lazy" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-foreground md:text-base">{system.title}</h3>
        <p className="text-xs font-medium text-muted-foreground">{system.area}</p>
      </div>
      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
        Ingresar con Google
      </span>
    </button>
  );

  const renderBackButton = (backTo: View = "main") => (
    <button
      onClick={() => setView(backTo)}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="h-4 w-4" /> Volver
    </button>
  );

  const renderQuestionView = (questionView: "question-terapia" | "question-psicodiagnostico" | "question-forense") => {
    const map = {
      "question-terapia": systemCards[0],
      "question-psicodiagnostico": systemCards[1],
      "question-forense": systemCards[2],
    };
    const system = map[questionView];
    return (
      <div className="mx-auto w-full max-w-md px-6 py-6 animate-fade-in">
        {renderBackButton("no-paciente")}
        {renderSystemCard(system, false, true)}
      </div>
    );
  };

  const isMainView = view === "main";

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-110 shadow-md"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <main className="flex flex-1 flex-col">
        {/* ═══ MAIN VIEW: Hero image + animated buttons ═══ */}
        {isMainView && (
          <div className="flex flex-col">
            {/* Hero Image — full width, seamless */}
            <section className="relative w-full">
              <img
                src={heroImage}
                alt="PSI — Plataforma de Sistemas Interactivos"
                className="w-full h-auto object-cover animate-fade-in"
              />
              {/* Seamless gradient fade into buttons section */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8f5f0] dark:from-[#1a1815] to-transparent" />
            </section>

            {/* Access buttons — seamless continuation with staggered animations */}
            <section className="w-full bg-gradient-to-b from-[#f8f5f0] via-[#f4efe8] to-[#eee8de] dark:from-[#1a1815] dark:via-[#17140f] dark:to-[#13110d] px-5 pb-8 pt-2 md:px-8 -mt-1">
              <div className="mx-auto max-w-lg space-y-3">
                {/* Soy Paciente — primary gold CTA */}
                <button
                  onClick={() => setView("paciente")}
                  className="w-full group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#d4a332] via-[#c9982a] to-[#b8871f] px-6 py-4 text-left shadow-lg shadow-[#d4a332]/15 transition-all duration-500 ease-out hover:shadow-xl hover:shadow-[#d4a332]/30 hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in"
                  style={{ animationDelay: "0.1s", animationFillMode: "both" }}
                >
                  <div className="h-11 w-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    <User className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-white block tracking-wide">Soy Paciente</span>
                    <span className="text-[11px] text-white/70">Accedé a tu sistema asignado</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/50 -rotate-90 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                {/* Row: No soy Paciente + Soy Profesional */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setView("no-paciente")}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/25 bg-white/90 dark:bg-white/8 backdrop-blur-sm px-4 py-3.5 transition-all duration-500 ease-out hover:border-[#d4a332]/50 hover:bg-white hover:shadow-md hover:shadow-[#d4a332]/10 dark:hover:bg-white/12 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                    style={{ animationDelay: "0.25s", animationFillMode: "both" }}
                  >
                    <UserX className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
                    <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">No soy Paciente</span>
                  </button>

                  <button
                    onClick={() => setView("profesional")}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/25 bg-white/90 dark:bg-white/8 backdrop-blur-sm px-4 py-3.5 transition-all duration-500 ease-out hover:border-[#d4a332]/50 hover:bg-white hover:shadow-md hover:shadow-[#d4a332]/10 dark:hover:bg-white/12 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                    style={{ animationDelay: "0.35s", animationFillMode: "both" }}
                  >
                    <Briefcase className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
                    <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">Soy Profesional</span>
                  </button>
                </div>

                {/* Soy Empresa */}
                <button
                  onClick={() => setView("empresa")}
                  className="w-full group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/15 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-500 ease-out hover:border-[#d4a332]/35 hover:bg-white/90 hover:shadow-md hover:shadow-[#d4a332]/8 dark:hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                  style={{ animationDelay: "0.45s", animationFillMode: "both" }}
                >
                  <Building2 className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
                  <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">Soy una Empresa</span>
                </button>

                {/* Privacy — subtle */}
                <div className="flex items-center justify-center gap-2 pt-2 animate-fade-in" style={{ animationDelay: "0.6s", animationFillMode: "both" }}>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#d4a332]/50" />
                  <span className="text-[10px] text-[#8a7a5e] dark:text-[#d4a332]/40">Tus datos están protegidos. </span>
                  <Link to="/privacy-policy" className="text-[10px] text-[#d4a332]/80 hover:text-[#d4a332] hover:underline font-medium transition-colors">
                    Política de Privacidad
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ═══ AFTER SELECTING: Show welcome + content ═══ */}
        {!isMainView && (
          <>
            {/* Compact header with logo + welcome */}
            <header className="w-full border-b border-border/20 bg-background">
              <div className="mx-auto max-w-6xl px-6 py-6 lg:px-10 lg:py-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12">
                  <div className="flex items-center justify-center lg:w-[35%] mb-5 lg:mb-0">
                    <img
                      src={logoPsi}
                      alt="PSI PRO"
                      className="w-[45%] max-w-[280px] lg:w-full lg:max-w-[320px] object-contain drop-shadow-lg"
                    />
                  </div>

                  <div className="lg:w-[65%] flex flex-col gap-3">
                    <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Heart className="h-4 w-4 text-primary" />
                        </div>
                        <h1 className="text-base font-bold text-foreground font-serif lg:text-lg">¡Un gusto saludarte!</h1>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Soy <span className="font-semibold text-foreground">Germán Nieves</span>, Psicólogo clínico, Especialista en Psicología Forense, Diplomado en Psicodiagnóstico y experto en Rorschach.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[hsl(45,60%,80%)]/40 bg-card p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-[hsl(45,60%,90%)] flex items-center justify-center shrink-0">
                          <Search className="h-4 w-4 text-[hsl(45,70%,30%)]" />
                        </div>
                        <h2 className="text-base font-bold text-foreground font-serif">Mi práctica</h2>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Mi práctica se orienta al cuidado de la Salud Mental, integrando la complejidad de tres campos complementarios: la <strong className="text-foreground">psicoterapia</strong>, el <strong className="text-foreground">psicodiagnóstico</strong> y el abordaje <strong className="text-foreground">psico-forense</strong>.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[hsl(200,50%,80%)]/40 bg-card p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-9 w-9 rounded-full bg-[hsl(200,50%,90%)] flex items-center justify-center shrink-0">
                          <Gavel className="h-4 w-4 text-[hsl(200,60%,30%)]" />
                        </div>
                        <h2 className="text-base font-bold text-foreground font-serif">PSI</h2>
                      </div>
                      <div className="space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                        <p>
                          Estas disciplinas se reúnen en <strong className="text-foreground">PSI — Plataforma de Sistemas Interactivos</strong>, un ecosistema digital de aplicaciones para el soporte clínico, herramientas de psicodiagnóstico y el seguimiento psicoforense.
                        </p>
                        <p>
                          Tres <strong className="text-foreground">Sistemas Estructurados y Complementarios</strong>: 1. Sistema Reflexionar · 2. Sistema Evaluar · 3. Sistema Acompañar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content area */}
            <section className="mx-auto w-full max-w-4xl px-6 py-6 lg:px-10">
              {view === "paciente" && (
                <div className="animate-fade-in">
                  {renderBackButton()}
                  <p className="mb-6 text-center text-sm text-muted-foreground">
                    Seleccioná el sistema al que necesitás acceder:
                  </p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    {systemCards.map((system) => renderPatientSystemButton(system))}
                  </div>
                </div>
              )}

              {view === "no-paciente" && (
                <div className="animate-fade-in">
                  {renderBackButton()}
                  <p className="text-center text-sm text-muted-foreground mb-5">Contame, ¿qué necesitás?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
                    <button onClick={() => setView("question-terapia")}
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(30,40%,80%)]">
                      <Flame className="h-8 w-8 text-[hsl(30,50%,35%)]" />
                      <span className="text-sm font-semibold text-foreground text-center">¿Necesitás terapia?</span>
                      <span className="text-xs text-muted-foreground text-center">Comenzá tu proceso terapéutico</span>
                    </button>
                    <button onClick={() => setView("question-psicodiagnostico")}
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(225,50%,75%)]">
                      <BookOpen className="h-8 w-8 text-[hsl(225,60%,40%)]" />
                      <span className="text-sm font-semibold text-foreground text-center">¿Te solicitan un psicodiagnóstico?</span>
                      <span className="text-xs text-muted-foreground text-center">Evaluación de personalidad y aptitud</span>
                    </button>
                    <button onClick={() => setView("question-forense")}
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(100,40%,70%)]">
                      <Scale className="h-8 w-8 text-[hsl(100,50%,30%)]" />
                      <span className="text-sm font-semibold text-foreground text-center">¿Buscás asesoramiento para una causa judicial?</span>
                      <span className="text-xs text-muted-foreground text-center">Pericias y prácticas psico-forenses</span>
                    </button>
                  </div>
                </div>
              )}

              {(view === "question-terapia" || view === "question-psicodiagnostico" || view === "question-forense") &&
                renderQuestionView(view)}

              {view === "profesional" && (
                <div className="animate-fade-in mx-auto max-w-md">
                  {renderBackButton()}
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                    <div className="h-14 w-14 rounded-full bg-[hsl(14,70%,52%)] flex items-center justify-center">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground font-serif">Contacto Profesional</h3>
                    <p className="text-sm text-muted-foreground text-center">Para derivaciones, interconsultas o consultas profesionales.</p>
                    <div className="w-full space-y-3 mt-2">
                      <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-400 transition-all hover:bg-green-100 dark:hover:bg-green-950/50 active:scale-[0.98]">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                      <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-950/50 active:scale-[0.98]">
                        <Globe className="h-4 w-4" /> Sitio Web
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {view === "empresa" && (
                <div className="animate-fade-in mx-auto max-w-md">
                  {renderBackButton()}
                  <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                    <Building2 className="h-12 w-12 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground font-serif">Contacto Empresarial</h3>
                    <p className="text-sm text-muted-foreground text-center">Para servicios corporativos, evaluaciones y consultas institucionales.</p>
                    <div className="w-full space-y-3 mt-2">
                      <a href={EMPRESA_EMAIL}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]">
                        <Mail className="h-4 w-4" /> Enviar Email
                      </a>
                      <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm font-medium text-blue-700 dark:text-blue-400 transition-all hover:bg-blue-100 dark:hover:bg-blue-950/50 active:scale-[0.98]">
                        <Globe className="h-4 w-4" /> Sitio Web
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Stats, avales, FAQ */}
            <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
                <ProfessionalStats />
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 py-2 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-5 shadow-sm">
                <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avales institucionales</h3>
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                  <img src={logoALPJF} alt="Asociación Latinoamericana de Psicología Jurídica y Forense" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                  <img src={logoAPFRA} alt="Asociación de Psicólogos Forenses de la República Argentina" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity dark:invert" />
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
                <h3 className="text-center text-lg font-semibold text-foreground font-serif mb-4">Preguntas frecuentes</h3>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                  {faqItems.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                      <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            {/* Quote */}
            <section className="mx-auto w-full max-w-5xl px-6 pb-4 lg:px-10">
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card px-8 py-7 shadow-sm">
                <div className="absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-primary/40" />
                <p className="text-base leading-relaxed text-foreground/85 md:text-lg md:leading-relaxed font-serif italic">
                  ✨ "Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"
                </p>
              </div>
            </section>

            {/* Privacy */}
            <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-2 rounded-xl bg-card border border-border/30 px-5 py-3 mx-6 lg:mx-10 shadow-sm">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                <p className="text-xs text-muted-foreground">Tus datos están protegidos y son confidenciales.</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Al ingresar, aceptás los{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
                  Términos de Uso, Condiciones del Servicio y Políticas de Privacidad
                </Link>.
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Login;
