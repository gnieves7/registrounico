import { useState } from "react";
import { Moon, Plus, Calendar, Sparkles, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useDreamRecords, DreamRecordInsert } from "@/hooks/useDreamRecords";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { demoDreamRecords } from "@/data/demoData";

// Emojis para describir elementos del sueño
const dreamEmojis = [
  { emoji: "🌙", label: "Noche/Luna" },
  { emoji: "☀️", label: "Día/Sol" },
  { emoji: "🏠", label: "Casa" },
  { emoji: "🌊", label: "Agua" },
  { emoji: "🔥", label: "Fuego" },
  { emoji: "🌲", label: "Naturaleza" },
  { emoji: "✈️", label: "Volar" },
  { emoji: "🏃", label: "Correr" },
  { emoji: "😨", label: "Miedo" },
  { emoji: "😊", label: "Felicidad" },
  { emoji: "😢", label: "Tristeza" },
  { emoji: "😠", label: "Enojo" },
  { emoji: "👥", label: "Personas" },
  { emoji: "👨‍👩‍👧", label: "Familia" },
  { emoji: "💀", label: "Muerte" },
  { emoji: "🐍", label: "Animales" },
  { emoji: "🚗", label: "Vehículo" },
  { emoji: "🏥", label: "Hospital" },
  { emoji: "📚", label: "Escuela" },
  { emoji: "💼", label: "Trabajo" },
  { emoji: "💑", label: "Romance" },
  { emoji: "🎭", label: "Máscara" },
  { emoji: "🔮", label: "Misterio" },
  { emoji: "⚡", label: "Energía" },
];

