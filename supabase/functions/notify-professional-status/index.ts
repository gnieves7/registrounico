import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const FROM = "PSI Profesional <onboarding@resend.dev>";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return json({ error: "Invalid token" }, 401);
    const adminUserId = claimsData.claims.sub as string;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUserId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) return json({ error: "Admin only" }, 403);

    const body = await req.json();
    const userId = String(body.user_id || "");
    const decision = String(body.decision || "");
    const reason = body.reason ? String(body.reason) : null;

    if (!userId || !["approved", "rejected", "revoked"].includes(decision)) {
      return json({ error: "Invalid input" }, 400);
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (!prof?.email) return json({ error: "Profile not found" }, 404);

    const name = prof.full_name || "Profesional";
    let subject = "";
    let html = "";

    if (decision === "approved") {
      subject = "Tu cuenta profesional fue aprobada";
      html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;background:#ffffff;padding:24px;">
          <h1 style="font-family:Georgia,serif;color:#4a1822;">¡Bienvenido/a, ${escapeHtml(name)}!</h1>
          <p>Tu solicitud de acceso profesional a la plataforma <strong>PSI</strong> ha sido <strong>aprobada</strong>.</p>
          <p>Ya podés ingresar al panel profesional con tu cuenta de Google y comenzar a operar.</p>
          ${reason ? `<p style="color:#555;"><em>Nota del administrador:</em> ${escapeHtml(reason)}</p>` : ""}
          <p style="margin-top:24px;">
            <a href="https://psi-profesional.lovable.app/dashboard" style="display:inline-block;background:#4a1822;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;">Ingresar al panel</a>
          </p>
          <p style="font-size:12px;color:#777;margin-top:32px;">
            El consentimiento informado que firmaste queda archivado y disponible para auditoría.
          </p>
        </div>`;
    } else {
      subject = decision === "revoked"
        ? "Tu acceso profesional fue revocado"
        : "Tu solicitud de acceso profesional no fue aprobada";
      html = `
        <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;background:#ffffff;padding:24px;">
          <h1 style="font-family:Georgia,serif;color:#4a1822;">Hola, ${escapeHtml(name)}</h1>
          <p>${decision === "revoked"
            ? "Tu acceso al panel profesional fue revocado."
            : "Tu solicitud de acceso profesional fue revisada y no fue aprobada en esta instancia."}</p>
          ${reason ? `<p><strong>Motivo:</strong> ${escapeHtml(reason)}</p>` : ""}
          <p>Si querés contactarnos para más información, escribinos a <a href="mailto:ghnieves14@gmail.com">ghnieves14@gmail.com</a>.</p>
        </div>`;
    }

    const sent = await resend.emails.send({
      from: FROM,
      to: [prof.email],
      subject,
      html,
    });

    await supabase.from("activity_log").insert({
      user_id: adminUserId,
      event_type: "professional_status_email",
      event_detail: { recipient: prof.email, decision, reason, message_id: (sent as any)?.data?.id ?? null },
    });

    return json({ ok: true });
  } catch (e) {
    console.error("notify-professional-status error", e);
    return json({ error: "Internal error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}