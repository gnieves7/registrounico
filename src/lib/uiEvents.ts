/**
 * Lightweight global event bus for contextual admin actions.
 * Sections subscribe with onAdminAction; the layout dispatches with emitAdminAction.
 */
export type AdminActionEvent =
  | "new-note"
  | "new-booking"
  | "new-interview"
  | "new-symbolic"
  | "focus-search";

const PREFIX = "admin:";

export function emitAdminAction(name: AdminActionEvent, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(`${PREFIX}${name}`, { detail }));
}

export function onAdminAction(
  name: AdminActionEvent,
  handler: (detail: unknown) => void,
): () => void {
  const wrapped = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(`${PREFIX}${name}`, wrapped);
  return () => window.removeEventListener(`${PREFIX}${name}`, wrapped);
}