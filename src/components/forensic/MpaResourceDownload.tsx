import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activityLogger";

/**
 * Botón inline para descargar una resolución del MPA almacenada
 * en el bucket privado `recursos-profesionales`. Genera una signed
 * URL de corta vida (10 min) y registra la descarga en activity_log.
 */
interface MpaResourceDownloadProps {
  storagePath: string;
  label: string;
  resourceId?: string;
}

export function MpaResourceDownload({
  storagePath,
  label,
  resourceId,
}: MpaResourceDownloadProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("recursos-profesionales")
        .createSignedUrl(storagePath, 600);
      if (error || !data?.signedUrl) throw error ?? new Error("URL no disponible");

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await logActivity(user.id, "mpa_resource_download", {
          resource_id: resourceId ?? null,
          storage_path: storagePath,
          label,
        });
      }
    } catch (e) {
      console.error("Error downloading MPA resource:", e);
      toast.error("No se pudo abrir el PDF. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={loading}
      className="h-7 gap-1.5 px-2 text-xs"
    >
      {loading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      Descargar PDF
    </Button>
  );
}

export const MPA_RESOURCES = {
  res147: {
    id: "cc485a3d-cfbd-4bdf-893c-2a7bf6c20ee6",
    storagePath: "protocols/resolucion-mpa-147-2020-brasilia.pdf",
    label: "Resolución MPA N° 147/2020 — 100 Reglas de Brasilia",
  },
  res417: {
    id: "3fe85469-7e48-4028-a50d-8703a09ccb71",
    storagePath: "protocols/resolucion-mpa-417-femicidio.pdf",
    label: "Resolución MPA N° 417 — Femicidio",
  },
} as const;