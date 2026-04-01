import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, FileText, BarChart3 } from "lucide-react";
import { PaymentSettingsEditor } from "@/components/admin/PaymentSettingsEditor";
import ProfessionalStatsEditor from "@/components/admin/ProfessionalStatsEditor";

export function AdminSettingsSection() {
  return (
    <div className="space-y-6">
      {/* Professional Stats (Landing Metrics) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Métricas de experiencia (Landing)
          </CardTitle>
          <CardDescription>
            Editá los números que se muestran en la página pública de inicio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfessionalStatsEditor />
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Configuración de pagos e informes
          </CardTitle>
          <CardDescription>
            Datos del profesional que figuran en los informes PDF y la configuración de MercadoPago.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSettingsEditor />
        </CardContent>
      </Card>
    </div>
  );
}
