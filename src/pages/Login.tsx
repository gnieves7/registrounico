import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, LogOut, Flame, BookOpen, Scale, Calendar, ArrowLeft, Building2, MessageCircle, Globe, Mail, Heart, Search, Gavel, User, UserX, Briefcase } from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";
import logoPsi from "@/assets/logo_psi.png";
import { applySystemTheme, getStoredSystemArea, setStoredSystemArea, systemBranding, type SystemArea } from "@/lib/systemBranding";

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
    accentHue: "30",
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
    accentHue: "45",
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
    accentHue: "200",
  },
];

const Login = () => {
  const { user, isLoading, isApproved, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("main");

  useEffect(() => {
    if (user && !isLoading) {
      if (!isApproved) return;
      const redirectTo = sessionStorage.getItem("login_redirect");
      if (redirectTo) {
        sessionStorage.removeItem("login_redirect");
        navigate(redirectTo, { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, isLoading, isApproved, navigate]);

  const handleGoogleLogin = async (redirectPath: string, area: string) => {
    try {
      sessionStorage.setItem("login_redirect", redirectPath);
      sessionStorage.setItem("user_area", area);
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
        {/* Colored top stripe */}
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
              <a
                href={CALENDAR_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4" />
                Solicitar Turno
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={EMPRESA_WEB}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]"
              >
                <Globe className="h-4 w-4" />
                Sitio Web
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
      <div className="flex h-28 w-28 items-center justify-center rounded-full border border-border/50 bg-background p-3 shadow-sm transition-transform duration-300 group-hover:scale-105 md:h-32 md:w-32">
        <img
          src={system.image}
          alt={system.title}
          className="h-full w-full rounded-full object-contain"
          loading="lazy"
        />
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
      <ArrowLeft className="h-4 w-4" />
      Volver
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
      <div className="mx-auto w-full max-w-md px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderBackButton("no-paciente")}
        {renderSystemCard(system, false, true)}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <main className="flex flex-1 flex-col">
        {/* Hero: Logo LEFT (50%) + Cards RIGHT (50%) */}
        <header className="w-full">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-10">
              {/* LEFT: Logo — 50% */}
              <div className="flex flex-col items-center justify-center lg:w-1/2 mb-8 lg:mb-0">
                <img
                  src={logoPsi}
                  alt="Logo PSI — Plataforma de Sistemas Interactivos"
                  className="w-[70%] max-w-[420px] object-contain drop-shadow-xl"
                />
                <div className="mt-4 text-center">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">PSI</h1>
                  <p className="mt-1 text-sm font-medium text-primary md:text-base lg:text-lg">
                    Plataforma de Sistemas Interactivos
                  </p>
                </div>
              </div>

              {/* RIGHT: Professional cards — 50% */}
              <div className="lg:w-1/2 flex flex-col gap-4">
                {/* Card 1 */}
                <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-card p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">¡Un gusto saludarte!</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Soy <span className="font-semibold text-foreground">Germán Nieves</span>, Psicólogo clínico, Especialista en Psicología Forense, Diplomado en Psicodiagnóstico y experto en Rorschach.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl border border-[hsl(45,60%,80%)]/40 bg-gradient-to-br from-[hsl(45,60%,96%)] to-card p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-[hsl(45,60%,90%)] flex items-center justify-center shrink-0">
                      <Search className="h-4 w-4 text-[hsl(45,70%,30%)]" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">Mi práctica</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Mi práctica se orienta al cuidado de la Salud Mental, integrando la complejidad de tres campos complementarios: la <strong className="text-foreground">psicoterapia</strong>, el <strong className="text-foreground">psicodiagnóstico</strong> y el abordaje <strong className="text-foreground">psico-forense</strong>.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl border border-[hsl(200,50%,80%)]/40 bg-gradient-to-br from-[hsl(200,50%,96%)] to-card p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-[hsl(200,50%,90%)] flex items-center justify-center shrink-0">
                      <Gavel className="h-4 w-4 text-[hsl(200,60%,30%)]" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">PSI</h3>
                  </div>
                  <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                    <p>
                      Estas disciplinas se reúnen en <strong className="text-foreground">PSI — Plataforma de Sistemas Interactivos</strong>, un ecosistema digital de aplicaciones para el soporte clínico, herramientas de psicodiagnóstico y el seguimiento psicoforense en causas judiciales.
                    </p>
                    <p>
                      Una plataforma única que integra tres (3) <strong className="text-foreground">Sistemas Estructurados y Complementarios</strong> para la atención en Salud Mental: 1. Sistema Reflexionar · 2. Sistema Evaluar · 3. Sistema Acompañar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Profile buttons with reference image */}
        <section className="mx-auto w-full max-w-4xl px-6 py-4 lg:px-10">
          <p className="font-medium text-foreground text-base md:text-lg text-center mb-6">¿En qué puedo ayudarte?</p>

          {view === "main" && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-2xl justify-items-center">
                {[
                  { label: "Soy Paciente", view: "paciente" as View, Icon: User, bg: "bg-primary/10", border: "border-primary", iconColor: "text-primary" },
                  { label: "No soy Paciente", view: "no-paciente" as View, Icon: UserX, bg: "bg-accent/50", border: "border-accent-foreground/30", iconColor: "text-accent-foreground" },
                  { label: "Soy Profesional", view: "profesional" as View, Icon: Briefcase, bg: "bg-secondary", border: "border-secondary-foreground/30", iconColor: "text-secondary-foreground" },
                  { label: "Soy Empresa", view: "empresa" as View, Icon: Building2, bg: "bg-muted", border: "border-muted-foreground/30", iconColor: "text-muted-foreground" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setView(item.view)}
                    className="group flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1"
                  >
                    <div
                      className={`h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20 rounded-full border-[3px] ${item.border} ${item.bg} flex items-center justify-center shadow-md transition-all duration-200 group-hover:shadow-lg group-hover:scale-105`}
                    >
                      <item.Icon className={`h-8 w-8 sm:h-9 sm:w-9 ${item.iconColor}`} strokeWidth={1.8} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground text-center leading-tight">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Soy Paciente → 3 system buttons */}
          {view === "paciente" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderBackButton()}
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Seleccioná el sistema al que necesitás acceder:
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {systemCards.map((system) => renderPatientSystemButton(system))}
              </div>
            </div>
          )}

          {/* No soy Paciente → 3 questions */}
          {view === "no-paciente" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderBackButton()}
              <p className="text-center text-sm text-muted-foreground mb-5">Contame, ¿qué necesitás?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
                <button
                  onClick={() => setView("question-terapia")}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(30,40%,80%)]"
                >
                  <Flame className="h-8 w-8 text-[hsl(30,50%,35%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Necesitás terapia?</span>
                  <span className="text-xs text-muted-foreground text-center">Comenzá tu proceso terapéutico</span>
                </button>
                <button
                  onClick={() => setView("question-psicodiagnostico")}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(45,60%,75%)]"
                >
                  <BookOpen className="h-8 w-8 text-[hsl(45,70%,30%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Te solicitan un psicodiagnóstico?</span>
                  <span className="text-xs text-muted-foreground text-center">Evaluación de personalidad y aptitud</span>
                </button>
                <button
                  onClick={() => setView("question-forense")}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(200,50%,75%)]"
                >
                  <Scale className="h-8 w-8 text-[hsl(200,60%,30%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Buscás asesoramiento para una causa judicial?</span>
                  <span className="text-xs text-muted-foreground text-center">Pericias y prácticas psico-forenses</span>
                </button>
              </div>
            </div>
          )}

          {/* Question detail views */}
          {(view === "question-terapia" || view === "question-psicodiagnostico" || view === "question-forense") &&
            renderQuestionView(view)}

          {/* Soy Profesional */}
          {view === "profesional" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mx-auto max-w-md">
              {renderBackButton()}
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                <div className="h-14 w-14 rounded-full bg-[hsl(14,70%,52%)] flex items-center justify-center">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground">Contacto Profesional</h3>
                <p className="text-sm text-muted-foreground text-center">Para derivaciones, interconsultas o consultas profesionales.</p>
                <div className="w-full space-y-3 mt-2">
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all hover:bg-green-100 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a
                    href={EMPRESA_WEB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]"
                  >
                    <Globe className="h-4 w-4" />
                    Sitio Web
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Soy una Empresa */}
          {view === "empresa" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mx-auto max-w-md">
              {renderBackButton()}
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                <Building2 className="h-12 w-12 text-blue-600" />
                <h3 className="text-lg font-semibold text-foreground">Contacto Empresarial</h3>
                <p className="text-sm text-muted-foreground text-center">Para servicios corporativos, evaluaciones y consultas institucionales.</p>
                <div className="w-full space-y-3 mt-2">
                  <a
                    href={EMPRESA_EMAIL}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
                  >
                    <Mail className="h-4 w-4" />
                    Enviar Email
                  </a>
                  <a
                    href={EMPRESA_WEB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]"
                  >
                    <Globe className="h-4 w-4" />
                    Sitio Web
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Professional Stats */}
        <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10">
          <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
            <ProfessionalStats />
          </div>
        </section>

        {/* Quote */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-6 lg:px-10">
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-primary/5 px-8 py-7 shadow-sm">
            <div className="absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-primary/40" />
            <p className="text-base leading-relaxed text-foreground/85 md:text-lg md:leading-relaxed" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              ✨ <em>"Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"</em>
            </p>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-2 rounded-xl bg-card border border-border/30 px-5 py-3 mx-6 lg:mx-10 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">Tus datos están protegidos y son confidenciales.</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Al ingresar, aceptás los{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline font-medium">
              Términos de Uso, Condiciones del Servicio y Políticas de Privacidad
            </Link>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
