import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Award, Gift, Plus, Sparkles, Star, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SymbolicAwardRecord {
  id: string;
  patient_id: string;
  granted_by: string;
  category_key: string;
  award_key: string;
  award_title: string;
  award_description: string | null;
  therapeutic_objective: string | null;
  clinical_note: string | null;
  awarded_at: string;
}

interface AwardItem {
  key: string;
  title: string;
  description: string;
}

interface AwardCategory {
  key: string;
  title: string;
  emoji: string;
  description: string;
  awards: AwardItem[];
}

const AWARD_CATALOG: AwardCategory[] = [
  {
    key: "autoconocimiento",
    title: "Autoconocimiento y trabajo interno",
    emoji: "🔍",
    description: "Premios para nombrar patrones, verse con honestidad y reescribir la propia historia con más agencia.",
    awards: [
      {
        key: "primer_insight",
        title: "Premio al primer insight",
        description: "Por nombrar algo que antes no podía ver y conectar por primera vez un patrón propio.",
      },
      {
        key: "espejo_sin_distorsion",
        title: "Premio al espejo sin distorsión",
        description: "Por sostener una mirada honesta sobre sí sin minimizarse ni dramatizarse.",
      },
      {
        key: "historiador_propio",
        title: "Premio al historiador propio",
        description: "Por reescribir una historia personal rígida con más matices, compasión o agencia.",
      },
      {
        key: "medalla_insight",
        title: "Medalla del Insight",
        description: "Por comprender algo importante sobre sí y transformar esa comprensión en lenguaje propio.",
      },
      {
        key: "autoconciencia",
        title: "Reconocimiento a la Autoconciencia",
        description: "Por identificar patrones repetitivos y reconocer la relación entre emoción, conducta y contexto.",
      },
      {
        key: "descubrimiento_personal",
        title: "Premio al Descubrimiento Personal",
        description: "Por descubrir una verdad subjetiva que amplía la narrativa de cambio.",
      },
    ],
  },
  {
    key: "regulacion",
    title: "Regulación emocional y tolerancia",
    emoji: "🌊",
    description: "Premios para validar la capacidad de sentir, esperar y atravesar activación sin colapsar.",
    awards: [
      {
        key: "surfista_emocional",
        title: "Premio al surfista emocional",
        description: "Por atravesar una emoción difícil sin evitarla ni ser arrastrado por ella.",
      },
      {
        key: "ventana_tolerancia",
        title: "Premio a la ventana de tolerancia",
        description: "Por mantenerse dentro del rango activable sin disociarse ni desbordarse ante un disparador.",
      },
      {
        key: "pausa_ganada",
        title: "Premio a la pausa ganada",
        description: "Por interponer un segundo entre el estímulo y la respuesta automática.",
      },
      {
        key: "resiliencia",
        title: "Distinción a la Resiliencia",
        description: "Por atravesar una situación compleja y sostener recursos internos aun en medio de la dificultad.",
      },
      {
        key: "fortaleza_interior",
        title: "Premio a la Fortaleza Interior",
        description: "Por mostrar firmeza subjetiva sin perder sensibilidad ante lo vivido.",
      },
      {
        key: "recuperacion_personal",
        title: "Reconocimiento a la Recuperación Personal",
        description: "Por recuperar capacidad de regulación después de una etapa crítica.",
      },
    ],
  },
  {
    key: "vinculos",
    title: "Vínculos y comunicación",
    emoji: "🗣️",
    description: "Premios para validar expresión auténtica, límites sanos y reparación de vínculos.",
    awards: [
      {
        key: "voz_propia",
        title: "Premio a la voz propia",
        description: "Por decir lo que necesitaba decir sin pedir disculpas por existir ni escalar a conflicto.",
      },
      {
        key: "limite_con_calma",
        title: "Premio al límite con calma",
        description: "Por sostener un no sin culpa excesiva y sin romper el vínculo.",
      },
      {
        key: "reparacion",
        title: "Premio a la reparación",
        description: "Por volver a un vínculo después de un conflicto con disposición genuina, sin borrarse ni aplastar al otro.",
      },
    ],
  },
  {
    key: "accion_cambio",
    title: "Acción, cambio conductual y exposición",
    emoji: "🚪",
    description: "Premios para marcar la acción incómoda, la exposición y la interrupción de hábitos repetidos.",
    awards: [
      {
        key: "puerta_abierta",
        title: "Premio a la puerta abierta",
        description: "Por enfrentar una situación evitada durante mucho tiempo, aunque fuera con ansiedad.",
      },
      {
        key: "habito_roto",
        title: "Premio al hábito roto",
        description: "Por interrumpir voluntariamente un patrón repetido al menos una vez, de forma consciente.",
      },
      {
        key: "primer_paso_incomodo",
        title: "Premio al primer paso incómodo",
        description: "Por actuar sin esperar a sentirse listo; la acción antes que la certeza.",
      },
      {
        key: "cambio_en_accion",
        title: "Premio al Cambio en Acción",
        description: "Por convertir una decisión terapéutica en una conducta concreta y verificable.",
      },
      {
        key: "reconstruccion_personal",
        title: "Reconocimiento a la Reconstrucción Personal",
        description: "Por modificar una conducta impulsiva, establecer límites o salir de una dinámica dañina.",
      },
      {
        key: "cambio_habito",
        title: "Medalla al Cambio de Hábito",
        description: "Por reemplazar una respuesta automática por una elección más consciente.",
      },
      {
        key: "coraje_emocional",
        title: "Distinción al Coraje Emocional",
        description: "Por enfrentar algo evitado, como hablar de un trauma o sostener una conversación pendiente.",
      },
      {
        key: "valentia_personal",
        title: "Reconocimiento a la Valentía Personal",
        description: "Por exponerse a una experiencia desafiante sin retirarse de sí mismo.",
      },
    ],
  },
  {
    key: "proceso_terapeutico",
    title: "Proceso terapéutico",
    emoji: "🌱",
    description: "Premios para fortalecer la constancia, el uso genuino del espacio clínico y la lectura madura de recaídas.",
    awards: [
      {
        key: "constancia",
        title: "Premio a la constancia",
        description: "Por seguir viniendo aunque pareciera que no pasó nada, entendiendo que el proceso es proceso.",
      },
      {
        key: "uso_genuino_espacio",
        title: "Premio al uso genuino del espacio",
        description: "Por traer algo real en vez de llenar el tiempo y arriesgarse a hablar de lo que cuesta.",
      },
      {
        key: "recaida_metabolizada",
        title: "Premio a la recaída bien metabolizada",
        description: "Por volver después de una recaída sin dramatismo ni abandono, leyéndola como información.",
      },
      {
        key: "perseverancia",
        title: "Distinción a la Perseverancia",
        description: "Por sostener el proceso terapéutico en momentos difíciles y seguir apostando al trabajo interno.",
      },
      {
        key: "compromiso_terapeutico",
        title: "Reconocimiento al Compromiso Terapéutico",
        description: "Por asistir regularmente y cuidar el encuadre como parte del tratamiento.",
      },
      {
        key: "continuidad_proceso",
        title: "Premio a la Continuidad del Proceso",
        description: "Por darle continuidad al cambio incluso cuando el avance no es espectacular pero sí profundo.",
      },
    ],
  },
  {
    key: "cierre_y_logros",
    title: "Cierre terapéutico y logros integrados",
    emoji: "🎓",
    description: "Premios de cierre y síntesis para materializar el camino recorrido en el pasaporte terapéutico.",
    awards: [
      {
        key: "transformacion_personal",
        title: "Reconocimiento al Proceso de Transformación Personal",
        description: "Por el camino sostenido de cambio subjetivo a lo largo del tratamiento.",
      },
      {
        key: "autonomia_emocional",
        title: "Certificado de Autonomía Emocional",
        description: "Por mostrar recursos internos para cuidarse, regularse y pedir ayuda de forma más saludable.",
      },
      {
        key: "camino_recorrido",
        title: "Distinción al Camino Recorrido",
        description: "Por materializar avances que antes parecían intangibles y reconocer el valor del recorrido.",
      },
    ],
  },
];

