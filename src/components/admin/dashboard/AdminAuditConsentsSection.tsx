import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShieldCheck,
  Search,
  Download,
  Loader2,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface AuditEvent {
  id: string;
  user_id: string;
  created_at: string;
  event_detail: any;
  professional_name?: string;
  professional_email?: string;
}

/**
 * Vista de auditoría de firmas de consentimiento profesional.
 * Filtros: nombre/email/matrícula del profesional + rango de fechas.
 * Permite descargar el PDF de constancia firmado de cada evento.
 */
export function AdminAuditConsentsSection() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data: rows, error } = await supabase
        .from("activity_log")
        .select("id, user_id, created_at, event_detail")
        .eq("event_type", "professional_consent_signed")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;

      const userIds = Array.from(new Set((rows || []).map((r: any) => r.user_id)));
      const { data: profiles } = userIds.length
        ? await supabase
            .from("profiles")
            .select("user_id, full_name, email")
            .in("user_id", userIds)
        : { data: [] as any[] };

      const profileMap = new Map<string, { full_name?: string; email?: string }>();
      (profiles || []).forEach((p: any) =>
        profileMap.set(p.user_id, { full_name: p.full_name, email: p.email }),
      );

      const enriched: AuditEvent[] = (rows || []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        created_at: r.created_at,
        event_detail: r.event_detail || {},
        professional_name: profileMap.get(r.user_id)?.full_name,
        professional_email: profileMap.get(r.user_id)?.email,
      }));

      setEvents(enriched);
    } catch (err: any) {
      toast({
        title: "Error al cargar auditoría",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = from ? new Date(from).getTime() : 0;
    const toTs = to ? new Date(to).getTime() + 24 * 60 * 60 * 1000 : Infinity;
    return events.filter((e) => {
      const ts = new Date(e.created_at).getTime();
      if (ts < fromTs || ts > toTs) return false;
      if (!q) return true;
      const haystack = [
        e.professional_name,
        e.professional_email,
        e.event_detail?.full_name,
        e.event_detail?.license_number,
        e.event_detail?.license_jurisdiction,
        e.event_detail?.dni,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [events, search, from, to]);

  const handleDownload = async (event: AuditEvent) => {
    const path = event.event_detail?.pdf_storage_path;
    if (!path) {
      toast({ title: "PDF no disponible", variant: "destructive" });
      return;
    }
    setDownloadingId(event.id);
    try {
      const { data, error } = await supabase.storage
        .from("consentimientos-profesionales")
        .createSignedUrl(path, 120);
      if (error) throw error;
      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      toast({
        title: "Error al obtener PDF",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          Auditoría de consentimientos profesionales
          <Badge variant="outline" className="ml-2">
            {filtered.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Label htmlFor="search" className="text-xs">
              Buscar profesional
            </Label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre, email, matrícula, jurisdicción…"
                className="pl-7 h-9 text-sm"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="from" className="text-xs">
              Desde
            </Label>
            <Input
              id="from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="to" className="text-xs">
              Hasta
            </Label>
            <Input
              id="to"
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Mostrando {filtered.length} de {events.length} eventos
          </p>
          <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Recargar
          </Button>
        </div>

        <ScrollArea className="h-[520px] rounded-md border">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              No hay eventos de firma para los filtros seleccionados.
            </p>
          ) : (
            <ul className="divide-y">
              {filtered.map((e) => {
                const d = e.event_detail || {};
                return (
                  <li key={e.id} className="px-4 py-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium truncate">
                          {e.professional_name || d.full_name || "Sin nombre"}
                        </p>
                        <Badge variant="outline" className="text-[10px]">
                          v{d.document_version || "?"}
                        </Badge>
                        {d.license_jurisdiction && (
                          <Badge variant="secondary" className="text-[10px]">
                            {d.license_jurisdiction}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Mat. {d.license_number || "—"} · {d.license_college || "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {e.professional_email && <>{e.professional_email} · </>}
                        DNI {d.dni ? `••••${String(d.dni).slice(-3)}` : "—"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(new Date(e.created_at), "dd MMM yyyy HH:mm:ss", {
                          locale: es,
                        })}
                      </p>
                    </div>
                    {d.pdf_storage_path && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(e)}
                        disabled={downloadingId === e.id}
                      >
                        {downloadingId === e.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
