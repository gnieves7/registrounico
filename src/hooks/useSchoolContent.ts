import { useMemo } from 'react';
import { useActiveSchool } from './useActiveSchool';
import { HUMANISTIC_SECTIONS, type HumanisticSection } from '@/data/humanisticContent';
import { SYSTEMIC_SECTIONS } from '@/data/systemicContent';

/**
 * Given a menuId (e.g. 'history', 'training', 'emotional'), returns
 * the matching school-specific section content for the active school,
 * or null if the current school doesn't have rich content.
 */
export function useSchoolContent(menuId: string): HumanisticSection | null {
  const { schoolId } = useActiveSchool();

  return useMemo(() => {
    if (schoolId === 'humanistic') {
      return HUMANISTIC_SECTIONS.find(s => s.menuId === menuId) ?? null;
    }
    if (schoolId === 'systemic') {
      return SYSTEMIC_SECTIONS.find(s => s.menuId === menuId) ?? null;
    }
    return null;
  }, [schoolId, menuId]);
}
