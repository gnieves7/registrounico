import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MessageSquarePlus, Loader2, CheckCircle2 } from "lucide-react";

interface SessionProposalWidgetProps {
  /** Identificador interno de la sección (ej: 'psychological_autopsy', 'emotional_thermometer') */
  sectionKey: string;
  /** Nombre legible para el psicólogo */
  sectionLabel: string;
  /** Variante compacta (sin descripción larga) */
  compact?: boolean;
}

/**
 * Widget que permite al paciente dejar un tema o pregunta para su próxima sesión,
 * vinculado a la sección informativa que está consultando.
 *
 * Solo se muestra a usuarios con rol "patient" (no a profesionales/admins).
 * Las propuestas se guardan en la tabla `suggestions` con category='pregunta_sesion'
 * y `section_key` / `section_label` para que el psicólogo pueda agruparlas en su panel.
 */
export function SessionProposalWidget({ sectionKey, sectionLabel, compact = false }: SessionProposalWidgetProps) {
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();
  const { isPatient, loading: roleLoading } = useUserRole();
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [justSent, setJustSent] = useState(false);

  // Solo pacientes ven el widget. En modo demo no se muestra (el demo es profesional).
  if (roleLoading || !isPatient || isDemoMode) return null;

  const canSubmit = (topic.trim().length > 0 || question.trim().length > 0) && !submitting;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debés iniciar sesión para enviar tu propuesta");
      return;
    }
    const cleanTopic = topic.trim();
    const cleanQuestion = question.trim();
    if (!cleanTopic && !cleanQuestion) return;

    setSubmitting(true);
    const title = cleanTopic
      ? cleanTopic.slice(0, 120)
      : cleanQuestion.slice(0, 120);
    const message = [
      cleanTopic ? `Tema propuesto:\n${cleanTopic}` : null,
      cleanQuestion ? `Pregunta para la próxima sesión:\n${cleanQuestion}` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    const { error } = await supabase.from("suggestions").insert({
      user_id: user.id,
      title,
      message,
      category: "pregunta_sesion",
      section_key: sectionKey,
      section_label: sectionLabel,
    } as never);

    setSubmitting(false);

    if (error) {
      toast.error("No se pudo enviar tu propuesta", { description: error.message });
      return;
    }
    toast.success("Tu propuesta llegó al psicólogo", {
      description: "La verá antes de tu próxima sesión.",
    });
    setTopic("");
    setQuestion("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 4000);
  };

  return (
    <Card className="border border-primary/20 bg-primary/5 p-4 md:p-5" aria-label="Proponer tema o pregunta para la próxima sesión">
      <div className="flex items-start gap-2.5">
        <MessageSquarePlus className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold md:text-base">
              ¿Querés trabajar esto en tu próxima sesión?
            </h3>
            <Badge variant="outline" className="text-[10px]">
              {sectionLabel}
            </Badge>
          </div>
          {!compact && (
            <p className="text-xs text-muted-foreground md:text-sm">
              Dejá un tema o una pregunta vinculada a lo que estás leyendo. Tu psicólogo
              la verá antes del próximo encuentro y podrán abordarla juntos.
            </p>
          )}
          <div className="space-y-2">
            <label className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Tema (opcional)
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: Cómo me afecta esta lectura"
                maxLength={120}
                className="mt-1"
                aria-label="Tema propuesto"
              />
            </label>
            <label className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Pregunta para la próxima sesión
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Escribí tu pregunta o duda…"
                rows={3}
                maxLength={1000}
                className="mt-1"
                aria-label="Pregunta para la próxima sesión"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-muted-foreground">
              {(topic.length + question.length)} / 1120 caracteres
            </p>
            <div className="flex items-center gap-2">
              {justSent && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Enviado
                </span>
              )}
              <Button size="sm" onClick={handleSubmit} disabled={!canSubmit} className="gap-1.5">
                {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquarePlus className="h-3.5 w-3.5" />}
                Enviar al psicólogo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}