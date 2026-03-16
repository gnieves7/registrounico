import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { notifyPatientAndAdmin } from "@/lib/telegramNotifications";
import { 
  Plus, 
  FileText, 
  Upload, 
  Trash2, 
  CheckCircle, 
  Clock,
  Download,
  Loader2,
  Key,
  Copy,
  Check
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Document {
  id: string;
  title: string;
  description: string | null;
  document_type: string;
  price: number;
  is_paid: boolean;
  payment_date: string | null;
  file_url: string | null;
  created_at: string;
  download_code: string | null;
  code_generated_at: string | null;
}

interface PatientDocumentsViewProps {
  userId: string;
  patientName: string;
}

const DOCUMENT_TYPES = [
  { value: "constancia", label: "Constancia" },
  { value: "informe", label: "Informe Clínico" },
  { value: "certificado", label: "Certificado" },
  { value: "resumen", label: "Resumen de Tratamiento" },
  { value: "otro", label: "Otro" },
];

export function PatientDocumentsView({ userId, patientName }: PatientDocumentsViewProps) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatingCode, setGeneratingCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    document_type: "constancia",
    price: "0",
  });

  useEffect(() => {
    fetchDocuments();
  }, [userId]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("patient_id", userId)
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no puede superar los 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      let fileUrl: string | null = null;

      // Upload file if selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        // Store the storage path, not a public URL (bucket is private)
        fileUrl = fileName;
      }

      // Create document record
      const { error } = await supabase.from("documents").insert({
        patient_id: userId,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        document_type: formData.document_type,
        price: parseFloat(formData.price) || 0,
        file_url: fileUrl,
        is_paid: parseFloat(formData.price) === 0, // Auto-mark as paid if free
      });

      if (error) throw error;

      toast({
        title: "Documento creado",
        description: "El documento se ha agregado correctamente",
      });

      // Reset form and close dialog
      setFormData({ title: "", description: "", document_type: "constancia", price: "0" });
      setSelectedFile(null);
      setIsDialogOpen(false);
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el documento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (documentId: string, fileUrl: string | null) => {
    if (!confirm("¿Estás seguro de eliminar este documento?")) return;

    try {
      // Delete file from storage if exists
      if (fileUrl) {
        const filePath = fileUrl.split("/documents/")[1];
        if (filePath) {
          await supabase.storage.from("documents").remove([filePath]);
        }
      }

      // Delete document record
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      toast({
        title: "Documento eliminado",
        description: "El documento se ha eliminado correctamente",
      });

      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento",
        variant: "destructive",
      });
    }
  };

  // Mark document as paid, generate code, and send email in one step
  const markAsPaidAndSendCode = async (documentId: string, documentTitle: string) => {
    setGeneratingCode(documentId);
    try {
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const array = new Uint8Array(8);
      crypto.getRandomValues(array);
      const code = Array.from(array, (byte) => characters[byte % characters.length]).join('');

      const { error } = await supabase
        .from("documents")
        .update({
          is_paid: true,
          payment_date: new Date().toISOString(),
          download_code: code,
          code_generated_at: new Date().toISOString(),
        })
        .eq("id", documentId);

      if (error) throw error;

      try {
        await supabase.functions.invoke('send-download-code', {
          body: { patientId: userId, documentId, documentTitle, downloadCode: code },
        });
      } catch {
        // noop: el aviso por Telegram sigue aunque falle el email
      }

      void notifyPatientAndAdmin({
        patientUserId: userId,
        adminUserId: user?.id,
        eventType: "document_ready",
        data: { title: documentTitle, patientName },
      });

      toast({
        title: "Pago registrado y código generado",
        description: `Código: ${code} — el documento quedó listo para descarga.`,
      });

      fetchDocuments();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "No se pudo procesar", variant: "destructive" });
    } finally {
      setGeneratingCode(null);
    }
  };

  // Generate a unique download code and send email notification
  const generateDownloadCode = async (documentId: string, documentTitle: string) => {
    setGeneratingCode(documentId);
    try {
      // Generate a random 8-character alphanumeric code
      const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const array = new Uint8Array(8);
      crypto.getRandomValues(array);
      const code = Array.from(array, (byte) => characters[byte % characters.length]).join('');

      const { error } = await supabase
        .from("documents")
        .update({ 
          download_code: code,
          code_generated_at: new Date().toISOString()
        })
        .eq("id", documentId);

      if (error) throw error;

      // Send email notification to patient
      try {
        const response = await supabase.functions.invoke('send-download-code', {
          body: {
            patientId: userId,
            documentId: documentId,
            documentTitle: documentTitle,
            downloadCode: code,
          },
        });
        
        if (response.error) {
          console.error("Email notification error:", response.error);
        } else {
          toast({
            title: "Código generado y enviado",
            description: `Código: ${code} - Se envió una notificación por email al paciente`,
          });
        }
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        toast({
          title: "Código generado",
          description: `Código: ${code} - No se pudo enviar el email, compártelo manualmente`,
        });
      }

      fetchDocuments();
    } catch (error) {
      console.error("Error generating code:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el código",
        variant: "destructive",
      });
    } finally {
      setGeneratingCode(null);
    }
  };

  const copyToClipboard = async (code: string, docId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(docId);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Código copiado",
        description: "El código se ha copiado al portapapeles",
      });
    } catch (error) {
      console.error("Error copying:", error);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    return DOCUMENT_TYPES.find((t) => t.value === type)?.label || type;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documentos</h3>
          <p className="text-sm text-muted-foreground">
            Constancias e informes de {patientName}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nuevo Documento</DialogTitle>
              <DialogDescription>
                Sube un documento para {patientName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Constancia de tratamiento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de documento</Label>
                <Select
                  value={formData.document_type}
                  onValueChange={(value) => setFormData({ ...formData, document_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción opcional del documento"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Precio (ARS)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">
                  Si el precio es 0, el documento estará disponible sin pago
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Archivo (PDF, DOC, etc.)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">
                    Archivo: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Guardar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Documents List */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay documentos para este paciente</p>
            <p className="text-sm">Haz clic en "Agregar" para crear uno nuevo</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{doc.title}</h4>
                      <Badge variant="outline" className="shrink-0">
                        {getDocumentTypeLabel(doc.document_type)}
                      </Badge>
                    </div>
                    {doc.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {doc.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Creado: {format(new Date(doc.created_at), "dd MMM yyyy", { locale: es })}
                      </span>
                      <span className="font-medium text-foreground">
                        ${doc.price.toLocaleString("es-AR")}
                      </span>
                      {doc.is_paid ? (
                        <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                          <CheckCircle className="h-3 w-3" />
                          Pagado
                        </Badge>
                      ) : doc.price > 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-xs gap-1"
                          disabled={generatingCode === doc.id}
                          onClick={() => markAsPaidAndSendCode(doc.id, doc.title)}
                        >
                          {generatingCode === doc.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          Marcar como pagado
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Clock className="h-3 w-3" />
                          Pendiente
                        </Badge>
                      )}
                    </div>
                    
                    {/* Download Code Display (auto-generated when marked as paid) */}
                    {doc.download_code && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <code className="px-2 py-1 bg-background rounded text-sm font-mono font-bold tracking-wider">
                          {doc.download_code}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(doc.download_code!, doc.id)}
                        >
                          {copiedCode === doc.id ? (
                            <Check className="h-3 w-3 text-primary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          Generado: {format(new Date(doc.code_generated_at!), "dd/MM/yy", { locale: es })}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {doc.file_url && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={async () => {
                          const { data, error } = await supabase.storage
                            .from("documents")
                            .createSignedUrl(doc.file_url!, 3600);
                          if (data?.signedUrl) {
                            window.open(data.signedUrl, "_blank");
                          } else {
                            toast({ title: "Error", description: "No se pudo obtener el archivo", variant: "destructive" });
                          }
                        }}
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(doc.id, doc.file_url)}
                      className="text-destructive hover:text-destructive"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
