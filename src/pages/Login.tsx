import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/layout/Footer";
import { Heart, Shield, Users } from "lucide-react";

const Login = () => {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard");
    }
  }, [user, isLoading, navigate]);

  const handleGoogleLogin = async () => {
    try {
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Logo/Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Heart className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Registro Clínico Personalizado
          </h1>
          <p className="mt-2 text-muted-foreground">
            Plataforma Privada para la Dinámica Terapéutica
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Bienvenido</CardTitle>
            <CardDescription>
              Inicia sesión para acceder a tu espacio terapéutico personal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGoogleLogin}
              className="w-full"
              size="lg"
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
              Continuar con Google
            </Button>

            <div className="mt-6 space-y-3 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Tus datos están protegidos y son confidenciales</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Acceso exclusivo para pacientes autorizados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid max-w-3xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Heart className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Espacio de Reflexión</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Un lugar seguro para expresarte y registrar tu proceso
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Shield className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Privacidad Total</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Información protegida con los más altos estándares
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Users className="h-6 w-6 text-accent-foreground" />
            </div>
            <h3 className="font-medium text-foreground">Acompañamiento</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Conectado con tu proceso terapéutico
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
