import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Save, Loader2, UserCheck, UserX } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate } from "@/hooks/usePsychobiography";

interface TreatmentSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function TreatmentSection({ data, onSave, isSaving }: TreatmentSectionProps) {
  const [formData, setFormData] = useState({
    treatment_start_date: "",
    sessions_attended: 0,
    sessions_absent: 0,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        treatment_start_date: (data as any).treatment_start_date || "",
        sessions_attended: (data as any).sessions_attended || 0,
        sessions_absent: (data as any).sessions_absent || 0,
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      treatment_start_date: formData.treatment_start_date || null,
      sessions_attended: formData.sessions_attended,
      sessions_absent: formData.sessions_absent,
    } as any);
  };

  const totalSessions = formData.sessions_attended + formData.sessions_absent;
  const attendanceRate = totalSessions > 0 
    ? Math.round((formData.sessions_attended / totalSessions) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Seguimiento del Tratamiento
        </CardTitle>
        <CardDescription>
          Información sobre el inicio y asistencia a las sesiones de tratamiento.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="treatment_start_date">Fecha de Inicio del Tratamiento</Label>
            <Input
              id="treatment_start_date"
              type="date"
              value={formData.treatment_start_date}
              onChange={(e) => setFormData({ ...formData, treatment_start_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions_attended" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary" />
              Sesiones Asistidas
            </Label>
            <Input
              id="sessions_attended"
              type="number"
              min="0"
              value={formData.sessions_attended}
              onChange={(e) => setFormData({ ...formData, sessions_attended: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions_absent" className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-destructive" />
              Ausencias
            </Label>
            <Input
              id="sessions_absent"
              type="number"
              min="0"
              value={formData.sessions_absent}
              onChange={(e) => setFormData({ ...formData, sessions_absent: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Summary Stats */}
        {totalSessions > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{totalSessions}</p>
              <p className="text-xs text-muted-foreground">Total Sesiones</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{formData.sessions_attended}</p>
              <p className="text-xs text-muted-foreground">Asistencias</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
              <p className="text-xs text-muted-foreground">Tasa de Asistencia</p>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Sección
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
