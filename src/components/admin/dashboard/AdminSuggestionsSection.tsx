import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Send, MessageSquare, ChevronDown, ChevronUp, CheckCircle2, XCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AdminSuggestion {
  id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
  user_id: string;
  decision_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  author?: { full_name: string | null; email: string | null } | null;
}

interface ThreadComment {
  id: string;
  body: string;
  author_role: "professional" | "admin";
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "nueva", label: "Abierto" },
  { value: "en_revision", label: "En revisión" },
  { value: "implementada", label: "Aprobado" },
  { value: "descartada", label: "Rechazado" },
];

const STATUS_COLOR: Record<string, string> = {
  nueva: "bg-slate-100 text-slate-700",
  en_revision: "bg-amber-100 text-amber-700",
  implementada: "bg-emerald-100 text-emerald-700",
  descartada: "bg-rose-100 text-rose-700",
};

export function AdminSuggestionsSection() {
  const [items, setItems] = useState<AdminSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [threads, setThreads] = useState<Record<string, ThreadComment[]>>({});
  const [openThread, setOpenThread] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [decisionDrafts, setDecisionDrafts] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data: sugs, error } = await supabase
      .from("suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error al cargar", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const ids = Array.from(new Set((sugs || []).map((s: any) => s.user_id)));
    let profiles: Record<string, any> = {};
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", ids);
      profiles = Object.fromEntries((profs || []).map((p: any) => [p.user_id, p]));
    }
    setItems(((sugs || []) as any[]).map((s) => ({ ...s, author: profiles[s.user_id] || null })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveResponse = async (id: string) => {
    const text = (drafts[id] || "").trim();
    if (!text) {
      toast({ title: "Escribí una respuesta", variant: "destructive" });
      return;
    }
    setSavingId(id);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("suggestions")
      .update({
        admin_response: text,
        responded_at: new Date().toISOString(),
        responded_by: user?.id,
        status: "en_revision",
      })
      .eq("id", id);
    setSavingId(null);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Respuesta enviada" });
    setDrafts((d) => ({ ...d, [id]: "" }));
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "implementada") patch.approved_at = new Date().toISOString();
    if (status === "descartada") patch.rejected_at = new Date().toISOString();
    const { error } = await supabase.from("suggestions").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    load();
  };

  const saveDecisionReason = async (id: string) => {
    const reason = (decisionDrafts[id] || "").trim();
    if (!reason) {
      toast({ title: "Indicá el motivo", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("suggestions").update({ decision_reason: reason }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Motivo registrado" });
    setDecisionDrafts((d) => ({ ...d, [id]: "" }));
    load();
  };

  const loadThread = async (id: string) => {
    const { data } = await supabase
      .from("suggestion_comments")
      .select("id, body, author_role, created_at")
      .eq("suggestion_id", id)
      .order("created_at", { ascending: true });
    setThreads((t) => ({ ...t, [id]: (data as ThreadComment[]) || [] }));
  };

  const toggleThread = (id: string) => {
    if (openThread === id) setOpenThread(null);
    else { setOpenThread(id); if (!threads[id]) loadThread(id); }
  };

  const sendComment = async (id: string) => {
    if (!comment.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("suggestion_comments").insert({
      suggestion_id: id,
      author_id: user?.id,
      author_role: "admin",
      body: comment.trim(),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    setComment("");
    loadThread(id);
  };

  const visible = filter === "all" ? items : items.filter((s) => s.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-bold">Sugerencias de profesionales</h2>
          <p className="text-sm text-muted-foreground">Canal de comunicación directo.</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : visible.length === 0 ? (
        <Card><CardContent className="text-sm text-muted-foreground py-10 text-center">
          No hay sugerencias.
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {visible.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{s.title}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {s.author?.full_name || s.author?.email || s.user_id.slice(0, 8)} · {new Date(s.created_at).toLocaleString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                    <Badge className={`text-[10px] border-0 ${STATUS_COLOR[s.status] || ""}`}>
                      {STATUS_OPTIONS.find(o => o.value === s.status)?.label || s.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{s.message}</p>

                {s.admin_response && (
                  <div className="rounded-md bg-primary/5 border border-primary/15 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">Tu respuesta</p>
                    <p className="text-sm whitespace-pre-wrap">{s.admin_response}</p>
                  </div>
                )}

                {(s.status === "implementada" || s.status === "descartada") && (
                  <div className={`rounded-md border p-3 space-y-2 ${s.status === "implementada" ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                      {s.status === "implementada" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                      Motivo de decisión
                    </p>
                    {s.decision_reason ? (
                      <p className="text-sm whitespace-pre-wrap">{s.decision_reason}</p>
                    ) : (
                      <div className="flex gap-2">
                        <Textarea
                          rows={2}
                          placeholder="Dejá registrado por qué se aprobó o rechazó este ticket…"
                          value={decisionDrafts[s.id] || ""}
                          onChange={(e) => setDecisionDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                        />
                        <Button size="sm" onClick={() => saveDecisionReason(s.id)} className="self-end">
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t">
                  <Textarea
                    placeholder={s.admin_response ? "Actualizar respuesta…" : "Responder al profesional…"}
                    value={drafts[s.id] || ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [s.id]: e.target.value }))}
                    rows={2}
                  />
                  <div className="flex flex-wrap items-center gap-2 justify-between">
                    <Select value={s.status} onValueChange={(v) => updateStatus(s.id, v)}>
                      <SelectTrigger className="w-[170px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => saveResponse(s.id)} disabled={savingId === s.id} className="gap-2">
                      {savingId === s.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Enviar respuesta
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Button variant="ghost" size="sm" onClick={() => toggleThread(s.id)} className="gap-1.5 -ml-2">
                    {openThread === s.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    <MessageSquare className="h-3.5 w-3.5" />
                    Hilo de conversación ({(threads[s.id] || []).length})
                  </Button>
                  {openThread === s.id && (
                    <div className="mt-3 space-y-3">
                      {(threads[s.id] || []).length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">Sin comentarios todavía.</p>
                      ) : (
                        <div className="space-y-2">
                          {(threads[s.id] || []).map((c) => (
                            <div
                              key={c.id}
                              className={`rounded-md p-2.5 text-sm ${c.author_role === "admin" ? "bg-primary/5 border border-primary/15" : "bg-muted/50 border border-border"}`}
                            >
                              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1">
                                {c.author_role === "admin" ? "Vos (admin)" : "Profesional"} · {new Date(c.created_at).toLocaleString("es-AR")}
                              </p>
                              <p className="whitespace-pre-wrap">{c.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Textarea
                          value={openThread === s.id ? comment : ""}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Comentar en el hilo…"
                          rows={2}
                          className="text-sm"
                        />
                        <Button onClick={() => sendComment(s.id)} disabled={!comment.trim()} size="sm" className="gap-1.5 self-end">
                          <Send className="h-3.5 w-3.5" /> Enviar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}