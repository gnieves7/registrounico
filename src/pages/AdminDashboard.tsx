import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminDashboardLayout, AdminSection } from "@/components/admin/AdminDashboardLayout";
import { AdminDashboardHome } from "@/components/admin/dashboard/AdminDashboardHome";
import { AdminSymbolicResourcesSection } from "@/components/admin/dashboard/AdminSymbolicResourcesSection";
import { AdminClinicalNotesSection } from "@/components/admin/dashboard/AdminClinicalNotesSection";
import { AdminBookingSection } from "@/components/admin/dashboard/AdminBookingSection";
import { AdminGuard } from "@/components/admin/AdminGuard";

const ALLOWED: AdminSection[] = ["dashboard", "clinical_notes", "booking", "symbolic"];

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const requested = (searchParams.get("section") as AdminSection) || "dashboard";
  const initialSection: AdminSection = ALLOWED.includes(requested) ? requested : "dashboard";
  const [activeSection, setActiveSection] = useState<AdminSection>(initialSection);

  useEffect(() => {
    if (!ALLOWED.includes(activeSection)) setActiveSection("dashboard");
  }, [activeSection]);

  return (
    <AdminGuard>
      <AdminDashboardLayout
        activeSection={activeSection}
        onSectionChange={(s) => setActiveSection(ALLOWED.includes(s) ? s : "dashboard")}
      >
        {activeSection === "dashboard" && (
          <AdminDashboardHome onNavigateSection={(s) => setActiveSection(s as AdminSection)} />
        )}
        {activeSection === "clinical_notes" && <AdminClinicalNotesSection />}
        {activeSection === "booking" && <AdminBookingSection />}
        {activeSection === "symbolic" && <AdminSymbolicResourcesSection />}
      </AdminDashboardLayout>
    </AdminGuard>
  );
}
