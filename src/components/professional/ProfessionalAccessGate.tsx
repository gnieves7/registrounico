import { useNavigate } from "react-router-dom";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, FileSignature, CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  children: React.ReactNode;
}

export const ProfessionalAccessGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const { loading, isProfessional, hasAccess, isOnTrial, trialDaysLeft, needsPayment, needsConsent } = useProfessionalAccess();
  const [paying, setPaying] = useState<"monthly" | "annual" | null>(null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!isProfessional || hasAccess) {
    return (
      <>
        {isProfessional && isOnTrial && trialDaysLeft <= 30 && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-center text-sm text-amber-900 dark:text-amber-200">
            ⏰ Te quedan <strong>{trialDaysLeft} día{trialDaysLeft === 1 ? "" : "s"}</strong> de prueba gratuita.{" "}
            <button onClick={() => navigate("/profesional/suscripcion")} className="underline font-semibold">Activar suscripción</button>
          </div>
        )}
        {children}
      </>
    );
  }

  // Needs consent
  if (needsConsent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FileSignature className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Consentimiento pendiente</CardTitle>
            <CardDescription>Para continuar, necesitás completar el registro profesional y firmar el consentimiento informado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate("/profesional/registro")}>
              Completar registro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Needs payment
  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setPaying(plan);
    try {
      const { data, error } = await supabase.functions.invoke("mercadopago-create-subscription", {
        body: { plan },
      });
      if (error) throw error;
      if (data?.init_point) window.location.href = data.init_point;
      else throw new Error("No se obtuvo el link de pago");
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error al iniciar pago", description: err.message, variant: "destructive" });
    } finally {
      setPaying(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <div className="max-w-3xl w-full space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
            <CardTitle>Tu período de prueba finalizó</CardTitle>
            <CardDescription>Activá tu suscripción para continuar usando .PSI.</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => !paying && handleSubscribe("monthly")}>
            <CardHeader>
              <CardTitle className="text-lg">Plan Mensual</CardTitle>
              <div className="text-3xl font-bold text-primary">USD 10<span className="text-sm font-normal text-muted-foreground">/mes</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acceso completo a los 3 sistemas</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Sin permanencia</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Cancelás cuando quieras</p>
              <Button disabled={paying !== null} className="w-full mt-4 gap-2" onClick={(e) => { e.stopPropagation(); handleSubscribe("monthly"); }}>
                {paying === "monthly" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Suscribirme mensual
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-semibold">
              Ahorrás USD 20
            </div>
            <CardHeader>
              <CardTitle className="text-lg">Plan Anual</CardTitle>
              <div className="text-3xl font-bold text-primary">USD 100<span className="text-sm font-normal text-muted-foreground">/año</span></div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Acceso completo a los 3 sistemas</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Equivale a USD 8,33/mes</p>
              <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Soporte prioritario</p>
              <Button disabled={paying !== null} className="w-full mt-4 gap-2" onClick={() => handleSubscribe("annual")}>
                {paying === "annual" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                Suscribirme anual
              </Button>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Pagos procesados de forma segura por MercadoPago. El monto en USD se convertirá a pesos argentinos al tipo de cambio vigente.
        </p>
      </div>
    </div>
  );
};
