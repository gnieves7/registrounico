import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (
  userId: string,
  eventType: string,
  eventDetail?: Record<string, unknown>
) => {
  try {
    await supabase.from("activity_log").insert([{
      user_id: userId,
      event_type: eventType,
      event_detail: (eventDetail || {}) as unknown as import("@/integrations/supabase/types").Json,
    }]);
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

/**
 * Auditoría mínima de informes para el rol psicólogo/admin.
 * No expone contenido clínico sensible: solo metadata operativa
 * (tipo de informe, paciente referenciado, ruta hashed, timestamp).
 */
const hashPath = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return `h${Math.abs(h).toString(36)}`;
};

export const logReportEvent = async (
  actorUserId: string,
  event:
    | "report_created"
    | "report_downloaded"
    | "report_draft_edited"
    | "pdf_code_issued_ui"
    | "pdf_code_consumed_ui",
  payload: {
    report_type?: string;
    patient_id?: string | null;
    storage_path?: string | null;
    draft_id?: string | null;
    code_id?: string | null;
  } = {}
) => {
  await logActivity(actorUserId, event, {
    report_type: payload.report_type ?? null,
    patient_id: payload.patient_id ?? null,
    storage_path_hash: payload.storage_path ? hashPath(payload.storage_path) : null,
    draft_id: payload.draft_id ?? null,
    code_id: payload.code_id ?? null,
  });
};
