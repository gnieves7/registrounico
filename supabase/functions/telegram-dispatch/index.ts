import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type DispatchAction = "create-link" | "send-event";
type EventType = "symbolic_award" | "micro_task" | "session_scheduled" | "session_updated" | "session_cancelled" | "document_ready";

interface TelegramContact {
  chat_id: number;
  notify_sessions: boolean;
  notify_micro_tasks: boolean;
  notify_symbolic_awards: boolean;
  notify_documents: boolean;
}

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const formatDate = (value?: string | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const safeText = (value: unknown) => {
  const normalized = String(value ?? "").trim();
  return normalized ? escapeHtml(normalized) : null;
};

const getPreferenceKey = (eventType: EventType): keyof TelegramContact | null => {
  switch (eventType) {
    case "symbolic_award":
      return "notify_symbolic_awards";
    case "micro_task":
      return "notify_micro_tasks";
    case "session_scheduled":
    case "session_updated":
    case "session_cancelled":
      return "notify_sessions";
    case "document_ready":
      return "notify_documents";
    default:
      return null;
  }
};

const buildMessage = (eventType: EventType, data: Record<string, unknown> = {}) => {
  switch (eventType) {
    case "symbolic_award":
      return {
        title: "🏆 Nuevo premio simbólico",
        text: [
          "🏆 <b>Nuevo premio simbólico</b>",
          `Recibiste <b>${safeText(data.awardTitle) || "un reconocimiento"}</b>.`,
          safeText(data.categoryTitle) ? `Categoría: ${safeText(data.categoryTitle)}` : null,
          safeText(data.clinicalNote) ? `Validación clínica: ${safeText(data.clinicalNote)}` : null,
          "Podés verlo en tu pasaporte terapéutico dentro de la app.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "micro_task":
      return {
        title: "🧩 Nueva micro-tarea",
        text: [
          "🧩 <b>Nueva micro-tarea asignada</b>",
          `Tarea: <b>${safeText(data.title) || "Micro-tarea"}</b>`,
          safeText(data.categoryLabel) ? `Categoría: ${safeText(data.categoryLabel)}` : null,
          safeText(data.dueDate) ? `Fecha límite: ${safeText(data.dueDate)}` : null,
          safeText(data.instructions) ? `Instrucciones: ${safeText(data.instructions)}` : null,
          "Podés completarla desde la sección Micro-Tareas de la app.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "session_scheduled":
      return {
        title: "📅 Turno agendado",
        text: [
          "📅 <b>Nuevo turno agendado</b>",
          safeText(data.sessionDate) ? `Fecha y hora: <b>${safeText(data.sessionDate)}</b>` : null,
          safeText(data.topic) ? `Tema: ${safeText(data.topic)}` : null,
          "Revisá la sección Mis Turnos para ver el detalle.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "session_updated":
      return {
        title: "🗓️ Turno actualizado",
        text: [
          "🗓️ <b>Tu turno fue actualizado</b>",
          safeText(data.sessionDate) ? `Nueva fecha y hora: <b>${safeText(data.sessionDate)}</b>` : null,
          safeText(data.topic) ? `Tema: ${safeText(data.topic)}` : null,
          "Entrá a Mis Turnos para revisar los cambios.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "session_cancelled":
      return {
        title: "❌ Turno cancelado",
        text: [
          "❌ <b>Se canceló un turno</b>",
          safeText(data.sessionDate) ? `Turno: ${safeText(data.sessionDate)}` : null,
          safeText(data.topic) ? `Tema: ${safeText(data.topic)}` : null,
          "Si necesitás, coordiná un nuevo espacio desde la app.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    case "document_ready":
      return {
        title: "📄 Documento listo",
        text: [
          "📄 <b>Tu informe está listo</b>",
          safeText(data.title) ? `Documento: <b>${safeText(data.title)}</b>` : null,
          "Encontralo en la sección Informes de la app.",
        ]
          .filter(Boolean)
          .join("\n"),
      };
    default:
      return {
        title: "🔔 Nueva notificación",
        text: "Tenés una novedad disponible en la app.",
      };
  }
};

async function callTelegram(path: string, body: Record<string, unknown>) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

  const response = await fetch(`${GATEWAY_URL}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": TELEGRAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Telegram API call failed [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured");

    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseAnonKey) throw new Error("SUPABASE_ANON_KEY is not configured");

    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseServiceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: claimsData, error: authError } = await authClient.auth.getClaims(token);
    const userId = claimsData?.claims?.sub;

    if (authError || !userId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const service = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { action, recipientUserId, eventType, data = {} } = (await req.json()) as {
      action: DispatchAction;
      recipientUserId?: string;
      eventType?: EventType;
      data?: Record<string, unknown>;
    };

    if (action === "create-link") {
      const me = await callTelegram("getMe", {});
      const botUsername = me?.result?.username as string | undefined;
      if (!botUsername) {
        return jsonResponse({ error: "No se pudo detectar el bot de Telegram conectado." }, 500);
      }

      const token = `${crypto.randomUUID().replace(/-/g, "")}${Date.now().toString(36)}`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await service
        .from("telegram_link_tokens")
        .update({ used_at: new Date().toISOString() })
        .eq("user_id", userId)
        .is("used_at", null);

      await service.from("telegram_link_tokens").insert({
        user_id: userId,
        token,
        expires_at: expiresAt,
      } as any);

      return jsonResponse({
        success: true,
        link: `https://t.me/${botUsername}?start=${token}`,
        botUsername,
        expiresAt,
      });
    }

    if (action !== "send-event" || !recipientUserId || !eventType) {
      return jsonResponse({ error: "Invalid action" }, 400);
    }

    const { data: roleRow } = await service
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    const isAdmin = Boolean(roleRow);
    if (!isAdmin && recipientUserId !== userId) {
      return jsonResponse({ error: "Admin access required" }, 403);
    }

    const { data: contact } = await service
      .from("telegram_contacts")
      .select("chat_id, notify_sessions, notify_micro_tasks, notify_symbolic_awards, notify_documents")
      .eq("user_id", recipientUserId)
      .eq("is_active", true)
      .order("linked_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!contact) {
      await service.from("telegram_delivery_logs").insert({
        user_id: recipientUserId,
        event_type: eventType,
        title: buildMessage(eventType, data).title,
        message_text: buildMessage(eventType, data).text,
        payload: data,
        delivery_status: "skipped",
        error_message: "No active Telegram contact linked",
      } as any);

      return jsonResponse({ success: true, delivered: false, connected: false, reason: "No hay un chat vinculado." });
    }

    const preferenceKey = getPreferenceKey(eventType);
    if (preferenceKey && contact[preferenceKey] === false) {
      await service.from("telegram_delivery_logs").insert({
        user_id: recipientUserId,
        chat_id: contact.chat_id,
        event_type: eventType,
        title: buildMessage(eventType, data).title,
        message_text: buildMessage(eventType, data).text,
        payload: data,
        delivery_status: "skipped",
        error_message: "Preference disabled for this event type",
      } as any);

      return jsonResponse({ success: true, delivered: false, connected: true, reason: "Las preferencias del usuario desactivan este aviso." });
    }

    const message = buildMessage(eventType, {
      ...data,
      sessionDate: typeof data.sessionDate === "string" ? formatDate(data.sessionDate) : data.sessionDate,
      dueDate: typeof data.dueDate === "string" ? formatDate(data.dueDate) : data.dueDate,
    });

    try {
      await callTelegram("sendMessage", {
        chat_id: contact.chat_id,
        text: message.text,
        parse_mode: "HTML",
      });

      await service.from("telegram_delivery_logs").insert({
        user_id: recipientUserId,
        chat_id: contact.chat_id,
        event_type: eventType,
        title: message.title,
        message_text: message.text,
        payload: data,
        delivery_status: "sent",
        sent_at: new Date().toISOString(),
      } as any);

      return jsonResponse({ success: true, delivered: true, connected: true });
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unknown Telegram delivery error";

      await service.from("telegram_delivery_logs").insert({
        user_id: recipientUserId,
        chat_id: contact.chat_id,
        event_type: eventType,
        title: message.title,
        message_text: message.text,
        payload: data,
        delivery_status: "failed",
        error_message: messageText,
      } as any);

      return jsonResponse({ success: false, delivered: false, connected: true, reason: messageText }, 500);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("telegram-dispatch error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
