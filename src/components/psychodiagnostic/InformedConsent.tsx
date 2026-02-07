import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCheck, AlertTriangle } from "lucide-react";

interface InformedConsentProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  testName: string;
}

export function InformedConsent({ open, onAccept, onDecline, testName }: InformedConsentProps) {
  const [accepted, setAccepted] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const handleAccept = () => {
    if (accepted && understood) {
      onAccept();
    }
  };

  const canProceed = accepted && understood;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Consentimiento Informado
          </DialogTitle>
          <DialogDescription>
            Para el proceso psicodiagnóstico - {testName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 text-sm">
            <p>
              El/la que suscribe brinda su consentimiento, aceptando y declarando 
              voluntariamente que recibió y comprendió información clara respecto 
              a los siguientes aspectos que conforman la evaluación, a saber:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>
                El proceso será responsabilidad del Sr. Germán Nieves, Licenciado en 
                Psicología con Matrícula N.º 1889, F.89. L11, habilitado para el ejercicio 
                de la profesión según Ley Provincial N° 12.818 -CPAC- afiliado N° 65.849/00.
              </li>
              <li>
                La metodología de la evaluación, sus etapas y la aplicación de técnicas 
                gráficas y/o proyectivas, las cuales fueron científicamente validadas.
              </li>
              <li>
                El rol del psicólogo en calidad de evaluador, sus competencias específicas
                <sup>1</sup>, el alcance profesional, su obligación de guardar secreto 
                profesional<sup>2</sup> y el resguardo de los protocolos originales<sup>3</sup>, 
                según lo establecido por el Código de Ética de Psicodiagnosticador.
              </li>
              <li>
                El uso ético de los test y su adecuada utilización, según las Pautas 
                Internacionales para el uso de los Test<sup>4</sup>.
              </li>
              <li>
                Los honorarios no podrá ser menor al equivalente a siete (7) sesiones 
                de terapia y su valor estará sujeto al arancel ético vigente establecido 
                por el Colegio de Psicólogos (1º Circunscripción).
              </li>
            </ul>

            <p className="mt-4">
              La persona evaluada admite que aportará información veraz en un lenguaje 
              claro y responderá todas las preguntas y/o tareas que surjan en la evaluación, 
              asimismo se compromete a comunicar cualquier situación (personal, social, 
              emocional, traumática, familiar y/o jurídica) que considere relevante aun 
              sabiendo que podría influir en los resultados de la evaluación.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg mt-4">
              <p className="text-xs text-muted-foreground">
                <sup>1</sup> Código de Ética del Psicodiagnosticador. Art. 1º, 2º, 6º, 8º, 9º
              </p>
              <p className="text-xs text-muted-foreground">
                <sup>2</sup> Art. 3º
              </p>
              <p className="text-xs text-muted-foreground">
                <sup>3</sup> Art. 10º
              </p>
              <p className="text-xs text-muted-foreground">
                <sup>4</sup> Versión argentina. Traducción y adaptación autorizada por la 
                Asociación Argentina de Estudio e Investigación en Psicodiagnóstico (Adeip)
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="understood"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
            />
            <Label htmlFor="understood" className="text-sm leading-relaxed">
              He leído y comprendido la información proporcionada sobre el proceso 
              de evaluación psicodiagnóstica.
            </Label>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="accepted"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked === true)}
            />
            <Label htmlFor="accepted" className="text-sm leading-relaxed">
              Acepto voluntariamente participar en este proceso de evaluación y 
              autorizo al profesional a realizar las pruebas correspondientes.
            </Label>
          </div>

          {!canProceed && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>Debe aceptar ambas condiciones para continuar.</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onDecline}>
            No acepto
          </Button>
          <Button onClick={handleAccept} disabled={!canProceed}>
            Acepto y continúo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
