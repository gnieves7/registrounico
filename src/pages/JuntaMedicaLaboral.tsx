import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Download, FileText, Clock, FileCheck, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  file_url: string | null;
  created_at: string;
}

const JuntaMedicaLaboral = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Personal data fields for the certificate
  const [personalData, setPersonalData] = useState({
    fullName: "",
    dni: "",
    workplace: "",
    juntaDate: "",
    licenseStartDate: "",
  });

  useEffect(() => {
    if (user) fetchDocuments();
    if (profile?.full_name) {
      setPersonalData((prev) => ({ ...prev, fullName: profile.full_name || "" }));
    }
  }, [user, profile]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, description, document_type, file_url, created_at")
        .eq("patient_id", user.id)
        .eq("document_type", "junta_medica_laboral")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({ title: "Error", description: "No se pudieron cargar los documentos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.file_url) return;
    setDownloadingId(doc.id);
    try {
      const { data, error } = await supabase.storage.from("documents").download(doc.file_url);
      if (error) throw error;
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.title + ".pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Descarga exitosa", description: `"${doc.title}" se descargó correctamente` });
      }
    } catch (error) {
      console.error("Error downloading:", error);
      toast({ title: "Error", description: "No se pudo descargar el documento", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-2 md:gap-3">
          <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
            Junta Médica Laboral
          </h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Informes y planillas para presentar ante la junta médica laboral
        </p>
      </div>

      {/* Datos personales del paciente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            Datos personales para la junta
          </CardTitle>
          <CardDescription>
            Completá tus datos antes de descargar el certificado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre y Apellido</Label>
              <Input
                id="fullName"
                value={personalData.fullName}
                onChange={(e) => setPersonalData((p) => ({ ...p, fullName: e.target.value }))}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI / LE / LC / CI</Label>
              <Input
                id="dni"
                value={personalData.dni}
                onChange={(e) => setPersonalData((p) => ({ ...p, dni: e.target.value }))}
                placeholder="Nº de documento"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="workplace">Lugar de trabajo</Label>
            <Input
              id="workplace"
              value={personalData.workplace}
              onChange={(e) => setPersonalData((p) => ({ ...p, workplace: e.target.value }))}
              placeholder="Empresa / Institución"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="juntaDate">Fecha de junta médica</Label>
              <Input
                id="juntaDate"
                type="date"
                value={personalData.juntaDate}
                onChange={(e) => setPersonalData((p) => ({ ...p, juntaDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="licenseStartDate">Fecha de inicio de licencia médica</Label>
              <Input
                id="licenseStartDate"
                type="date"
                value={personalData.licenseStartDate}
                onChange={(e) => setPersonalData((p) => ({ ...p, licenseStartDate: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificado descargable */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Certificado Exclusivo Junta Médica
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Descargá el certificado médico con carácter de declaración jurada
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href="/documents/certificado-junta-medica.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Descargar certificado
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Informes del administrador */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Informes del profesional</h2>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground">No hay informes disponibles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando tu profesional suba un informe para la junta médica, aparecerá aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                    {doc.description && <CardDescription className="mt-1">{doc.description}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(doc.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  {doc.file_url ? (
                    <Button onClick={() => handleDownload(doc)} variant="outline" className="self-start" disabled={downloadingId === doc.id}>
                      {downloadingId === doc.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                      Descargar informe
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Informe pendiente de carga.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JuntaMedicaLaboral;
