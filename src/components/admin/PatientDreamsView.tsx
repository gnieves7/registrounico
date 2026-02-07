import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Moon, Sparkles, Calendar, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DreamRecord {
  id: string;
  user_id: string;
  dream_date: string;
  title: string | null;
  dream_content: string;
  dream_emojis: string[];
  interpretation: string | null;
  interpretation_date: string | null;
  created_at: string;
}

interface PatientDreamsViewProps {
  userId: string;
  patientName: string;
}

// Emoji labels for display
const emojiLabels: Record<string, string> = {
  "🌙": "Noche/Luna",
  "☀️": "Día/Sol",
  "🏠": "Casa",
  "🌊": "Agua",
  "🔥": "Fuego",
  "🌲": "Naturaleza",
  "✈️": "Volar",
  "🏃": "Correr",
  "😨": "Miedo",
  "😊": "Felicidad",
  "😢": "Tristeza",
  "😠": "Enojo",
  "👥": "Personas",
  "👨‍👩‍👧": "Familia",
  "💀": "Muerte",
  "🐍": "Animales",
  "🚗": "Vehículo",
  "🏥": "Hospital",
  "📚": "Escuela",
  "💼": "Trabajo",
  "💑": "Romance",
  "🎭": "Máscara",
  "🔮": "Misterio",
  "⚡": "Energía",
};

export function PatientDreamsView({ userId, patientName }: PatientDreamsViewProps) {
  const [dreams, setDreams] = useState<DreamRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDream, setSelectedDream] = useState<DreamRecord | null>(null);
  const [interpretationText, setInterpretationText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchDreams();
  }, [userId]);

  const fetchDreams = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("dream_records")
        .select("*")
        .eq("user_id", userId)
        .order("dream_date", { ascending: false });

      if (error) throw error;

      const formattedDreams: DreamRecord[] = (data || []).map((d) => ({
        ...d,
        dream_emojis: Array.isArray(d.dream_emojis) 
          ? (d.dream_emojis as unknown as string[]) 
          : [],
      }));

      setDreams(formattedDreams);
    } catch (error) {
      console.error("Error fetching dreams:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los sueños",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInterpretation = (dream: DreamRecord) => {
    setSelectedDream(dream);
    setInterpretationText(dream.interpretation || "");
  };

  const saveInterpretation = async () => {
    if (!selectedDream) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("dream_records")
        .update({
          interpretation: interpretationText.trim() || null,
          interpretation_date: interpretationText.trim() ? new Date().toISOString() : null,
        })
        .eq("id", selectedDream.id);

      if (error) throw error;

      toast({
        title: "Interpretación guardada",
        description: "La interpretación ha sido actualizada",
      });

      setSelectedDream(null);
      setInterpretationText("");
      fetchDreams();
    } catch (error) {
      console.error("Error saving interpretation:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la interpretación",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Moon className="h-5 w-5" />
          Registro del Inconsciente
        </h3>
        <p className="text-sm text-muted-foreground">
          Sueños registrados por {patientName}
        </p>
      </div>

      {/* Dreams List */}
      {dreams.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Moon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay sueños registrados</p>
            <p className="text-sm">El paciente aún no ha registrado ningún sueño</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[500px] pr-2">
          <div className="space-y-4">
            {dreams.map((dream) => (
              <Card key={dream.id} className="overflow-hidden">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {dream.title || "Sueño sin título"}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(dream.dream_date), "PPP", { locale: es })}
                      </p>
                    </div>
                    {dream.interpretation ? (
                      <Badge variant="secondary" className="shrink-0 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Interpretado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="shrink-0">
                        Sin interpretar
                      </Badge>
                    )}
                  </div>

                  {/* Emojis */}
                  {dream.dream_emojis.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {dream.dream_emojis.map((emoji, idx) => (
                        <span
                          key={idx}
                          className="text-lg bg-muted rounded-md px-1.5 py-0.5"
                          title={emojiLabels[emoji] || emoji}
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dream content */}
                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                      {dream.dream_content}
                    </p>
                    {dream.dream_content.length > 300 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-1"
                        onClick={() => openInterpretation(dream)}
                      >
                        Ver más...
                      </Button>
                    )}
                  </div>

                  {/* Interpretation preview */}
                  {dream.interpretation && (
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-primary mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Interpretación
                        {dream.interpretation_date && (
                          <span className="font-normal text-muted-foreground ml-2">
                            ({format(new Date(dream.interpretation_date), "dd/MM/yyyy")})
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                        {dream.interpretation}
                      </p>
                    </div>
                  )}

                  {/* Action button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openInterpretation(dream)}
                    className="w-full gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    {dream.interpretation ? "Ver / Editar Interpretación" : "Añadir Interpretación"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Interpretation Dialog */}
      <Dialog open={!!selectedDream} onOpenChange={(open) => !open && setSelectedDream(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDream && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  {selectedDream.title || "Sueño sin título"}
                </DialogTitle>
                <DialogDescription>
                  Sueño del {format(new Date(selectedDream.dream_date), "PPP", { locale: es })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Emojis */}
                {selectedDream.dream_emojis.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Elementos del sueño:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDream.dream_emojis.map((emoji, idx) => (
                        <span
                          key={idx}
                          className="text-lg bg-muted rounded-md px-2 py-1 flex items-center gap-1"
                        >
                          {emoji}
                          <span className="text-xs text-muted-foreground">
                            {emojiLabels[emoji] || ""}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full dream content */}
                <div>
                  <p className="text-sm font-medium mb-2">Descripción del sueño:</p>
                  <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {selectedDream.dream_content}
                    </p>
                  </div>
                </div>

                {/* Interpretation input */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Tu interpretación:
                  </p>
                  <Textarea
                    value={interpretationText}
                    onChange={(e) => setInterpretationText(e.target.value)}
                    placeholder="Escribe tu análisis e interpretación del sueño..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta interpretación será visible para el paciente
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDream(null)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={saveInterpretation}
                    disabled={isSaving}
                    className="flex-1 gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Guardar Interpretación
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
