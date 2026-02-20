import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Key, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface DownloadCodeInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    title: string;
    file_url: string | null;
  };
  onSuccess: () => void;
}

export function DownloadCodeInput({ open, onOpenChange, document, onSuccess }: DownloadCodeInputProps) {
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError("Por favor ingresa el código");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Server-side verification via edge function (secure)
      const { data, error: fnError } = await supabase.functions.invoke("verify-download-code", {
        body: { document_id: document.id, code: code.trim().toUpperCase() },
      });

      if (fnError) throw fnError;

      if (data?.error) {
        setError(data.error === "Código incorrecto" 
          ? "Código incorrecto. Verifica con tu terapeuta." 
          : data.error);
        return;
      }

      toast({
        title: "¡Código verificado!",
        description: "Tu documento está listo para descargar.",
      });

      onSuccess();
      onOpenChange(false);
      setCode("");
    } catch (err) {
      console.error("Error verifying code:", err);
      setError("Error al verificar el código. Intenta de nuevo.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Ingresar Código de Descarga
          </DialogTitle>
          <DialogDescription>
            Ingresa el código único proporcionado por tu terapeuta para descargar: <strong>{document.title}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="download-code">Código de Descarga</Label>
            <Input
              id="download-code"
              placeholder="Ej: ABC123XYZ"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError(null);
              }}
              className="text-center text-lg tracking-widest uppercase"
              maxLength={12}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            El código es único para cada documento y te lo proporciona tu terapeuta una vez confirmado el pago.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || !code.trim()}>
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verificar Código
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
