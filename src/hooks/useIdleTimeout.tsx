import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const IDLE_WARN_MS = 28 * 60 * 1000; // 28 minutes
const IDLE_LOGOUT_MS = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_EVENTS = ["mousedown", "keydown", "touchstart", "scroll"] as const;

interface UseIdleTimeoutOptions {
  enabled: boolean;
}

/**
 * Idle session manager:
 * - At 28 min of inactivity: shows a warning modal.
 * - At 30 min: signs the user out.
 * Activity (mouse/keyboard/touch/scroll) resets the timers.
 */
export function useIdleTimeout({ enabled }: UseIdleTimeoutOptions) {
  const [showWarning, setShowWarning] = useState(false);
  const warnTimer = useRef<number | null>(null);
  const logoutTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (warnTimer.current) window.clearTimeout(warnTimer.current);
    if (logoutTimer.current) window.clearTimeout(logoutTimer.current);
    warnTimer.current = null;
    logoutTimer.current = null;
  }, []);

  const performLogout = useCallback(async () => {
    clearTimers();
    setShowWarning(false);
    try {
      await supabase.auth.signOut();
    } catch {
      /* noop */
    }
    toast.message("Sesión cerrada por inactividad", {
      description: "Por tu seguridad, volvé a iniciar sesión.",
    });
    if (typeof window !== "undefined") window.location.assign("/login");
  }, [clearTimers]);

  const resetTimers = useCallback(() => {
    clearTimers();
    if (!enabled) return;
    setShowWarning(false);
    warnTimer.current = window.setTimeout(() => setShowWarning(true), IDLE_WARN_MS);
    logoutTimer.current = window.setTimeout(performLogout, IDLE_LOGOUT_MS);
  }, [clearTimers, enabled, performLogout]);

  const stayLoggedIn = useCallback(() => {
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }
    resetTimers();

    const onActivity = () => {
      // Only reset if warning is not shown — keep modal in control while shown
      if (!showWarning) resetTimers();
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, onActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, onActivity));
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, showWarning]);

  return { showWarning, stayLoggedIn, performLogout };
}
