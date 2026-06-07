import type { AdminSection } from "@/components/admin/AdminDashboardLayout";
import type { UserRole } from "@/hooks/useUserRole";

/**
 * Which roles can access each admin section.
 * Admin sees everything. Professionals see their clinical workspace.
 * Patients never reach the admin layout (AdminGuard blocks).
 */
export const SECTION_ROLES: Record<AdminSection, UserRole[]> = {
  dashboard: ["admin", "professional"],
  clinical_notes: ["admin", "professional"],
  booking: ["admin", "professional"],
  symbolic: ["admin", "professional"],
  interview_models: ["admin", "professional"],
  profile: ["admin", "professional"],
  monitoring: ["admin"],
  users: ["admin"],
  professionals: ["admin"],
  authorizations: ["admin"],
  allowlist: ["admin"],
  activity: ["admin"],
  audit_consents: ["admin"],
  audit_reports: ["admin"],
  tests: ["admin", "professional"],
  reports: ["admin", "professional"],
  notifications: ["admin"],
  patient_proposals: ["admin"],
  suggestions: ["admin"],
  settings: ["admin"],
};

export function canAccessSection(section: AdminSection, role: UserRole | null): boolean {
  if (!role) return false;
  return SECTION_ROLES[section]?.includes(role) ?? false;
}