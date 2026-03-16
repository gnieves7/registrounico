import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { exportClinicalHistoryPdf } from "@/lib/clinicalHistoryPdf";

interface ClinicalHistoryExportButtonProps {
  userId: string;
  patientName: string;
}

const TASK_CATEGORY_LABELS: Record<string, string> = {
  behavioral_activation: "Activación Conductual",
  thought_records: "Registro de Pensamientos",
  mindfulness: "Mindfulness",
  exposure: "Tareas de Exposición",
  gratitude: "Diario de Gratitud",
};

const TASK_STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  completed: "Completada",
  skipped: "Omitida",
};

const AWARD_CATEGORY_LABELS: Record<string, string> = {
  autoconocimiento: "Autoconocimiento y trabajo interno",
  regulacion: "Regulación emocional y tolerancia",
  vinculos: "Vínculos y comunicación",
  accion_cambio: "Acción, cambio conductual y exposición",
  proceso_terapeutico: "Proceso terapéutico",
  cierre_y_logros: "Cierre terapéutico y logros integrados",
};

export function ClinicalHistoryExportButton({ userId, patientName }: ClinicalHistoryExportButtonProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const [sessionsResult, tasksResult, awardsResult] = await Promise.all([
        supabase
          .from("sessions")
          .select("session_date, topic, clinical_notes, patient_notes, patient_questions")
          .eq("patient_id", userId)
          .order("session_date", { ascending: false }),
        supabase
          .from("micro_tasks")
          .select("title, category, status, due_date, completed_at, instructions, response")
          .eq("patient_id", userId)
          .order("created_at", { ascending: false }),
        supabase
          .from("symbolic_awards")
          .select("award_title, award_description, category_key, awarded_at, clinical_note")
          .eq("patient_id", userId)
          .order("awarded_at", { ascending: false }),
      ]);

      if (sessionsResult.error) throw sessionsResult.error;
      if (tasksResult.error) throw tasksResult.error;
      if (awardsResult.error) throw awardsResult.error;

      exportClinicalHistoryPdf({
        patientName,
        generatedBy: profile?.full_name || "Profesional",
        sessions: sessionsResult.data || [],
        tasks: (tasksResult.data || []).map((task) => ({
          ...task,
          category_label: TASK_CATEGORY_LABELS[task.category] || task.category,
          status_label: TASK_STATUS_LABELS[task.status] || task.status,
        })),
        awards: (awardsResult.data || []).map((award) => ({
          ...award,
          category_title: AWARD_CATEGORY_LABELS[award.category_key] || award.category_key,
        })),
      });

      toast({
        title: "PDF generado",
        description: "El historial clínico se descargó correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo exportar el historial clínico.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={isExporting} className="gap-2">
      {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Exportar PDF clínico
    </Button>
  );
}
