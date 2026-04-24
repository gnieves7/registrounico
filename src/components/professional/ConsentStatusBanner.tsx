import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useConsentVersion } from "@/hooks/useConsentVersion";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  FileSignature,
  Loader2,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Banner permanente para el dashboard profesional que informa el
 * estado del consentimiento informado:
 *  - Firmado y vigente → banner verde discreto con descarga.
 *  - Pendiente de aprobación admin → banner ámbar.
 *  - Desactualizado (cambió la versión) → banner rojo con descarga
 *    de la constancia previa y CTA para firmar la nueva versión.
 */
export function ConsentStatusBanner() {
  const navigate = useNavigate();
  const { user, isApproved } = useAuth();
  const { isProfessional, needsConsent } = useProfessionalAccess();
  const {
    loading,
    currentVersion,
    signedVersion,
    signedAt,
    signedPdfPath,
    consentOutdated,
  } = useConsentVersion();
  const [downloading, setDownloading] = useState(false);

  if (!user || !isProfessional || loading) return null;

  const handleDownload = async () => {
    if (!signedPdfPath) return;
    setDownloading(true);
    try {
      const { data, error } = await supabase.storage
        .from("consentimientos-profesionales")
        .createSignedUrl(signedPdfPath, 60);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast({
        title: "No se pudo generar el enlace",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  // Estado: nunca firmó (lo maneja el gate, pero por seguridad mostramos aviso)
  if (needsConsent && !signedVersion) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
          <FileSignature className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Consentimiento profesional pendiente</p>
            <p className="text-xs opacity-80">
              Necesitás firmar el consentimiento para usar las funciones clínicas.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => navigate("/profesional/consentimiento")}>
          Firmar ahora
        </Button>
      </div>
    );
  }

  // Estado: versión desactualizada
  if (consentOutdated) {
    return (
      <div className="rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 px-4 py-3 space-y-2">
        <div className="flex items-start gap-2 text-sm text-rose-900 dark:text-rose-200">
          <ShieldAlert className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Nueva versión del consentimiento ({currentVersion})</p>
            <p className="text-xs opacity-80">
              Firmaste la versión {signedVersion}. Para continuar usando .PSI. debés
              aceptar la versión vigente.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => navigate("/profesional/consentimiento")}>
            <FileSignature className="h-3.5 w-3.5 mr-1.5" />
            Firmar nueva versión
          </Button>
          {signedPdfPath && (
            <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5 mr-1.5" />
              )}
              Descargar constancia previa
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Estado: pendiente de aprobación admin (ya firmó)
  if (signedVersion && !isApproved) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-200">
          <Clock className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Consentimiento firmado — pendiente de revisión</p>
            <p className="text-xs opacity-80">
              Versión {signedVersion} aceptada el{" "}
              {signedAt && format(new Date(signedAt), "dd MMM yyyy 'a las' HH:mm", { locale: es })}.
              El administrador revisará tu cuenta.
            </p>
          </div>
        </div>
        {signedPdfPath && (
          <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            Constancia
          </Button>
        )}
      </div>
    );
  }

  // Estado: firmado y vigente
  if (signedVersion) {
    return (
      <div className="rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 text-sm text-emerald-900 dark:text-emerald-200">
          <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Consentimiento vigente (v{signedVersion})</p>
            <p className="text-xs opacity-80">
              Firmado el{" "}
              {signedAt && format(new Date(signedAt), "dd MMM yyyy", { locale: es })}.
            </p>
          </div>
        </div>
        {signedPdfPath && (
          <Button size="sm" variant="outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            Constancia
          </Button>
        )}
      </div>
    );
  }

  return null;
}
