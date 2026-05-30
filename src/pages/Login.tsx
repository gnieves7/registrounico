import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/layout/Footer";
import {
  ShieldCheck, LogOut, ArrowRight, Lock, Stethoscope, Mail,
  Moon, Sun, Loader2, AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { applySystemTheme } from "@/lib/systemBranding";

type AccessState = "checking" | "ok" | "blocked";

const Login = () => {
  const { user, isLoading, isApproved, isAdmin, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  const [access, setAccess] = useState<AccessState>("checking");
  const [signingIn, setSigningIn] = useState(false);

  // Verifica si el email del usuario está autorizado
  useEffect(() => {
    if (!user || isLoading) return;
    if (isAdmin) {
      setAccess("ok");
      return;
    }
    let cancel = false;
    (async () => {
      const { data, error } = await supabase.rpc("is_current_email_authorized");
      if (cancel) return;
      if (error) {
        console.error("Authorization check failed:", error);
        setAccess("blocked");
        return;
      }
      setAccess(data === true ? "ok" : "blocked");
    })();
    return () => {
      cancel = true;
    };
  }, [user, isLoading, isAdmin]);

  // Redirige cuando todo está OK
  useEffect(() => {
    if (!user || isLoading) {
      applySystemTheme(null);
      return;
    }
    const hasSchool = sessionStorage.getItem("psi_active_school");
    if (isAdmin) {
      navigate(hasSchool ? "/admin/dashboard" : "/profesional/escuela", { replace: true });
      return;
    }
    if (access === "ok" && isApproved) {
      const redirectTo = sessionStorage.getItem("login_redirect");
      if (redirectTo) {
        sessionStorage.removeItem("login_redirect");
        navigate(redirectTo, { replace: true });
      } else {
        navigate(hasSchool ? "/dashboard" : "/profesional/escuela", { replace: true });
      }
    }
  }, [user, isLoading, isApproved, isAdmin, access, navigate]);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    try {
      sessionStorage.setItem("login_redirect", "/dashboard");
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error al iniciar sesión",
        description: "No se pudo conectar con Google. Intentá de nuevo.",
        variant: "destructive",
      });
      setSigningIn(false);
    }
  };

  // ── Loading global ──
  if (isLoading || (user && access === "checking")) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // ── Email no autorizado por el admin ──
  if (user && access === "blocked") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-foreground">
              Acceso no autorizado
            </h1>
            <p className="mb-3 text-sm text-muted-foreground">
              El email <strong className="text-foreground">{user.email}</strong> no está
              habilitado para ingresar a la plataforma.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Solicitá acceso al administrador del sistema para que pre-autorice tu cuenta.
            </p>
            <a
              href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" /> Solicitar acceso al administrador
            </a>
            <button
              onClick={() => signOut()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Email autorizado pero pendiente de aprobación ──
  if (user && access === "ok" && !isApproved && !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold text-foreground">
              Acceso pendiente de autorización
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Tu solicitud fue recibida. El administrador revisará tu cuenta y te
              habilitará en breve. Te avisaremos cuando puedas ingresar.
            </p>
            <button
              onClick={() => signOut()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Pantalla pública de login ──
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <button
        onClick={toggleDark}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-transform hover:scale-105"
        aria-label="Alternar modo oscuro"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <PsiLogo size="2xl" />
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Plataforma de Sistemas Interactivos
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-8 shadow-xl">
            <div className="mb-6 text-center">
              <span className="inline-block rounded-md bg-primary/10 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[1.2px] text-primary">
                Acceso exclusivo
              </span>
              <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-foreground">
                Profesional de la salud mental
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Plataforma reservada para psicólogos/as y profesionales acreditados.
                El ingreso se realiza con tu cuenta de Google previamente autorizada
                por el administrador.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {signingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Stethoscope className="h-4 w-4" />
              )}
              Ingresar con Google
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 flex items-start gap-2 border-t border-border pt-4">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Al ingresar aceptás nuestra{" "}
                <Link to="/privacy-policy" className="font-medium text-primary underline">
                  Política de Privacidad
                </Link>{" "}
                y el cumplimiento de la Ley N° 25.326. Tu email debe estar
                pre-autorizado por el administrador para ingresar.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            ¿No tenés acceso?{" "}
            <a
              href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
              className="font-semibold text-primary underline"
            >
              Solicitalo al administrador
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