const awardsTable = "symbolic_awards" as any;

export default function SymbolicAwards() {
  const { isAdmin, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const isPatient = !isAdmin;

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [awards, setAwards] = useState<SymbolicAwardRecord[]>([]);
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCategoryKey, setSelectedCategoryKey] = useState(AWARD_CATALOG[0].key);
  const [selectedAwardKey, setSelectedAwardKey] = useState(AWARD_CATALOG[0].awards[0].key);
  const [clinicalNote, setClinicalNote] = useState("");

  const patientId = isAdmin ? selectedPatient : user?.id;

  const selectedCategory = useMemo(
    () => AWARD_CATALOG.find((category) => category.key === selectedCategoryKey) ?? AWARD_CATALOG[0],
    [selectedCategoryKey],
  );

  const selectedAward = useMemo(
    () => selectedCategory.awards.find((award) => award.key === selectedAwardKey) ?? selectedCategory.awards[0],
    [selectedAwardKey, selectedCategory],
  );

  const currentPatientName = useMemo(() => {
    return patients.find((patient) => patient.user_id === selectedPatient)?.full_name || "Paciente seleccionado";
  }, [patients, selectedPatient]);

  const awardsByCategory = useMemo(() => {
    return awards.reduce<Record<string, number>>((acc, award) => {
      acc[award.category_key] = (acc[award.category_key] || 0) + 1;
      return acc;
    }, {});
  }, [awards]);

  const unlockedCategories = useMemo(() => Object.keys(awardsByCategory).length, [awardsByCategory]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .order("full_name", { ascending: true });

      if (error) {
        toast({ title: "Error", description: "No se pudieron cargar los pacientes.", variant: "destructive" });
        return;
      }

      const filteredPatients = (data || []).filter((patient) => patient.user_id !== user?.id);
      setPatients(filteredPatients);
    };

    fetchPatients();
  }, [isAdmin, toast, user?.id]);

  useEffect(() => {
    if (!patientId) {
      setAwards([]);
      return;
    }

    const loadAwards = async () => {
      const { data, error } = await supabase
        .from(awardsTable)
        .select("*")
        .eq("patient_id", patientId)
        .order("awarded_at", { ascending: false });

      if (error) {
        toast({ title: "Error", description: "No se pudieron cargar los premios simbólicos.", variant: "destructive" });
        return;
      }

      setAwards(((data || []) as unknown) as SymbolicAwardRecord[]);
    };

    loadAwards();
  }, [patientId, toast]);

  const resetGrantForm = () => {
    setSelectedCategoryKey(AWARD_CATALOG[0].key);
    setSelectedAwardKey(AWARD_CATALOG[0].awards[0].key);
    setClinicalNote("");
  };

  const handleCategoryChange = (value: string) => {
    const nextCategory = AWARD_CATALOG.find((category) => category.key === value) ?? AWARD_CATALOG[0];
    setSelectedCategoryKey(nextCategory.key);
    setSelectedAwardKey(nextCategory.awards[0].key);
  };

  const grantAward = async () => {
    if (!selectedPatient || !user?.id || !selectedAward) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from(awardsTable).insert({
        patient_id: selectedPatient,
        granted_by: user.id,
        category_key: selectedCategory.key,
        award_key: selectedAward.key,
        award_title: selectedAward.title,
        award_description: selectedAward.description,
        therapeutic_objective: selectedCategory.title,
        clinical_note: clinicalNote.trim() || null,
      });

      if (error) throw error;

      const { data, error: reloadError } = await supabase
        .from(awardsTable)
        .select("*")
        .eq("patient_id", selectedPatient)
        .order("awarded_at", { ascending: false });

      if (reloadError) throw reloadError;

      setAwards((data || []) as SymbolicAwardRecord[]);
      setIsGrantOpen(false);
      resetGrantForm();
      toast({ title: "Premio otorgado", description: `${selectedAward.title} quedó registrado en el pasaporte terapéutico.` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo otorgar el premio.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-primary">Cargando premios simbólicos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Sistema Reflexionar · Pasaporte terapéutico
              </div>
              <CardTitle className="font-serif text-2xl md:text-3xl">Premios simbólicos</CardTitle>
              <CardDescription className="max-w-3xl text-sm md:text-base">
                Trofeos con peso semántico para validar el esfuerzo subjetivo del paciente y materializar avances que, de otro modo, podrían parecer intangibles.
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsGrantOpen(true)} disabled={!selectedPatient} className="gap-2 self-start">
                <Plus className="h-4 w-4" />
                Otorgar premio
              </Button>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{awards.length}</p>
                  <p className="text-sm text-muted-foreground">Premios otorgados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-secondary p-3 text-secondary-foreground">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{unlockedCategories}</p>
                  <p className="text-sm text-muted-foreground">Categorías activadas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-accent p-3 text-accent-foreground">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {awards[0] ? format(new Date(awards[0].awarded_at), "dd 'de' MMMM", { locale: es }) : "Sin registros"}
                  </p>
                  <p className="text-sm text-muted-foreground">Último reconocimiento</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
      </Card>

      {isAdmin && (
        <Card className="mt-6">
          <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-muted p-3 text-muted-foreground">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Seleccionar paciente</p>
                <p className="text-sm text-muted-foreground">El administrador otorga los premios simbólicos y construye el pasaporte terapéutico.</p>
              </div>
            </div>
            <div className="w-full md:max-w-sm">
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegir paciente..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.user_id} value={patient.user_id}>
                      {patient.full_name || "Paciente sin nombre"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground md:text-2xl">Pasaporte terapéutico</h1>
              <p className="text-sm text-muted-foreground">
                {isPatient ? "Tus avances simbólicos registrados por tu profesional." : selectedPatient ? `Logros registrados para ${currentPatientName}.` : "Elegí un paciente para ver sus logros registrados."}
              </p>
            </div>
            <Badge variant="outline" className="hidden md:inline-flex">
              {awards.length} hitos
            </Badge>
          </div>

          {patientId ? (
            awards.length > 0 ? (
              <div className="space-y-4">
                {awards.map((award) => {
                  const category = AWARD_CATALOG.find((item) => item.key === award.category_key);
                  return (
                    <Card key={award.id} className="border-border/70 bg-card/90 shadow-sm">
                      <CardContent className="p-5">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="secondary" className="gap-1">
                                <span>{category?.emoji || "🏆"}</span>
                                {category?.title || award.therapeutic_objective || "Premio simbólico"}
                              </Badge>
                              <Badge variant="outline">{format(new Date(award.awarded_at), "dd/MM/yyyy", { locale: es })}</Badge>
                            </div>
                            <div>
                              <h2 className="font-serif text-xl text-foreground">{award.award_title}</h2>
                              <p className="mt-1 text-sm text-muted-foreground">{award.award_description}</p>
                            </div>
                            {award.clinical_note && (
                              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
                                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Validación clínica</p>
                                <p className="mt-2 text-sm text-foreground">{award.clinical_note}</p>
                              </div>
                            )}
                          </div>
                          <div className="rounded-2xl border border-border/70 bg-muted/40 px-4 py-3 text-center md:min-w-32">
                            <p className="text-3xl">{category?.emoji || "🏆"}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">Trofeo simbólico</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="rounded-full bg-muted p-4 text-muted-foreground">
                    <Award className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">Todavía no hay premios otorgados</p>
                    <p className="max-w-md text-sm text-muted-foreground">
                      {isPatient
                        ? "Cuando tu profesional valide un avance, aparecerá aquí como parte de tu pasaporte terapéutico."
                        : "Usá el botón “Otorgar premio” para registrar un avance subjetivo significativo."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card>
              <CardContent className="flex min-h-56 items-center justify-center p-8 text-center text-muted-foreground">
                Seleccioná un paciente para habilitar la sesión de premios simbólicos.
              </CardContent>
            </Card>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-foreground">Catálogo terapéutico</h2>
            <p className="text-sm text-muted-foreground">Insignias y trofeos narrativos para reforzar cambio, constancia y sentido clínico.</p>
          </div>

          <div className="space-y-3">
            {AWARD_CATALOG.map((category) => (
              <Card key={category.key} className="border-border/70">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <span className="text-xl">{category.emoji}</span>
                        {category.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-sm">{category.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{category.awards.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.awards.map((award) => (
                      <div key={award.key} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                        <p className="text-sm font-medium text-foreground">{award.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{award.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Dialog
        open={isGrantOpen}
        onOpenChange={(open) => {
          setIsGrantOpen(open);
          if (!open) resetGrantForm();
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Otorgar premio simbólico</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Paciente</p>
              <p className="mt-1 font-medium text-foreground">{currentPatientName}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Categoría terapéutica</Label>
                <Select value={selectedCategoryKey} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AWARD_CATALOG.map((category) => (
                      <SelectItem key={category.key} value={category.key}>
                        {category.emoji} {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Premio</Label>
                <Select value={selectedAwardKey} onValueChange={setSelectedAwardKey}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.awards.map((award) => (
                      <SelectItem key={award.key} value={award.key}>
                        {award.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Validación clínica opcional</Label>
              <Textarea
                value={clinicalNote}
                onChange={(event) => setClinicalNote(event.target.value)}
                placeholder="Ej: Hoy pudo hablar de un tema evitado sin borrarse ni irse del vínculo."
                rows={4}
              />
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Vista previa del reconocimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="secondary" className="gap-1">
                  <span>{selectedCategory.emoji}</span>
                  {selectedCategory.title}
                </Badge>
                <div>
                  <p className="font-serif text-xl text-foreground">{selectedAward.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedAward.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGrantOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={grantAward} disabled={isSaving}>
              {isSaving ? "Otorgando..." : "Confirmar premio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
