import { useNavigate, Outlet } from "react-router-dom";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { useAuth } from "@/hooks/useAuth";
import { useConsentVersion } from "@/hooks/useConsentVersion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, FileSignature, CheckCircle2, ShieldAlert, Download, RefreshCw, AlertTriangle, LogOut, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  children?: React.ReactNode;
}

export const ProfessionalAccessGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user, isApproved, isAdmin, signOut } = useAuth();
  const { loading, isProfessional, hasAccess, needsConsent } = useProfessionalAccess();
  const {
    loading: consentLoading,
    consentOutdated,
    currentVersion,
    signedVersion,
    signedPdfPath,
  } = useConsentVersion();
  const [downloadingPrev, setDownloadingPrev] = useState(false);
  const [emailAuthorized, setEmailAuthorized] = useState<boolean | null>(null);

  // Verificar allowlist del email (admins se omiten)
  useEffect(() => {
    if (!user || isAdmin) {
      setEmailAuthorized(true);
      return;
    }
    let cancel = false;
    (async () => {
      const { data, error } = await supabase.rpc("is_current_email_authorized");
      if (cancel) return;
      setEmailAuthorized(error ? false : data === true);
    })();
    return () => { cancel = true; };
  }, [user, isAdmin]);

  // Auto-redirect a la pantalla unificada de consentimiento si está pendiente
  // (excepto admins, que pueden navegar libremente)
  useEffect(() => {
    if (loading) return;
    if (isAdmin) return;
    if (isProfessional && needsConsent) {
      const here = window.location.pathname;
      if (!here.startsWith("/profesional/consentimiento") && !here.startsWith("/profesional/registro")) {
        navigate("/profesional/consentimiento", { replace: true });
      }
    }
  }, [loading, isAdmin, isProfessional, needsConsent, navigate]);

  if (loading || consentLoading || emailAuthorized === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  // Email no autorizado por el admin → bloqueo total
  if (user && !isAdmin && emailAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Acceso no autorizado</CardTitle>
            <CardDescription>
              El email <strong>{user.email}</strong> no está habilitado para ingresar.
              Solicitá acceso al administrador para que pre-autorice tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" /> Solicitar acceso al administrador
            </a>
            <Button variant="outline" className="w-full" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin siempre tiene acceso. Si visita rutas profesionales con consentimiento pendiente,
  // mostramos un aviso de estado en banner pero no bloqueamos.
  if (isAdmin) {
    return (
      <>
        {isProfessional && needsConsent && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-xs text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5" />
            Acceso administrativo — tu consentimiento profesional está pendiente de firma.
          </div>
        )}
        {isProfessional && !needsConsent && consentOutdated && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-800 px-4 py-2 text-center text-xs text-rose-900 dark:text-rose-200 flex items-center justify-center gap-2">
            <RefreshCw className="h-3.5 w-3.5" />
            Acceso administrativo — hay una nueva versión del consentimiento (v{currentVersion}). Firmaste v{signedVersion}.
          </div>
        )}
        {children ?? <Outlet />}
      </>
    );
  }

  // Profesional con consentimiento desactualizado: bloqueo total con pantalla intermedia.
  if (isProfessional && !needsConsent && consentOutdated) {
    const handleDownloadPrev = async () => {
      if (!signedPdfPath) return;
      setDownloadingPrev(true);
      try {
        const { data, error } = await supabase.storage
          .from("consentimientos-profesionales")
          .createSignedUrl(signedPdfPath, 60);
        if (error) throw error;
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      } catch (err: any) {
        toast({ title: "No se pudo descargar", description: err.message, variant: "destructive" });
      } finally {
        setDownloadingPrev(false);
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center mb-3">
              <RefreshCw className="h-6 w-6 text-rose-600" />
            </div>
            <CardTitle>Nueva versión del consentimiento</CardTitle>
            <CardDescription>
              Se publicó una nueva versión del Consentimiento Informado Profesional
              (<strong>v{currentVersion}</strong>). Firmaste la versión <strong>v{signedVersion}</strong>.
              Para continuar usando la plataforma necesitás aceptar la versión vigente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => navigate("/profesional/consentimiento")}>
              <FileSignature className="h-4 w-4 mr-2" />
              Firmar nueva versión (v{currentVersion})
            </Button>
            {signedPdfPath && (
              <Button variant="outline" className="w-full" onClick={handleDownloadPrev} disabled={downloadingPrev}>
                {downloadingPrev ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Descargar constancia previa (v{signedVersion})
              </Button>
            )}
            <p className="text-xs text-muted-foreground pt-2 text-center">
              Tu firma anterior queda archivada para auditoría.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isProfessional || hasAccess) {
    return (
      <>
        {isProfessional && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-center text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Acceso profesional gratuito autorizado por el administrador
          </div>
        )}
        {children ?? <Outlet />}
      </>
    );
  }

  // Profesional sin aprobación del admin
  if (isProfessional && !isApproved && !needsConsent) {
    return (
      <GateShell icon={<ShieldAlert className="h-6 w-6 text-amber-600" />} title="Pendiente de aprobación" description="Tu cuenta profesional está esperando la aprobación del administrador. Recibirás un aviso apenas se decida.">
        <Button variant="outline" className="w-full" onClick={() => navigate("/diagnostico-acceso")}>Ver diagnóstico de acceso</Button>
      </GateShell>
    );
  }

  // Needs consent
  if (needsConsent) {
    return (
      <GateShell icon={<FileSignature className="h-6 w-6 text-primary" />} title="Consentimiento pendiente" description="Para continuar, necesitás completar el registro profesional y firmar el consentimiento informado (nombre completo + DNI).">
        <Button className="w-full" onClick={() => navigate("/profesional/consentimiento")}>Completar registro y firmar</Button>
        <Button variant="outline" className="w-full" onClick={() => navigate("/diagnostico-acceso")}>Ver diagnóstico</Button>
      </GateShell>
    );
  }

  // Estado por defecto: pendiente de aprobación del administrador.
  return (
    <GateShell
      icon={<ShieldAlert className="h-6 w-6 text-amber-600" />}
      title="Pendiente de autorización"
      description="Tu cuenta está esperando la autorización del administrador. El acceso a .PSI. es gratuito para todos los profesionales una vez aprobados."
    >
      <a
        href="mailto:ghnieves14@gmail.com?subject=Solicitud%20de%20acceso%20a%20.PSI."
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Mail className="h-4 w-4" /> Solicitar autorización al administrador
      </a>
      <Button variant="outline" className="w-full" onClick={() => navigate("/diagnostico-acceso")}>Ver diagnóstico de acceso</Button>
      <Button variant="ghost" className="w-full" onClick={() => signOut()}>
        <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
      </Button>
    </GateShell>
  );
};

function GateShell({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">{icon}</div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">{children}</CardContent>
      </Card>
    </div>
  );
}
