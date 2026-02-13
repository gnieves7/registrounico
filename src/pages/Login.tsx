import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { Heart, Brain, Scale, Shield } from "lucide-react";

const sections = [
  {
    id: "clinica",
    title: "¿Buscás terapia?",
    subtitle: "Área Clínica",
    description:
      "Espacio terapéutico personalizado. Registro clínico, seguimiento emocional y acompañamiento profesional en tu proceso.",
    icon: Heart,
    redirect: "/psychobiography",
    color: "bg-primary/10 text-primary",
    borderColor: "border-primary/30 hover:border-primary/60",
  },
  {
    id: "psicodiagnostico",
    title: "¿Necesitás una evaluación?",
    subtitle: "Área Psicodiagnóstica",
    description:
      "Evaluaciones psicológicas profesionales. Tests estandarizados, informes psicodiagnósticos y análisis de personalidad.",
    icon: Brain,
    redirect: "/psychodiagnostic",
    color: "bg-secondary/10 text-secondary",
    borderColor: "border-secondary/30 hover:border-secondary/60",
  },
  {
    id: "forense",
    title: "¿Surgió una causa judicial?",
    subtitle: "Área Forense",
    description:
      "Pericias psicológicas para procesos judiciales. Expediente forense, documentación legal y acompañamiento pericial.",
    icon: Scale,
    redirect: "/forensic",
    color: "bg-destructive/10 text-destructive",
    borderColor: "border-destructive/30 hover:border-destructive/60",
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

  const handleGoogleLogin = async (redirectPath: string) => {
    try {
      sessionStorage.setItem("login_redirect", redirectPath);
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
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="mb-6 rounded-full bg-primary/10 p-5">
            <Shield className="h-14 w-14 text-primary" />
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">¡Hola de nuevo!</h1>
          <p className="mb-8 text-muted-foreground">Ya tenés una sesión activa.</p>
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Ir al Dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-5">
              <Shield className="h-14 w-14 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Registro Clínico Personalizado
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic text-muted-foreground md:text-xl">
            "Los senderos del inconsciente son misteriosos… qué mejor un compañero para transitarlos"
          </p>
        </div>

        {/* Three Sections */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <Card
              key={section.id}
              className={`flex flex-col border-2 transition-all ${section.borderColor} hover:shadow-lg`}
            >
              <CardHeader className="flex-1 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <section.icon className={`h-8 w-8 ${section.color.split(" ")[1]}`} />
                </div>
                <CardTitle className="text-xl">{section.title}</CardTitle>
                <span className="mt-1 inline-block rounded-full bg-muted/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.subtitle}
                </span>
                <CardDescription className="mt-3 text-sm">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={() => handleGoogleLogin(section.redirect)}
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Ingresar con Google
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Privacy Notice */}
        <div className="mt-12 flex max-w-2xl items-center justify-center gap-2 rounded-lg bg-muted/50 p-4 text-center">
          <Shield className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Tus datos están protegidos y son confidenciales. Acceso exclusivo para pacientes autorizados.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
