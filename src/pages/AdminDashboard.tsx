import { useState } from "react";
import { AdminDashboardLayout, AdminSection } from "@/components/admin/AdminDashboardLayout";
import { AdminDashboardHome } from "@/components/admin/dashboard/AdminDashboardHome";
import { AdminUsersSection } from "@/components/admin/dashboard/AdminUsersSection";
import { AdminTestsSection } from "@/components/admin/dashboard/AdminTestsSection";
import { AdminReportsSection } from "@/components/admin/dashboard/AdminReportsSection";
import { AdminNotificationsSection } from "@/components/admin/dashboard/AdminNotificationsSection";
import { AdminSettingsSection } from "@/components/admin/dashboard/AdminSettingsSection";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  return (
    <AdminDashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {activeSection === "dashboard" && <AdminDashboardHome />}
      {activeSection === "users" && <AdminUsersSection />}
      {activeSection === "tests" && <AdminTestsSection />}
      {activeSection === "reports" && <AdminReportsSection />}
      {activeSection === "notifications" && <AdminNotificationsSection />}
      {activeSection === "settings" && <AdminSettingsSection />}
    </AdminDashboardLayout>
  );
}
