import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, FileDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { exportClinicalPdf } from "@/lib/clinicalSectionPdf";
import { useAuth } from "@/hooks/useAuth";

interface PatientNotebookViewProps {
  userId: string;
  patientName?: string;
}

export function PatientNotebookView({ userId, patientName }: PatientNotebookViewProps) {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      // Admin can only see entries the patient has shared
      const { data, error } = await supabase
        .from("notebook_entries" as any)
        .select("*")
        .eq("user_id", userId)
        .eq("shared_with_therapist", true)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setEntries((data as any[]) || []);
    } catch (error) {
      console.error("Error fetching notebook entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Skeleton className="h-32 w-full" />;

  const handleExport = () => {
    exportClinicalPdf({
      documentTitle: 'Mi Cuaderno · Constancia',
      patientName: patientName || 'Paciente',
      professionalName: profile?.full_name || 'Profesional',
      subtitle: `${entries.length} entradas compartidas`,
      sections: entries.map((e: any) => ({
        heading: `${e.title || 'Sin título'} — ${format(new Date(e.updated_at), 'dd/MM/yyyy HH:mm', { locale: es })}`,
        lines: [e.content || ''],
      })),
      filenamePrefix: 'cuaderno',
    });
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>El paciente no ha compartido entradas de su cuaderno</p>
          <p className="text-xs mt-1">Solo se muestran las entradas que el paciente decide compartir.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm text-muted-foreground">{entries.length} entradas compartidas</p>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <FileDown className="h-3.5 w-3.5" /> Exportar constancia
        </Button>
      </div>
      {entries.map((entry: any) => (
        <Card key={entry.id}>
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground">{entry.title || "Sin título"}</p>
              <Badge variant="outline" className="text-xs">
                {format(new Date(entry.updated_at), "dd/MM/yyyy HH:mm", { locale: es })}
              </Badge>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
