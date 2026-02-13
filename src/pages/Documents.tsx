import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Clock, FileCheck, Key, CreditCard, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DownloadCodeInput } from "@/components/documents/DownloadCodeInput";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  file_url: string | null;
  created_at: string;
  price: number;
  is_paid: boolean;
  download_code: string | null;
}

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [codeDialogDoc, setCodeDialogDoc] = useState<Document | null>(null);
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
        .from("documents")
        .select("id, title, description, document_type, file_url, created_at, price, is_paid, download_code")
        .eq("patient_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
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

  const handleDownload = async (document: Document) => {
    if (!document.file_url) return;
    setDownloadingId(document.id);
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .createSignedUrl(document.file_url, 3600);

      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
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
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          Mis Documentos
        </h1>
        <p className="mt-1 text-muted-foreground">
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
          {documents.map(doc => {
            const needsPayment = doc.price > 0 && !doc.is_paid;
            const canDownload = doc.file_url && (doc.price === 0 || doc.is_paid);

            return (
              <Card key={doc.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(doc.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                      </span>
                      {doc.price > 0 && (
                        <span className="font-medium text-foreground ml-2">
                          ${doc.price.toLocaleString("es-AR")}
                        </span>
                      )}
                    </div>

                    {/* Payment info for unpaid documents */}
                    {needsPayment && (
                      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <CreditCard className="h-4 w-4 text-primary" />
                          Datos para abonar
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Alias:</strong> psi.german.nieves</p>
                          <p><strong>CVU:</strong> 0000003100037023075926</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Una vez confirmado el pago, tu terapeuta te enviará el código de descarga.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCodeDialogDoc(doc)}
                          className="gap-2"
                        >
                          <Key className="h-4 w-4" />
                          Tengo el código de descarga
                        </Button>
                      </div>
                    )}

                    {/* Download button for paid/free documents */}
                    {canDownload && (
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
                    )}

                    {/* Waiting for file upload */}
                    {!doc.file_url && (
                      <p className="text-sm text-muted-foreground italic">
                        Documento pendiente de carga por tu terapeuta.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card className="mt-6 border-muted bg-muted/30">
        <CardContent className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Los documentos son subidos por tu terapeuta. Para cualquier consulta, contactalo directamente.
          </p>
        </CardContent>
      </Card>

      {/* Download Code Dialog */}
      {codeDialogDoc && (
        <DownloadCodeInput
          open={!!codeDialogDoc}
          onOpenChange={(open) => !open && setCodeDialogDoc(null)}
          document={codeDialogDoc}
          onSuccess={fetchDocuments}
        />
      )}
    </div>
  );
};

export default Documents;
