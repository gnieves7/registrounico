import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

/**
 * Verifica en tiempo real si el usuario autenticado tiene rol admin.
 * Fuente de verdad: tabla public.user_roles (no usa user_metadata ni JWT claims).
 * Devuelve { isAdmin, isChecking } para permitir mostrar loading states sin flash.
 */
export function useIsAdmin() {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!user) {
        if (!cancelled) setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setIsAdmin(!error && !!data);
    };

    if (!authLoading) check();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return {
    isAdmin: isAdmin === true,
    isChecking: authLoading || isAdmin === null,
  };
}