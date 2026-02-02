import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Save, Loader2, Plus, X } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate, LifestyleData } from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface LifestyleSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function LifestyleSection({ data, onSave, isSaving }: LifestyleSectionProps) {
  const [formData, setFormData] = useState<LifestyleData>({
    sleepPattern: "",
    exercise: "",
    diet: "",
    substanceUse: { alcohol: "", tobacco: "", drugs: "", caffeine: "" },
    stressLevel: "",
    relaxationMethods: [],
  });
  const [newRelaxation, setNewRelaxation] = useState("");

  useEffect(() => {
    if (data?.lifestyle_data) {
      const lifestyle = data.lifestyle_data as unknown as LifestyleData;
      setFormData({
        sleepPattern: lifestyle.sleepPattern || "",
        exercise: lifestyle.exercise || "",
        diet: lifestyle.diet || "",
        substanceUse: lifestyle.substanceUse || { alcohol: "", tobacco: "", drugs: "", caffeine: "" },
        stressLevel: lifestyle.stressLevel || "",
        relaxationMethods: lifestyle.relaxationMethods || [],
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      lifestyle_data: formData as unknown as Json,
    });
  };

  const addRelaxation = () => {
    if (newRelaxation.trim()) {
      setFormData({
        ...formData,
        relaxationMethods: [...(formData.relaxationMethods || []), newRelaxation.trim()],
      });
      setNewRelaxation("");
    }
  };

  const removeRelaxation = (index: number) => {
    setFormData({
      ...formData,
      relaxationMethods: formData.relaxationMethods?.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          Estilo de Vida
        </CardTitle>
        <CardDescription>
          Información sobre tus hábitos diarios y bienestar general.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sleep */}
        <div className="space-y-2">
          <Label>Patrón de Sueño</Label>
          <Textarea
            placeholder="¿Cuántas horas duermes? ¿Tienes problemas para dormir? ¿Te despiertas durante la noche? ¿Cómo es la calidad de tu sueño?"
            value={formData.sleepPattern || ""}
            onChange={(e) => setFormData({ ...formData, sleepPattern: e.target.value })}
            rows={3}
          />
        </div>

        {/* Exercise */}
        <div className="space-y-2">
          <Label>Actividad Física</Label>
          <Textarea
            placeholder="¿Haces ejercicio? ¿Con qué frecuencia? ¿Qué tipo de actividad física realizas?"
            value={formData.exercise || ""}
            onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
            rows={2}
          />
        </div>

        {/* Diet */}
        <div className="space-y-2">
          <Label>Alimentación</Label>
          <Textarea
            placeholder="¿Cómo describirías tu alimentación? ¿Tienes una dieta equilibrada? ¿Hay alimentos que evitas o consumes en exceso?"
            value={formData.diet || ""}
            onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
            rows={2}
          />
        </div>

        {/* Substance Use */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Uso de Sustancias</Label>
          <p className="text-sm text-muted-foreground">
            Esta información es confidencial y nos ayuda a brindarte mejor atención.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Alcohol</Label>
              <Select
                value={formData.substanceUse?.alcohol || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    substanceUse: { ...formData.substanceUse, alcohol: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nunca">Nunca</SelectItem>
                  <SelectItem value="ocasional">Ocasionalmente (eventos sociales)</SelectItem>
                  <SelectItem value="semanal">Semanalmente</SelectItem>
                  <SelectItem value="frecuente">Frecuentemente (varios días a la semana)</SelectItem>
                  <SelectItem value="diario">Diariamente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tabaco</Label>
              <Select
                value={formData.substanceUse?.tobacco || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    substanceUse: { ...formData.substanceUse, tobacco: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nunca">Nunca fumé</SelectItem>
                  <SelectItem value="exfumador">Ex fumador</SelectItem>
                  <SelectItem value="ocasional">Ocasionalmente</SelectItem>
                  <SelectItem value="regular">Regularmente</SelectItem>
                  <SelectItem value="diario">Diariamente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cafeína</Label>
              <Select
                value={formData.substanceUse?.caffeine || ""}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    substanceUse: { ...formData.substanceUse, caffeine: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una opción" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">No consumo cafeína</SelectItem>
                  <SelectItem value="poco">1-2 tazas al día</SelectItem>
                  <SelectItem value="moderado">3-4 tazas al día</SelectItem>
                  <SelectItem value="alto">Más de 4 tazas al día</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Otras sustancias</Label>
              <Input
                placeholder="Si aplica, describe brevemente"
                value={formData.substanceUse?.drugs || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    substanceUse: { ...formData.substanceUse, drugs: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Stress Level */}
        <div className="space-y-2">
          <Label>Nivel de Estrés</Label>
          <Select
            value={formData.stressLevel || ""}
            onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo describirías tu nivel de estrés actual?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bajo">Bajo - Me siento tranquilo/a la mayor parte del tiempo</SelectItem>
              <SelectItem value="moderado">Moderado - Tengo algo de estrés pero lo manejo</SelectItem>
              <SelectItem value="alto">Alto - El estrés afecta mi día a día</SelectItem>
              <SelectItem value="muy_alto">Muy Alto - Me siento abrumado/a constantemente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Relaxation Methods */}
        <div className="space-y-3">
          <Label>Métodos de Relajación</Label>
          <div className="flex gap-2">
            <Input
              placeholder="¿Qué haces para relajarte? (Ej: meditación, música, lectura...)"
              value={newRelaxation}
              onChange={(e) => setNewRelaxation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRelaxation()}
            />
            <Button type="button" variant="outline" size="icon" onClick={addRelaxation}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.relaxationMethods?.map((method, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {method}
                <button onClick={() => removeRelaxation(index)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
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
