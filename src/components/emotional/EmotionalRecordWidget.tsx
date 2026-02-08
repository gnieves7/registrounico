import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check } from "lucide-react";

const MOODS = [
  { emoji: "😊", label: "Feliz", score: 5 },
  { emoji: "😌", label: "Tranquilo", score: 4 },
  { emoji: "🥴", label: "Inestable", score: 3 },
  { emoji: "😔", label: "Triste", score: 2 },
  { emoji: "😤", label: "Frustrado", score: 2 },
  { emoji: "😰", label: "Ansioso", score: 1 },
  { emoji: "😢", label: "Muy triste", score: 1 },
  { emoji: "😡", label: "Enojado", score: 1 },
];

interface EmotionalRecordWidgetProps {
  todayRecord?: {
    id: string;
    emoji: string;
    reflection: string | null;
  } | null;
  onRecordSaved?: () => void;
  compact?: boolean;
}

export function EmotionalRecordWidget({ 
  todayRecord, 
  onRecordSaved,
  compact = false 
}: EmotionalRecordWidgetProps) {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(todayRecord?.emoji || null);
  const [reflection, setReflection] = useState(todayRecord?.reflection || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !selectedMood) return;

    const moodData = MOODS.find(m => m.emoji === selectedMood);
    if (!moodData) return;

    setIsSaving(true);
    try {
      if (todayRecord?.id) {
        // Update existing record
        const { error } = await supabase
          .from("emotional_records")
          .update({
            emoji: selectedMood,
            mood_score: moodData.score,
            reflection: reflection || null,
          })
          .eq("id", todayRecord.id);

        if (error) throw error;
        toast.success("Registro actualizado");
      } else {
        // Create new record
        const { error } = await supabase
          .from("emotional_records")
          .insert({
            user_id: user.id,
            emoji: selectedMood,
            mood_score: moodData.score,
            reflection: reflection || null,
          });

        if (error) throw error;
        toast.success("¡Estado emocional registrado!");
      }

      onRecordSaved?.();
    } catch (error) {
      console.error("Error saving emotional record:", error);
      toast.error("Error al guardar el registro");
    } finally {
      setIsSaving(false);
    }
  };

  if (compact && todayRecord) {
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-card to-accent/10">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl">{todayRecord.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              Hoy te sientes: {MOODS.find(m => m.emoji === todayRecord.emoji)?.label}
            </p>
            {todayRecord.reflection && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                "{todayRecord.reflection}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 text-primary">
            <Check className="h-4 w-4" />
            <span className="text-sm">Registrado</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🫶</span>
          ¿Cómo te sientes hoy?
        </CardTitle>
        <CardDescription>
          Selecciona el emoji que mejor represente tu estado emocional actual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emoji Grid */}
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {MOODS.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => setSelectedMood(mood.emoji)}
              className={`flex flex-col items-center gap-1 rounded-lg p-3 transition-all hover:bg-accent ${
                selectedMood === mood.emoji
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "bg-muted/50"
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs text-muted-foreground">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Reflection Text */}
        {selectedMood && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              ¿Quieres agregar una reflexión? (opcional)
            </label>
            <Textarea
              placeholder="Escribe cómo te sientes, qué pensamientos tienes..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={!selectedMood || isSaving}
          className="w-full"
        >
          {isSaving ? "Guardando..." : todayRecord ? "Actualizar registro" : "Guardar mi estado"}
        </Button>
      </CardContent>
    </Card>
  );
}
