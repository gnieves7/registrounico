import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      await logAuditEvent(adminClient, "download_code_attempt_no_auth", null, { reason: "No authorization header" });
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user identity
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      await logAuditEvent(adminClient, "download_code_attempt_invalid_token", null, { reason: "Invalid JWT" });
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { document_id, code } = await req.json();
    if (!document_id || !code) {
      return new Response(JSON.stringify({ error: "Faltan parámetros" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the code matches and document belongs to user
    const { data: doc, error: docError } = await adminClient
      .from("documents")
      .select("id, patient_id, download_code, is_paid, file_url")
      .eq("id", document_id)
      .maybeSingle();

    if (docError || !doc) {
      await logAuditEvent(adminClient, "download_code_doc_not_found", user.id, { document_id });
      return new Response(JSON.stringify({ error: "Documento no encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    if (doc.patient_id !== user.id) {
      await logAuditEvent(adminClient, "download_code_ownership_violation", user.id, {
        document_id,
        actual_owner: doc.patient_id,
      });
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify code
    if (!doc.download_code || doc.download_code !== code.trim().toUpperCase()) {
      await logAuditEvent(adminClient, "download_code_wrong_code", user.id, {
        document_id,
        attempted_code: code.trim().toUpperCase(),
      });
      return new Response(JSON.stringify({ error: "Código incorrecto" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark as paid server-side
    const { error: updateError } = await adminClient
      .from("documents")
      .update({ is_paid: true, payment_date: new Date().toISOString() })
      .eq("id", document_id);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(JSON.stringify({ error: "Error al procesar" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log successful verification
    await logAuditEvent(adminClient, "download_code_success", user.id, { document_id });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function logAuditEvent(
  client: ReturnType<typeof createClient>,
  eventType: string,
  userId: string | null,
  details: Record<string, unknown>
) {
  try {
    await client.from("audit_logs").insert({
      event_type: eventType,
      user_id: userId,
      details,
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
}
