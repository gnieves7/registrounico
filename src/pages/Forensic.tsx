import { useMemo, useState } from "react";
import {
  Library,
  Search,
  FileText,
  ExternalLink,
  Eye,
  Download,
  MessageCircle,
  ShieldAlert,
  Scale,
  AlertTriangle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  RESOURCE_SECTIONS,
  type ResourceSection,
  type SectionDefinition,
} from "@/data/professionalResourcesContent";
import {
  useProfessionalResources,
  type ProfessionalResource,
} from "@/hooks/useProfessionalResources";

const ROLE_BADGES: Record<ProfessionalResource["role_tag"], { label: string; className: string }> = {
  clinical: { label: "Clínica", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300" },
  forensic: { label: "Pericial", className: "bg-rose-500/10 text-rose-700 border-rose-500/30 dark:text-rose-300" },
  both: { label: "Pericial + Clínica", className: "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:text-violet-300" },
  institutional: { label: "Institucional", className: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-300" },
};

const TYPE_LABELS: Record<ProfessionalResource["resource_type"], string> = {
  pdf: "PDF",
  link: "Enlace",
  template: "Plantilla",
};

export default function Forensic() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<ResourceSection>("protocols");
  const [search, setSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const { resources, loading, getSignedUrl, logDownload } = useProfessionalResources();

  const filteredBySection = useMemo(() => {
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const q = norm(search.trim());

    return RESOURCE_SECTIONS.reduce<Record<ResourceSection, ProfessionalResource[]>>(
      (acc, sec) => {
        const items = resources.filter((r) => r.section === sec.id);
        acc[sec.id] = q
          ? items.filter((r) =>
              [r.title, r.description, r.author, r.source]
                .filter(Boolean)
                .some((field) => norm(String(field)).includes(q))
            )
          : items;
        return acc;
      },
      {} as Record<ResourceSection, ProfessionalResource[]>
    );
  }, [resources, search]);

  const handleOpenPdf = async (resource: ProfessionalResource) => {
    if (!resource.storage_path) return;
    try {
      const url = await getSignedUrl(resource.storage_path);
      setPreviewUrl(url);
      setPreviewTitle(resource.title);
      logDownload(resource.id);
    } catch (err) {
      console.error(err);
      toast.error("No se pudo abrir el documento");
    }
  };

  const handleDownload = async (resource: ProfessionalResource) => {
    if (resource.storage_path) {
      try {
        const url = await getSignedUrl(resource.storage_path);
        window.open(url, "_blank", "noopener");
        logDownload(resource.id);
      } catch {
        toast.error("No se pudo descargar el documento");
      }
    } else if (resource.url) {
      window.open(resource.url, "_blank", "noopener");
      logDownload(resource.id);
    }
  };

  const handleConsultLaura = (section: SectionDefinition) => {
    sessionStorage.setItem(
      "laura_resource_context",
      JSON.stringify({
        section: section.id,
        title: section.title,
        prompt: section.lauraContext,
      })
    );
    navigate("/laura");
    toast.success(`Contexto cargado: ${section.title}`);
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-4 md:px-6 md:py-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 md:gap-3">
          <Library className="h-6 w-6 text-primary md:h-8 md:w-8" />
          <h1 className="text-xl font-bold leading-tight md:text-3xl">
            Recursos Psicoforenses
          </h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Biblioteca clínico-forense: protocolos, autores de referencia, documentos
          descargables y modelos de informe. Acceso restringido a profesionales
          aprobados.
        </p>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título, autor o fuente…"
          className="pl-9"
          aria-label="Buscar recursos"
        />
      </div>

      <Tabs
        value={activeSection}
        onValueChange={(v) => setActiveSection(v as ResourceSection)}
      >
        {/* Mobile: dropdown selector */}
        {isMobile ? (
          <Select
            value={activeSection}
            onValueChange={(v) => setActiveSection(v as ResourceSection)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESOURCE_SECTIONS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  <span className="font-medium">{s.number}</span> · {s.shortTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <TabsList className="grid h-auto w-full grid-cols-5">
            {RESOURCE_SECTIONS.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="flex-col gap-0.5 py-2 text-xs"
              >
                <span className="opacity-60">{s.number}</span>
                <span>{s.shortTitle}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {RESOURCE_SECTIONS.map((section) => (
          <TabsContent
            key={section.id}
            value={section.id}
            className="mt-5 space-y-5"
          >
            {/* Section header w/ accent */}
            <Card
              className="overflow-hidden border-l-4 p-5 md:p-6"
              style={{ borderLeftColor: `hsl(${section.accentHsl})` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: `hsl(${section.accentHsl})` }}
                  >
                    Sección {section.number}
                  </p>
                  <h2 className="text-lg font-bold md:text-2xl">{section.title}</h2>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  onClick={() => handleConsultLaura(section)}
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Consultar con Laura</span>
                  <span className="sm:hidden">Laura</span>
                </Button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                {section.introduction}
              </p>

              {section.id === "sexual_abuse" && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-900 dark:text-amber-200 md:text-sm">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    <strong>Importante:</strong> Distinguir evaluación clínica de
                    pericial forense. Son procesos con encuadres, objetivos y
                    alcances diferentes.
                  </p>
                </div>
              )}
            </Card>

            {/* Authors table */}
            <Card className="p-4 md:p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold md:text-base">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                Autores y marcos de referencia
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%] text-xs md:text-sm">Autor</TableHead>
                      <TableHead className="text-xs md:text-sm">Aporte clave</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.authors.map((a) => (
                      <TableRow key={a.name}>
                        <TableCell className="align-top text-xs font-medium md:text-sm">
                          {a.name}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground md:text-sm">
                          {a.contribution}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Resources list */}
            <Card className="p-4 md:p-5">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold md:text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Documentos y enlaces
              </h3>

              {loading ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Cargando recursos…
                </p>
              ) : filteredBySection[section.id]?.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {search
                    ? "Sin resultados para esta búsqueda."
                    : "Aún no hay recursos cargados en esta sección."}
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredBySection[section.id]?.map((r) => {
                    const badge = ROLE_BADGES[r.role_tag];
                    return (
                      <li
                        key={r.id}
                        className="flex flex-col gap-2 rounded-lg border border-border bg-card/50 p-3 transition-colors hover:bg-muted/40 md:flex-row md:items-center md:justify-between md:gap-4 md:p-4"
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-sm font-medium leading-tight md:text-base">
                              {r.title}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${badge.className}`}
                            >
                              {badge.label}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {TYPE_LABELS[r.resource_type]}
                            </Badge>
                          </div>
                          {r.description && (
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {r.description}
                            </p>
                          )}
                          {(r.author || r.source) && (
                            <p className="text-[11px] text-muted-foreground/80 md:text-xs">
                              {[r.author, r.source].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {r.resource_type === "pdf" && r.storage_path && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenPdf(r)}
                              className="gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              Ver
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handleDownload(r)}
                            className="gap-1.5"
                            disabled={r.resource_type === "template"}
                          >
                            {r.resource_type === "link" ? (
                              <>
                                <ExternalLink className="h-3.5 w-3.5" />
                                Abrir
                              </>
                            ) : r.resource_type === "template" ? (
                              <>
                                <FileText className="h-3.5 w-3.5" />
                                Próximamente
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                Descargar
                              </>
                            )}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* PDF preview modal */}
      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)}>
        <DialogContent className="h-[90vh] max-w-5xl gap-2 p-0 sm:p-0">
          <DialogHeader className="flex flex-row items-center justify-between gap-2 border-b px-4 py-3">
            <DialogTitle className="line-clamp-1 text-sm md:text-base">
              {previewTitle}
            </DialogTitle>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setPreviewUrl(null)}
              className="h-7 w-7"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {previewUrl && (
            <iframe
              src={previewUrl}
              title={previewTitle}
              className="h-full w-full rounded-b-lg border-0"
            />
          )}
        </DialogContent>
      </Dialog>

      <p className="pt-2 text-center text-[11px] text-muted-foreground">
        <Scale className="mr-1 inline h-3 w-3" />
        Centro de Recursos Profesionales · .PSI. — uso exclusivo de profesionales
        aprobados.
      </p>
    </div>
  );
}
