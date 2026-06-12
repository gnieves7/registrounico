import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  ShieldCheck, LogOut, ArrowRight, Lock, Mail, Loader2, AlertTriangle, Wifi, Battery, Search,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { applySystemTheme } from "@/lib/systemBranding";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccessState = "checking" | "ok" | "blocked";

const Login = () => {
  const { user, isLoading, isApproved, isAdmin, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();
  const [access, setAccess] = useState<AccessState>("checking");
  const [signingIn, setSigningIn] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

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
      <div className="mac-lockscreen flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--mac-cream)]" />
      </div>
    );
  }

  // ── Email no autorizado por el admin ──
  if (user && access === "blocked") {
    return (
      <div className="mac-lockscreen flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="mac-glass w-full max-w-md rounded-2xl p-8 text-center text-[var(--mac-cream)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold">
              Acceso no autorizado
            </h1>
            <p className="mb-3 text-sm opacity-90">
              El email <strong>{user.email}</strong> no está
              habilitado para ingresar a la plataforma.
            </p>
            <p className="mb-6 text-sm opacity-80">
              Solicitá acceso al administrador del sistema para que pre-autorice tu cuenta.
            </p>
            <a
              href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--mac-gold)] px-4 py-2.5 text-sm font-semibold text-[var(--mac-borravino)] transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" /> Solicitar acceso al administrador
            </a>
            <button
              onClick={() => signOut()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-[var(--mac-cream)] transition-opacity hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Email autorizado pero pendiente de aprobación ──
  if (user && access === "ok" && !isApproved && !isAdmin) {
    return (
      <div className="mac-lockscreen flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="mac-glass w-full max-w-md rounded-2xl p-8 text-center text-[var(--mac-cream)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="h-7 w-7 text-[var(--mac-gold)]" />
            </div>
            <h1 className="mb-2 font-serif text-2xl font-bold">
              Acceso pendiente de autorización
            </h1>
            <p className="mb-6 text-sm opacity-90">
              Tu solicitud fue recibida. El administrador revisará tu cuenta y te
              habilitará en breve. Te avisaremos cuando puedas ingresar.
            </p>
            <button
              onClick={() => signOut()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold transition-opacity hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Lock screen estilo macOS ──
  const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="mac-lockscreen relative flex min-h-screen flex-col text-[var(--mac-cream)]">
      {/* faux menu bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-[12px] opacity-90">
        <div className="flex items-center gap-3">
          <span className="font-serif font-semibold tracking-wide" style={{ color: "var(--mac-gold)" }}>.PSI.</span>
        </div>
        <div className="flex items-center gap-3">
          <Wifi className="h-3.5 w-3.5" />
          <Battery className="h-3.5 w-3.5" />
          <Search className="h-3.5 w-3.5" />
          <span>{now.toLocaleString("es-AR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Hora y fecha */}
        <div className="mb-12 text-center mac-unlock-in">
          <div className="font-serif text-7xl font-light leading-none tracking-tight md:text-8xl">{timeStr}</div>
          <div className="mt-3 text-base capitalize opacity-90 md:text-lg">{dateStr}</div>
        </div>

        {/* Avatar + acceso */}
        <div className="flex flex-col items-center gap-5 mac-unlock-in">
          <Avatar className="h-24 w-24 ring-4 ring-white/25 shadow-2xl">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[var(--mac-borravino)] font-serif text-2xl text-[var(--mac-gold)]">PSI</AvatarFallback>
          </Avatar>

          <PsiLogo size="md" color="#F5EFE6" />
          <p className="text-xs uppercase tracking-[0.22em] opacity-80">Mi Práctica · Profesional</p>

          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--mac-cream)] px-7 py-2.5 text-sm font-semibold text-[var(--mac-borravino)] shadow-lg transition-transform hover:scale-[1.03] disabled:opacity-60"
          >
            {signingIn ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            Acceder con Google
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-4 max-w-xs text-center text-[11px] leading-relaxed opacity-75">
            Acceso exclusivo para psicólogos/as autorizados. Al ingresar aceptás nuestra{" "}
            <Link to="/privacy-policy" className="underline decoration-[var(--mac-gold)] underline-offset-2">Política de Privacidad</Link>.
          </p>

          <a
            href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
            className="mt-1 text-[11px] underline decoration-white/40 underline-offset-2 opacity-80 hover:opacity-100"
          >
            ¿No tenés acceso? Solicitalo al administrador
          </a>
        </div>
      </main>

      <div className="pb-4 text-center text-[11px] opacity-60">
        <span className="rounded-full border border-white/15 px-3 py-1">Pulsá para desbloquear</span>
      </div>
    </div>
  );
};

export default Login;
