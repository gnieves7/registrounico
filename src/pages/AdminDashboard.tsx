import { useEffect, useState } from "react";
import { AdminDashboardLayout, AdminSection } from "@/components/admin/AdminDashboardLayout";
import { AdminDashboardSixMetrics } from "@/components/admin/dashboard/AdminDashboardSixMetrics";
import { AdminDashboardHome } from "@/components/admin/dashboard/AdminDashboardHome";
import { AdminUsersSection } from "@/components/admin/dashboard/AdminUsersSection";
import { AdminProfessionalsSection } from "@/components/admin/dashboard/AdminProfessionalsSection";
import { AdminTestsSection } from "@/components/admin/dashboard/AdminTestsSection";
import { AdminReportsSection } from "@/components/admin/dashboard/AdminReportsSection";
import { AdminNotificationsSection } from "@/components/admin/dashboard/AdminNotificationsSection";
import { AdminSettingsSection } from "@/components/admin/dashboard/AdminSettingsSection";
import { AdminSuggestionsSection } from "@/components/admin/dashboard/AdminSuggestionsSection";
import { AdminAuthorizationsSection } from "@/components/admin/dashboard/AdminAuthorizationsSection";
import { AdminSubscriptionsSection } from "@/components/admin/dashboard/AdminSubscriptionsSection";
import { AdminActivitySection } from "@/components/admin/dashboard/AdminActivitySection";
import { AdminAuditConsentsSection } from "@/components/admin/dashboard/AdminAuditConsentsSection";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [pendingAuthCount, setPendingAuthCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("user_id", { count: "exact", head: true })
        .eq("account_type", "professional")
        .eq("is_approved", false)
        .is("approval_decided_at", null);
      setPendingAuthCount(count || 0);
    };
    load();
  }, [activeSection]);

  return (
    <AdminGuard>
      <AdminDashboardLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        pendingAuthCount={pendingAuthCount}
      >
        {activeSection === "dashboard" && (
          <div className="space-y-8">
            <AdminDashboardSixMetrics />
            <AdminDashboardHome />
          </div>
        )}
        {activeSection === "users" && <AdminUsersSection />}
        {activeSection === "professionals" && <AdminProfessionalsSection />}
        {activeSection === "authorizations" && <AdminAuthorizationsSection />}
        {activeSection === "subscriptions" && <AdminSubscriptionsSection />}
        {activeSection === "activity" && <AdminActivitySection />}
        {activeSection === "audit_consents" && <AdminAuditConsentsSection />}
        {activeSection === "tests" && <AdminTestsSection />}
        {activeSection === "reports" && <AdminReportsSection />}
        {activeSection === "notifications" && <AdminNotificationsSection />}
        {activeSection === "suggestions" && <AdminSuggestionsSection />}
        {activeSection === "settings" && <AdminSettingsSection />}
      </AdminDashboardLayout>
    </AdminGuard>
  );
}
