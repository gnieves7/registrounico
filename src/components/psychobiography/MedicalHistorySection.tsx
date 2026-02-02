import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Save, Loader2, Plus, X } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate, MedicalHistory } from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface MedicalHistorySectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function MedicalHistorySection({ data, onSave, isSaving }: MedicalHistorySectionProps) {
  const [formData, setFormData] = useState<MedicalHistory>({
    currentConditions: [],
    pastConditions: [],
    medications: [],
    allergies: [],
    surgeries: [],
    familyMedicalHistory: "",
  });
  const [newCondition, setNewCondition] = useState("");
  const [newPastCondition, setNewPastCondition] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newSurgery, setNewSurgery] = useState("");

  useEffect(() => {
    if (data?.medical_history) {
      const medicalData = data.medical_history as unknown as MedicalHistory;
      setFormData({
        currentConditions: medicalData.currentConditions || [],
        pastConditions: medicalData.pastConditions || [],
        medications: medicalData.medications || [],
        allergies: medicalData.allergies || [],
        surgeries: medicalData.surgeries || [],
        familyMedicalHistory: medicalData.familyMedicalHistory || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      medical_history: formData as unknown as Json,
    });
  };

  const addItem = (field: keyof Pick<MedicalHistory, 'currentConditions' | 'pastConditions' | 'allergies' | 'surgeries'>, value: string, setter: (v: string) => void) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), value.trim()],
      });
      setter("");
    }
  };

  const removeItem = (field: keyof Pick<MedicalHistory, 'currentConditions' | 'pastConditions' | 'allergies' | 'surgeries'>, index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index),
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...(formData.medications || []), { name: "", dose: "", frequency: "" }],
    });
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      medications: formData.medications?.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Historia Médica
        </CardTitle>
        <CardDescription>
          Información sobre tu salud física y antecedentes médicos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Conditions */}
        <div className="space-y-3">
          <Label>Condiciones Médicas Actuales</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar condición médica actual"
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem("currentConditions", newCondition, setNewCondition)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addItem("currentConditions", newCondition, setNewCondition)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.currentConditions?.map((condition, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {condition}
                <button onClick={() => removeItem("currentConditions", index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Past Conditions */}
        <div className="space-y-3">
          <Label>Condiciones Médicas Pasadas</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar condición médica pasada"
              value={newPastCondition}
              onChange={(e) => setNewPastCondition(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem("pastConditions", newPastCondition, setNewPastCondition)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addItem("pastConditions", newPastCondition, setNewPastCondition)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.pastConditions?.map((condition, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {condition}
                <button onClick={() => removeItem("pastConditions", index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Medicamentos Actuales</Label>
            <Button variant="outline" size="sm" onClick={addMedication}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Medicamento
            </Button>
          </div>
          {formData.medications?.map((med, index) => (
            <div key={index} className="grid gap-4 md:grid-cols-4 items-end">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre del medicamento"
                  value={med.name || ""}
                  onChange={(e) => {
                    const newMeds = [...(formData.medications || [])];
                    newMeds[index] = { ...med, name: e.target.value };
                    setFormData({ ...formData, medications: newMeds });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosis</Label>
                <Input
                  placeholder="Ej: 10mg"
                  value={med.dose || ""}
                  onChange={(e) => {
                    const newMeds = [...(formData.medications || [])];
                    newMeds[index] = { ...med, dose: e.target.value };
                    setFormData({ ...formData, medications: newMeds });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Frecuencia</Label>
                <Input
                  placeholder="Ej: 2 veces al día"
                  value={med.frequency || ""}
                  onChange={(e) => {
                    const newMeds = [...(formData.medications || [])];
                    newMeds[index] = { ...med, frequency: e.target.value };
                    setFormData({ ...formData, medications: newMeds });
                  }}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeMedication(index)}>
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Allergies */}
        <div className="space-y-3">
          <Label>Alergias</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar alergia"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem("allergies", newAllergy, setNewAllergy)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addItem("allergies", newAllergy, setNewAllergy)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies?.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="gap-1">
                {allergy}
                <button onClick={() => removeItem("allergies", index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Surgeries */}
        <div className="space-y-3">
          <Label>Cirugías</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Agregar cirugía (incluye fecha si la recuerdas)"
              value={newSurgery}
              onChange={(e) => setNewSurgery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem("surgeries", newSurgery, setNewSurgery)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addItem("surgeries", newSurgery, setNewSurgery)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.surgeries?.map((surgery, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {surgery}
                <button onClick={() => removeItem("surgeries", index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Family Medical History */}
        <div className="space-y-2">
          <Label>Antecedentes Médicos Familiares</Label>
          <Textarea
            placeholder="Describe enfermedades o condiciones médicas que hayan afectado a miembros de tu familia (padres, abuelos, hermanos, etc.)"
            value={formData.familyMedicalHistory || ""}
            onChange={(e) => setFormData({ ...formData, familyMedicalHistory: e.target.value })}
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
