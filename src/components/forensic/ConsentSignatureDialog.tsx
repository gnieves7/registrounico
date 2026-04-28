import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eraser, FileSignature, FileText, Loader2, Save } from "lucide-react";
import type { ConsentModelMeta } from "@/lib/consentTemplates";
import {
  buildConsentDocxBlob,
  downloadBlob,
  type PatientData,
  type ProfessionalData,
} from "@/lib/consentDocxGenerator";
import { buildConsentPdfBlob } from "@/lib/consentPdfGenerator";

interface Props {
  model: ConsentModelMeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProfessional?: Partial<ProfessionalData>;
}

const empty: ProfessionalData = {
  fullName: "",
  matriculaNacional: "",
  matriculaProvincial: "",
  specialty: "",
  address: "",
  phone: "",
  email: "",
  honorarios: "",
};

const emptyPatient: PatientData = {
  fullName: "",
  dni: "",
  birthDate: "",
  address: "",
};

export function ConsentSignatureDialog({
  model,
  open,
  onOpenChange,
  defaultProfessional,
}: Props) {
  const [prof, setProf] = useState<ProfessionalData>({ ...empty, ...defaultProfessional });
  const [patient, setPatient] = useState<PatientData>(emptyPatient);
  const [busy, setBusy] = useState(false);
  const sigRef = useRef<SignatureCanvas>(null);

  if (!model) return null;

  const handleClearSignature = () => sigRef.current?.clear();

  const getSignatureDataUrl = (): string | undefined => {
    const ref = sigRef.current;
    if (!ref || ref.isEmpty()) return undefined;
    return ref.getCanvas().toDataURL("image/png");
  };

  const validate = (): boolean => {
    if (!prof.fullName.trim()) {
      toast.error("Ingresá el nombre y apellido del/la profesional");
      return false;
    }
    return true;
  };

  const handleDownloadDocx = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const blob = await buildConsentDocxBlob(model, prof, patient);
      downloadBlob(blob, `${model.code}_${prof.fullName.replace(/\s+/g, "_") || "profesional"}.docx`);
      toast.success("DOCX pre-llenado descargado");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar el DOCX");
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const signatureDataUrl = getSignatureDataUrl();
      const blob = buildConsentPdfBlob({
        model,
        professional: prof,
        patient,
        signatureDataUrl,
      });
      const fname = `${model.code}_${prof.fullName.replace(/\s+/g, "_") || "profesional"}${
        signatureDataUrl ? "_firmado" : ""
      }.pdf`;
      downloadBlob(blob, fname);
      toast.success(signatureDataUrl ? "PDF firmado descargado" : "PDF descargado");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar el PDF");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            Pre-llenar y descargar — {model.code}
          </DialogTitle>
          <DialogDescription>
            Completá tus datos profesionales y los del/la consultante. Podés descargar el modelo
            como DOCX editable o como PDF (con firma digital opcional).
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="prof" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prof">Profesional</TabsTrigger>
            <TabsTrigger value="patient">Consultante</TabsTrigger>
            <TabsTrigger value="sign">Firma</TabsTrigger>
          </TabsList>

          <TabsContent value="prof" className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Nombre y apellido *</Label>
                <Input
                  value={prof.fullName}
                  onChange={(e) => setProf({ ...prof, fullName: e.target.value })}
                  placeholder="Lic. ..."
                />
              </div>
              <div>
                <Label>Matrícula Nacional</Label>
                <Input
                  value={prof.matriculaNacional}
                  onChange={(e) => setProf({ ...prof, matriculaNacional: e.target.value })}
                />
              </div>
              <div>
                <Label>Matrícula Provincial</Label>
                <Input
                  value={prof.matriculaProvincial}
                  onChange={(e) => setProf({ ...prof, matriculaProvincial: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Especialidad</Label>
                <Input
                  value={prof.specialty}
                  onChange={(e) => setProf({ ...prof, specialty: e.target.value })}
                  placeholder="Psicología clínica / forense / ..."
                />
              </div>
              <div className="md:col-span-2">
                <Label>Domicilio profesional</Label>
                <Input
                  value={prof.address}
                  onChange={(e) => setProf({ ...prof, address: e.target.value })}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={prof.phone}
                  onChange={(e) => setProf({ ...prof, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={prof.email}
                  onChange={(e) => setProf({ ...prof, email: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Honorarios por sesión (sin $)</Label>
                <Input
                  value={prof.honorarios}
                  onChange={(e) => setProf({ ...prof, honorarios: e.target.value })}
                  placeholder="Ej. 25.000"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patient" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Los datos del/la consultante son opcionales: si los dejás vacíos, el modelo se
              descargará con espacios para completar a mano.
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <Label>Nombre y apellido</Label>
                <Input
                  value={patient.fullName}
                  onChange={(e) => setPatient({ ...patient, fullName: e.target.value })}
                />
              </div>
              <div>
                <Label>DNI</Label>
                <Input
                  value={patient.dni}
                  onChange={(e) => setPatient({ ...patient, dni: e.target.value })}
                />
              </div>
              <div>
                <Label>Fecha de nacimiento</Label>
                <Input
                  type="date"
                  value={patient.birthDate}
                  onChange={(e) => setPatient({ ...patient, birthDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label>Domicilio</Label>
                <Input
                  value={patient.address}
                  onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sign" className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Dibujá tu firma con el mouse o el dedo. Se incrustará como imagen en el PDF
              descargado. Si no firmás, el PDF se entregará con espacio para firma manuscrita.
            </p>
            <div className="rounded-lg border bg-background">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                  className: "w-full h-48 rounded-lg",
                  style: { touchAction: "none" },
                }}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleClearSignature} type="button">
              <Eraser className="mr-1.5 h-4 w-4" /> Limpiar firma
            </Button>
            <p className="rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground">
              <strong>Aclaración:</strong> esta firma digital tiene valor de constancia visual.
              Para uso pericial o judicial estricto, recomendamos firma ológrafa o firma digital
              certificada (Ley 25.506).
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleDownloadDocx} disabled={busy}>
            {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileText className="mr-1.5 h-4 w-4" />}
            DOCX editable
          </Button>
          <Button onClick={handleDownloadPdf} disabled={busy}>
            {busy ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FileSignature className="mr-1.5 h-4 w-4" />}
            PDF {sigRef.current && !sigRef.current.isEmpty() ? "firmado" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
