import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Clock, FileCheck, Loader2 } from "lucide-react";
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

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("documents_patient_view" as any)
        .select("id, title, description, document_type, file_url, created_at")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments((data as unknown as Document[]) || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.file_url) return;
    setDownloadingId(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(doc.file_url);

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
        toast({
          title: "Descarga exitosa",
          description: `"${doc.title}" se descargó correctamente`,
        });
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "No se pudo descargar el documento",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
          Mis Documentos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Constancias e informes disponibles para descarga
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground">No tienes documentos disponibles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando tu terapeuta suba constancias o informes, aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                    {doc.description && (
                      <CardDescription className="mt-1">
                        {doc.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {format(new Date(doc.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                  </div>

                  {doc.file_url ? (
                    <Button
                      onClick={() => handleDownload(doc)}
                      variant="outline"
                      className="shrink-0 self-start"
                      disabled={downloadingId === doc.id}
                    >
                      {downloadingId === doc.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="mr-2 h-4 w-4" />
                      )}
                      Descargar PDF
                    </Button>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Documento pendiente de carga por tu terapeuta.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-6 border-muted bg-muted/30">
        <CardContent className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Los documentos son subidos por tu terapeuta. Para cualquier consulta, contactalo directamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;