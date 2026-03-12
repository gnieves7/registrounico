import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { Flame, BookOpen, Scale, ShieldCheck, LogOut, Calendar } from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import { toast } from "@/hooks/use-toast";
import logoImg from "@/assets/Logo_ReflexionAr.png";

const CALENDAR_LINK = "https://calendar.app.google/9do3Ag82RUUN1uNA8";

const sections = [
  {
    id: "clinica",
    title: "Sistema Reflexionar",
    systemName: "Área Clínica",
    subtitle: "",
    description: "Espacio interactivo para los avances de la psicoterapia con acceso exclusivo para Pacientes",
    icon: Flame,
    redirect: "/psychobiography",
    bgColor: "bg-[hsl(30,30%,95%)]",
    iconBg: "bg-[hsl(30,40%,88%)]",
    iconColor: "text-[hsl(30,50%,35%)]",
    hoverBorder: "hover:border-[hsl(30,40%,80%)]",
    hoverShadow: "hover:shadow-[0_8px_30px_hsl(30,40%,88%,0.4)]",
  },
  {
    id: "psicodiagnostico",
    title: "Sistema Evaluar",
    systemName: "Área Psicodiagnóstica",
    subtitle: "",
    description: "Pruebas y tests específicos para acreditar la salud mental. Acceso restringido, previa autorización del psicólogo",
    icon: BookOpen,
    redirect: "/psychodiagnostic",
    bgColor: "bg-[hsl(45,60%,92%)]",
    iconBg: "bg-[hsl(45,65%,82%)]",
    iconColor: "text-[hsl(45,70%,30%)]",
    hoverBorder: "hover:border-[hsl(45,60%,75%)]",
    hoverShadow: "hover:shadow-[0_8px_30px_hsl(45,60%,82%,0.4)]",
  },
  {
    id: "forense",
    title: "Sistema Acompañar",
    systemName: "Área Forense",
    subtitle: "",
    description: "Espacio destinado a la problemática judicial, solicitud de pericias, análisis del testimonio en Cámara Gesell, entre otras prácticas psico-forenses. Acceso restringido, previa autorización del psicólogo",
    icon: Scale,
    redirect: "/forensic",
    bgColor: "bg-[hsl(200,50%,92%)]",
    iconBg: "bg-[hsl(200,55%,82%)]",
    iconColor: "text-[hsl(200,60%,30%)]",
    hoverBorder: "hover:border-[hsl(200,50%,75%)]",
    hoverShadow: "hover:shadow-[0_8px_30px_hsl(200,50%,82%,0.4)]",
  },
];

const Login = () => {
  const { user, isLoading, isApproved, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
        description: "No se pudo conectar con Google. Intentá de nuevo o habilitá las ventanas emergentes.",
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
            <p className="mb-4 text-muted-foreground">
              Esta plataforma es exclusiva para pacientes registrados. Tu solicitud de acceso fue recibida y será revisada por el profesional.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Una vez autorizado, podrás acceder a todas las funciones de tu registro clínico personalizado.
            </p>
            <Button variant="outline" onClick={() => signOut()} className="transition-all duration-200 hover:scale-105 active:scale-95">
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
            <Button size="lg" className="rounded-xl transition-all duration-200 hover:scale-105 active:scale-95" onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
      <main className="flex flex-1 flex-col">
        {/* Header with DSM-SIE branding */}
        <header className="border-b border-border/30 bg-card/80 backdrop-blur-sm px-6 py-8 lg:px-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <img src={logoImg} alt="Logo ReflexionAr" className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24 drop-shadow-sm" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                DSM - SIE
              </h1>
              <p className="mt-1 text-base font-medium text-primary md:text-lg">
                Dinámica de la Salud Mental — Sistemas Integrados Especializados
              </p>
              <p className="mt-3 max-w-xl mx-auto text-sm leading-relaxed text-muted-foreground">
                Plataforma única, privada e interactiva para tu salud mental. Un espacio personalizado donde registrar tus avances, solicitar turnos e informes.
              </p>
            </div>
          </div>
        </header>

        {/* Solicitar Turno Button */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-6 lg:px-10">
          <a
            href={CALENDAR_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <Calendar className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="text-base font-semibold text-primary">Solicitar Turno</span>
          </a>
        </section>

        {/* Single Google Login Button */}
        <section className="mx-auto w-full max-w-5xl px-6 pt-5 lg:px-10">
          <button
            onClick={() => handleGoogleLogin("/dashboard", "general")}
            className="group w-full flex items-center justify-center gap-3 rounded-2xl border border-border/50 bg-card px-6 py-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <svg className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-base font-semibold text-foreground">Ingresar con Google</span>
          </button>
        </section>

        {/* 3 Service Cards */}
        <section className="mx-auto w-full max-w-5xl px-6 py-6 lg:px-10">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => handleGoogleLogin(section.redirect, section.id)}
                className={`group flex flex-col items-center gap-4 rounded-2xl border border-border/40 bg-card p-7 transition-all duration-300 ${section.hoverBorder} ${section.hoverShadow} hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/30`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex h-24 w-24 items-center justify-center rounded-full ${section.bgColor} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${section.iconBg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <section.icon className={`h-7 w-7 ${section.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold leading-snug text-foreground">{section.title}</h3>
                  <p className="mt-1 text-sm font-bold text-primary tracking-wide">
                    {section.systemName}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {section.subtitle}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {section.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Professional Stats */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-6 lg:px-10">
          <div className="rounded-2xl border border-border/40 bg-card px-6 py-6 shadow-sm">
            <ProfessionalStats />
          </div>
        </section>

        {/* Quote - moved to bottom */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-6 lg:px-10">
          <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-primary/5 px-8 py-7 shadow-sm">
            <div className="absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-primary/40" />
            <p
              className="text-base leading-relaxed text-foreground/85 md:text-lg md:leading-relaxed"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              ✨ <em>"Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"</em>
            </p>
          </div>
        </section>

        {/* Privacy Notice */}
        <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-2 rounded-xl bg-card border border-border/30 px-5 py-3 mx-6 lg:mx-10 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Tus datos están protegidos y son confidenciales. Acceso exclusivo para pacientes autorizados.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Al ingresar, aceptás los{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline font-medium transition-colors duration-200 hover:text-primary/80">
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
