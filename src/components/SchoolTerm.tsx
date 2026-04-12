import { useActiveSchool } from '@/hooks/useActiveSchool';
import type { SchoolTerms } from '@/config/schools';

interface Props {
  term: keyof SchoolTerms;
  capitalize?: boolean;
}

export function SchoolTerm({ term, capitalize = false }: Props) {
  const { terms } = useActiveSchool();
  const value = terms[term];
  return <>{capitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value}</>;
}
