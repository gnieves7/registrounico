import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Brain, Save, Plus, Trash2, Download, BookOpen, HelpCircle, Heart, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AbcdeRecord {
  id: string;
  record_date: string;
  situation: string | null;
  thought: string | null;
  emotion_conduct: string | null;
  debate: string | null;
  result: string | null;
  created_at: string;
}

const AnxietyRecord = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<AbcdeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newRecord, setNewRecord] = useState({
    situation: "",
    thought: "",
    emotion_conduct: "",
    debate: "",
    result: "",
  });

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("anxiety_abcde_records")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecord = async () => {
    if (!user) return;
    if (!newRecord.situation.trim()) {
      toast({ title: "Completá al menos la situación", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("anxiety_abcde_records").insert({
        user_id: user.id,
        situation: newRecord.situation || null,
        thought: newRecord.thought || null,
        emotion_conduct: newRecord.emotion_conduct || null,
        debate: newRecord.debate || null,
        result: newRecord.result || null,
      });
      if (error) throw error;
      setNewRecord({ situation: "", thought: "", emotion_conduct: "", debate: "", result: "" });
      fetchRecords();
      toast({ title: "Registro guardado", description: "Tu registro ABCDE se guardó correctamente" });
    } catch (error) {
      console.error("Error saving record:", error);
      toast({ title: "Error", description: "No se pudo guardar el registro", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase.from("anxiety_abcde_records").delete().eq("id", id);
      if (error) throw error;
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Registro eliminado" });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-2 md:gap-3">
          <Brain className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
            Entrenamiento Cognitivo
          </h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Herramientas cognitivas para comprender y gestionar la ansiedad
        </p>
      </div>

      <Tabs defaultValue="registro" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="registro" className="text-xs md:text-sm">
            <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
            Registro ABCDE
          </TabsTrigger>
          <TabsTrigger value="pensamientos" className="text-xs md:text-sm">
            <BookOpen className="mr-1.5 h-3.5 w-3.5" />
            Pensamientos
          </TabsTrigger>
          <TabsTrigger value="preguntas" className="text-xs md:text-sm">
            <HelpCircle className="mr-1.5 h-3.5 w-3.5" />
            Preguntas Clave
          </TabsTrigger>
          <TabsTrigger value="recomendaciones" className="text-xs md:text-sm">
            <Heart className="mr-1.5 h-3.5 w-3.5" />
            Recomendaciones
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Registro ABCDE interactivo */}
        <TabsContent value="registro" className="space-y-6">
          {/* Ejemplo */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ejemplo de Registro A-B-C-D-E</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile: card layout */}
              <div className="space-y-2 md:hidden">
                <div className="rounded border border-border p-2">
                  <span className="text-xs font-semibold text-foreground">A – Situación</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Saliendo de una entrevista de trabajo</p>
                </div>
                <div className="rounded border border-border p-2">
                  <span className="text-xs font-semibold text-foreground">B – Pensamiento</span>
                  <p className="text-xs text-muted-foreground mt-0.5">No me lo van a dar. Seguro que no soy el candidato ideal. Soy un fracasado.</p>
                </div>
                <div className="rounded border border-border p-2">
                  <span className="text-xs font-semibold text-foreground">C – Emoción y conducta</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Angustia o abatimiento. Me desmoralizo y dejo de buscar trabajo.</p>
                </div>
                <div className="rounded border border-border p-2">
                  <span className="text-xs font-semibold text-foreground">D – Debate</span>
                  <p className="text-xs text-muted-foreground mt-0.5">¿Cómo sé que no me lo van a dar? ¿Puedo estar seguro? En caso de que no, ¿eso me convierte en fracasado?</p>
                </div>
                <div className="rounded border border-border p-2">
                  <span className="text-xs font-semibold text-foreground">E – Resultado</span>
                  <p className="text-xs text-muted-foreground mt-0.5">No puedo estar seguro, lo mejor es dejar pasar tiempo. Me siento menos angustiado.</p>
                </div>
              </div>
              {/* Desktop: table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="p-2 text-left font-semibold text-foreground">A – Situación</th>
                      <th className="p-2 text-left font-semibold text-foreground">B – Pensamiento</th>
                      <th className="p-2 text-left font-semibold text-foreground">C – Emoción y conducta</th>
                      <th className="p-2 text-left font-semibold text-foreground">D – Debate</th>
                      <th className="p-2 text-left font-semibold text-foreground">E – Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 text-muted-foreground align-top">Saliendo de una entrevista de trabajo</td>
                      <td className="p-2 text-muted-foreground align-top">No me lo van a dar. Seguro que no soy el candidato ideal. Soy un fracasado.</td>
                      <td className="p-2 text-muted-foreground align-top">Angustia o abatimiento. Me desmoralizo y dejo de buscar trabajo.</td>
                      <td className="p-2 text-muted-foreground align-top">¿Cómo sé que no me lo van a dar? ¿Puedo estar seguro? En caso de que no, ¿eso me convierte en fracasado?</td>
                      <td className="p-2 text-muted-foreground align-top">No puedo estar seguro, lo mejor es dejar pasar tiempo. Me siento menos angustiado.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Formulario nuevo registro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nuevo Registro ABCDE
              </CardTitle>
              <CardDescription>Completá cada columna para analizar tu pensamiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">A – Situación</label>
                  <Textarea placeholder="¿Qué pasó?" value={newRecord.situation} onChange={(e) => setNewRecord((p) => ({ ...p, situation: e.target.value }))} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">B – Pensamiento</label>
                  <Textarea placeholder="¿Qué pensaste?" value={newRecord.thought} onChange={(e) => setNewRecord((p) => ({ ...p, thought: e.target.value }))} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">C – Emoción y conducta</label>
                  <Textarea placeholder="¿Qué sentiste y qué hiciste?" value={newRecord.emotion_conduct} onChange={(e) => setNewRecord((p) => ({ ...p, emotion_conduct: e.target.value }))} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">D – Debate</label>
                  <Textarea placeholder="¿Qué preguntas le hacés a ese pensamiento?" value={newRecord.debate} onChange={(e) => setNewRecord((p) => ({ ...p, debate: e.target.value }))} rows={4} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">E – Resultado</label>
                  <Textarea placeholder="¿Qué pensás y sentís tras el debate?" value={newRecord.result} onChange={(e) => setNewRecord((p) => ({ ...p, result: e.target.value }))} rows={4} />
                </div>
              </div>
              <Button onClick={saveRecord} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Guardando..." : "Guardar registro"}
              </Button>
            </CardContent>
          </Card>

          {/* Descargar planilla */}
          <Button variant="outline" asChild>
            <a href="/documents/registro-abcde-planilla.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Descargar planilla ABCDE en PDF
            </a>
          </Button>

          {/* Registros anteriores */}
          {records.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Mis registros anteriores</h3>
              {records.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardDescription>
                        {format(new Date(record.created_at), "d 'de' MMMM, yyyy – HH:mm", { locale: es })}
                      </CardDescription>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteRecord(record.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                    <CardContent>
                    {/* Mobile: card layout for records */}
                    <div className="space-y-2 md:hidden">
                      {[
                        { label: "A – Situación", value: record.situation },
                        { label: "B – Pensamiento", value: record.thought },
                        { label: "C – Emoción", value: record.emotion_conduct },
                        { label: "D – Debate", value: record.debate },
                        { label: "E – Resultado", value: record.result },
                      ].map((item) => (
                        <div key={item.label} className="rounded border border-border p-2">
                          <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                          <p className="text-sm text-foreground mt-0.5">{item.value || "—"}</p>
                        </div>
                      ))}
                    </div>
                    {/* Desktop: table layout for records */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="p-2 text-left font-medium text-muted-foreground">A</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">B</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">C</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">D</th>
                            <th className="p-2 text-left font-medium text-muted-foreground">E</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 align-top text-foreground">{record.situation || "—"}</td>
                            <td className="p-2 align-top text-foreground">{record.thought || "—"}</td>
                            <td className="p-2 align-top text-foreground">{record.emotion_conduct || "—"}</td>
                            <td className="p-2 align-top text-foreground">{record.debate || "—"}</td>
                            <td className="p-2 align-top text-foreground">{record.result || "—"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 2: Pensamientos automáticos */}
        <TabsContent value="pensamientos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Características de los Pensamientos Automáticos
              </CardTitle>
              <CardDescription>Comprender estos patrones es el primer paso para cambiarlos</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="1">
                  <AccordionTrigger className="text-sm font-medium">1. Son mensajes específicos y discretos</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Un joven que temía ser rechazado se decía a sí mismo en una situación grupal: "ellos me desprecian, me encuentran raro, me rechazarán". Son pensamientos puntuales y concretos sobre la situación.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="2">
                  <AccordionTrigger className="text-sm font-medium">2. Parecen taquigrafiados</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Están compuestos por muy pocas y esenciales palabras o una imagen visual breve. No son discursos elaborados, sino flashes rápidos de pensamiento.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                  <AccordionTrigger className="text-sm font-medium">3. Casi siempre son creídos</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    No importa lo irracionales que sean, se les adscribe el mismo valor de verdad que a las percepciones sensoriales del mundo externo. Parecen completamente reales y verdaderos en el momento.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="4">
                  <AccordionTrigger className="text-sm font-medium">4. Son relativamente idiosincráticos</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Ante un mismo estímulo, cada persona tiene una respuesta diferente basada en su forma única de ver la situación, lo cual causa una emoción diferente en cada individuo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="5">
                  <AccordionTrigger className="text-sm font-medium">5. Son difíciles de desviar</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Son irreflexivos y se entretejen inadvertidamente a través del diálogo interno. Tienden a actuar como señales de otros pensamientos: un pensamiento deprimente dispara una larga cadena de pensamientos deprimentes asociados.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="6">
                  <AccordionTrigger className="text-sm font-medium">6. Son aprendidos</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Todas las personas han sido condicionadas por la familia, los amigos y los medios de información para interpretar los sucesos de cierta forma. Esto significa que también pueden des-aprenderse.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="7">
                  <AccordionTrigger className="text-sm font-medium">7. Tienden a dramatizar</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Predicen catástrofes, ven peligros en todas partes y siempre suponen lo peor. Las dramatizaciones constituyen la mayor fuente de ansiedad.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Preguntas clave */}
        <TabsContent value="preguntas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Tres tipos de preguntas clave para combatir pensamientos irracionales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-semibold text-foreground">1. Evaluar la evidencia y consistencia lógica</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>¿Dónde está la evidencia de que esto es cómo yo me lo digo?</li>
                  <li>¿Puedo probar lo que estoy diciendo?</li>
                  <li>¿Puedo demostrarlo?</li>
                  <li>¿Es eso una buena prueba?</li>
                  <li>¿Dónde está escrito que eso sea así?</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-semibold text-foreground">2. Suponiendo que sea cierto, ¿las consecuencias serían tan terribles?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>¿Serían tan terribles?</li>
                  <li>Si esto es así, ¿y qué?</li>
                  <li>¿Qué ocurriría si…?</li>
                  <li>¿Por qué sería tan terrible?</li>
                  <li>¿Puedo encontrarme bien aún cuando esto sea así?</li>
                  <li>¿Puedo estar contento incluso si no tengo lo que quiero?</li>
                </ul>
              </div>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-semibold text-foreground">3. Analizar a qué me conduce pensar de esta manera</h3>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                  <li>¿Me es rentable pensar como pienso?</li>
                  <li>Si pienso así, ¿soluciono mis problemas?, ¿me ayuda a conseguir mis objetivos?</li>
                  <li>¿Qué consecuencias tiene para mí pensar de esta manera?</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: Recomendaciones terapéuticas */}
        <TabsContent value="recomendaciones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Recomendaciones Terapéuticas
              </CardTitle>
              <CardDescription>Estrategias prácticas para gestionar la ansiedad en tu vida diaria</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="ejercicio">
                  <AccordionTrigger className="text-sm font-medium">🏃 Ejercicio físico</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    La práctica moderada de deporte ayuda a relajarse. Andar todos los días 30-45 minutos siguiendo un ritmo rápido y constante es muy recomendable, especialmente si se hace al aire libre.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dieta">
                  <AccordionTrigger className="text-sm font-medium">🥗 Dieta y horarios de comidas</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Llevar una dieta saludable, evitando comidas que sobrecargan el organismo. Destinar el tiempo para comer como un momento de descanso. Dedicar el tiempo suficiente para comer sin prisas. Intentar llevar horarios fijos de comidas.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="estimulantes">
                  <AccordionTrigger className="text-sm font-medium">☕ Estimulantes</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    No tomar sustancias estimulantes o reducir su consumo (café, té, tabaco, etc.).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="descanso">
                  <AccordionTrigger className="text-sm font-medium">😴 Descanso</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Dormir lo suficiente, en torno a 7-8 horas, siguiendo un horario regular. Cuando se aproxima el momento de irse a dormir, no conviene intentar resolver problemas o tomar decisiones difíciles; conviene disminuir la actividad y relajarse.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="organizacion">
                  <AccordionTrigger className="text-sm font-medium">📋 Organización</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    Organizar el tiempo y las actividades a lo largo del día y de la semana estableciendo horarios y espacios reservados para trabajar, pero también para actividades de ocio y de relax. Es útil diseñar una agenda. Priorizar actividades cuando no podemos hacer todo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="problemas">
                  <AccordionTrigger className="text-sm font-medium">🧩 Solución de problemas</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    No posponer el afrontamiento de los problemas. Tomar decisiones siguiendo un proceso lógico: planteamiento del problema, análisis de alternativas (pros y contras), elección de una alternativa y llevarla a cabo.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="autogestion">
                  <AccordionTrigger className="text-sm font-medium">🧘 Autogestión de la ansiedad</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="space-y-2 list-disc pl-5">
                      <li>No rumiar o analizar continuamente el problema.</li>
                      <li>La ansiedad es una emoción normal; no focalizarse en ella pues se magnifica.</li>
                      <li>Tendemos a exagerar la probabilidad de que ocurra algo malo. Intentar generar otras posibilidades más positivas.</li>
                      <li>Reconocer logros y permitirse sentirse bien. Evitar etiquetas globales como "todo lo hago mal".</li>
                      <li>No intentar tener control sobre todo.</li>
                      <li>Practicar la relajación con asiduidad.</li>
                      <li>No evitar sistemáticamente situaciones que producen ansiedad.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="relaciones">
                  <AccordionTrigger className="text-sm font-medium">🤝 Relaciones con los demás</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Potenciar las conductas positivas de quienes nos rodean con reconocimiento y halagos.</li>
                      <li>Aprender a decir NO cuando lo consideremos.</li>
                      <li>No sacar continuamente los errores del pasado.</li>
                      <li>Apoyarse en personas de confianza en los malos momentos y disfrutar conjuntamente en los buenos.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="final">
                  <AccordionTrigger className="text-sm font-medium">✨ Y por último…</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Aceptarse.</li>
                      <li>Cuidarse.</li>
                      <li>Potenciar el sentido del humor.</li>
                      <li>Tener una actitud mental positiva.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnxietyRecord;
