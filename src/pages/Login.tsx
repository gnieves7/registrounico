import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { Flame, BookOpen, Scale } from "lucide-react";
import ProfessionalStats from "@/components/landing/ProfessionalStats";
import danteBg from "@/assets/dante-bg.jpg";

const sections = [
  {
    id: "clinica",
    title: "Terapia",
    subtitle: "Área Clínica",
    description: "Acompañamiento terapéutico personalizado",
    icon: Flame,
    redirect: "/psychobiography",
    bgColor: "bg-[hsl(30,30%,95%)]",
    iconBg: "bg-[hsl(30,40%,88%)]",
    iconColor: "text-[hsl(30,50%,35%)]",
    hoverBorder: "hover:border-[hsl(30,40%,80%)]",
  },
  {
    id: "psicodiagnostico",
    title: "Evaluación",
    subtitle: "Área Psicodiagnóstica",
    description: "Tests y evaluaciones psicológicas profesionales",
    icon: BookOpen,
    redirect: "/psychodiagnostic",
    bgColor: "bg-[hsl(45,60%,92%)]",
    iconBg: "bg-[hsl(45,65%,82%)]",
    iconColor: "text-[hsl(45,70%,30%)]",
    hoverBorder: "hover:border-[hsl(45,60%,75%)]",
  },
  {
    id: "forense",
    title: "Judicial",
    subtitle: "Área Forense",
    description: "Pericias y documentación para procesos judiciales",
    icon: Scale,
    redirect: "/forensic",
    bgColor: "bg-[hsl(200,50%,92%)]",
    iconBg: "bg-[hsl(200,55%,82%)]",
    iconColor: "text-[hsl(200,60%,30%)]",
    hoverBorder: "hover:border-[hsl(200,50%,75%)]",
  },
];

const Login = () => {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user && !isLoading) {
      const redirectTo = sessionStorage.getItem("login_redirect");
      if (redirectTo) {
        sessionStorage.removeItem("login_redirect");
        navigate(redirectTo);
      }
    }
  }, [user, isLoading, navigate]);

  const handleGoogleLogin = async (redirectPath: string, area: string) => {
    try {
      sessionStorage.setItem("login_redirect", redirectPath);
      sessionStorage.setItem("user_area", area);
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex min-h-screen flex-col">
        <main
          className="relative flex flex-1 items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${danteBg})` }}
        >
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center rounded-xl bg-card/80 p-10 shadow-lg backdrop-blur-md">
            <Flame className="mb-4 h-14 w-14 text-primary" />
            <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">¡Hola de nuevo!</h1>
            <p className="mb-8 text-muted-foreground">Ya tenés una sesión activa.</p>
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Left: Photo – clean, no overlay text */}
        <div
          className="relative min-h-[30vh] flex-1 bg-cover bg-center lg:min-h-0"
          style={{ backgroundImage: `url(${danteBg})` }}
        />

        {/* Right: Title + Quote + Sections */}
        <div className="flex flex-1 flex-col justify-center bg-background px-6 py-8 lg:px-10 lg:py-10">
          <Flame className="mb-3 h-10 w-10 text-primary" />
          <h1 className="mb-2 font-serif text-2xl font-bold text-foreground md:text-3xl">
            Registro Clínico Personalizado
          </h1>
          <p className="mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 font-serif text-sm italic text-foreground/80 md:text-base">
            ✨ "Los senderos del inconsciente son sinuosos y enigmáticos, agradables, poderosos y en ocasiones siniestros. Recorrerlo es la única manera de descubrirte y poder lograr la paz mental. Es un viaje largo y puedo acompañarte. Seré tu guía, el tiempo que vos decidas"
          </p>

          {/* Professional Stats */}
          <div className="mb-6 rounded-lg border border-border/50 bg-muted/30 px-4 py-4">
            <ProfessionalStats />
          </div>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => handleGoogleLogin(section.redirect, section.id)}
                className={`group flex w-52 flex-col items-center gap-4 rounded-2xl border-2 border-transparent p-6 transition-all duration-300 ${section.hoverBorder} hover:shadow-lg`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-full ${section.bgColor} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-full ${section.iconBg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <section.icon className={`h-9 w-9 ${section.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {section.subtitle}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Ingresar
                </span>
              </button>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 flex items-center gap-2 rounded-lg bg-muted/50 p-3">
            <Flame className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              Tus datos están protegidos y son confidenciales. Acceso exclusivo para pacientes autorizados.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
