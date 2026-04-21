import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  Lightbulb, Bug, Wrench, Sparkles, Send, Clock, CheckCircle2,
  XCircle, MessageSquare, Loader2,
} from "lucide-react";

interface Suggestion {
  id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "mejora", label: "Mejora", icon: Sparkles, color: "bg-blue-100 text-blue-700" },
  { value: "error", label: "Error / Bug", icon: Bug, color: "bg-red-100 text-red-700" },
  { value: "cambio", label: "Cambio funcional", icon: Wrench, color: "bg-amber-100 text-amber-700" },
  { value: "otro", label: "Otro", icon: Lightbulb, color: "bg-violet-100 text-violet-700" },
];

const STATUS = {
  nueva:        { label: "Nueva",         icon: Clock,        color: "bg-slate-100 text-slate-700" },
  en_revision:  { label: "En revisión",   icon: MessageSquare, color: "bg-amber-100 text-amber-700" },
  implementada: { label: "Implementada",  icon: CheckCircle2, color: "bg-emerald-100 text-emerald-700" },
  descartada:   { label: "Descartada",    icon: XCircle,      color: "bg-rose-100 text-rose-700" },
} as const;

export default function Suggestions() {
  const { user } = useAuth();
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", category: "mejora" });

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("suggestions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error al cargar", description: error.message, variant: "destructive" });
    } else {
      setItems((data as Suggestion[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const submit = async () => {
    if (!user) return;
    if (!form.title.trim() || !form.message.trim()) {
      toast({ title: "Completá título y mensaje", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("suggestions").insert({
      user_id: user.id,
      title: form.title.trim(),
      message: form.message.trim(),
      category: form.category,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error al enviar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Sugerencia enviada", description: "El administrador la revisará a la brevedad." });
    setForm({ title: "", message: "", category: "mejora" });
    load();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 md:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Sugerencias y comentarios</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Canal directo con el administrador. Proponé mejoras, reportá errores o pedí cambios.
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Send className="h-4 w-4 text-primary" /> Nueva sugerencia
          </CardTitle>
          <CardDescription>Tu opinión ayuda a perfeccionar la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <Label htmlFor="s-title">Título *</Label>
              <Input
                id="s-title"
                value={form.title}
                maxLength={140}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Resumen breve"
              />
            </div>
            <div>
              <Label htmlFor="s-cat">Categoría</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger id="s-cat"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="s-msg">Mensaje *</Label>
            <Textarea
              id="s-msg"
              value={form.message}
              maxLength={3000}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Contanos con detalle qué te gustaría sugerir, mejorar o reportar."
              rows={5}
            />
            <p className="text-[11px] text-muted-foreground mt-1">{form.message.length} / 3000</p>
          </div>
          <Button onClick={submit} disabled={submitting} className="gap-2">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar sugerencia
          </Button>
        </CardContent>
      </Card>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Tus sugerencias enviadas
      </h2>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <Card><CardContent className="text-sm text-muted-foreground py-10 text-center">
          Todavía no enviaste sugerencias.
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((s) => {
            const cat = CATEGORIES.find((c) => c.value === s.category) || CATEGORIES[0];
            const st = STATUS[s.status as keyof typeof STATUS] || STATUS.nueva;
            const CatIcon = cat.icon;
            const StIcon = st.icon;
            return (
              <Card key={s.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{s.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(s.created_at).toLocaleString("es-AR")}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className={`gap-1 ${cat.color} border-0`}>
                        <CatIcon className="h-3 w-3" /> {cat.label}
                      </Badge>
                      <Badge variant="outline" className={`gap-1 ${st.color} border-0`}>
                        <StIcon className="h-3 w-3" /> {st.label}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap text-foreground/90">{s.message}</p>
                  {s.admin_response && (
                    <div className="rounded-md bg-primary/5 border border-primary/15 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">
                        Respuesta del administrador
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{s.admin_response}</p>
                      {s.responded_at && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {new Date(s.responded_at).toLocaleString("es-AR")}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}