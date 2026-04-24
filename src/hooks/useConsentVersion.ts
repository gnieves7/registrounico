import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ConsentVersionState {
  loading: boolean;
  currentVersion: string;
  signedVersion: string | null;
  signedAt: string | null;
  signedPdfPath: string | null;
  consentOutdated: boolean;
}

const FALLBACK_VERSION = "1.0";

/**
 * Lee la versión vigente del consentimiento profesional desde
 * `app_settings.consent_version` y la compara con la última versión
 * firmada por el usuario en `professional_consents`.
 *
 * Si difieren, `consentOutdated = true` y el panel debe bloquearse
 * hasta que el profesional firme la nueva versión.
 */
export function useConsentVersion() {
  const { user } = useAuth();
  const [state, setState] = useState<ConsentVersionState>({
    loading: true,
    currentVersion: FALLBACK_VERSION,
    signedVersion: null,
    signedAt: null,
    signedPdfPath: null,
    consentOutdated: false,
  });

  const refresh = useCallback(async () => {
    if (!user) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const [{ data: setting }, { data: lastConsent }] = await Promise.all([
      supabase
        .from("app_settings")
        .select("value")
        .eq("key", "consent_version")
        .maybeSingle(),
      supabase
        .from("professional_consents")
        .select("document_version, accepted_at, pdf_storage_path")
        .eq("user_id", user.id)
        .order("accepted_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const currentVersion = (setting as any)?.value?.trim() || FALLBACK_VERSION;
    const signedVersion = (lastConsent as any)?.document_version ?? null;
    const signedAt = (lastConsent as any)?.accepted_at ?? null;
    const signedPdfPath = (lastConsent as any)?.pdf_storage_path ?? null;

    // Solo se considera "desactualizado" si ya firmó alguna vez y la versión cambió.
    // Si nunca firmó, el flujo normal de needsConsent se encarga.
    const consentOutdated =
      !!signedVersion && signedVersion.trim() !== currentVersion;

    setState({
      loading: false,
      currentVersion,
      signedVersion,
      signedAt,
      signedPdfPath,
      consentOutdated,
    });
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
