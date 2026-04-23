import { useNavigate, Outlet } from "react-router-dom";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, AlertCircle, FileSignature, CreditCard, CheckCircle2, MapPin } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Props {
  children?: React.ReactNode;
}

export const ProfessionalAccessGate = ({ children }: Props) => {
  const navigate = useNavigate();
  const { loading, isProfessional, hasAccess, needsPayment, needsConsent, isSantaFe } = useProfessionalAccess();
  const [paying, setPaying] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
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
              Para profesionales de otras jurisdicciones, el acceso tiene un costo de
              <strong> USD 5 por mes</strong>, sin permanencia.
            </CardDescription>
          </CardHeader>
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
