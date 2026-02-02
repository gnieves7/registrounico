import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Scale, Star, Save, Loader2, Plus, Trash2, X } from "lucide-react";
import type { 
  Psychobiography, 
  PsychobiographyUpdate, 
  TraumaticEvent, 
  LegalHistory, 
  PersonalValues 
} from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface SignificantEventsSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function SignificantEventsSection({ data, onSave, isSaving }: SignificantEventsSectionProps) {
  const [traumaticEvents, setTraumaticEvents] = useState<TraumaticEvent[]>([]);
  const [legalHistory, setLegalHistory] = useState<LegalHistory>({
    hasLegalIssues: false,
    details: "",
    currentStatus: "",
  });
  const [personalValues, setPersonalValues] = useState<PersonalValues>({
    coreValues: [],
    lifeGoals: "",
    fears: [],
    strengths: [],
    areasToImprove: [],
    motivations: "",
  });

  const [newValue, setNewValue] = useState("");
  const [newFear, setNewFear] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newArea, setNewArea] = useState("");

  useEffect(() => {
    if (data?.traumatic_events) {
      setTraumaticEvents((data.traumatic_events as unknown as TraumaticEvent[]) || []);
    }
    if (data?.legal_history) {
      const legal = data.legal_history as unknown as LegalHistory;
      setLegalHistory({
        hasLegalIssues: legal.hasLegalIssues || false,
        details: legal.details || "",
        currentStatus: legal.currentStatus || "",
      });
    }
    if (data?.personal_values) {
      const values = data.personal_values as unknown as PersonalValues;
      setPersonalValues({
        coreValues: values.coreValues || [],
        lifeGoals: values.lifeGoals || "",
        fears: values.fears || [],
        strengths: values.strengths || [],
        areasToImprove: values.areasToImprove || [],
        motivations: values.motivations || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      traumatic_events: traumaticEvents as unknown as Json,
      legal_history: legalHistory as unknown as Json,
      personal_values: personalValues as unknown as Json,
    });
  };

  const addTraumaticEvent = () => {
    setTraumaticEvents([...traumaticEvents, { description: "", age: undefined, impact: "", resolved: false }]);
  };

  const removeTraumaticEvent = (index: number) => {
    setTraumaticEvents(traumaticEvents.filter((_, i) => i !== index));
  };

  const addItem = (
    field: keyof Pick<PersonalValues, 'coreValues' | 'fears' | 'strengths' | 'areasToImprove'>,
    value: string,
    setter: (v: string) => void
  ) => {
    if (value.trim()) {
      setPersonalValues({
        ...personalValues,
        [field]: [...(personalValues[field] || []), value.trim()],
      });
      setter("");
    }
  };

  const removeItem = (field: keyof Pick<PersonalValues, 'coreValues' | 'fears' | 'strengths' | 'areasToImprove'>, index: number) => {
    setPersonalValues({
      ...personalValues,
      [field]: personalValues[field]?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Traumatic Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Eventos Significativos
          </CardTitle>
          <CardDescription>
            Experiencias importantes que han marcado tu vida. Esta información es confidencial y opcional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Puedes agregar cualquier evento que consideres significativo, no tiene que ser traumático.
            </p>
            <Button variant="outline" size="sm" onClick={addTraumaticEvent}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Evento
            </Button>
          </div>

          {traumaticEvents.map((event, index) => (
            <div key={index} className="space-y-4 border-b border-border pb-6">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-foreground">Evento {index + 1}</h4>
                <Button variant="ghost" size="icon" onClick={() => removeTraumaticEvent(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Descripción</Label>
                  <Textarea
                    placeholder="Describe el evento de la manera que te sientas cómodo/a"
                    value={event.description || ""}
                    onChange={(e) => {
                      const newEvents = [...traumaticEvents];
                      newEvents[index] = { ...event, description: e.target.value };
                      setTraumaticEvents(newEvents);
                    }}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Edad aproximada cuando ocurrió</Label>
                  <Input
                    type="number"
                    placeholder="Edad"
                    value={event.age || ""}
                    onChange={(e) => {
                      const newEvents = [...traumaticEvents];
                      newEvents[index] = { ...event, age: parseInt(e.target.value) || undefined };
                      setTraumaticEvents(newEvents);
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    checked={event.resolved || false}
                    onCheckedChange={(checked) => {
                      const newEvents = [...traumaticEvents];
                      newEvents[index] = { ...event, resolved: checked };
                      setTraumaticEvents(newEvents);
                    }}
                  />
                  <Label>Siento que lo he superado</Label>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Impacto en tu vida</Label>
                  <Textarea
                    placeholder="¿Cómo crees que este evento te ha afectado?"
                    value={event.impact || ""}
                    onChange={(e) => {
                      const newEvents = [...traumaticEvents];
                      newEvents[index] = { ...event, impact: e.target.value };
                      setTraumaticEvents(newEvents);
                    }}
                    rows={2}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Legal History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Historia Legal
          </CardTitle>
          <CardDescription>
            Información sobre asuntos legales, si aplica. Esta información es confidencial.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Switch
              checked={legalHistory.hasLegalIssues || false}
              onCheckedChange={(checked) => setLegalHistory({ ...legalHistory, hasLegalIssues: checked })}
            />
            <Label>¿Has tenido o tienes algún asunto legal?</Label>
          </div>

          {legalHistory.hasLegalIssues && (
            <div className="space-y-4 ml-8">
              <div className="space-y-2">
                <Label>Detalles</Label>
                <Textarea
                  placeholder="Describe brevemente la situación"
                  value={legalHistory.details || ""}
                  onChange={(e) => setLegalHistory({ ...legalHistory, details: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Estado Actual</Label>
                <Input
                  placeholder="¿En qué estado se encuentra actualmente?"
                  value={legalHistory.currentStatus || ""}
                  onChange={(e) => setLegalHistory({ ...legalHistory, currentStatus: e.target.value })}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Valores y Metas Personales
          </CardTitle>
          <CardDescription>
            Conocer tus valores y metas nos ayuda a entender qué es importante para ti.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Core Values */}
          <div className="space-y-3">
            <Label>Valores Fundamentales</Label>
            <div className="flex gap-2">
              <Input
                placeholder="¿Qué valores son más importantes para ti? (Ej: honestidad, familia, libertad...)"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem("coreValues", newValue, setNewValue)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => addItem("coreValues", newValue, setNewValue)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalValues.coreValues?.map((value, index) => (
                <Badge key={index} variant="default" className="gap-1">
                  {value}
                  <button onClick={() => removeItem("coreValues", index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-3">
            <Label>Fortalezas</Label>
            <div className="flex gap-2">
              <Input
                placeholder="¿Cuáles son tus fortalezas?"
                value={newStrength}
                onChange={(e) => setNewStrength(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem("strengths", newStrength, setNewStrength)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => addItem("strengths", newStrength, setNewStrength)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalValues.strengths?.map((strength, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {strength}
                  <button onClick={() => removeItem("strengths", index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Areas to Improve */}
          <div className="space-y-3">
            <Label>Áreas a Mejorar</Label>
            <div className="flex gap-2">
              <Input
                placeholder="¿En qué áreas te gustaría mejorar?"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem("areasToImprove", newArea, setNewArea)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => addItem("areasToImprove", newArea, setNewArea)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalValues.areasToImprove?.map((area, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {area}
                  <button onClick={() => removeItem("areasToImprove", index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Fears */}
          <div className="space-y-3">
            <Label>Miedos o Preocupaciones</Label>
            <div className="flex gap-2">
              <Input
                placeholder="¿Cuáles son tus principales miedos o preocupaciones?"
                value={newFear}
                onChange={(e) => setNewFear(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem("fears", newFear, setNewFear)}
              />
              <Button type="button" variant="outline" size="icon" onClick={() => addItem("fears", newFear, setNewFear)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalValues.fears?.map((fear, index) => (
                <Badge key={index} variant="outline" className="gap-1 border-destructive/30">
                  {fear}
                  <button onClick={() => removeItem("fears", index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Life Goals */}
          <div className="space-y-2">
            <Label>Metas de Vida</Label>
            <Textarea
              placeholder="¿Qué metas tienes para tu vida? ¿Qué te gustaría lograr a corto, mediano y largo plazo?"
              value={personalValues.lifeGoals || ""}
              onChange={(e) => setPersonalValues({ ...personalValues, lifeGoals: e.target.value })}
              rows={3}
            />
          </div>

          {/* Motivations */}
          <div className="space-y-2">
            <Label>Motivaciones</Label>
            <Textarea
              placeholder="¿Qué te motiva? ¿Qué te impulsa a seguir adelante?"
              value={personalValues.motivations || ""}
              onChange={(e) => setPersonalValues({ ...personalValues, motivations: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
