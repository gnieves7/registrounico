import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

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

async function sendBotMessage(chatId: number, text: string) {
  await callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
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
    const service = createClient(supabaseUrl, supabaseServiceRoleKey);
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const body = await req.json().catch(() => ({}));
    const manual = Boolean(body?.manual);

    let isAuthorized = token === supabaseAnonKey;

    if (!isAuthorized) {
      const {
        data: { user },
        error,
      } = await authClient.auth.getUser();

      if (!error && user) {
        const { data: roleRow } = await service
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        isAuthorized = Boolean(roleRow);
      }
    }

    if (!isAuthorized) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: state, error: stateError } = await service
      .from("telegram_bot_state")
      .select("id, update_offset")
      .eq("id", 1)
      .single();

    if (stateError) throw stateError;

    const response = await callTelegram("getUpdates", {
      offset: state.update_offset,
      timeout: manual ? 2 : 50,
      allowed_updates: ["message"],
    });

    const updates = Array.isArray(response?.result) ? response.result : [];

    if (updates.length === 0) {
      return jsonResponse({ success: true, processed: 0, linked: 0 });
    }

    let linked = 0;

    for (const update of updates) {
      const message = update?.message;
      if (!message) continue;

      const chatId = Number(message.chat?.id);
      const messageText = typeof message.text === "string" ? message.text : null;
      const telegramUsername = message.from?.username ?? null;
      const telegramFirstName = message.from?.first_name ?? null;
      const telegramLastName = message.from?.last_name ?? null;
      const phoneNumber = message.contact?.phone_number ?? null;
      const receivedAt = message.date ? new Date(message.date * 1000).toISOString() : new Date().toISOString();

      let linkedUserId: string | null = null;

      if (messageText?.startsWith("/start ")) {
        const startToken = messageText.replace("/start ", "").trim();
        const { data: linkToken } = await service
          .from("telegram_link_tokens")
          .select("id, user_id, expires_at, used_at")
          .eq("token", startToken)
          .maybeSingle();

        if (linkToken && !linkToken.used_at && new Date(linkToken.expires_at) > new Date()) {
          linkedUserId = linkToken.user_id;

          await service
            .from("telegram_contacts")
            .update({ is_active: false })
            .eq("user_id", linkedUserId);

          await service.from("telegram_contacts").upsert(
            {
              user_id: linkedUserId,
              chat_id: chatId,
              telegram_username: telegramUsername,
              telegram_first_name: telegramFirstName,
              telegram_last_name: telegramLastName,
              phone_number: phoneNumber,
              chat_type: message.chat?.type ?? "private",
              is_active: true,
              linked_at: new Date().toISOString(),
              last_incoming_at: receivedAt,
            } as any,
            { onConflict: "chat_id" },
          );

          await service
            .from("telegram_link_tokens")
            .update({ used_at: new Date().toISOString() })
            .eq("id", linkToken.id);

          await sendBotMessage(
            chatId,
            "✅ <b>Canal vinculado</b>\nTu chat quedó conectado con el sistema. A partir de ahora recibirás avisos clínicos y operativos según tus preferencias.",
          );
          linked += 1;
        } else {
          await sendBotMessage(
            chatId,
            "⚠️ <b>Enlace inválido o vencido</b>\nVolvé a la app y generá un nuevo enlace de vinculación.",
          );
        }
      } else {
        const { data: contact } = await service
          .from("telegram_contacts")
          .select("user_id")
          .eq("chat_id", chatId)
          .eq("is_active", true)
          .maybeSingle();

        linkedUserId = contact?.user_id ?? null;

        if (linkedUserId) {
          await service
            .from("telegram_contacts")
            .update({ last_incoming_at: receivedAt })
            .eq("chat_id", chatId)
            .eq("is_active", true);
        }
      }

      await service.from("telegram_messages").upsert(
        {
          update_id: update.update_id,
          user_id: linkedUserId,
          chat_id: chatId,
          message_id: message.message_id,
          direction: "incoming",
          message_text: messageText,
          raw_update: update,
          received_at: receivedAt,
        } as any,
        { onConflict: "update_id" },
      );

      if (linkedUserId && messageText && !messageText.startsWith("/start ")) {
        const { data: admins } = await service
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");

        if (admins?.length) {
          await service.from("app_notifications").insert(
            admins.map((admin) => ({
              recipient_user_id: admin.user_id,
              notification_type: "telegram_message",
              title: "Nuevo mensaje en Telegram",
              message: messageText.length > 120 ? `${messageText.slice(0, 117)}...` : messageText,
              related_table: "telegram_messages",
              related_record_id: null,
              route: "/telegram",
              metadata: {
                source_user_id: linkedUserId,
                chat_id: chatId,
                update_id: update.update_id,
              },
            })) as any,
          );
        }
      }
    }

    const newOffset = Math.max(...updates.map((item: { update_id: number }) => item.update_id)) + 1;

    await service
      .from("telegram_bot_state")
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq("id", 1);

    return jsonResponse({ success: true, processed: updates.length, linked });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("telegram-poll error:", message);
    return jsonResponse({ error: message }, 500);
  }
});
