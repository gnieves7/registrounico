import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, 
  Users, 
  Stethoscope, 
  Brain, 
  Briefcase, 
  Heart, 
  Star,
  FileText,
  CheckCircle2
} from "lucide-react";
import { usePsychobiography } from "@/hooks/usePsychobiography";
import { PersonalDataSection } from "@/components/psychobiography/PersonalDataSection";
import { FamilySection } from "@/components/psychobiography/FamilySection";
import { MedicalHistorySection } from "@/components/psychobiography/MedicalHistorySection";
import { PsychologicalHistorySection } from "@/components/psychobiography/PsychologicalHistorySection";
import { SocialWorkSection } from "@/components/psychobiography/SocialWorkSection";
import { LifestyleSection } from "@/components/psychobiography/LifestyleSection";
import { SignificantEventsSection } from "@/components/psychobiography/SignificantEventsSection";

const sections = [
  { id: "personal", label: "Datos Personales", icon: User },
  { id: "family", label: "Familia", icon: Users },
  { id: "medical", label: "Historia Médica", icon: Stethoscope },
  { id: "psychological", label: "Historia Psicológica", icon: Brain },
  { id: "social-work", label: "Social y Laboral", icon: Briefcase },
  { id: "lifestyle", label: "Estilo de Vida", icon: Heart },
  { id: "events", label: "Eventos y Valores", icon: Star },
];

export default function Psychobiography() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data, isLoading, isSaving, updateSection, calculateProgress } = usePsychobiography();

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Mi Psicobiografía</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Tu historia personal es única. Completa esta información a tu propio ritmo. 
          Todo lo que compartas es confidencial y nos ayudará a brindarte mejor atención.
        </p>
        
        {/* Progress */}
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
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto gap-2 bg-transparent p-0">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="personal">
          <PersonalDataSection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="family">
          <FamilySection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="medical">
          <MedicalHistorySection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="psychological">
          <PsychologicalHistorySection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="social-work">
          <SocialWorkSection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="lifestyle">
          <LifestyleSection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>

        <TabsContent value="events">
          <SignificantEventsSection data={data} onSave={updateSection} isSaving={isSaving} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
