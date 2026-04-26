import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, FileText, Download, Edit3, KeyRound } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AuditRow {
  id: string;
  user_id: string;
  event_type: string;
  event_detail: Record<string, unknown> | null;
  created_at: string;
}

const EVENT_META: Record<
  string,
  { label: string; icon: React.ElementType; tone: string }
> = {
  report_created: { label: "Creación de informe", icon: FileText, tone: "default" },
  report_downloaded: { label: "Descarga de informe", icon: Download, tone: "secondary" },
  report_draft_edited: { label: "Edición de borrador", icon: Edit3, tone: "outline" },
  pdf_code_issued: { label: "Código PDF emitido", icon: KeyRound, tone: "outline" },
  pdf_code_consumed: { label: "Código PDF consumido", icon: KeyRound, tone: "secondary" },
  pdf_code_issued_ui: { label: "Código PDF emitido (UI)", icon: KeyRound, tone: "outline" },
  pdf_code_consumed_ui: { label: "Código PDF consumido (UI)", icon: KeyRound, tone: "secondary" },
  mpa_resource_download: { label: "Descarga recurso MPA", icon: Download, tone: "outline" },
};

const TRACKED = Object.keys(EVENT_META);

export function AdminReportsAuditSection() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("activity_log")
        .select("id, user_id, event_type, event_detail, created_at")
        .in("event_type", TRACKED)
        .order("created_at", { ascending: false })
        .limit(200);
      if (cancelled) return;
      setRows((data as AuditRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <ShieldCheck className="h-5 w-5" />
          Auditoría de Informes
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Registro mínimo de eventos operativos sobre informes (creación,
          edición, descarga, emisión y consumo de códigos). No incluye
          contenido clínico sensible: solo metadatos de trazabilidad.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos 200 eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Cargando…</p>
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <ShieldCheck className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p>No hay eventos registrados todavía.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo de informe</TableHead>
                    <TableHead className="hidden md:table-cell">Paciente</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => {
                    const meta = EVENT_META[r.event_type] ?? {
                      label: r.event_type,
                      icon: FileText,
                      tone: "outline",
                    };
                    const Icon = meta.icon;
                    const detail = (r.event_detail ?? {}) as Record<string, unknown>;
                    const reportType = (detail.report_type ?? detail.resource_type ?? "—") as string;
                    const patient = (detail.patient_id as string | null | undefined) ?? null;
                    return (
                      <TableRow key={r.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <Badge variant={meta.tone as "default" | "secondary" | "outline"}>
                              {meta.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {reportType}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                          {patient ? `${patient.slice(0, 8)}…` : "—"}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {r.user_id.slice(0, 8)}…
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {format(new Date(r.created_at), "dd MMM yyyy HH:mm", { locale: es })}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}