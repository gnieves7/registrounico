import { useNavigate, Outlet } from "react-router-dom";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { useAuth } from "@/hooks/useAuth";
import { useConsentVersion } from "@/hooks/useConsentVersion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, FileSignature, CreditCard, CheckCircle2, MapPin, ShieldAlert, Stethoscope, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  children?: React.ReactNode;
}

export const ProfessionalAccessGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const { user, isApproved, isAdmin } = useAuth();
  const { loading, isProfessional, hasAccess, needsPayment, needsConsent, isSantaFe, jurisdiction } = useProfessionalAccess();
  const {
    loading: consentLoading,
    consentOutdated,
    currentVersion,
    signedVersion,
    signedPdfPath,
  } = useConsentVersion();
  const [paying, setPaying] = useState(false);
  const [downloadingPrev, setDownloadingPrev] = useState(false);

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

  if (loading || consentLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
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
        {isProfessional && isSantaFe && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 px-4 py-2 text-center text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            Acceso gratuito para psicólogos matriculados en Santa Fe
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

  // Needs payment (jurisdicciones fuera de Santa Fe)
  const handleSubscribe = async () => {
    setPaying(true);
    try {
      const { data, error } = await supabase.functions.invoke("mercadopago-create-subscription", {
        body: { plan: "monthly" },
      });
      if (error) throw error;
      if (data?.init_point) window.location.href = data.init_point;
      else throw new Error("No se obtuvo el link de pago");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error al iniciar pago", description: err.message, variant: "destructive" });
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Suscripción requerida</CardTitle>
            <CardDescription>
              .PSI. es gratuito para psicólogos matriculados en la provincia de Santa Fe.
              Tu jurisdicción registrada es <strong>{jurisdiction || "(sin definir)"}</strong>, por lo que el acceso tiene un costo de
              <strong> USD 5 por mes</strong>, sin permanencia.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <p className="flex items-start gap-2"><Stethoscope className="h-3.5 w-3.5 mt-0.5 shrink-0" /> Si sos de Santa Fe, actualizá tu jurisdicción en el perfil profesional para acceso gratis.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate("/diagnostico-acceso")}>Ver diagnóstico de acceso</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-lg">Acceso Profesional Mensual</CardTitle>
            <div className="text-3xl font-bold text-primary">
              USD 5<span className="text-sm font-normal text-muted-foreground">/mes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acceso completo a los 3 sistemas</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sin permanencia</p>
            <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancelás cuando quieras</p>
            <Button disabled={paying} className="w-full mt-4 gap-2" onClick={handleSubscribe}>
              {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Suscribirme por USD 5/mes
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Pagos procesados de forma segura por MercadoPago. El monto en USD se convierte a pesos argentinos al tipo de cambio vigente.
          Si sos psicólogo/a matriculado/a en Santa Fe, actualizá tu jurisdicción en tu perfil profesional para acceder gratis.
        </p>
      </div>
    </div>
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
