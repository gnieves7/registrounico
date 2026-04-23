import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Copy, Loader2, KeyRound } from "lucide-react";

interface Props {
  resourceType: string; // e.g. 'mmpi2_report'
  storageBucket: string;
  storagePath: string;
  patientId?: string;
  defaultHours?: number;
}

/**
 * Genera un código numérico de 6 dígitos de un solo uso para descargar un PDF
 * desde la página pública /descargar. No expone URLs públicas.
 */
export const SecurePdfShare = ({ resourceType, storageBucket, storagePath, patientId, defaultHours = 24 }: Props) => {
  const [hours, setHours] = useState(defaultHours);
  const [code, setCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("issue-pdf-code", {
        body: {
          resource_type: resourceType,
          storage_bucket: storageBucket,
          storage_path: storagePath,
          patient_id: patientId,
          hours_valid: hours,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setCode((data as any).code);
      setExpiresAt((data as any).expires_at);
      toast({ title: "Código generado", description: "Comparte el código de 6 dígitos con el destinatario." });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo generar el código", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({ title: "Copiado", description: "Código copiado al portapapeles." });
  };

  return (
    <div className="space-y-3 rounded-md border border-border p-4 bg-card">
      <div className="flex items-center gap-2 text-sm font-medium">
        <KeyRound className="h-4 w-4 text-primary" />
        <span>Compartir PDF con código seguro</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Genera un código numérico de un solo uso. El destinatario lo ingresa en{" "}
        <code className="text-primary">/descargar</code> para obtener el PDF.
      </p>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="hours" className="text-xs">Validez (horas)</Label>
          <Input
            id="hours"
            type="number"
            min={1}
            max={168}
            value={hours}
            onChange={(e) => setHours(Math.max(1, Math.min(168, Number(e.target.value) || 1)))}
          />
        </div>
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generar código"}
        </Button>
      </div>
      {code && (
        <div className="rounded-md bg-muted p-3 text-center">
          <div className="text-3xl font-mono tracking-[0.5em] font-bold text-primary">{code}</div>
          {expiresAt && (
            <p className="mt-1 text-xs text-muted-foreground">
              Vence: {new Date(expiresAt).toLocaleString()}
            </p>
          )}
          <Button variant="outline" size="sm" className="mt-2" onClick={copy}>
            <Copy className="h-4 w-4 mr-1" /> Copiar
          </Button>
        </div>
      )}
    </div>
  );
};