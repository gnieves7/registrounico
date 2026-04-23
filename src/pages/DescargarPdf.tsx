import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PsiLogo } from "@/components/ui/PsiLogo";

type Status = "idle" | "loading" | "ok" | "expired" | "consumed" | "not_found" | "invalid" | "error";

const STATUS_CONFIG: Record<Status, { icon: any; title: string; tone: string }> = {
  idle: { icon: ShieldCheck, title: "", tone: "" },
  loading: { icon: Loader2, title: "Verificando...", tone: "text-muted-foreground" },
  ok: { icon: CheckCircle2, title: "Código válido", tone: "text-emerald-600" },
  expired: { icon: AlertTriangle, title: "Código vencido", tone: "text-destructive" },
  consumed: { icon: AlertTriangle, title: "Código ya utilizado", tone: "text-destructive" },
  not_found: { icon: AlertTriangle, title: "Código no encontrado", tone: "text-destructive" },
  invalid: { icon: AlertTriangle, title: "Código inválido", tone: "text-destructive" },
  error: { icon: AlertTriangle, title: "Error", tone: "text-destructive" },
};

export default function DescargarPdf() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setStatus("invalid");
      setMessage("Ingresa exactamente 6 dígitos numéricos.");
      return;
    }
    setStatus("loading");
    setMessage("");
    setDownloadUrl(null);
    try {
      const { data, error } = await supabase.functions.invoke("consume-pdf-code", {
        body: { code },
      });
      if (error) throw error;
      const r = data as any;
      setStatus(r.status as Status);
      setMessage(r.message || "");
      if (r.status === "ok" && r.download_url) {
        setDownloadUrl(r.download_url);
      }
    } catch (e: any) {
      setStatus("error");
      setMessage(e?.message || "No se pudo verificar el código. Intenta nuevamente.");
    }
  };

  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <PsiLogo />
          </div>
          <CardTitle>Descarga segura de PDF</CardTitle>
          <CardDescription>
            Ingresa el código de 6 dígitos que recibiste del profesional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="------"
                className="text-center text-2xl font-mono tracking-[0.5em]"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                disabled={status === "loading"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={status === "loading" || code.length !== 6}>
              {status === "loading" ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verificando...</>
              ) : (
                <><ShieldCheck className="h-4 w-4 mr-2" /> Verificar código</>
              )}
            </Button>
          </form>

          {status !== "idle" && status !== "loading" && (
            <div className={`mt-4 rounded-md border border-border p-4 ${cfg.tone}`}>
              <div className="flex items-start gap-2">
                <Icon className="h-5 w-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">{cfg.title}</p>
                  {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
                  {downloadUrl && (
                    <Button asChild className="mt-3 w-full">
                      <a href={downloadUrl} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4 mr-2" /> Descargar PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Los códigos son de un solo uso y caducan automáticamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}