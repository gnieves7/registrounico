import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check } from "lucide-react";

const AFFECTIVE_CATEGORIES = [
  { emoji: "🤩", label: "Admiración", labelEn: "Admiration", score: 8 },
  { emoji: "🥰", label: "Adoración", labelEn: "Adoration", score: 8 },
  { emoji: "😍", label: "Apreciación estética", labelEn: "Aesthetic appreciation", score: 7 },
  { emoji: "😄", label: "Diversión", labelEn: "Amusement", score: 7 },
  { emoji: "😡", label: "Ira", labelEn: "Anger", score: 2 },
  { emoji: "😰", label: "Ansiedad", labelEn: "Anxiety", score: 2 },
  { emoji: "😲", label: "Asombro", labelEn: "Awe", score: 6 },
  { emoji: "😬", label: "Incomodidad", labelEn: "Awkwardness", score: 3 },
  { emoji: "😑", label: "Aburrimiento", labelEn: "Boredom", score: 3 },
  { emoji: "😌", label: "Calma", labelEn: "Calmness", score: 7 },
  { emoji: "🤔", label: "Confusión", labelEn: "Confusion", score: 4 },
  { emoji: "🤤", label: "Deseo intenso", labelEn: "Craving", score: 5 },
  { emoji: "🤢", label: "Disgusto", labelEn: "Disgust", score: 1 },
  { emoji: "😢", label: "Dolor empático", labelEn: "Empathic pain", score: 3 },
  { emoji: "🫠", label: "Fascinación", labelEn: "Entrancement", score: 6 },
  { emoji: "🥳", label: "Entusiasmo", labelEn: "Excitement", score: 9 },
  { emoji: "😨", label: "Miedo", labelEn: "Fear", score: 2 },
  { emoji: "😱", label: "Horror", labelEn: "Horror", score: 1 },
  { emoji: "🧐", label: "Interés", labelEn: "Interest", score: 6 },
  { emoji: "😊", label: "Alegría", labelEn: "Joy", score: 9 },
  { emoji: "🥹", label: "Nostalgia", labelEn: "Nostalgia", score: 5 },
  { emoji: "😮‍💨", label: "Alivio", labelEn: "Relief", score: 7 },
  { emoji: "🥰", label: "Romance", labelEn: "Romance", score: 8 },
  { emoji: "😔", label: "Tristeza", labelEn: "Sadness", score: 2 },
  { emoji: "😌", label: "Satisfacción", labelEn: "Satisfaction", score: 8 },
  { emoji: "😏", label: "Deseo sexual", labelEn: "Sexual desire", score: 5 },
  { emoji: "🤗", label: "Simpatía", labelEn: "Sympathy", score: 7 },
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

    const moodData = AFFECTIVE_CATEGORIES.find(m => m.emoji === selectedMood);
    if (!moodData) return;

    setIsSaving(true);
    try {
      if (todayRecord?.id) {
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
    const found = AFFECTIVE_CATEGORIES.find(m => m.emoji === todayRecord.emoji);
    return (
      <Card className="border-primary/20 bg-gradient-to-r from-card to-accent/10">
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <span className="text-2xl">{todayRecord.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">
              Hoy te sientes: {found?.label || "Registrado"}
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
          Seleccioná la categoría afectiva que mejor represente tu estado emocional actual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 27 Affective Categories Grid */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {AFFECTIVE_CATEGORIES.map((mood) => (
            <button
              key={`${mood.labelEn}`}
              onClick={() => setSelectedMood(mood.emoji)}
              className={`flex flex-col items-center gap-0.5 rounded-lg p-2 transition-all hover:bg-accent sm:gap-1 sm:p-3 ${
                selectedMood === mood.emoji
                  ? "bg-primary/10 ring-2 ring-primary"
                  : "bg-muted/50"
              }`}
            >
              <span className="text-xl sm:text-2xl">{mood.emoji}</span>
              <span className="text-[9px] leading-tight sm:text-[10px] text-muted-foreground text-center">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Reference */}
        <p className="text-[10px] text-muted-foreground text-center italic">
          Basado en las 27 categorías afectivas de Cowen & Keltner (2017)
        </p>

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
