import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, Pencil, Scale, Calendar } from "lucide-react";
import type { ConsentModelMeta } from "@/lib/consentTemplates";

interface Props {
  model: ConsentModelMeta;
  trigger?: React.ReactNode;
}

export function ConsentDetailDrawer({ model, trigger }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Info className="mr-1.5 h-4 w-4" />
            Ver detalle
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="space-y-2 text-left">
          <Badge variant="outline" className="w-fit">
            {model.code}
          </Badge>
          <SheetTitle className="text-xl">{model.title}</SheetTitle>
          <SheetDescription>{model.description}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="includes" className="mt-5">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="includes" className="text-xs">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Incluye
            </TabsTrigger>
            <TabsTrigger value="adapt" className="text-xs">
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Adaptarlo
            </TabsTrigger>
            <TabsTrigger value="when" className="text-xs">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Cuándo
            </TabsTrigger>
            <TabsTrigger value="legal" className="text-xs">
              <Scale className="mr-1 h-3.5 w-3.5" />
              Marco
            </TabsTrigger>
          </TabsList>

          <TabsContent value="includes" className="mt-4 space-y-3">
            <h3 className="text-sm font-semibold">¿Qué incluye este modelo?</h3>
            <ul className="space-y-2">
              {model.includes.map((item, i) => (
                <li key={i} className="flex gap-2 rounded-md bg-muted/40 p-2.5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="adapt" className="mt-4 space-y-3">
            <h3 className="text-sm font-semibold">Cómo adaptarlo a tu práctica</h3>
            <ul className="space-y-2">
              {model.adaptationTips.map((item, i) => (
                <li key={i} className="flex gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-2.5 text-sm">
                  <Pencil className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-md border border-amber-300/60 bg-amber-50 dark:border-amber-800/60 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200">
              <strong>Recordá:</strong> el documento descargado es un <em>modelo</em> editable. Cada
              profesional debe adaptarlo a sus datos personales, su criterio clínico y los
              honorarios que correspondan al arancel ético de su Colegio de Psicólogos.
            </p>
          </TabsContent>

          <TabsContent value="when" className="mt-4 space-y-3">
            <h3 className="text-sm font-semibold">¿Cuándo corresponde usarlo?</h3>
            <ul className="space-y-2">
              {model.whenToUse.map((item, i) => (
                <li key={i} className="flex gap-2 rounded-md bg-muted/40 p-2.5 text-sm">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="legal" className="mt-4 space-y-3">
            <h3 className="text-sm font-semibold">Marco normativo aplicable</h3>
            <ul className="space-y-1.5">
              {model.legalFrame.map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                  <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
