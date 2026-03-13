import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, LogOut, Flame, BookOpen, Scale, Calendar, ArrowLeft, Building2, MessageCircle, Globe, Mail } from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";
import logoPsi from "@/assets/Logo_PSI_mejorado.png";
import iconPaciente from "@/assets/icon-paciente.png";
import iconProfesional from "@/assets/icon-profesional.png";
import iconNoPaciente from "@/assets/icon-no-paciente.png";

const CALENDAR_LINK = "https://calendar.app.google/4Locar4CbcTB45zv9";
const WHATSAPP_LINK = "https://wa.me/5493426272158";
const EMPRESA_EMAIL = "mailto:pdf.consultas@gmail.com";
const EMPRESA_WEB = "https://www.psicodiagnostico-forense.com.ar";

type View = "main" | "paciente" | "no-paciente" | "question-terapia" | "question-psicodiagnostico" | "question-forense" | "profesional" | "empresa";

const systemCards = [
{
  id: "reflexionar",
  title: "Sistema Reflexionar",
  area: "Área Clínica",
  icon: Flame,
  redirect: "/psychobiography",
  description: "Abordaje terapéutico, avances, monitoreo del estado de ánimo e intervenciones clínicas.",
  codes: ["Código Clínico", "Código Intervenciones"],
  bgColor: "bg-[hsl(30,30%,95%)]",
  iconBg: "bg-[hsl(30,40%,88%)]",
  iconColor: "text-[hsl(30,50%,35%)]"
},
{
  id: "evaluar",
  title: "Sistema Evaluar",
  area: "Área Psicodiagnóstica",
  icon: BookOpen,
  redirect: "/psychodiagnostic",
  description: "Estudio de la personalidad, perfiles, psicodiagnósticos clínicos y aptitud psíquica.",
  codes: ["Código Personalidad", "Código Rorschach", "Código Aptitud Psíquica", "Código Junta Médica"],
  bgColor: "bg-[hsl(45,60%,92%)]",
  iconBg: "bg-[hsl(45,65%,82%)]",
  iconColor: "text-[hsl(45,70%,30%)]"
},
{
  id: "acompanar",
  title: "Sistema Acompañar",
  area: "Área Forense",
  icon: Scale,
  redirect: "/forensic",
  description: "Problemática judicial, pericias, análisis del testimonio en Cámara Gesell y prácticas psico-forenses.",
  codes: ["Código Pericia", "Código Familia", "Código Cámara Gesell", "Código IPP"],
  bgColor: "bg-[hsl(200,50%,92%)]",
  iconBg: "bg-[hsl(200,55%,82%)]",
  iconColor: "text-[hsl(200,60%,30%)]"
}];


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
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>);

  }

  if (user && !isApproved) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="flex flex-col items-center rounded-3xl bg-card p-10 shadow-xl border border-border/50 max-w-md text-center">
            <ShieldCheck className="mb-4 h-14 w-14 text-primary" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">Acceso pendiente de autorización</h1>
            <p className="mb-4 text-muted-foreground">
              Tu solicitud fue recibida y será revisada por el profesional.
            </p>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </main>
        <Footer />
      </div>);

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
      </div>);

  }

  const renderSystemCard = (system: typeof systemCards[0], showLogin = true, showTurno = false) =>
  <div
    key={system.id}
    className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${system.bgColor} shadow-sm`}>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${system.iconBg}`}>
          <system.icon className={`h-5 w-5 ${system.iconColor}`} />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-base font-semibold text-foreground">{system.title}</h3>
        <p className="text-sm font-bold text-primary tracking-wide">{system.area}</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{system.description}</p>
      </div>
      {showLogin &&
      <button
        onClick={() => handleGoogleLogin(system.redirect, system.id)}
        className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary/20 active:scale-[0.98]">
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Acceder
      </button>
      }
      {showTurno &&
      <div className="w-full space-y-2 mt-1">
        <a href={CALENDAR_LINK} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]">
          <Calendar className="h-4 w-4" />
          Solicitar Turno
        </a>
        <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100 active:scale-[0.98]">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]">
          <Globe className="h-4 w-4" />
          Sitio Web
        </a>
      </div>
      }
    </div>;

  const renderBackButton = (backTo: View = "main") =>
  <button
    onClick={() => setView(backTo)}
    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
      <ArrowLeft className="h-4 w-4" />
      Volver
    </button>;

  const renderQuestionView = (
    questionView: "question-terapia" | "question-psicodiagnostico" | "question-forense") => {
    const map = {
      "question-terapia": systemCards[0],
      "question-psicodiagnostico": systemCards[1],
      "question-forense": systemCards[2]
    };
    const system = map[questionView];
    return (
      <div className="mx-auto w-full max-w-md px-6 py-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {renderBackButton("no-paciente")}
        {renderSystemCard(system, false, true)}
      </div>);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <main className="flex flex-1 flex-col">
        {/* Header with logo and welcome */}
        <header className="px-6 pt-10 pb-6 lg:px-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            {/* Logo large and prominent */}
            <div className="relative">
              <img
                src={logoPsi}
                alt="Logo PSI"
                className="relative h-44 w-44 object-contain md:h-56 md:w-56 drop-shadow-lg" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                PSI
              </h1>
              <p className="mt-1 text-base font-medium text-primary md:text-lg">
                Plataforma de Sistemas Interactivos
              </p>
            </div>

            {/* Welcome message */}
            <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p className="text-foreground font-medium text-base md:text-lg">
                ¡Un gusto saludarte! Gracias por visitar mi sitio.
              </p>
              <p>
                Soy <span className="font-semibold text-foreground">German Nieves</span>, Psicólogo clínico, Especialista en Psicología Forense, Diplomado en Psicodiagnóstico y experto en Rorschach.
              </p>
              <p className="font-medium text-foreground">¿En qué puedo ayudarte?</p>
              <p className="text-xs md:text-sm">
                Mi práctica profesional se orienta al cuidado de la Salud Mental contemplando la intradisciplina como recurso necesario para aportar una perspectiva superadora, integrando la complejidad y dinámica de tres grandes campos, distintos aunque complementarios: la <strong>psicoterapia</strong>, el <strong>psicodiagnóstico</strong> y el abordaje <strong>psico-forense</strong>.
              </p>
              <p className="text-xs md:text-sm">
                Estas disciplinas se reúnen en <strong>PSI — Plataforma de Sistemas Interactivos</strong>. Un espacio virtual privado y exclusivo para pacientes, profesionales y empresas que ofrece tres sistemas profesionales orientados al análisis, comprensión, interpretación y seguimiento dinámico de la salud mental.
              </p>
            </div>
          </div>
        </header>

        {/* Interactive section */}
        <section className="mx-auto w-full max-w-4xl px-6 py-4 lg:px-10">
          {view === "main" &&
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 w-full max-w-2xl">
                {/* Soy Paciente */}
                <button
                onClick={() => setView("paciente")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 overflow-hidden">
                    <img src={iconPaciente} alt="Paciente" className="h-10 w-10 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-tight">Soy Paciente</span>
                </button>

                {/* No soy Paciente */}
                <button
                onClick={() => setView("no-paciente")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted transition-all duration-300 group-hover:bg-muted/80 group-hover:scale-110 overflow-hidden">
                    <img src={iconNoPaciente} alt="No soy paciente" className="h-10 w-10 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-tight">No soy Paciente</span>
                </button>

                {/* Soy Profesional */}
                <button
                onClick={() => setView("profesional")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-400/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 transition-all duration-300 group-hover:bg-green-100 group-hover:scale-110 overflow-hidden">
                    <img src={iconProfesional} alt="Profesional" className="h-10 w-10 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-tight">Soy Profesional</span>
                </button>

                {/* Soy una Empresa */}
                <button
                onClick={() => setView("empresa")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-blue-400/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
                    <Building2 className="h-7 w-7 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-foreground text-center leading-tight">Soy una Empresa</span>
                </button>
              </div>
            </div>
          }

          {/* Soy Paciente → 3 system cards */}
          {view === "paciente" &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderBackButton()}
              <p className="text-center text-sm text-muted-foreground mb-5">
                Seleccioná el sistema al que necesitás acceder:
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {systemCards.map((s) => renderSystemCard(s))}
              </div>
            </div>
          }

          {/* No soy Paciente → 3 questions */}
          {view === "no-paciente" &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderBackButton()}
              <p className="text-center text-sm text-muted-foreground mb-5">
                Contame, ¿qué necesitás?
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <button
                onClick={() => setView("question-terapia")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(30,40%,80%)]">
                
                  <Flame className="h-8 w-8 text-[hsl(30,50%,35%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Necesitás terapia?</span>
                  <span className="text-xs text-muted-foreground text-center">Comenzá tu proceso terapéutico</span>
                </button>
                <button
                onClick={() => setView("question-psicodiagnostico")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(45,60%,75%)]">
                
                  <BookOpen className="h-8 w-8 text-[hsl(45,70%,30%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Te solicitan un psicodiagnóstico?</span>
                  <span className="text-xs text-muted-foreground text-center">Evaluación de personalidad y aptitud</span>
                </button>
                <button
                onClick={() => setView("question-forense")}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-[hsl(200,50%,75%)]">
                
                  <Scale className="h-8 w-8 text-[hsl(200,60%,30%)]" />
                  <span className="text-sm font-semibold text-foreground text-center">¿Buscás asesoramiento para una causa judicial?</span>
                  <span className="text-xs text-muted-foreground text-center">Pericias y prácticas psico-forenses</span>
                </button>
              </div>
            </div>
          }

          {/* Question detail views */}
          {(view === "question-terapia" || view === "question-psicodiagnostico" || view === "question-forense") &&
          renderQuestionView(view)}

          {/* Soy Profesional */}
          {view === "profesional" &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mx-auto max-w-md">
              {renderBackButton()}
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                <img src={iconProfesional} alt="Profesional" className="h-12 w-12 object-contain" />
                <h3 className="text-lg font-semibold text-foreground">Contacto Profesional</h3>
                <p className="text-sm text-muted-foreground text-center">Para derivaciones, interconsultas o consultas profesionales.</p>
                <div className="w-full space-y-3 mt-2">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-green-300/40 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 transition-all hover:bg-green-100 active:scale-[0.98]">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]">
                    <Globe className="h-4 w-4" />
                    Sitio Web
                  </a>
                </div>
              </div>
            </div>
          }

          {/* Soy una Empresa */}
          {view === "empresa" &&
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mx-auto max-w-md">
              {renderBackButton()}
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-8">
                <Building2 className="h-12 w-12 text-blue-600" />
                <h3 className="text-lg font-semibold text-foreground">Contacto Empresarial</h3>
                <p className="text-sm text-muted-foreground text-center">Para servicios corporativos, evaluaciones y consultas institucionales.</p>
                <div className="w-full space-y-3 mt-2">
                  <a href={EMPRESA_EMAIL}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/10 active:scale-[0.98]">
                    <Mail className="h-4 w-4" />
                    Enviar Email
                  </a>
                  <a href={EMPRESA_WEB} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-300/40 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-[0.98]">
                    <Globe className="h-4 w-4" />
                    Sitio Web
                  </a>
                </div>
              </div>
            </div>
          }
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
            <p
              className="text-base leading-relaxed text-foreground/85 md:text-lg md:leading-relaxed"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              
              ✨ <em>"Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"</em>
            </p>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-2 rounded-xl bg-card border border-border/30 px-5 py-3 mx-6 lg:mx-10 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Tus datos están protegidos y son confidenciales.
            </p>
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
    </div>);

};

export default Login;