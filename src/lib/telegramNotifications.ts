import { sendTelegramEvent, type TelegramEventType } from "@/lib/telegram";

interface BroadcastTelegramEventParams {
  recipientUserIds: Array<string | null | undefined>;
  eventType: TelegramEventType;
  data?: Record<string, unknown>;
}

export async function broadcastTelegramEvent({
  recipientUserIds,
  eventType,
  data,
}: BroadcastTelegramEventParams) {
  const uniqueRecipientIds = Array.from(
    new Set(recipientUserIds.filter((recipientUserId): recipientUserId is string => Boolean(recipientUserId))),
  );

  return Promise.allSettled(
    uniqueRecipientIds.map((recipientUserId) =>
      sendTelegramEvent({
        recipientUserId,
        eventType,
        data,
      }),
    ),
  );
}

interface NotifyPatientAndAdminParams {
  patientUserId: string;
  adminUserId?: string | null;
  eventType: TelegramEventType;
  data?: Record<string, unknown>;
}

export async function notifyPatientAndAdmin({
  patientUserId,
  adminUserId,
  eventType,
  data,
}: NotifyPatientAndAdminParams) {
  return broadcastTelegramEvent({
    recipientUserIds: [patientUserId, adminUserId],
    eventType,
    data,
  });
}
