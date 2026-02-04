import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  FileClock,
  CreditCard,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  file_url: string | null;
  price: number;
  is_paid: boolean | null;
  payment_date: string | null;
  created_at: string;
}

const Documents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  // Handle payment result from redirect
  useEffect(() => {
    const paymentResult = searchParams.get("payment");
    if (paymentResult === "success") {
      toast({
        title: "¡Pago exitoso!",
        description: "Tu documento estará disponible para descargar en breve.",
      });
      // Refresh documents to get updated payment status
      if (user) {
        fetchDocuments();
      }
    } else if (paymentResult === "failure") {
      toast({
        title: "Pago no completado",
        description: "El pago no pudo procesarse. Intenta nuevamente.",
        variant: "destructive",
      });
    } else if (paymentResult === "pending") {
      toast({
        title: "Pago pendiente",
        description: "Tu pago está siendo procesado. Te notificaremos cuando se confirme.",
      });
    }
  }, [searchParams]);

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
        .select("*")
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
    if (!document.file_url) {
      toast({
        title: "No disponible",
        description: "El archivo aún no está disponible para descargar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get public URL or signed URL from storage
      const { data } = supabase.storage
        .from("documents")
        .getPublicUrl(document.file_url);

      if (data?.publicUrl) {
        window.open(data.publicUrl, "_blank");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "No se pudo descargar el documento",
        variant: "destructive",
      });
    }
  };

  const handleRequestPayment = async (document: Document) => {
    setProcessingPayment(document.id);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para realizar un pago",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke("mercadopago-create-preference", {
        body: { document_id: document.id },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { init_point } = response.data;
      
      if (init_point) {
        // Redirect to MercadoPago checkout
        window.location.href = init_point;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar la solicitud de pago. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "constancia":
        return <FileCheck className="h-5 w-5" />;
      case "informe":
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getDocumentTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "constancia":
        return <Badge variant="secondary">Constancia</Badge>;
      case "informe":
        return <Badge variant="outline">Informe</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const paidDocuments = documents.filter(d => d.is_paid);
  const pendingDocuments = documents.filter(d => !d.is_paid);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
          Mis Documentos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Constancias, informes y documentación clínica
        </p>
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground">No tienes documentos</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando tu terapeuta genere constancias o informes, aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pending Documents */}
          {pendingDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileClock className="h-5 w-5 text-amber-500" />
                <h2 className="font-medium text-foreground">Pendientes de pago</h2>
                <Badge variant="secondary" className="ml-auto">
                  {pendingDocuments.length}
                </Badge>
              </div>

              {pendingDocuments.map(doc => (
                <Card key={doc.id} className="border-amber-200/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
                          {getDocumentTypeIcon(doc.document_type)}
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
                      {getDocumentTypeBadge(doc.document_type)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Creado el {format(new Date(doc.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          <span className="font-medium text-amber-600">
                            {formatPrice(doc.price)}
                          </span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleRequestPayment(doc)}
                        className="shrink-0"
                        disabled={processingPayment === doc.id}
                      >
                        {processingPayment === doc.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pagar con Mercado Pago
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paid Documents */}
          {paidDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <h2 className="font-medium text-foreground">Disponibles para descarga</h2>
                <Badge variant="secondary" className="ml-auto">
                  {paidDocuments.length}
                </Badge>
              </div>

              {paidDocuments.map(doc => (
                <Card key={doc.id} className="border-green-200/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-green-100 p-2 text-green-600">
                          {getDocumentTypeIcon(doc.document_type)}
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
                      {getDocumentTypeBadge(doc.document_type)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Creado el {format(new Date(doc.created_at), "d 'de' MMMM, yyyy", { locale: es })}
                          </span>
                        </div>
                        {doc.payment_date && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>
                              Pagado el {format(new Date(doc.payment_date), "d 'de' MMMM, yyyy", { locale: es })}
                            </span>
                          </div>
                        )}
                      </div>
                      <Button 
                        onClick={() => handleDownload(doc)}
                        variant="outline"
                        className="shrink-0 border-green-200 text-green-700 hover:bg-green-50"
                        disabled={!doc.file_url}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {doc.file_url ? "Descargar" : "Preparando..."}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <Card className="mt-6 border-muted bg-muted/30">
        <CardContent className="py-4">
          <p className="text-center text-sm text-muted-foreground">
            Los documentos estarán disponibles para descarga una vez confirmado el pago.
            Para cualquier consulta, contacta a tu terapeuta.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
