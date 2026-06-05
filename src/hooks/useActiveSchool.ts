import { useState, useCallback, useEffect } from 'react';
import { SCHOOL_CONFIG, type SchoolType, type SchoolConfig } from '@/config/schools';

const STORAGE_KEY = 'psi_active_school';

function getStoredSchool(): SchoolType {
  try {
    // Prefer persistent storage so the choice survives reloads and new sessions.
    const persistent = localStorage.getItem(STORAGE_KEY);
    if (persistent && persistent in SCHOOL_CONFIG) return persistent as SchoolType;
    // Backward-compat: migrate any value previously kept in sessionStorage.
    const legacy = sessionStorage.getItem(STORAGE_KEY);
    if (legacy && legacy in SCHOOL_CONFIG) {
      localStorage.setItem(STORAGE_KEY, legacy);
      return legacy as SchoolType;
    }
  } catch {}
  return 'cognitive_behavioral';
}

export function useActiveSchool() {
  const [activeSchoolId, setActiveSchoolId] = useState<SchoolType>(getStoredSchool);

  const setSchool = useCallback((id: SchoolType) => {
    setActiveSchoolId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
      // Keep sessionStorage in sync for legacy readers within the tab.
      sessionStorage.setItem(STORAGE_KEY, id);
      window.dispatchEvent(new CustomEvent('psi:school-change', { detail: id }));
    } catch {}
  }, []);

  // Sync across tabs / other hook instances.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue && e.newValue in SCHOOL_CONFIG) {
        setActiveSchoolId(e.newValue as SchoolType);
      }
    };
    const onCustom = (e: Event) => {
      const id = (e as CustomEvent<SchoolType>).detail;
      if (id && id in SCHOOL_CONFIG) setActiveSchoolId(id);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('psi:school-change', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('psi:school-change', onCustom as EventListener);
    };
  }, []);

  const school: SchoolConfig = SCHOOL_CONFIG[activeSchoolId];

  return {
    schoolId: activeSchoolId,
    school,
    setSchool,
    terms: school.terms,
    instruments: school.instruments,
    authors: school.authors,
    reportBlocks: school.reportBlocks,
    suggestedGoals: school.suggestedGoals,
    evolutionMetrics: school.evolutionMetrics,
  };
}

/** Get stored school without hook (for non-React contexts) */
export function getActiveSchoolId(): SchoolType {
  return getStoredSchool();
}
