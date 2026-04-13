import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Quote, Users, Lightbulb, Save, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useDemoMode } from "@/hooks/useDemoMode";
import type { HumanisticSection, ExerciseField, SectionExercise } from "@/data/humanisticContent";

interface SchoolSectionRendererProps {
  section: HumanisticSection;
}

function ExerciseFieldRenderer({ field, value, onChange }: {
  field: ExerciseField;
  value: string | string[] | number;
  onChange: (val: string | string[] | number) => void;
}) {
  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Textarea
            placeholder={field.placeholder}
            value={value as string}
            onChange={e => onChange(e.target.value)}
            className="min-h-[80px] resize-y"
          />
        </div>
      );
    case 'text':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Input
            placeholder={field.placeholder}
            value={value as string}
            onChange={e => onChange(e.target.value)}
          />
        </div>
      );
    case 'scale':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="flex items-center gap-3">
            {field.scaleMinLabel && <span className="text-xs text-muted-foreground whitespace-nowrap">{field.scaleMinLabel}</span>}
            <Slider
              min={field.scaleMin ?? 1}
              max={field.scaleMax ?? 10}
              step={1}
              value={[typeof value === 'number' ? value : (field.scaleMin ?? 1)]}
              onValueChange={([v]) => onChange(v)}
              className="flex-1"
            />
            {field.scaleMaxLabel && <span className="text-xs text-muted-foreground whitespace-nowrap">{field.scaleMaxLabel}</span>}
            <Badge variant="secondary" className="ml-1 min-w-[2rem] justify-center">{typeof value === 'number' ? value : (field.scaleMin ?? 1)}</Badge>
          </div>
        </div>
      );
    case 'radio':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <RadioGroup value={value as string} onValueChange={v => onChange(v)}>
            {field.options?.map(opt => (
              <div key={opt} className="flex items-start gap-2">
                <RadioGroupItem value={opt} id={`${field.id}-${opt}`} className="mt-0.5" />
                <Label htmlFor={`${field.id}-${opt}`} className="text-sm font-normal leading-snug cursor-pointer">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    case 'checkbox':
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{field.label}</Label>
          <div className="space-y-1.5">
            {field.options?.map(opt => {
              const checked = Array.isArray(value) && value.includes(opt);
              return (
                <div key={opt} className="flex items-start gap-2">
                  <Checkbox
                    id={`${field.id}-${opt}`}
                    checked={checked}
                    onCheckedChange={(c) => {
                      const arr = Array.isArray(value) ? [...value] : [];
                      if (c) arr.push(opt); else arr.splice(arr.indexOf(opt), 1);
                      onChange(arr);
                    }}
                    className="mt-0.5"
                  />
                  <Label htmlFor={`${field.id}-${opt}`} className="text-sm font-normal leading-snug cursor-pointer">{opt}</Label>
                </div>
              );
            })}
          </div>
        </div>
      );
    case 'select':
      return (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">{field.label}</Label>
          <Select value={value as string} onValueChange={v => onChange(v)}>
            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
            <SelectContent>
              {field.options?.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    default:
      return null;
  }
}

function ExerciseCard({ exercise, demoMode }: { exercise: SectionExercise; demoMode: boolean }) {
  const [formData, setFormData] = useState<Record<string, string | string[] | number>>({});

  const updateField = (fieldId: string, val: string | string[] | number) => {
    setFormData(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleSave = () => {
    if (demoMode) {
      toast.info("Modo demo: los datos no se guardan", { description: "Registrate para guardar tu trabajo." });
      return;
    }
    toast.success("Registro guardado");
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-primary" />
          {exercise.title}
        </CardTitle>
        <CardDescription className="text-sm italic">{exercise.instruction}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercise.fields.map(field => (
          <ExerciseFieldRenderer
            key={field.id}
            field={field}
            value={formData[field.id] ?? (field.type === 'checkbox' ? [] : field.type === 'scale' ? (field.scaleMin ?? 1) : '')}
            onChange={val => updateField(field.id, val)}
          />
        ))}
        <Button onClick={handleSave} className="w-full mt-2" size="sm">
          <Save className="h-4 w-4 mr-2" /> Guardar registro
        </Button>
      </CardContent>
    </Card>
  );
}

export default function SchoolSectionRenderer({ section }: SchoolSectionRendererProps) {
  const { isDemoMode } = useDemoMode();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-2 py-4 md:px-4">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">{section.title}</h1>
        <p className="text-muted-foreground">{section.subtitle}</p>
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 border border-border/40">
          <Quote className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm italic text-muted-foreground">
            "{section.quote}" — <span className="font-medium">{section.quoteAuthor}</span>
          </p>
        </div>
      </div>

      {/* Theoretical summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Marco teórico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{section.theoreticalSummary}</p>
        </CardContent>
      </Card>

      {/* Authors */}
      <Accordion type="single" collapsible>
        <AccordionItem value="authors">
          <AccordionTrigger className="text-sm font-medium">
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Autores de referencia ({section.authors.length})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 pt-2">
              {section.authors.map(author => (
                <div key={author.name} className="rounded-md border border-border/50 p-3 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm">{author.name}</span>
                    <span className="text-xs text-muted-foreground">{author.years}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{author.bio}</p>
                  <div className="flex flex-wrap gap-1">
                    {author.keyContributions.map(c => (
                      <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Exercises */}
      {section.exercises.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Ejercicios clínicos
          </h2>
          {section.exercises.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} demoMode={isDemoMode} />
          ))}
        </div>
      )}
    </div>
  );
}
