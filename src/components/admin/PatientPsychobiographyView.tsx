import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  User, 
  Users, 
  Stethoscope, 
  Brain, 
  Briefcase, 
  Heart, 
  Star,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Psychobiography = Tables<"psychobiographies">;

interface PatientPsychobiographyViewProps {
  userId: string;
  patientName?: string;
}

export function PatientPsychobiographyView({ userId }: PatientPsychobiographyViewProps) {
  const [data, setData] = useState<Psychobiography | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPsychobiography();
  }, [userId]);

  const fetchPsychobiography = async () => {
    try {
      setIsLoading(true);
      const { data: psycho, error } = await supabase
        .from("psychobiographies")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      setData(psycho);
    } catch (error) {
      console.error("Error fetching psychobiography:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (): number => {
    if (!data) return 0;

    const sections = [
      !!(data.birth_date || data.birth_place || data.nationality || data.address || data.education_level || data.occupation || data.marital_status),
      !!(data.family_data && Object.keys(data.family_data as object).length > 0),
      !!(data.medical_history && Object.keys(data.medical_history as object).length > 0),
      !!(data.psychological_history && Object.keys(data.psychological_history as object).length > 0),
      !!(data.social_data && Object.keys(data.social_data as object).length > 0) ||
        !!(data.work_history && (data.work_history as unknown[]).length > 0),
      !!(data.lifestyle_data && Object.keys(data.lifestyle_data as object).length > 0),
      !!(data.traumatic_events && (data.traumatic_events as unknown[]).length > 0) ||
        !!(data.legal_history && Object.keys(data.legal_history as object).length > 0) ||
        !!(data.personal_values && Object.keys(data.personal_values as object).length > 0),
    ];

    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (Array.isArray(value)) {
      if (value.length === 0) return "—";
      return value.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ");
    }
    return String(value);
  };

  const renderKeyValue = (label: string, value: unknown) => {
    const displayValue = formatValue(value);
    if (displayValue === "—") return null;
    return (
      <div key={label} className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{displayValue}</span>
      </div>
    );
  };

  const renderJsonSection = (title: string, data: unknown, keyLabels?: Record<string, string>) => {
    if (!data || (typeof data === "object" && Object.keys(data as object).length === 0)) {
      return null;
    }

    const obj = data as Record<string, unknown>;
    return (
      <div className="space-y-1">
        {Object.entries(obj).map(([key, value]) => {
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            return (
              <div key={key} className="pl-2 border-l-2 border-primary/20 mt-2">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                  {keyLabels?.[key] || key}
                </p>
                {Object.entries(value as Record<string, unknown>).map(([subKey, subValue]) =>
                  renderKeyValue(keyLabels?.[subKey] || subKey, subValue)
                )}
              </div>
            );
          }
          return renderKeyValue(keyLabels?.[key] || key, value);
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontró psicobiografía para este paciente
      </div>
    );
  }

  const progress = calculateProgress();

  const sections = [
    {
      id: "personal",
      title: "Datos Personales",
      icon: User,
      content: (
        <div className="space-y-1">
          {renderKeyValue("Fecha de nacimiento", data.birth_date ? format(new Date(data.birth_date), "d 'de' MMMM, yyyy", { locale: es }) : null)}
          {renderKeyValue("Lugar de nacimiento", data.birth_place)}
          {renderKeyValue("Nacionalidad", data.nationality)}
          {renderKeyValue("Dirección", data.address)}
          {renderKeyValue("Nivel educativo", data.education_level)}
          {renderKeyValue("Ocupación", data.occupation)}
          {renderKeyValue("Estado civil", data.marital_status)}
        </div>
      ),
    },
    {
      id: "family",
      title: "Familia",
      icon: Users,
      content: renderJsonSection("Familia", data.family_data, {
        parents: "Padres",
        father: "Padre",
        mother: "Madre",
        name: "Nombre",
        age: "Edad",
        occupation: "Ocupación",
        relationship: "Relación",
        alive: "Vive",
        siblings: "Hermanos",
        children: "Hijos",
        familyDynamics: "Dinámica familiar",
        significantRelationships: "Relaciones significativas",
      }),
    },
    {
      id: "medical",
      title: "Historia Médica",
      icon: Stethoscope,
      content: renderJsonSection("Historia Médica", data.medical_history, {
        currentConditions: "Condiciones actuales",
        pastConditions: "Condiciones pasadas",
        medications: "Medicamentos",
        allergies: "Alergias",
        surgeries: "Cirugías",
        familyMedicalHistory: "Historia médica familiar",
        name: "Nombre",
        dose: "Dosis",
        frequency: "Frecuencia",
      }),
    },
    {
      id: "psychological",
      title: "Historia Psicológica",
      icon: Brain,
      content: renderJsonSection("Historia Psicológica", data.psychological_history, {
        previousTherapy: "Terapia previa",
        therapyDetails: "Detalles de terapia",
        diagnoses: "Diagnósticos",
        hospitalizations: "Hospitalizaciones",
        currentSymptoms: "Síntomas actuales",
        copingMechanisms: "Mecanismos de afrontamiento",
      }),
    },
    {
      id: "social",
      title: "Social y Laboral",
      icon: Briefcase,
      content: (
        <>
          {renderJsonSection("Social", data.social_data, {
            socialNetwork: "Red social",
            friendships: "Amistades",
            communityInvolvement: "Participación comunitaria",
            hobbies: "Hobbies",
            spirituality: "Espiritualidad",
          })}
          {data.work_history && Array.isArray(data.work_history) && (data.work_history as unknown[]).length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Historial Laboral
              </p>
              {(data.work_history as Array<Record<string, unknown>>).map((job, index) => (
                <div key={index} className="pl-2 border-l-2 border-primary/20 mb-2">
                  {renderKeyValue("Puesto", job.title)}
                  {renderKeyValue("Empresa", job.company)}
                  {renderKeyValue("Duración", job.duration)}
                </div>
              ))}
            </div>
          )}
        </>
      ),
    },
    {
      id: "lifestyle",
      title: "Estilo de Vida",
      icon: Heart,
      content: renderJsonSection("Estilo de Vida", data.lifestyle_data, {
        sleepPattern: "Patrón de sueño",
        exercise: "Ejercicio",
        diet: "Dieta",
        substanceUse: "Uso de sustancias",
        alcohol: "Alcohol",
        tobacco: "Tabaco",
        drugs: "Drogas",
        caffeine: "Cafeína",
        stressLevel: "Nivel de estrés",
        relaxationMethods: "Métodos de relajación",
      }),
    },
    {
      id: "events",
      title: "Eventos y Valores",
      icon: Star,
      content: (
        <>
          {data.traumatic_events && Array.isArray(data.traumatic_events) && (data.traumatic_events as unknown[]).length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
                Eventos Traumáticos
              </p>
              {(data.traumatic_events as Array<Record<string, unknown>>).map((event, index) => (
                <div key={index} className="pl-2 border-l-2 border-destructive/30 mb-2">
                  {renderKeyValue("Descripción", event.description)}
                  {renderKeyValue("Edad", event.age)}
                  {renderKeyValue("Impacto", event.impact)}
                  {renderKeyValue("Resuelto", event.resolved)}
                </div>
              ))}
            </div>
          )}
          {renderJsonSection("Historia Legal", data.legal_history, {
            hasLegalIssues: "Tiene problemas legales",
            details: "Detalles",
            currentStatus: "Estado actual",
          })}
          {renderJsonSection("Valores Personales", data.personal_values, {
            coreValues: "Valores fundamentales",
            lifeGoals: "Metas de vida",
            fears: "Miedos",
            strengths: "Fortalezas",
            areasToImprove: "Áreas a mejorar",
            motivations: "Motivaciones",
          })}
        </>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Card */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progreso</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              {progress === 100 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {progress}% completado
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="mt-2 text-xs text-muted-foreground">
            Última actualización: {format(new Date(data.updated_at), "d MMM yyyy, HH:mm", { locale: es })}
          </p>
        </CardContent>
      </Card>

      {/* Sections Accordion */}
      <Accordion type="multiple" className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const hasContent = section.content !== null;
          
          return (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{section.title}</span>
                  {hasContent ? (
                    <Badge variant="secondary" className="text-xs">Completado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">Pendiente</Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                {hasContent ? (
                  section.content
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    El paciente aún no ha completado esta sección
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
