import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";

export type UserRole = "patient" | "professional" | "admin";

/**
 * Determina el rol funcional del usuario para el control de acceso de UI.
 * - admin: usuario con rol 'admin' en user_roles
 * - professional: account_type = 'professional' en profiles
 * - patient: por defecto
 *
 * En modo demo, asume 'professional' para mostrar el contenido completo.
 */
export function useUserRole() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const { isDemoMode } = useDemoMode();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const resolve = async () => {
      if (isDemoMode) {
        if (!cancelled) {
          setRole("professional");
          setLoading(false);
        }
        return;
      }

      if (!user) {
        if (!cancelled) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      if (isAdmin) {
        if (!cancelled) {
          setRole("admin");
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;
      const accountType = (data as { account_type?: string } | null)?.account_type;
      setRole(accountType === "professional" ? "professional" : "patient");
      setLoading(false);
    };

    if (!authLoading) resolve();

    return () => {
      cancelled = true;
    };
  }, [user, isAdmin, authLoading, isDemoMode]);

  return {
    role,
    loading,
    isPatient: role === "patient",
    isProfessional: role === "professional" || role === "admin",
    isAdmin: role === "admin",
  };
}
