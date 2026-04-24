import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { lovable } from "@/integrations/lovable/index";

const ProfessionalLogin = () => {
  const { user, isLoading, isAdmin, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });

  useEffect(() => {
    if (isLoading || !user) return;
    // 1° admin siempre va al panel admin
    if (isAdmin) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    navigate("/profesional/registro", { replace: true });
  }, [user, isLoading, isAdmin, navigate]);

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      toast({ title: "Completá email y contraseña", variant: "destructive" });
      return;
    }
    if (mode === "signup" && !form.fullName.trim()) {
      toast({ title: "Ingresá tu nombre completo", variant: "destructive" });
      return;
    }
    if (mode === "signup" && form.password.length < 8) {
      toast({ title: "La contraseña debe tener al menos 8 caracteres", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmail(form.email, form.password);
        // No navegamos aquí: el useEffect de arriba detecta el rol
        // (admin → /admin/dashboard, otros → /profesional/registro)
      } else {
        const { needsEmailVerification } = await signUpWithEmail(form.email, form.password, form.fullName.trim());
        if (needsEmailVerification) {
          toast({
            title: "Verificá tu correo",
            description: "Te enviamos un enlace de verificación. Una vez confirmado, completá tu registro.",
          });
        } else {
          navigate("/profesional/registro");
        }
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Intentá nuevamente", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/profesional/login`,
      });
      if (result.error) {
        toast({
          title: "No se pudo iniciar sesión con Google",
          description: (result.error as any)?.message || "Intentá nuevamente.",
          variant: "destructive",
        });
        setGoogleLoading(false);
        return;
      }
      // Si redirige al proveedor, el navegador toma control. Si no, el useEffect maneja la redirección post-login.
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Intentá nuevamente", variant: "destructive" });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F7F4", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-md mx-auto w-full px-5 py-10">
        <button
          onClick={() => navigate("/profesional")}
          className="flex items-center gap-2 text-sm font-medium mb-6 hover:opacity-70"
          style={{ color: "#6B6B6B" }}
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="text-center mb-6">
          <PsiLogo size="md" />
          <p className="text-xs mt-2" style={{ color: "#6B6B6B" }}>Acceso profesional</p>
        </div>

        <Card style={{ background: "#FFFFFF", border: "1px solid #E2DED8" }}>
          <CardHeader>
            <CardTitle style={{ color: "#1A1A1A" }}>
              {mode === "login" ? "Iniciá sesión" : "Crear cuenta profesional"}
            </CardTitle>
            <CardDescription style={{ color: "#6B6B6B" }}>
              {mode === "login"
                ? "Acceso exclusivo para profesionales habilitados."
                : "Tu cuenta será revisada por el administrador antes de habilitar el acceso."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || submitting}
              variant="outline"
              className="w-full gap-2 font-medium"
              style={{ borderColor: "#E2DED8", color: "#1A1A1A", background: "#FFFFFF" }}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
              )}
              Continuar con Google
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" style={{ borderColor: "#E2DED8" }} />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="px-2" style={{ background: "#FFFFFF", color: "#9A9A9A" }}>o con email</span>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Apellido y Nombre" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-9" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="profesional@ejemplo.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-9" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={mode === "signup" ? "Mín. 8 caracteres" : "••••••••"} />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
              style={{ background: "#1C3F6E", color: "#fff" }}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </Button>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="w-full text-xs font-medium hover:opacity-70 transition-opacity"
              style={{ color: "#1C3F6E" }}
            >
              {mode === "login" ? "¿No tenés cuenta? Crear una nueva" : "¿Ya tenés cuenta? Iniciar sesión"}
            </button>

            <div className="flex items-start gap-2 pt-3 border-t" style={{ borderColor: "#E2DED8" }}>
              <ShieldCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#1C3F6E" }} />
              <p className="text-[11px] leading-relaxed" style={{ color: "#6B6B6B" }}>
                Al continuar aceptás nuestra{" "}
                <Link to="/privacy-policy" className="underline" style={{ color: "#1C3F6E" }}>Política de Privacidad</Link>{" "}
                y el cumplimiento de la Ley N° 25.326.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfessionalLogin;