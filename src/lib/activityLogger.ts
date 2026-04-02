import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (
  userId: string,
  eventType: string,
  eventDetail?: Record<string, unknown>
) => {
  try {
    await supabase.from("activity_log").insert({
      user_id: userId,
      event_type: eventType,
      event_detail: eventDetail || {},
    });
  } catch (e) {
    console.error("Error logging activity:", e);
  }
};

export const logTestComplete = async (
  userId: string,
  testType: string,
  testId: string
) => {
  await logActivity(userId, "test_complete", { test_type: testType, test_id: testId });

  // Create admin notification
  try {
    // Get admin user IDs
    const { data: admins } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    // Get patient name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .maybeSingle();

    const patientName = profile?.full_name || "Paciente";

    if (admins && admins.length > 0) {
      const notifications = admins.map((admin) => ({
        recipient_user_id: admin.user_id,
        notification_type: "test_complete",
        title: `Test ${testType} completado`,
        message: `${patientName} completó el test ${testType}. Puede ver los resultados y generar el informe PDF.`,
        related_table: testType === "MMPI-2" ? "mmpi2_tests" : testType === "MBTI" ? "mbti_tests" : testType === "MCMI-III" ? "mcmi3_tests" : "scl90r_tests",
        related_record_id: testId,
        route: "/admin/dashboard",
        metadata: { test_type: testType, patient_name: patientName },
      }));

      await supabase.from("app_notifications").insert(notifications);
    }
  } catch (e) {
    console.error("Error creating test completion notification:", e);
  }
};

export const logTestStart = async (
  userId: string,
  testType: string,
  testId: string
) => {
  await logActivity(userId, "test_start", { test_type: testType, test_id: testId });
};
