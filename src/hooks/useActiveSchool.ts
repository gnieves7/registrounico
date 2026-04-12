import { useState, useCallback } from 'react';
import { SCHOOL_CONFIG, type SchoolType, type SchoolConfig } from '@/config/schools';

const STORAGE_KEY = 'psi_active_school';

function getStoredSchool(): SchoolType {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored && stored in SCHOOL_CONFIG) return stored as SchoolType;
  return 'cognitive_behavioral';
}

export function useActiveSchool() {
  const [activeSchoolId, setActiveSchoolId] = useState<SchoolType>(getStoredSchool);

  const setSchool = useCallback((id: SchoolType) => {
    setActiveSchoolId(id);
    sessionStorage.setItem(STORAGE_KEY, id);
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
