import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CreditCard, Save, Loader2 } from "lucide-react";

interface PaymentInfo {
  alias: string;
  cvu: string;
}

export function PaymentSettingsEditor() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({ alias: "", cvu: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("professional_profile_content")
        .select("content")
        .eq("section_key", "payment_info")
        .maybeSingle();

      if (error) throw error;
      if (data?.content) {
        const content = data.content as unknown as PaymentInfo;
        setPaymentInfo({
          alias: content.alias || "",
          cvu: content.cvu || "",
        });
      }
    } catch (error) {
      console.error("Error fetching payment info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("professional_profile_content")
        .select("id")
        .eq("section_key", "payment_info")
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("professional_profile_content")
          .update({ content: paymentInfo as unknown as any })
          .eq("section_key", "payment_info");
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("professional_profile_content")
          .insert([{ section_key: "payment_info", content: paymentInfo as unknown as any }]);
        if (error) throw error;
      }

      toast({
        title: "Datos guardados",
        description: "Los datos de pago se actualizaron correctamente",
      });
    } catch (error) {
      console.error("Error saving payment info:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los datos de pago",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-primary" />
          Datos de Pago
        </CardTitle>
        <CardDescription>
          Estos datos se muestran a los pacientes para abonar documentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="alias">Alias</Label>
          <Input
            id="alias"
            value={paymentInfo.alias}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, alias: e.target.value })}
            placeholder="Ej: psi.german.nieves"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvu">CVU</Label>
          <Input
            id="cvu"
            value={paymentInfo.cvu}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvu: e.target.value })}
            placeholder="Ej: 0000003100037023075926"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="sm" className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar
        </Button>
      </CardContent>
    </Card>
  );
}
