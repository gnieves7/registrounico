import { useMemo, useState } from "react";
import {
  ShieldAlert,
  Plus,
  Trash2,
  Upload,
  FileText,
  Eye,
  Lock,
  Gavel,
  Scale,
  Calendar,
  Search,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useJudicialCases,
  useJudicialAttachments,
  type JudicialCase,
  type AttachmentType,
} from "@/hooks/useJudicialCases";

const JURISDICTION_LABELS: Record<string, string> = {
  civil: "Civil",
  penal: "Penal",
  familia: "Familia",
  laboral: "Laboral",
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  activo: { label: "Activo", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300" },
  archivado: { label: "Archivado", className: "bg-muted text-muted-foreground border-border" },
  sentencia: { label: "Con sentencia", className: "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:text-violet-300" },
  apelacion: { label: "En apelación", className: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300" },
};

const ATTACHMENT_LABELS: Record<AttachmentType, string> = {
  informe_pericial: "Informe pericial",
  gesell: "Cámara Gesell",
  sentencia: "Sentencia",
  fundamentos: "Fundamentos",
  denuncia: "Denuncia",
  otro: "Otro",
};

const emptyCase: Partial<JudicialCase> = {
  case_title: "",
  jurisdiction: "penal",
  case_status: "activo",
};

export default function JudicialCasePage() {
  const { cases, loading, createCase, updateCase, deleteCase } = useJudicialCases();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Partial<JudicialCase> | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selectedCase = cases.find((c) => c.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter((c) =>
      [c.case_title, c.cuij, c.legajo_number, c.complainant_name, c.court_name]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [cases, search]);

  const openNew = () => {
    setEditing({ ...emptyCase });
    setOpenForm(true);
  };

  const openEdit = (c: JudicialCase) => {
    setEditing({ ...c });
    setOpenForm(true);
  };

  const handleSave = async () => {
    if (!editing?.case_title?.trim()) {
      toast.error("La carátula es obligatoria");
      return;
    }
    try {
      if (editing.id) {
        await updateCase(editing.id, editing);
        toast.success("Expediente actualizado");
      } else {
        const created = await createCase(editing);
        setSelectedId(created.id);
        toast.success("Expediente creado");
      }
      setOpenForm(false);
      setEditing(null);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al guardar";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCase(confirmDelete);
      if (selectedId === confirmDelete) setSelectedId(null);
      toast.success("Expediente eliminado");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-3 py-4 md:px-6 md:py-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-center gap-2 md:gap-3">
          <Gavel className="h-6 w-6 text-primary md:h-8 md:w-8" />
          <h1 className="text-xl font-bold leading-tight md:text-3xl">
            Expediente Judicial
          </h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Gestión integral de causas judiciales: datos identificatorios, denuncia,
          representación legal, cámara Gesell, audiencias, fundamentos y sentencia.
        </p>
      </header>

      {/* Aviso de confidencialidad */}
      <div className="flex items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/5 p-4 text-rose-900 dark:text-rose-200">
        <Lock className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="space-y-1 text-xs md:text-sm">
          <p className="font-semibold">Información estrictamente confidencial</p>
          <p className="leading-relaxed text-rose-900/80 dark:text-rose-200/80">
            Protegida por secreto profesional (Código de Ética FePRA), Ley 26.657 de
            Salud Mental y Ley 25.326 de Protección de Datos Personales. Cifrado en
            reposo y en tránsito · acceso restringido por RLS · auditoría de
            descargas · URLs firmadas con expiración. La divulgación no autorizada
            constituye infracción ética y legal.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por carátula, CUIJ, legajo, denunciante…"
            className="pl-9"
          />
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo expediente
        </Button>
      </div>

      {/* Layout: lista + detalle */}
      <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
        {/* Lista */}
        <Card className="p-3">
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Causas ({filtered.length})
          </h2>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {search ? "Sin resultados" : "Sin expedientes registrados"}
            </p>
          ) : (
            <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto">
              {filtered.map((c) => {
                const status = STATUS_LABELS[c.case_status] ?? STATUS_LABELS.activo;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelectedId(c.id)}
                      className={`w-full rounded-md border p-2.5 text-left transition-colors ${
                        selectedId === c.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <p className="line-clamp-2 text-sm font-medium leading-tight">
                        {c.case_title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {JURISDICTION_LABELS[c.jurisdiction] ?? c.jurisdiction}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${status.className}`}>
                          {status.label}
                        </Badge>
                      </div>
                      {c.cuij && (
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                          CUIJ {c.cuij}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Detalle */}
        <div>
          {!selectedCase ? (
            <Card className="flex h-full min-h-[300px] flex-col items-center justify-center gap-2 p-8 text-center">
              <Scale className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                Seleccioná un expediente o creá uno nuevo
              </p>
            </Card>
          ) : (
            <CaseDetail
              caseData={selectedCase}
              onEdit={() => openEdit(selectedCase)}
              onDelete={() => setConfirmDelete(selectedCase.id)}
            />
          )}
        </div>
      </div>

      {/* Formulario */}
      <Dialog open={openForm} onOpenChange={(o) => !o && setOpenForm(false)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.id ? "Editar expediente" : "Nuevo expediente"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <CaseForm value={editing} onChange={setEditing} />
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar expediente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Se eliminarán también todos los archivos
              PDF adjuntos al expediente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Sub-componentes                                              */
/* ──────────────────────────────────────────────────────────── */

function CaseForm({
  value,
  onChange,
}: {
  value: Partial<JudicialCase>;
  onChange: (v: Partial<JudicialCase>) => void;
}) {
  const set = <K extends keyof JudicialCase>(k: K, v: JudicialCase[K] | null) =>
    onChange({ ...value, [k]: v });

  return (
    <Tabs defaultValue="ident" className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
        <TabsTrigger value="ident">Causa</TabsTrigger>
        <TabsTrigger value="denuncia">Denuncia</TabsTrigger>
        <TabsTrigger value="legal">Defensa</TabsTrigger>
        <TabsTrigger value="gesell">Gesell</TabsTrigger>
        <TabsTrigger value="sentencia">Sentencia</TabsTrigger>
      </TabsList>

      <TabsContent value="ident" className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label>Carátula *</Label>
          <Input
            value={value.case_title ?? ""}
            onChange={(e) => set("case_title", e.target.value)}
            placeholder="Ej: Pérez Juan c/ García María s/ daños"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>CUIJ</Label>
            <Input
              value={value.cuij ?? ""}
              onChange={(e) => set("cuij", e.target.value)}
              placeholder="21-12345678-9/2024"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Nº de legajo</Label>
            <Input
              value={value.legajo_number ?? ""}
              onChange={(e) => set("legajo_number", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Jurisdicción</Label>
            <Select
              value={value.jurisdiction ?? "penal"}
              onValueChange={(v) => set("jurisdiction", v as JudicialCase["jurisdiction"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(JURISDICTION_LABELS).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select
              value={value.case_status ?? "activo"}
              onValueChange={(v) => set("case_status", v as JudicialCase["case_status"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([k, v2]) => (
                  <SelectItem key={k} value={k}>{v2.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Juzgado / Tribunal</Label>
            <Input
              value={value.court_name ?? ""}
              onChange={(e) => set("court_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Sala / Secretaría</Label>
            <Input
              value={value.court_division ?? ""}
              onChange={(e) => set("court_division", e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="denuncia" className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Denunciante</Label>
            <Input
              value={value.complainant_name ?? ""}
              onChange={(e) => set("complainant_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>DNI</Label>
            <Input
              value={value.complainant_dni ?? ""}
              onChange={(e) => set("complainant_dni", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Vínculo</Label>
            <Input
              value={value.complainant_relationship ?? ""}
              onChange={(e) => set("complainant_relationship", e.target.value)}
              placeholder="Madre, padre, hermano, propia víctima…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de la denuncia</Label>
            <Input
              type="date"
              value={value.complaint_date ?? ""}
              onChange={(e) => set("complaint_date", e.target.value || null)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Lugar / Dependencia</Label>
          <Input
            value={value.complaint_place ?? ""}
            onChange={(e) => set("complaint_place", e.target.value)}
            placeholder="Comisaría 1ra, Fiscalía Nº…, etc."
          />
        </div>
        <div className="space-y-1.5">
          <Label>Hechos denunciados</Label>
          <Textarea
            rows={4}
            value={value.reported_facts ?? ""}
            onChange={(e) => set("reported_facts", e.target.value)}
          />
        </div>
      </TabsContent>

      <TabsContent value="legal" className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Abogado/a defensor/a</Label>
            <Input
              value={value.defense_lawyer_name ?? ""}
              onChange={(e) => set("defense_lawyer_name", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Matrícula</Label>
            <Input
              value={value.defense_lawyer_matricula ?? ""}
              onChange={(e) => set("defense_lawyer_matricula", e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input
              value={value.defense_lawyer_phone ?? ""}
              onChange={(e) => set("defense_lawyer_phone", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              value={value.defense_lawyer_email ?? ""}
              onChange={(e) => set("defense_lawyer_email", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Fiscalía interviniente</Label>
          <Input
            value={value.prosecutor_name ?? ""}
            onChange={(e) => set("prosecutor_name", e.target.value)}
          />
        </div>
      </TabsContent>

      <TabsContent value="gesell" className="mt-4 space-y-3">
        <div className="space-y-1.5">
          <Label>Fecha de Cámara Gesell</Label>
          <Input
            type="date"
            value={value.gesell_chamber_date ?? ""}
            onChange={(e) => set("gesell_chamber_date", e.target.value || null)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Notas / Observaciones</Label>
          <Textarea
            rows={5}
            value={value.gesell_chamber_notes ?? ""}
            onChange={(e) => set("gesell_chamber_notes", e.target.value)}
            placeholder="Síntesis del informe, profesional interviniente, protocolo aplicado (NICHD, etc.)"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          El informe completo se carga como PDF adjunto desde el detalle del expediente.
        </p>
      </TabsContent>

      <TabsContent value="sentencia" className="mt-4 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Próxima audiencia</Label>
            <Input
              type="datetime-local"
              value={value.next_hearing_date?.slice(0, 16) ?? ""}
              onChange={(e) =>
                set("next_hearing_date", e.target.value ? new Date(e.target.value).toISOString() : null)
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de sentencia</Label>
            <Input
              type="date"
              value={value.sentence_date ?? ""}
              onChange={(e) => set("sentence_date", e.target.value || null)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Resumen de sentencia</Label>
          <Textarea
            rows={4}
            value={value.sentence_summary ?? ""}
            onChange={(e) => set("sentence_summary", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Notas adicionales</Label>
          <Textarea
            rows={3}
            value={value.additional_notes ?? ""}
            onChange={(e) => set("additional_notes", e.target.value)}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}

function CaseDetail({
  caseData,
  onEdit,
  onDelete,
}: {
  caseData: JudicialCase;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const status = STATUS_LABELS[caseData.case_status] ?? STATUS_LABELS.activo;

  return (
    <div className="space-y-4">
      <Card className="p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-lg font-bold leading-tight md:text-xl">
              {caseData.case_title}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline">{JURISDICTION_LABELS[caseData.jurisdiction]}</Badge>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
              {caseData.cuij && (
                <Badge variant="secondary" className="font-mono text-[11px]">
                  CUIJ {caseData.cuij}
                </Badge>
              )}
              {caseData.legajo_number && (
                <Badge variant="secondary" className="font-mono text-[11px]">
                  Legajo {caseData.legajo_number}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>Editar</Button>
            <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <DetailBlock title="Juzgado">
            <Field label="Tribunal" value={caseData.court_name} />
            <Field label="Sala / Secretaría" value={caseData.court_division} />
            <Field label="Fiscalía" value={caseData.prosecutor_name} />
          </DetailBlock>

          <DetailBlock title="Denuncia">
            <Field label="Denunciante" value={caseData.complainant_name} />
            <Field label="DNI" value={caseData.complainant_dni} />
            <Field label="Vínculo" value={caseData.complainant_relationship} />
            <Field label="Fecha" value={caseData.complaint_date} />
            <Field label="Lugar" value={caseData.complaint_place} />
          </DetailBlock>

          <DetailBlock title="Defensa">
            <Field label="Abogado/a" value={caseData.defense_lawyer_name} />
            <Field label="Matrícula" value={caseData.defense_lawyer_matricula} />
            <Field label="Teléfono" value={caseData.defense_lawyer_phone} />
            <Field label="Email" value={caseData.defense_lawyer_email} />
          </DetailBlock>

          <DetailBlock title="Cámara Gesell">
            <Field label="Fecha" value={caseData.gesell_chamber_date} icon={<Calendar className="h-3 w-3" />} />
            <Field label="Notas" value={caseData.gesell_chamber_notes} multiline />
          </DetailBlock>

          {caseData.reported_facts && (
            <DetailBlock title="Hechos denunciados" wide>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {caseData.reported_facts}
              </p>
            </DetailBlock>
          )}

          <DetailBlock title="Audiencias y sentencia" wide>
            <Field label="Próxima audiencia" value={caseData.next_hearing_date ? new Date(caseData.next_hearing_date).toLocaleString("es-AR") : null} />
            <Field label="Fecha de sentencia" value={caseData.sentence_date} />
            <Field label="Resumen" value={caseData.sentence_summary} multiline />
          </DetailBlock>
        </div>
      </Card>

      <AttachmentsPanel caseId={caseData.id} />
    </div>
  );
}

function DetailBlock({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`space-y-2 rounded-md border border-border/60 bg-muted/30 p-3 ${wide ? "md:col-span-2" : ""}`}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  multiline = false,
  icon,
}: {
  label: string;
  value: string | null;
  multiline?: boolean;
  icon?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <div className="text-xs md:text-sm">
      <span className="font-medium text-foreground/70">{label}: </span>
      {multiline ? (
        <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">{value}</p>
      ) : (
        <span className="text-muted-foreground inline-flex items-center gap-1">{icon}{value}</span>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */
/* Adjuntos                                                     */
/* ──────────────────────────────────────────────────────────── */

function AttachmentsPanel({ caseId }: { caseId: string }) {
  const { attachments, loading, uploadAttachment, getSignedUrl, deleteAttachment } =
    useJudicialAttachments(caseId);
  const [openUpload, setOpenUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const handleView = async (path: string, title: string) => {
    try {
      const url = await getSignedUrl(path);
      setPreviewUrl(url);
      setPreviewTitle(title);
    } catch {
      toast.error("No se pudo abrir el documento");
    }
  };

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold md:text-base">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          Documentación adjunta ({attachments.length})
        </h3>
        <Button size="sm" onClick={() => setOpenUpload(true)} className="gap-1.5">
          <Upload className="h-3.5 w-3.5" /> Subir PDF
        </Button>
      </div>

      {loading ? (
        <p className="py-4 text-center text-sm text-muted-foreground">Cargando…</p>
      ) : attachments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No hay archivos adjuntos. Subí informes, fundamentos o sentencia en PDF.
        </p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-2 rounded-md border border-border bg-card/50 p-3 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <Badge variant="outline" className="text-[10px]">
                    {ATTACHMENT_LABELS[a.attachment_type]}
                  </Badge>
                </div>
                {a.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                )}
                <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                  {new Date(a.created_at).toLocaleString("es-AR")}
                  {a.size_bytes ? ` · ${(a.size_bytes / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => handleView(a.storage_path, a.title)} className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Ver
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteAttachment(a)}
                  className="text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <UploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={uploadAttachment}
      />

      <Dialog open={!!previewUrl} onOpenChange={(o) => !o && setPreviewUrl(null)}>
        <DialogContent className="h-[90vh] max-w-5xl gap-2 p-0 sm:p-0">
          <DialogHeader className="flex flex-row items-center justify-between gap-2 border-b px-4 py-3">
            <DialogTitle className="line-clamp-1 text-sm md:text-base">
              {previewTitle}
            </DialogTitle>
            <Button size="icon" variant="ghost" onClick={() => setPreviewUrl(null)} className="h-7 w-7">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {previewUrl && (
            <iframe src={previewUrl} title={previewTitle} className="h-full w-full rounded-b-lg border-0" />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function UploadDialog({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (
    f: File,
    meta: { attachment_type: AttachmentType; title: string; description?: string }
  ) => Promise<void>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<AttachmentType>("informe_pericial");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setFile(null); setType("informe_pericial"); setTitle(""); setDesc("");
  };

  const submit = async () => {
    if (!file || !title.trim()) {
      toast.error("Seleccioná un archivo y completá el título");
      return;
    }
    if (file.type !== "application/pdf") {
      toast.error("Solo se permiten archivos PDF");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("El archivo supera los 25 MB");
      return;
    }
    setBusy(true);
    try {
      await onUpload(file, { attachment_type: type, title: title.trim(), description: desc.trim() || undefined });
      toast.success("Documento subido");
      reset();
      onClose();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Error al subir");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Subir documento PDF</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as AttachmentType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(ATTACHMENT_LABELS).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Informe pericial 12/03/2025" />
          </div>
          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Archivo PDF (máx. 25 MB)</Label>
            <Input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancelar</Button>
          <Button onClick={submit} disabled={busy} className="gap-2">
            <Upload className="h-4 w-4" /> {busy ? "Subiendo…" : "Subir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
