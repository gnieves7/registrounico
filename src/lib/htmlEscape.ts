/**
 * Escapes a value for safe interpolation inside HTML strings used in
 * print/report popups. Prevents stored XSS via user-controlled fields.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const h = escapeHtml;