const DreamRecord = () => {
  const { isDemoMode, guardWrite } = useDemoMode();
  const { dreams: realDreams, isLoading: realLoading, isSaving, saveDream, updateInterpretation } = useDreamRecords();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDream, setSelectedDream] = useState<string | null>(null);
  const [interpretationText, setInterpretationText] = useState("");

  const dreams = isDemoMode ? demoDreamRecords : realDreams;
  const isLoading = isDemoMode ? false : realLoading;
  
  // Form state
  const [newDream, setNewDream] = useState<DreamRecordInsert>({
    title: "",
    dream_date: format(new Date(), "yyyy-MM-dd"),
    dream_content: "",
    dream_emojis: [],
  });

  const toggleEmoji = (emoji: string) => {
    setNewDream((prev) => ({
      ...prev,
      dream_emojis: prev.dream_emojis.includes(emoji)
        ? prev.dream_emojis.filter((e) => e !== emoji)
        : [...prev.dream_emojis, emoji],
    }));
  };

  const handleSaveDream = async () => {
    if (isDemoMode) { guardWrite("Guardar sueño"); return; }
    if (!newDream.dream_content.trim()) return;
    
    const result = await saveDream(newDream);
    if (result) {
      setNewDream({
        title: "",
        dream_date: format(new Date(), "yyyy-MM-dd"),
        dream_content: "",
        dream_emojis: [],
      });
      setIsDialogOpen(false);
    }
  };

  const handleSaveInterpretation = async () => {
    if (isDemoMode) { guardWrite("Guardar interpretación"); return; }
    if (!selectedDream || !interpretationText.trim()) return;
    await updateInterpretation(selectedDream, interpretationText);
    setSelectedDream(null);
    setInterpretationText("");
  };

  const openInterpretation = (dreamId: string, currentInterpretation: string | null) => {
    setSelectedDream(dreamId);
    setInterpretationText(currentInterpretation || "");
  };

  const handleOpenDialog = () => {
    if (isDemoMode) { guardWrite("Registrar sueño"); return; }
    setIsDialogOpen(true);
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10">
            <Moon className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-foreground md:text-2xl">
              Registro del Inconsciente
            </h1>
            <p className="text-sm text-muted-foreground md:text-base">
              Explora tu mundo interior a través de tus sueños
            </p>
          </div>
        </div>

        {isDemoMode ? (
          <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Sueño
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Sueño
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Nuevo Registro de Sueño
                </DialogTitle>
                <DialogDescription>
                  Describe tu sueño y selecciona los elementos que aparecieron
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dream-date">Fecha del sueño</Label>
                    <Input
                      id="dream-date"
                      type="date"
                      value={newDream.dream_date}
                      onChange={(e) =>
                        setNewDream((prev) => ({ ...prev, dream_date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dream-title">Título (opcional)</Label>
                    <Input
                      id="dream-title"
                      placeholder="Ej: El vuelo sobre el mar"
                      value={newDream.title || ""}
                      onChange={(e) =>
                        setNewDream((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dream-content">Descripción del sueño</Label>
                  <Textarea
                    id="dream-content"
                    placeholder="Describe tu sueño con el mayor detalle posible..."
                    className="min-h-[150px]"
                    value={newDream.dream_content}
                    onChange={(e) =>
                      setNewDream((prev) => ({ ...prev, dream_content: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label>Elementos del sueño</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecciona los símbolos que aparecieron en tu sueño
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dreamEmojis.map(({ emoji, label }) => (
                      <Button
                        key={emoji}
                        type="button"
                        variant={newDream.dream_emojis.includes(emoji) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleEmoji(emoji)}
                        className="h-auto py-1.5 px-3"
                      >
                        <span className="mr-1.5 text-lg">{emoji}</span>
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveDream} 
                    disabled={isSaving || !newDream.dream_content.trim()}
                  >
                    {isSaving ? "Guardando..." : "Guardar Sueño"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Content */}
      <Tabs defaultValue="dreams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dreams" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Mis Sueños
          </TabsTrigger>
          <TabsTrigger value="interpretations" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Interpretaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dreams" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando sueños...</p>
            </div>
          ) : dreams.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Moon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay sueños registrados
                </h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Comienza a registrar tus sueños para explorar tu mundo interior
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {dreams.map((dream) => (
                  <Card key={dream.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {dream.title || "Sueño sin título"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(new Date(dream.dream_date), "PPP", { locale: es })}
                          </CardDescription>
                        </div>
                        {dream.interpretation && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Interpretado
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dream.dream_emojis.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {dream.dream_emojis.map((emoji: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-xl bg-muted rounded-md p-1"
                              title={dreamEmojis.find((e) => e.emoji === emoji)?.label}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-foreground whitespace-pre-wrap">
                        {dream.dream_content}
                      </p>

                      <div className="flex justify-end pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInterpretation(dream.id, dream.interpretation)}
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          {dream.interpretation ? "Ver/Editar Interpretación" : "Añadir Interpretación"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="interpretations" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Cargando...</p>
            </div>
          ) : dreams.filter((d) => d.interpretation).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Sin interpretaciones aún
                </h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  Las interpretaciones de tus sueños aparecerán aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {dreams
                  .filter((d) => d.interpretation)
                  .map((dream) => (
                    <Card key={dream.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-primary" />
                          {dream.title || "Sueño sin título"}
                        </CardTitle>
                        <CardDescription>
                          Sueño del {format(new Date(dream.dream_date), "PPP", { locale: es })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            Resumen del sueño:
                          </h4>
                          <p className="text-sm text-foreground line-clamp-3">
                            {dream.dream_content}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Interpretación:
                          </h4>
                          <p className="text-foreground whitespace-pre-wrap">
                            {dream.interpretation}
                          </p>
                          {dream.interpretation_date && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Interpretado el{" "}
                              {format(new Date(dream.interpretation_date), "PPP", { locale: es })}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* Interpretation Dialog */}
      <Dialog open={!!selectedDream} onOpenChange={() => setSelectedDream(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Interpretación del Sueño
            </DialogTitle>
            <DialogDescription>
              Escribe tu interpretación o reflexión sobre este sueño
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="¿Qué crees que significa este sueño? ¿Qué emociones te evoca?..."
              className="min-h-[200px]"
              value={interpretationText}
              onChange={(e) => setInterpretationText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDream(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveInterpretation}
                disabled={isSaving || !interpretationText.trim()}
              >
                {isSaving ? "Guardando..." : "Guardar Interpretación"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DreamRecord;
