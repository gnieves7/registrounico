import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ReportStepperForm } from "@/components/admin/reports/ReportStepperForm";
import { demoAdminReports } from "@/data/demoData";

interface PdfReport {
  id: string;
  user_id: string;
  test_type: string;
  storage_path: string | null;
  created_at: string;
}

export function AdminReportsSection() {
  const { isDemoMode, guardWrite } = useDemoMode();
  const [reports, setReports] = useState<PdfReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isDemoMode) {
      setReports(demoAdminReports);
      setLoading(false);
      return;
    }
    fetchReports();
  }, [isDemoMode]);

  const fetchReports = async () => {
    try {
      const { data } = await supabase
        .from("informes_pdf")
        .select("*")
        .order("created_at", { ascending: false });
      setReports(data || []);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (path: string) => {
    if (!path) return;
    const { data, error } = await supabase.storage.from("documents").download(path);
    if (error || !data) return;
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop() || "informe.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (showForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nuevo Informe Profesional
          </h2>
          <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
            ← Volver a la lista
          </Button>
        </div>
        <ReportStepperForm />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Informes PDF
        </h2>
        <Button size="sm" className="gap-1.5" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4" />
          Nuevo informe
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informes generados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Cargando…</p>
          ) : reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No se han generado informes PDF todavía.</p>
              <p className="text-xs mt-1">Usá el botón "Nuevo informe" para crear uno.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><Badge variant="outline">{r.test_type}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.user_id.slice(0, 8)}…</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(r.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => r.storage_path && downloadReport(r.storage_path)}>
                        <Download className="h-3.5 w-3.5" />
                        Descargar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
