import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck, LogOut, Flame, BookOpen, Scale, Calendar,
  ArrowLeft, Building2, MessageCircle, Globe, Mail, Heart,
  Search, User, UserX, Briefcase, ChevronDown, Moon, Sun,
  MapPin, Phone, Clock, Video, Users, FileText, Brain,
  Award, GraduationCap, Send
} from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";

import heroImage from "@/assets/hero_psi_landing.png";
import heroAccessImage from "@/assets/hero_access.png";
import logoALPJF from "@/assets/logo_ALPJF.png";
import logoAPFRA from "@/assets/logo_APFRA.png";
import logoPsi from "@/assets/logo_psi.png";
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

const NAV_ITEMS = [
  { label: "Inicio", id: "hero" },
  { label: "Servicios", id: "servicios" },
  { label: "Profesional", id: "profesional-section" },
  { label: "Turnos", id: "turnos" },
  { label: "FAQ", id: "faq" },
  { label: "Contacto", id: "contacto" },
];

const serviceItems = [
  { icon: Brain, title: "Psicoterapia Clínica", desc: "Terapia individual para adultos. Abordaje cognitivo-conductual e integrativo." },
  { icon: BookOpen, title: "Psicodiagnóstico", desc: "Evaluación de personalidad, aptitud psíquica y perfiles psicológicos." },
  { icon: Scale, title: "Psicología Forense", desc: "Pericias judiciales, Cámara Gesell y acompañamiento en causas." },
  { icon: FileText, title: "Informes y Certificados", desc: "Aptos psicológicos, juntas médicas laborales y dictámenes periciales." },
  { icon: Users, title: "Interconsultas", desc: "Derivaciones y trabajo interdisciplinario con otros profesionales." },
  { icon: Video, title: "Atención Online", desc: "Consultas por videollamada con la misma calidad y confidencialidad." },
];

const faqItems = [
  { q: "¿Cómo accedo por primera vez a la plataforma?", a: "Seleccioná \"Soy Paciente\", elegí el sistema que te indicó tu profesional y autenticáte con tu cuenta de Google. Tu acceso será revisado y aprobado antes de ingresar." },
  { q: "¿Mis datos son confidenciales?", a: "Absolutamente. Toda la información es cifrada, almacenada en servidores seguros y solo accesible por vos y tu profesional tratante. Cumplimos con estándares internacionales de protección de datos en salud." },
  { q: "¿Puedo usar la plataforma desde el celular?", a: "Sí, PSI está optimizada para dispositivos móviles. Podés acceder desde cualquier navegador sin necesidad de instalar una aplicación." },
  { q: "¿Cómo solicito una consulta o turno?", a: "Podés agendar tu consulta directamente desde la plataforma en la sección \"Mis Turnos\", o contactarnos por WhatsApp o email. También podés solicitar turno desde el botón de agenda en la página principal." },
  { q: "¿Se realizan consultas en modalidad online?", a: "Sí, ofrecemos atención tanto presencial como online por videollamada." },
  { q: "¿Cuánto dura una sesión?", a: "Las sesiones clínicas tienen una duración aproximada de 45 a 50 minutos. Las evaluaciones psicodiagnósticas pueden requerir entre 60 y 90 minutos." },
  { q: "¿Cuántas sesiones necesito?", a: "La cantidad de sesiones varía según cada caso. En la primera consulta se realiza una evaluación inicial y se establece un plan de trabajo conjunto." },
  { q: "¿Qué diferencia hay entre los tres sistemas?", a: "Reflexionar es el área clínica. Evaluar es el área psicodiagnóstica. Acompañar es el área forense." },
];

