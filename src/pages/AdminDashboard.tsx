import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AdminDashboardLayout, AdminSection } from "@/components/admin/AdminDashboardLayout";
import { AdminDashboardHome } from "@/components/admin/dashboard/AdminDashboardHome";
import { AdminSymbolicResourcesSection } from "@/components/admin/dashboard/AdminSymbolicResourcesSection";
import { AdminClinicalNotesSection } from "@/components/admin/dashboard/AdminClinicalNotesSection";
import { AdminBookingSection } from "@/components/admin/dashboard/AdminBookingSection";
import { AdminAuthorizationsSection } from "@/components/admin/dashboard/AdminAuthorizationsSection";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from "@/integrations/supabase/client";

const ALLOWED: AdminSection[] = ["dashboard", "clinical_notes", "booking", "symbolic", "authorizations"];

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const requested = (searchParams.get("section") as AdminSection) || "dashboard";
  const initialSection: AdminSection = ALLOWED.includes(requested) ? requested : "dashboard";
  const [activeSection, setActiveSection] = useState<AdminSection>(initialSection);
  const [pendingAuthCount, setPendingAuthCount] = useState(0);

  useEffect(() => {
    if (!ALLOWED.includes(activeSection)) setActiveSection("dashboard");
  }, [activeSection]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("account_type", "professional")
        .eq("is_approved", false)
        .is("approval_decided_at", null);
      if (!cancelled) setPendingAuthCount(count ?? 0);
    };
    load();
    const interval = setInterval(load, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [activeSection]);

  return (
    <AdminGuard>
      <AdminDashboardLayout
        activeSection={activeSection}
        onSectionChange={(s) => setActiveSection(ALLOWED.includes(s) ? s : "dashboard")}
        pendingAuthCount={pendingAuthCount}
      >
        {activeSection === "dashboard" && (
          <AdminDashboardHome onNavigateSection={(s) => setActiveSection(s as AdminSection)} />
        )}
        {activeSection === "clinical_notes" && <AdminClinicalNotesSection />}
        {activeSection === "booking" && <AdminBookingSection />}
        {activeSection === "symbolic" && <AdminSymbolicResourcesSection />}
        {activeSection === "authorizations" && <AdminAuthorizationsSection />}
      </AdminDashboardLayout>
    </AdminGuard>
  );
}
