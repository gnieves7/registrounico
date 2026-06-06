import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_PSICODIAG, type PsicodiagFormData } from "@/components/interview/psicodiagnostica/types";

const DRAFT_PREFIX = "psi_planilla_psicodiag_draft";
const VERSIONS_PREFIX = "psi_planilla_psicodiag_versions";
const LEGACY_KEY = "psi_planilla_psicodiag_draft";
const MAX_VERSIONS = 20;

export type PsicodiagVersion = {
  id: string;
  savedAt: string; // ISO
  label?: string;
  data: PsicodiagFormData;
};

function patientSlug(patientId: string | undefined | null) {
  const s = (patientId ?? "").trim().toLowerCase();
  if (!s) return "__global__";
  return s.replace(/[^a-z0-9_-]+/g, "_").slice(0, 64);
}

function draftKey(patientId?: string | null) {
  return `${DRAFT_PREFIX}:${patientSlug(patientId)}`;
}
function versionsKey(patientId?: string | null) {
  return `${VERSIONS_PREFIX}:${patientSlug(patientId)}`;
}

function loadDraft(patientId?: string | null): PsicodiagFormData {
  try {
    const raw = localStorage.getItem(draftKey(patientId));
    if (raw) return { ...EMPTY_PSICODIAG, ...JSON.parse(raw) };
    // Legacy migration only when no patient id is provided.
    if (!patientId) {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) return { ...EMPTY_PSICODIAG, ...JSON.parse(legacy) };
    }
  } catch {}
  return EMPTY_PSICODIAG;
}

function loadVersions(patientId?: string | null): PsicodiagVersion[] {
  try {
    const raw = localStorage.getItem(versionsKey(patientId));
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list;
  } catch {
    return [];
  }
}

function persistVersions(patientId: string | undefined | null, list: PsicodiagVersion[]) {
  try { localStorage.setItem(versionsKey(patientId), JSON.stringify(list.slice(0, MAX_VERSIONS))); } catch {}
}

export function usePsicodiagDraft(patientId?: string | null) {
  const [data, setData] = useState<PsicodiagFormData>(() => loadDraft(patientId));
  const [versions, setVersions] = useState<PsicodiagVersion[]>(() => loadVersions(patientId));
  const lastPatient = useRef<string | undefined | null>(patientId);

  // Reload when patientId changes
  useEffect(() => {
    if (lastPatient.current === patientId) return;
    lastPatient.current = patientId;
    setData(loadDraft(patientId));
    setVersions(loadVersions(patientId));
  }, [patientId]);

  // Autosave draft (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(draftKey(patientId), JSON.stringify(data)); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [data, patientId]);

  const update = useCallback(
    (key: keyof PsicodiagFormData, value: string) =>
      setData((d) => ({ ...d, [key]: value })),
    []
  );

  const replace = useCallback((next: PsicodiagFormData) => setData(next), []);

  const reset = useCallback(() => {
    setData(EMPTY_PSICODIAG);
    try { localStorage.removeItem(draftKey(patientId)); } catch {}
  }, [patientId]);

  const saveVersion = useCallback(
    (label?: string) => {
      const v: PsicodiagVersion = {
        id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        savedAt: new Date().toISOString(),
        label: label?.trim() || undefined,
        data,
      };
      const next = [v, ...versions].slice(0, MAX_VERSIONS);
      setVersions(next);
      persistVersions(patientId, next);
      try { localStorage.setItem(draftKey(patientId), JSON.stringify(data)); } catch {}
      return v;
    },
    [data, versions, patientId]
  );

  const deleteVersion = useCallback(
    (id: string) => {
      const next = versions.filter((v) => v.id !== id);
      setVersions(next);
      persistVersions(patientId, next);
    },
    [versions, patientId]
  );

  const restoreVersion = useCallback(
    (id: string) => {
      const v = versions.find((x) => x.id === id);
      if (!v) return false;
      setData(v.data);
      try { localStorage.setItem(draftKey(patientId), JSON.stringify(v.data)); } catch {}
      return true;
    },
    [versions, patientId]
  );

  return { data, setField: update, replace, reset, versions, saveVersion, deleteVersion, restoreVersion };
}

// ------------------- Validation -------------------

export const REQUIRED_FIELDS: { key: keyof PsicodiagFormData; label: string }[] = [
  { key: "fullName", label: "Apellido y nombre" },
  { key: "sessionDate", label: "Fecha y hora de la sesión" },
  { key: "consentSigned", label: "Consentimiento informado firmado" },
  { key: "motiveOwn", label: "Motivo en palabras del/la consultante" },
  { key: "diagnosticHypothesis", label: "Hipótesis diagnóstica provisional" },
  { key: "professionalName", label: "Profesional (nombre y apellido)" },
  { key: "professionalLicense", label: "Matrícula N°" },
  { key: "signatureDate", label: "Fecha de la firma" },
];

export function validatePsicodiag(data: PsicodiagFormData) {
  const missing = REQUIRED_FIELDS.filter((f) => !(data[f.key] ?? "").toString().trim());
  return { missing, isValid: missing.length === 0 };
}

// ------------------- Diff between two versions -------------------

export function diffVersions(a: PsicodiagFormData, b: PsicodiagFormData) {
  const out: { key: string; from: string; to: string }[] = [];
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof PsicodiagFormData>;
  keys.forEach((k) => {
    const av = ((a as any)[k] ?? "") + "";
    const bv = ((b as any)[k] ?? "") + "";
    if (av !== bv) out.push({ key: k as string, from: av, to: bv });
  });
  return out;
}