const Login = () => {
  const { user, isLoading, isApproved, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("main");
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [scrollY, setScrollY] = useState(0);
  const [activeNav, setActiveNav] = useState("hero");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      // Active nav detection
      for (const item of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveNav(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
              <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
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
      <div key={system.id} className="group flex flex-col items-stretch rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="h-1.5" style={{ background: `hsl(${h}, 55%, 50%)` }} />
        <div className="flex flex-col items-center gap-3 p-5 flex-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: `hsl(${h}, 40%, 92%)` }}>
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
    <button onClick={() => setView(backTo)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
      <ArrowLeft className="h-4 w-4" /> Volver
    </button>
  );

  const renderQuestionView = (questionView: "question-terapia" | "question-psicodiagnostico" | "question-forense") => {
    const map = { "question-terapia": systemCards[0], "question-psicodiagnostico": systemCards[1], "question-forense": systemCards[2] };
    const system = map[questionView];
    return (
      <div className="mx-auto w-full max-w-md px-6 py-6 animate-fade-in">
        {renderBackButton("no-paciente")}
        {renderSystemCard(system, false, true)}
      </div>
    );
  };

  const isMainView = view === "main";
  const navScrolled = scrollY > 60;

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      {/* ═══ FIXED NAVBAR ═══ */}
      {isMainView && (
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            navScrolled
              ? "bg-background/85 backdrop-blur-lg shadow-sm border-b border-border/30"
              : "bg-transparent"
          }`}
        >
          <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-4 md:px-6">
            <button onClick={() => scrollToSection("hero")} className="flex items-center gap-2 shrink-0">
              <img src={logoPsi} alt=".PSI." className="h-8 w-8 rounded-full object-cover" />
              <span className={`text-sm font-bold transition-colors ${navScrolled ? "text-foreground" : "text-foreground/80"}`}>.PSI.</span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    activeNav === item.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleDark}
                className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => scrollToSection("hero")}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
              >
                Ingresar
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Dark mode toggle for non-main views */}
      {!isMainView && (
        <button
          onClick={toggleDark}
          className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-110 shadow-md"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      )}

      <main className="flex flex-1 flex-col">
        {/* ═══ MAIN VIEW ═══ */}
        {isMainView && (
          <div className="flex flex-col">
            {/* Hero Section */}
            <section id="hero" ref={heroRef} className="relative w-full overflow-hidden">
              <img
                src={heroImage}
                alt=".PSI. — Plataforma de Sistemas Interactivos"
                className="w-full h-auto object-cover animate-fade-in will-change-transform"
                style={{ transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.00015})` }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f8f5f0] dark:from-[#1a1815] to-transparent" />
            </section>

            {/* Access buttons */}
            <section className="w-full bg-gradient-to-b from-[#f8f5f0] via-[#f4efe8] to-[#eee8de] dark:from-[#1a1815] dark:via-[#17140f] dark:to-[#13110d] px-5 pb-6 pt-2 md:px-8 -mt-1">
              <div className="mx-auto max-w-lg space-y-3">
                {/* Primary CTA */}
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

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setView("no-paciente")}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/25 bg-white/90 dark:bg-white/8 backdrop-blur-sm px-4 py-3.5 transition-all duration-500 ease-out hover:border-[#d4a332]/50 hover:bg-white hover:shadow-md dark:hover:bg-white/12 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                    style={{ animationDelay: "0.25s", animationFillMode: "both" }}
                  >
                    <UserX className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332]" strokeWidth={1.8} />
                    <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">No soy Paciente</span>
                  </button>
                  <button
                    onClick={() => setView("profesional")}
                    className="group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/25 bg-white/90 dark:bg-white/8 backdrop-blur-sm px-4 py-3.5 transition-all duration-500 ease-out hover:border-[#d4a332]/50 hover:bg-white hover:shadow-md dark:hover:bg-white/12 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                    style={{ animationDelay: "0.35s", animationFillMode: "both" }}
                  >
                    <Briefcase className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332]" strokeWidth={1.8} />
                    <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">Soy Profesional</span>
                  </button>
                </div>

                <button
                  onClick={() => setView("empresa")}
                  className="w-full group flex items-center justify-center gap-2.5 rounded-2xl border border-[#d4a332]/15 bg-white/70 dark:bg-white/5 backdrop-blur-sm px-4 py-3 transition-all duration-500 ease-out hover:border-[#d4a332]/35 hover:bg-white/90 dark:hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.97] animate-fade-in"
                  style={{ animationDelay: "0.45s", animationFillMode: "both" }}
                >
                  <Building2 className="h-4 w-4 text-[#9a7a2e] dark:text-[#d4a332]" strokeWidth={1.8} />
                  <span className="text-xs font-semibold text-[#5a4a1e] dark:text-[#d4a332]/90">Soy una Empresa</span>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => scrollToSection("servicios")}
                  className="w-full flex items-center justify-center gap-2 text-xs font-medium text-[#8a7a5e] dark:text-[#d4a332]/60 hover:text-[#d4a332] transition-colors pt-1 animate-fade-in"
                  style={{ animationDelay: "0.55s", animationFillMode: "both" }}
                >
                  Conocer más <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
                </button>
              </div>
            </section>

            {/* ═══ SERVICIOS ═══ */}
            <section id="servicios" className="w-full bg-background py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <h2 className="text-center text-2xl font-bold text-foreground mb-2 md:text-3xl" style={{ maxFontSize: "32px" }}>
                  Servicios Profesionales
                </h2>
                <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
                  Atención integral en psicología clínica, psicodiagnóstico y psicología forense.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceItems.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                        <s.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ═══ SOBRE EL PROFESIONAL ═══ */}
            <section id="profesional-section" className="w-full bg-muted/30 py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 rounded-2xl border border-border/40 bg-card p-6 md:p-8 shadow-sm">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="h-28 w-28 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center overflow-hidden">
                      <img src={logoPsi} alt="Lic. Esp. Germán Nieves" className="h-full w-full object-cover rounded-full" />
                    </div>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold text-primary">
                        <Award className="h-3 w-3" /> Mat. N° 1889
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-foreground md:text-2xl">Lic. Esp. Germán Nieves</h2>
                    <p className="text-sm font-medium text-primary mt-1">Psicólogo Clínico · Especialista en Psicología Forense</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      Santa Fe, Argentina · Colegio de Psicólogos de Santa Fe
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Diplomado en Psicodiagnóstico y experto en Rorschach. Mi práctica integra la psicoterapia, el psicodiagnóstico y el abordaje psico-forense. Con años de experiencia en el campo clínico y judicial, ofrezco un acompañamiento profesional basado en la evidencia y el compromiso ético.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
                        <GraduationCap className="h-3 w-3" /> Psicología Clínica
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
                        <Scale className="h-3 w-3" /> Psicología Forense
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-[10px] font-medium text-muted-foreground">
                        <BookOpen className="h-3 w-3" /> Psicodiagnóstico
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══ TURNOS / CONSULTAS ═══ */}
            <section id="turnos" className="w-full bg-background py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <h2 className="text-center text-2xl font-bold text-foreground mb-2 md:text-3xl">Turnos y Consultas</h2>
                <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
                  Disponibilidad para atención presencial y virtual. Consultá por horarios y modalidades.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="rounded-2xl border border-border/40 bg-card p-5 text-center">
                    <MapPin className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-foreground">Presencial</h3>
                    <p className="text-xs text-muted-foreground mt-1">Consultorio en Santa Fe Capital</p>
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-card p-5 text-center">
                    <Video className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-foreground">Online</h3>
                    <p className="text-xs text-muted-foreground mt-1">Videollamada desde cualquier lugar</p>
                  </div>
                  <div className="rounded-2xl border border-border/40 bg-card p-5 text-center sm:col-span-2 lg:col-span-1">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-foreground">Horarios</h3>
                    <p className="text-xs text-muted-foreground mt-1">Lunes a Viernes, con turno previo</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                  <a
                    href={CALENDAR_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
                  >
                    <Calendar className="h-4 w-4" /> Agendar Turno
                  </a>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-green-300/50 bg-green-50 dark:bg-green-950/30 px-6 py-3 text-sm font-medium text-green-700 dark:text-green-400 transition-all hover:bg-green-100 dark:hover:bg-green-950/50 active:scale-[0.97]"
                  >
                    <MessageCircle className="h-4 w-4" /> Consultar por WhatsApp
                  </a>
                </div>
              </div>
            </section>

            {/* ═══ STATS + AVALES ═══ */}
            <section className="w-full bg-muted/30 py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8 space-y-6">
                <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
                  <ProfessionalStats />
                </div>
                <div className="rounded-2xl border border-border/40 bg-card px-6 py-5 shadow-sm">
                  <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avales institucionales</h3>
                  <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    <img src={logoALPJF} alt="Asociación Latinoamericana de Psicología Jurídica y Forense" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                    <img src={logoAPFRA} alt="Asociación de Psicólogos Forenses de la República Argentina" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity dark:invert" />
                  </div>
                </div>
              </div>
            </section>

            {/* ═══ FAQ ═══ */}
            <section id="faq" className="w-full bg-background py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <h2 className="text-center text-2xl font-bold text-foreground mb-6 md:text-3xl">Preguntas frecuentes</h2>
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

            {/* ═══ CONTACTO ═══ */}
            <section id="contacto" className="w-full bg-muted/30 py-12 md:py-16">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <h2 className="text-center text-2xl font-bold text-foreground mb-2 md:text-3xl">Contacto</h2>
                <p className="text-center text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
                  Para consultas, derivaciones o información sobre servicios.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Email</p>
                        <a href="mailto:pdf.consultas@gmail.com" className="text-xs text-primary hover:underline">pdf.consultas@gmail.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">WhatsApp</p>
                        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">+54 9 342 627-2158</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Web</p>
                        <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">psicodiagnostico-forense.com.ar</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Ubicación</p>
                        <p className="text-xs text-muted-foreground">Santa Fe Capital, Argentina</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/40 bg-card p-6">
                    <Send className="h-8 w-8 text-primary/60" />
                    <p className="text-sm text-center text-muted-foreground">
                      ¿Necesitás comunicarte de forma rápida?
                    </p>
                    <div className="w-full space-y-2">
                      <a
                        href={WHATSAPP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
                      >
                        <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
                      </a>
                      <a
                        href="mailto:pdf.consultas@gmail.com"
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.97]"
                      >
                        <Mail className="h-4 w-4" /> Enviar Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quote */}
            <section className="w-full bg-background py-8">
              <div className="mx-auto max-w-[1100px] px-5 md:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card px-8 py-7 shadow-sm">
                  <div className="absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-primary/40" />
                  <p className="text-sm leading-relaxed text-foreground/85 md:text-base md:leading-relaxed font-serif italic">
                    ✨ "Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"
                  </p>
                </div>
              </div>
            </section>

            {/* Privacy */}
            <div className="mx-auto max-w-[1100px] mb-8 px-5 md:px-8">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-card border border-border/30 px-5 py-3 shadow-sm">
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
            </div>
          </div>
        )}

        {/* ═══ AFTER SELECTING: Show welcome + content ═══ */}
        {!isMainView && (
          <>
            <section className="relative w-full overflow-hidden">
              <img
                src={heroAccessImage}
                alt=".PSI. — Acceso a la plataforma"
                className="w-full h-[30vh] sm:h-[35vh] md:h-[45vh] object-cover animate-fade-in will-change-transform"
                style={{ transform: `translateY(${scrollY * 0.15}px) scale(${1 + scrollY * 0.00015})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            </section>

            <section className="w-full bg-background px-5 pb-4 pt-6 md:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="flex flex-col lg:flex-row gap-3 mb-4">
                  <div className="lg:flex-1 rounded-2xl border border-primary/15 bg-card p-5 shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "0.15s", animationFillMode: "forwards", animationDuration: "0.5s" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <h1 className="text-base font-bold text-foreground font-serif">¡Un gusto saludarte!</h1>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Soy <span className="font-semibold text-foreground">Germán Nieves</span>, Psicólogo clínico, Especialista en Psicología Forense, Diplomado en Psicodiagnóstico y experto en Rorschach.
                    </p>
                  </div>
                  <div className="lg:flex-1 rounded-2xl border border-[hsl(45,60%,80%)]/40 bg-card p-5 shadow-sm opacity-0 animate-fade-in" style={{ animationDelay: "0.35s", animationFillMode: "forwards", animationDuration: "0.5s" }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-9 w-9 rounded-full bg-[hsl(45,60%,90%)] flex items-center justify-center shrink-0">
                        <Search className="h-4 w-4 text-[hsl(45,70%,30%)]" />
                      </div>
                      <h2 className="text-base font-bold text-foreground font-serif">Mi práctica y PSI</h2>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Mi práctica integra la <strong className="text-foreground">psicoterapia</strong>, el <strong className="text-foreground">psicodiagnóstico</strong> y el abordaje <strong className="text-foreground">psico-forense</strong> en <strong className="text-foreground">.PSI.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-4xl px-6 py-4 lg:px-10">
              {view === "paciente" && (
                <div className="animate-fade-in">
                  {renderBackButton()}
                  <p className="mb-6 text-center text-sm text-muted-foreground">Seleccioná el sistema al que necesitás acceder:</p>
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

            <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
                <ProfessionalStats />
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 py-2 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-5 shadow-sm">
                <h3 className="text-center text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Avales institucionales</h3>
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                  <img src={logoALPJF} alt="ALPJF" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity" />
                  <img src={logoAPFRA} alt="APFRA" className="h-16 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity dark:invert" />
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10 animate-fade-in">
              <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
                <h3 className="text-center text-lg font-semibold text-foreground font-serif mb-4">Preguntas frecuentes</h3>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                  {faqItems.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-border/30">
                      <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-3">{item.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-6 pb-4 lg:px-10">
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-card px-8 py-7 shadow-sm">
                <div className="absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-primary/40" />
                <p className="text-sm leading-relaxed text-foreground/85 md:text-base md:leading-relaxed font-serif italic">
                  ✨ "Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental."
                </p>
              </div>
            </section>

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
