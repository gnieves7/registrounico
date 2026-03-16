import { useCallback, useEffect, useMemo, useState } from "react";
import { format, formatDistanceToNow, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import {
  BellRing,
  Bot,
  CheckCircle2,
  Copy,
  Link as LinkIcon,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { createTelegramLink, syncTelegramMessages } from "@/lib/telegram";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TelegramContact {
  id: string;
  user_id: string;
  chat_id: string;
  telegram_username: string | null;
  telegram_first_name: string | null;
  telegram_last_name: string | null;
  notify_sessions: boolean;
  notify_micro_tasks: boolean;
  notify_symbolic_awards: boolean;
  notify_documents: boolean;
  is_active: boolean;
  linked_at: string;
  last_incoming_at: string | null;
}

interface TelegramLinkToken {
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

interface TelegramMessageRecord {
  update_id: string;
  user_id: string | null;
  chat_id: string;
  message_text: string | null;
  received_at: string;
}

const telegramContactsTable = "telegram_contacts" as any;
const telegramTokensTable = "telegram_link_tokens" as any;
const telegramMessagesTable = "telegram_messages" as any;

const preferenceConfig = [
  {
    key: "notify_sessions" as const,
    title: "Turnos y recordatorios",
    description: "Altas, cambios y recordatorios operativos de sesiones.",
  },
  {
    key: "notify_micro_tasks" as const,
    title: "Micro-tareas",
    description: "Avisos cuando se asigna o reenvía una tarea terapéutica.",
  },
  {
    key: "notify_symbolic_awards" as const,
    title: "Premios simbólicos",
    description: "Reconocimientos clínicos y actualizaciones del pasaporte terapéutico.",
  },
  {
    key: "notify_documents" as const,
    title: "Informes y certificados",
    description: "Avisos cuando un informe o certificado queda listo para su descarga.",
  },
];

export default function TelegramCenter() {
  const { user, isAdmin, profile } = useAuth();
  const { toast } = useToast();
  const [contact, setContact] = useState<TelegramContact | null>(null);
  const [latestToken, setLatestToken] = useState<TelegramLinkToken | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<TelegramMessageRecord[]>([]);
  const [profileNames, setProfileNames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadTelegramData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const contactQuery = supabase
      .from(telegramContactsTable)
      .select("id, user_id, chat_id, telegram_username, telegram_first_name, telegram_last_name, notify_sessions, notify_micro_tasks, notify_symbolic_awards, notify_documents, is_active, linked_at, last_incoming_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("linked_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const tokenQuery = supabase
      .from(telegramTokensTable)
      .select("token, expires_at, used_at, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const messagesQuery = (isAdmin
      ? supabase
          .from(telegramMessagesTable)
          .select("update_id, user_id, chat_id, message_text, received_at")
          .order("received_at", { ascending: false })
          .limit(20)
      : supabase
          .from(telegramMessagesTable)
          .select("update_id, user_id, chat_id, message_text, received_at")
          .eq("user_id", user.id)
          .order("received_at", { ascending: false })
          .limit(20)) as any;

    const [{ data: contactData }, { data: tokenData }, { data: messageData }] = await Promise.all([
      contactQuery,
      tokenQuery,
      messagesQuery,
    ]);

    const nextMessages = ((messageData ?? []) as TelegramMessageRecord[]).filter(Boolean);
    setContact(((contactData as unknown) as TelegramContact | null) ?? null);
    setLatestToken(((tokenData as unknown) as TelegramLinkToken | null) ?? null);
    setMessages(nextMessages);

    if (isAdmin) {
      const userIds = Array.from(new Set(nextMessages.map((message) => message.user_id).filter(Boolean))) as string[];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        setProfileNames(
          Object.fromEntries((profilesData ?? []).map((item) => [item.user_id, item.full_name || "Paciente"]))
        );
      } else {
        setProfileNames({});
      }
    }

    setIsLoading(false);
  }, [isAdmin, user?.id]);

  useEffect(() => {
    void loadTelegramData();
  }, [loadTelegramData]);

  const isTokenPending = useMemo(() => {
    if (!latestToken || latestToken.used_at) return false;
    return isAfter(new Date(latestToken.expires_at), new Date());
  }, [latestToken]);

  const handleGenerateLink = async () => {
    setIsGeneratingLink(true);
    try {
      const { data, error } = await createTelegramLink();
      if (error) throw error;
      if (!data?.link) throw new Error("No se pudo generar el enlace de vinculación.");
      setGeneratedLink(data.link);
      setBotUsername(data.botUsername || null);
      toast({ title: "Enlace listo", description: "Abrí Telegram con el enlace y enviá el comando de inicio." });
      await loadTelegramData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo generar el enlace.", variant: "destructive" });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const copyLink = async () => {
    if (!generatedLink) return;
    await navigator.clipboard.writeText(generatedLink);
    toast({ title: "Enlace copiado", description: "Podés pegarlo o abrirlo desde Telegram." });
  };

  const updatePreference = async (key: keyof Pick<TelegramContact, "notify_sessions" | "notify_micro_tasks" | "notify_symbolic_awards" | "notify_documents">, value: boolean) => {
    if (!contact) return;

    const previous = contact[key];
    setContact({ ...contact, [key]: value });

    const { error } = await supabase
      .from(telegramContactsTable)
      .update({ [key]: value } as any)
      .eq("id", contact.id)
      .eq("user_id", user?.id);

    if (error) {
      setContact({ ...contact, [key]: previous });
      toast({ title: "Error", description: "No se pudo actualizar la preferencia.", variant: "destructive" });
      return;
    }

    toast({ title: "Preferencia actualizada", description: "Tu configuración de Telegram quedó guardada." });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const { data, error } = await syncTelegramMessages(true);
      if (error) throw error;
      toast({ title: "Sincronización completa", description: `Se procesaron ${data?.processed ?? 0} mensajes.` });
      await loadTelegramData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudieron sincronizar los mensajes.", variant: "destructive" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Bot className="h-3.5 w-3.5 text-primary" />
                Canal clínico por Telegram
              </div>
              <CardTitle className="font-serif text-2xl md:text-3xl">Telegram conectado al sistema</CardTitle>
              <CardDescription className="max-w-3xl text-sm md:text-base">
                Vinculá el chat para recibir avisos de turnos, micro-tareas y premios simbólicos, y dejar trazabilidad de mensajes entrantes.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 self-start">
              {isAdmin && (
                <Button variant="outline" className="gap-2" onClick={handleSync} disabled={isSyncing}>
                  <RefreshCcw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                  Sincronizar mensajes
                </Button>
              )}
              <Button onClick={handleGenerateLink} disabled={isGeneratingLink} className="gap-2">
                <LinkIcon className="h-4 w-4" />
                {isGeneratingLink ? "Generando..." : contact ? "Regenerar enlace" : "Conectar Telegram"}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{contact ? "Vinculado" : isTokenPending ? "Pendiente" : "Sin vincular"}</p>
                  <p className="text-sm text-muted-foreground">Estado del canal</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-secondary p-3 text-secondary-foreground">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{contact ? "Alertas activas" : "Sin alertas"}</p>
                  <p className="text-sm text-muted-foreground">Notificaciones operativas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-background/80">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-full bg-accent p-3 text-accent-foreground">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{messages.length}</p>
                  <p className="text-sm text-muted-foreground">Mensajes registrados</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardHeader>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vinculación del chat</CardTitle>
              <CardDescription>
                {profile?.full_name || "Usuario"}, usá un enlace temporal para conectar tu chat con el sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contact ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    <p className="font-medium">Chat activo</p>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <p>
                      {contact.telegram_first_name || "Cuenta vinculada"}
                      {contact.telegram_username ? ` · @${contact.telegram_username}` : ""}
                    </p>
                    <p>Vinculado el {format(new Date(contact.linked_at), "dd/MM/yyyy HH:mm", { locale: es })}</p>
                    {contact.last_incoming_at && (
                      <p>Último mensaje recibido {formatDistanceToNow(new Date(contact.last_incoming_at), { addSuffix: true, locale: es })}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  Todavía no hay un chat vinculado. Generá un enlace y abrilo desde Telegram para activar el canal.
                </div>
              )}

              {generatedLink && (
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm font-medium text-foreground">Enlace temporal listo</p>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{generatedLink}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild size="sm">
                      <a href={generatedLink} target="_blank" rel="noreferrer">Abrir Telegram</a>
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyLink} className="gap-2">
                      <Copy className="h-3.5 w-3.5" />
                      Copiar enlace
                    </Button>
                  </div>
                  {botUsername && <p className="mt-2 text-xs text-muted-foreground">Bot detectado: @{botUsername}</p>}
                </div>
              )}

              {isTokenPending && !generatedLink && (
                <div className="rounded-2xl border border-border/70 bg-background p-4 text-sm text-muted-foreground">
                  Ya hay un enlace pendiente creado el {format(new Date(latestToken!.created_at), "dd/MM/yyyy HH:mm", { locale: es })}. Si no lo usaste, podés generar uno nuevo.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferencias de avisos</CardTitle>
              <CardDescription>Podés ajustar qué tipo de alertas querés recibir por Telegram.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preferenceConfig.map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">{item.title}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={contact ? contact[item.key] : false}
                    disabled={!contact}
                    onCheckedChange={(checked) => updatePreference(item.key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground md:text-2xl">Mensajes recibidos</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? "Vista operativa del canal entrante para seguimiento clínico y administrativo." : "Tus mensajes entrantes registrados en el canal clínico."}
            </p>
          </div>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[34rem]">
                <div className="space-y-3 p-4">
                  {isLoading ? (
                    <div className="rounded-2xl border border-border/70 bg-card p-4 text-sm text-muted-foreground">Cargando actividad de Telegram...</div>
                  ) : messages.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center">
                      <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-3 font-medium text-foreground">Todavía no hay mensajes entrantes</p>
                      <p className="mt-1 text-sm text-muted-foreground">Cuando el chat reciba mensajes, aparecerán acá con trazabilidad temporal.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.update_id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">Telegram</Badge>
                          {isAdmin && (
                            <Badge variant="outline">
                              {message.user_id ? profileNames[message.user_id] || "Paciente" : "Sin vincular"}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(message.received_at), { addSuffix: true, locale: es })}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-foreground">{message.message_text || "Mensaje no textual"}</p>
                        <p className="mt-2 text-xs text-muted-foreground">Chat #{message.chat_id}</p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
