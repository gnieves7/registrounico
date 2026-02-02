import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Brain, Save, Loader2, Plus, X } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate, PsychologicalHistory } from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface PsychologicalHistorySectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function PsychologicalHistorySection({ data, onSave, isSaving }: PsychologicalHistorySectionProps) {
  const [formData, setFormData] = useState<PsychologicalHistory>({
    previousTherapy: false,
    therapyDetails: "",
    diagnoses: [],
    hospitalizations: [],
    currentSymptoms: "",
    copingMechanisms: "",
  });
  const [newDiagnosis, setNewDiagnosis] = useState("");
  const [newHospitalization, setNewHospitalization] = useState("");

  useEffect(() => {
    if (data?.psychological_history) {
      const psychData = data.psychological_history as unknown as PsychologicalHistory;
      setFormData({
        previousTherapy: psychData.previousTherapy || false,
        therapyDetails: psychData.therapyDetails || "",
        diagnoses: psychData.diagnoses || [],
        hospitalizations: psychData.hospitalizations || [],
        currentSymptoms: psychData.currentSymptoms || "",
        copingMechanisms: psychData.copingMechanisms || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      psychological_history: formData as unknown as Json,
    });
  };

  const addDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setFormData({
        ...formData,
        diagnoses: [...(formData.diagnoses || []), newDiagnosis.trim()],
      });
      setNewDiagnosis("");
    }
  };

  const removeDiagnosis = (index: number) => {
    setFormData({
      ...formData,
      diagnoses: formData.diagnoses?.filter((_, i) => i !== index),
    });
  };

  const addHospitalization = () => {
    if (newHospitalization.trim()) {
      setFormData({
        ...formData,
        hospitalizations: [...(formData.hospitalizations || []), newHospitalization.trim()],
      });
      setNewHospitalization("");
    }
  };

  const removeHospitalization = (index: number) => {
    setFormData({
      ...formData,
      hospitalizations: formData.hospitalizations?.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Historia Psicológica
        </CardTitle>
        <CardDescription>
          Información sobre tu salud mental y experiencias terapéuticas previas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Previous Therapy */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch
              checked={formData.previousTherapy || false}
              onCheckedChange={(checked) => setFormData({ ...formData, previousTherapy: checked })}
            />
            <Label>¿Has asistido a terapia psicológica anteriormente?</Label>
          </div>
          
          {formData.previousTherapy && (
            <div className="space-y-2 ml-8">
              <Label>Cuéntanos sobre tus experiencias previas en terapia</Label>
              <Textarea
                placeholder="Describe tus experiencias previas: tipo de terapia, duración, motivo de consulta, qué funcionó y qué no..."
                value={formData.therapyDetails || ""}
                onChange={(e) => setFormData({ ...formData, therapyDetails: e.target.value })}
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Diagnoses */}
        <div className="space-y-3">
          <Label>Diagnósticos Previos (si los tienes)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar diagnóstico"
              value={newDiagnosis}
              onChange={(e) => setNewDiagnosis(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDiagnosis()}
            />
            <Button type="button" variant="outline" size="icon" onClick={addDiagnosis}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.diagnoses?.map((diagnosis, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {diagnosis}
                <button onClick={() => removeDiagnosis(index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Esta información es confidencial y solo se usa para darte mejor atención.
          </p>
        </div>

        {/* Hospitalizations */}
        <div className="space-y-3">
          <Label>Hospitalizaciones Psiquiátricas (si aplica)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar hospitalización (incluye fechas si las recuerdas)"
              value={newHospitalization}
              onChange={(e) => setNewHospitalization(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHospitalization()}
            />
            <Button type="button" variant="outline" size="icon" onClick={addHospitalization}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.hospitalizations?.map((hospitalization, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {hospitalization}
                <button onClick={() => removeHospitalization(index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Symptoms */}
        <div className="space-y-2">
          <Label>Síntomas o Dificultades Actuales</Label>
          <Textarea
            placeholder="Describe los síntomas o dificultades que estás experimentando actualmente. Por ejemplo: ansiedad, tristeza, problemas de sueño, dificultades en relaciones, etc."
            value={formData.currentSymptoms || ""}
            onChange={(e) => setFormData({ ...formData, currentSymptoms: e.target.value })}
            rows={4}
          />
        </div>

        {/* Coping Mechanisms */}
        <div className="space-y-2">
          <Label>Mecanismos de Afrontamiento</Label>
          <Textarea
            placeholder="¿Cómo sueles manejar el estrés o las situaciones difíciles? ¿Qué estrategias te han funcionado? ¿Cuáles no?"
            value={formData.copingMechanisms || ""}
            onChange={(e) => setFormData({ ...formData, copingMechanisms: e.target.value })}
            rows={4}
          />
        </div>

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
