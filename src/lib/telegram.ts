import { supabase } from "@/integrations/supabase/client";

export type TelegramEventType =
  | "symbolic_award"
  | "micro_task"
  | "session_scheduled"
  | "session_updated"
  | "session_cancelled"
  | "document_ready";

export interface TelegramFunctionResponse {
  success: boolean;
  delivered?: boolean;
  connected?: boolean;
  reason?: string;
  link?: string;
  botUsername?: string;
  processed?: number;
  linked?: number;
}

export async function createTelegramLink() {
  return supabase.functions.invoke<TelegramFunctionResponse>("telegram-dispatch", {
    body: { action: "create-link" },
  });
}

export async function sendTelegramEvent(params: {
  recipientUserId: string;
  eventType: TelegramEventType;
  data?: Record<string, unknown>;
}) {
  return supabase.functions.invoke<TelegramFunctionResponse>("telegram-dispatch", {
    body: {
      action: "send-event",
      ...params,
    },
  });
}

export async function syncTelegramMessages(manual = true) {
  return supabase.functions.invoke<TelegramFunctionResponse>("telegram-poll", {
    body: { manual },
  });
}
