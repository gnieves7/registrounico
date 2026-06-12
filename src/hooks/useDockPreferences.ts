import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "psi_mac_dock_v1";

export const DEFAULT_DOCK_ITEMS = [
  "dashboard",
  "clinical_notes",
  "sessions",
  "laura",
  "documents",
  "finder",
  "separator",
  "settings",
] as const;

export function useDockPreferences() {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [...DEFAULT_DOCK_ITEMS];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const reset = useCallback(() => setItems([...DEFAULT_DOCK_ITEMS]), []);
  const toggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  return { items, setItems, reset, toggle };
}