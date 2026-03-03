import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization")!;

    // Verify the caller is admin
    const callerClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) throw new Error("No autenticado");

    const { data: roleData } = await callerClient
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .maybeSingle();

    if (roleData?.role !== "admin") {
      throw new Error("No autorizado: solo administradores pueden eliminar pacientes");
    }

    const { patientUserId } = await req.json();
    if (!patientUserId) throw new Error("patientUserId es requerido");

    // Prevent self-deletion
    if (patientUserId === caller.id) {
      throw new Error("No puedes eliminarte a ti mismo");
    }

    // Use service role to delete all patient data and auth user
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Delete in order (dependent tables first)
    await adminClient.from("emotional_records").delete().eq("user_id", patientUserId);
    await adminClient.from("dream_records").delete().eq("user_id", patientUserId);
    await adminClient.from("anxiety_abcde_records").delete().eq("user_id", patientUserId);
    await adminClient.from("laura_conversations").delete().eq("user_id", patientUserId);
    await adminClient.from("psychobiographies").delete().eq("user_id", patientUserId);
    await adminClient.from("mbti_tests").delete().eq("user_id", patientUserId);
    await adminClient.from("mmpi2_tests").delete().eq("user_id", patientUserId);
    await adminClient.from("sessions").delete().eq("patient_id", patientUserId);
    await adminClient.from("documents").delete().eq("patient_id", patientUserId);
    
    // Forensic: delete documents first, then cases
    const { data: cases } = await adminClient.from("forensic_cases").select("id").eq("user_id", patientUserId);
    if (cases && cases.length > 0) {
      const caseIds = cases.map(c => c.id);
      await adminClient.from("forensic_documents").delete().in("case_id", caseIds);
    }
    await adminClient.from("forensic_cases").delete().eq("user_id", patientUserId);

    // Delete role and profile
    await adminClient.from("user_roles").delete().eq("user_id", patientUserId);
    await adminClient.from("profiles").delete().eq("user_id", patientUserId);

    // Delete auth user
    const { error: authError } = await adminClient.auth.admin.deleteUser(patientUserId);
    if (authError) {
      console.error("Error deleting auth user:", authError);
    }

    // Audit log
    await adminClient.from("audit_logs").insert({
      user_id: caller.id,
      event_type: "patient_deleted",
      details: { deleted_user_id: patientUserId },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
