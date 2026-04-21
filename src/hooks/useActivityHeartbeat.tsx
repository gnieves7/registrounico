import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Refreshes `professional_subscriptions.last_activity_at` periodically while
 * a professional is using the app. Used to compute the 90-day inactivity rule.
 * Safe to mount inside any authenticated layout.
 */
export function useActivityHeartbeat() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const ping = () => {
      if (cancelled) return;
      // best-effort: ignore failures (e.g. patient accounts won't have a row)
      supabase.rpc("mark_professional_active").then(() => {});
    };
    ping();
    const id = window.setInterval(ping, 1000 * 60 * 30); // every 30 minutes
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [user]);
}