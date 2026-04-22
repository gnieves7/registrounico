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

const ProfessionalLogin = () => {
  const { user, isLoading, signInWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });

  useEffect(() => {
    if (!isLoading && user) navigate("/profesional/registro");
  }, [user, isLoading, navigate]);

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
        navigate("/profesional/registro");
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