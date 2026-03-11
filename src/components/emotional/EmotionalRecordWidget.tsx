import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check } from "lucide-react";

const AFFECTIVE_CATEGORIES = [
  { emoji: "🤩", label: "Admiración", labelEn: "Admiration", score: 8, description: "Valoración positiva de una cualidad en otro" },
  { emoji: "🥰", label: "Adoración", labelEn: "Adoration", score: 8, description: "Afecto intenso, casi reverencial, hacia algo o alguien" },
  { emoji: "😍", label: "Apreciación estética", labelEn: "Aesthetic appreciation", score: 7, description: "Placer ante la belleza o excelencia formal" },
  { emoji: "😄", label: "Diversión", labelEn: "Amusement", score: 7, description: "Humor positivo" },
  { emoji: "😡", label: "Enojo", labelEn: "Anger", score: 2, description: "Respuesta ante obstáculo o injusticia percibida" },
  { emoji: "😰", label: "Ansiedad", labelEn: "Anxiety", score: 2, description: "Anticipación amenazante, difusa o específica" },
  { emoji: "😲", label: "Asombro reverencial", labelEn: "Awe", score: 6, description: "Asombro ante algo vasto o que supera las expectativas previas" },
  { emoji: "😬", label: "Incomodidad social", labelEn: "Awkwardness", score: 3, description: "Torpeza situacional" },
  { emoji: "😑", label: "Aburrimiento", labelEn: "Boredom", score: 3, description: "Baja activación, ausencia de estímulo significativo" },
  { emoji: "😌", label: "Calma", labelEn: "Calmness", score: 7, description: "Relajación, cierta estabilidad" },
  { emoji: "🤔", label: "Confusión", labelEn: "Confusion", score: 4, description: "Disonancia cognitiva, falta de comprensión" },
  { emoji: "🤤", label: "Anhelo", labelEn: "Craving", score: 5, description: "Deseo intenso, apetito hacia un objeto/situación" },
  { emoji: "🤢", label: "Asco", labelEn: "Disgust", score: 1, description: "Rechazo ante algo percibido como sucio, contaminante o violatorio" },
  { emoji: "😢", label: "Dolor empático", labelEn: "Empathic pain", score: 3, description: "Percibir el dolor y sentir ante el sufrimiento ajeno" },
  { emoji: "😎", label: "Fascinación", labelEn: "Entrancement", score: 6, description: "Atracción irresistible, deslumbramiento intenso hacia alguien o algo" },
  { emoji: "🥳", label: "Entusiasmo", labelEn: "Excitement", score: 9, description: "Exaltación del ánimo y fervor apasionado ante algo que admira" },
  { emoji: "😨", label: "Miedo", labelEn: "Fear", score: 2, description: "Respuesta ante amenaza concreta o percibida" },
  { emoji: "😱", label: "Horror", labelEn: "Horror", score: 1, description: "Miedo combinado con asco o perturbación moral" },
  { emoji: "🧐", label: "Interés", labelEn: "Interest", score: 6, description: "Orientación atencional hacia algo novedoso o complejo" },
  { emoji: "😊", label: "Alegría", labelEn: "Joy", score: 9, description: "Bienestar, satisfacción positiva" },
  { emoji: "🕰️", label: "Nostalgia", labelEn: "Nostalgia", score: 5, description: "Añoranza afectiva por el pasado" },
  { emoji: "😮‍💨", label: "Alivio", labelEn: "Relief", score: 7, description: "Reducción de tensión tras superar una amenaza real o percibida" },
  { emoji: "🥰", label: "Enamoramiento", labelEn: "Romance", score: 8, description: "Atracción afectivo-sexual con respeto y calidez" },
  { emoji: "😔", label: "Tristeza", labelEn: "Sadness", score: 2, description: "Respuesta ante la pérdida o la privación" },
  { emoji: "😌", label: "Satisfacción", labelEn: "Satisfaction", score: 8, description: "Cierre positivo de una meta o necesidad" },
  { emoji: "😘", label: "Deseo sexual", labelEn: "Sexual desire", score: 5, description: "Activación erótica dirigida" },
  { emoji: "🤗", label: "Compasión", labelEn: "Sympathy", score: 7, description: "Preocupación orientada hacia el bienestar ajeno" },
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

        {/* Selected emotion description with animation */}
        {selectedMood && (() => {
          const selected = AFFECTIVE_CATEGORIES.find(m => m.emoji === selectedMood);
          return selected ? (
            <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 animate-fade-in transition-all duration-300">
              <span className="text-3xl">{selected.emoji}</span>
              <div>
                <p className="font-medium text-foreground">{selected.label}</p>
                <p className="text-sm text-muted-foreground">{selected.description}</p>
              </div>
            </div>
          ) : null;
        })()}

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
