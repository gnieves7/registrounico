import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ProfessionalSubscription {
  id: string;
  user_id: string;
  trial_started_at: string;
  trial_ends_at: string;
  plan: string | null;
  status: "trial" | "active" | "expired" | "suspended";
  paid_until: string | null;
  last_payment_id: string | null;
  last_payment_at: string | null;
  amount_usd: number | null;
}

interface AccessState {
  loading: boolean;
  subscription: ProfessionalSubscription | null;
  isProfessional: boolean;
  hasAccess: boolean;
  isOnTrial: boolean;
  trialDaysLeft: number;
  needsPayment: boolean;
  needsConsent: boolean;
  isSantaFe: boolean;
  jurisdiction: string | null;
}

export function useProfessionalAccess() {
  const { user, profile, isAdmin, isApproved } = useAuth();
  const [state, setState] = useState<AccessState>({
    loading: true,
    subscription: null,
    isProfessional: false,
    hasAccess: false,
    isOnTrial: false,
    trialDaysLeft: 0,
    needsPayment: false,
    needsConsent: false,
    isSantaFe: false,
    jurisdiction: null,
  });

  const refresh = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    // Admin always has access
    if (isAdmin) {
      setState({
        loading: false,
        subscription: null,
        isProfessional: false,
        hasAccess: true,
        isOnTrial: false,
        trialDaysLeft: 0,
        needsPayment: false,
        needsConsent: false,
        isSantaFe: true,
        jurisdiction: "Santa Fe",
      });
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("account_type, license_number, consent_accepted_at, license_jurisdiction")
      .eq("user_id", user.id)
      .maybeSingle();

    const isProfessional = (prof as any)?.account_type === "professional";

    if (!isProfessional) {
      setState({
        loading: false,
        subscription: null,
        isProfessional: false,
        hasAccess: true, // patients are gated by is_approved elsewhere
        isOnTrial: false,
        trialDaysLeft: 0,
        needsPayment: false,
        needsConsent: false,
        isSantaFe: false,
        jurisdiction: null,
      });
      return;
    }

    const needsConsent = !(prof as any)?.consent_accepted_at;
    const jurisdiction: string | null = (prof as any)?.license_jurisdiction ?? null;
    const isSantaFe = (jurisdiction || "").trim().toLowerCase() === "santa fe";

    // Acceso 100% gratuito para todo profesional autorizado por el administrador.
    // No hay suscripción ni pago. La aprobación se gestiona desde la allowlist del admin.
    const hasAccess = !needsConsent && isApproved === true;
    const needsPayment = false;
    const isOnTrial = false;
    const trialDaysLeft = 0;

    setState({
      loading: false,
      subscription: null,
      isProfessional: true,
      hasAccess,
      isOnTrial,
      trialDaysLeft,
      needsPayment,
      needsConsent,
      isSantaFe,
      jurisdiction,
    });
  }, [user, isAdmin, isApproved]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
