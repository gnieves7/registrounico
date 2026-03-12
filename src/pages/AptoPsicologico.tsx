import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Download,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertTriangle,
  Users,
  Heart,
  GraduationCap,
  Building2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CATEGORIES = [
  {
    id: "seguridad",
    title: "Personal de Seguridad",
    description: "Fuerzas de seguridad, vigilancia privada, custodia",
    icon: ShieldCheck,
  },
  {
    id: "salud",
    title: "Personal de Salud",
    description: "Médicos, enfermeros, técnicos sanitarios",
    icon: Heart,
  },
  {
    id: "educacion",
    title: "Personal de Educación",
    description: "Docentes, directivos, personal auxiliar educativo",
    icon: GraduationCap,
  },
  {
    id: "administrativo",
    title: "Personal Administrativo",
    description: "Empleados administrativos, atención al público",
    icon: Building2,
  },
];

interface AptoCertificate {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  created_at: string;
  is_paid: boolean | null;
}

const BOOKING_URL = "https://calendar.app.google/4Locar4CbcTB45zv9";

const AptoPsicologico = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<AptoCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [hasPsychobiography, setHasPsychobiography] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const [certsRes, psychoRes] = await Promise.all([
        supabase
          .from("documents")
          .select("id, title, description, file_url, created_at, is_paid")
          .eq("patient_id", user.id)
          .eq("document_type", "apto_psicologico")
          .order("created_at", { ascending: false }),
        supabase
          .from("psychobiographies")
          .select("is_complete")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      if (certsRes.error) throw certsRes.error;
      setCertificates(certsRes.data || []);
      setHasPsychobiography(psychoRes.data?.is_complete === true);
    } catch (error) {
      console.error("Error fetching apto data:", error);
      toast({ title: "Error", description: "No se pudieron cargar los datos", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (cert: AptoCertificate) => {
    if (!cert.file_url) return;
    setDownloadingId(cert.id);
    try {
      const { data, error } = await supabase.storage.from("documents").download(cert.file_url);
      if (error) throw error;
      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = cert.title + ".pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Descarga exitosa", description: `"${cert.title}" se descargó correctamente` });
      }
    } catch (error) {
      console.error("Error downloading:", error);
      toast({ title: "Error", description: "No se pudo descargar el certificado", variant: "destructive" });
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
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 mb-2 md:gap-3">
          <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
            Apto Psicológico
          </h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Certificados de aptitud psicológica para distintas áreas laborales
        </p>
      </div>

      {/* Categorías */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Categorías disponibles</h2>
      <div className="grid gap-3 sm:grid-cols-2 mb-6">
        {CATEGORIES.map((cat) => (
          <Card key={cat.id} className="border-border/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <cat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{cat.title}</p>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Requisitos */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-primary" />
            Requisitos para obtener el certificado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Solicitar un turno para ser evaluado
                </span>
                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer">
                    Solicitar turno
                  </a>
                </Button>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Completar la psicobiografía</span>
                {hasPsychobiography ? (
                  <Badge variant="outline" className="gap-1 text-xs border-green-500/30 text-green-700 bg-green-50">
                    <CheckCircle2 className="h-3 w-3" /> Completada
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-xs border-destructive/30 text-destructive">
                    <XCircle className="h-3 w-3" /> Pendiente
                  </Badge>
                )}
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Realizar el pago correspondiente</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">Autorización del profesional para la descarga</span>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Certificados disponibles */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Mis certificados</h2>

      {certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground">No hay certificados disponibles</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando tu profesional autorice un certificado de apto psicológico, aparecerá aquí para su descarga
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => {
            const canDownload = cert.file_url && cert.is_paid;
            return (
              <Card key={cert.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{cert.title}</CardTitle>
                      {cert.description && <CardDescription className="mt-1">{cert.description}</CardDescription>}
                    </div>
                    {cert.is_paid ? (
                      <Badge variant="outline" className="gap-1 text-xs border-green-500/30 text-green-700 bg-green-50">
                        <CheckCircle2 className="h-3 w-3" /> Autorizado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-xs border-amber-500/30 text-amber-700 bg-amber-50">
                        <Clock className="h-3 w-3" /> Pendiente de pago
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(cert.created_at), "d 'de' MMMM, yyyy", { locale: es })}</span>
                    </div>
                    {canDownload ? (
                      <Button onClick={() => handleDownload(cert)} variant="outline" className="self-start" disabled={downloadingId === cert.id}>
                        {downloadingId === cert.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                        Descargar certificado
                      </Button>
                    ) : !cert.is_paid ? (
                      <p className="text-sm text-muted-foreground italic">
                        Certificado pendiente de pago y autorización del profesional.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Certificado pendiente de carga.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AptoPsicologico;
