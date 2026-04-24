import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminUserId = claimsData.claims.sub;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", adminUserId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { patientUserId, approved } = await req.json();

    if (!patientUserId || typeof approved !== "boolean") {
      return new Response(
        JSON.stringify({ error: "Missing patientUserId or approved" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_approved: approved })
      .eq("user_id", patientUserId);

    if (updateError) throw updateError;

    // Get patient info for email
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", patientUserId)
      .single();

    if (!profile?.email) {
      return new Response(
        JSON.stringify({ success: true, message: "Updated, no email found" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const patientName = profile.full_name || "Paciente";
    const subject = approved
      ? "✅ Tu cuenta ha sido aprobada"
      : "⚠️ Tu cuenta ha sido suspendida";

    const bodyHtml = approved
      ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #3B82F6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">¡Cuenta Aprobada!</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <p>Hola <strong>${patientName}</strong>,</p>
            <p>Tu cuenta en <strong>Registro Clínico Personalizado</strong> ha sido aprobada por tu psicólogo.</p>
            <p>Ya podés acceder a todas las funcionalidades de la plataforma:</p>
            <ul>
              <li>Registro emocional diario</li>
              <li>Diario de sueños</li>
              <li>Psicobiografía</li>
              <li>Asistente Laura</li>
              <li>Sesiones y documentos</li>
            </ul>
            <p>Si tenés alguna duda, consultá en tu próxima sesión.</p>
            <p>Un saludo,<br><strong>Tu terapeuta</strong></p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>© ${new Date().getFullYear()} Registro Clínico Personalizado</p>
            <p>Creado por Lic. Esp. Germán Nieves — <a href="https://www.psicodiagnostico-forense.com.ar">www.psicodiagnostico-forense.com.ar</a></p>
          </div>
        </div>`
      : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">Cuenta Suspendida</h1>
          </div>
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px;">
            <p>Hola <strong>${patientName}</strong>,</p>
            <p>Tu acceso a <strong>Registro Clínico Personalizado</strong> ha sido suspendido temporalmente.</p>
            <p>Si creés que se trata de un error o necesitás más información, por favor contactá a tu profesional tratante.</p>
            <p>Un saludo,<br><strong>Tu terapeuta</strong></p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px; margin-top: 20px;">
            <p>© ${new Date().getFullYear()} Registro Clínico Personalizado</p>
          </div>
        </div>`;

    const emailResponse = await resend.emails.send({
      from: "Registro Clínico <onboarding@resend.dev>",
      to: [profile.email],
      subject,
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#ffffff;margin:0;padding:20px;">${bodyHtml}</body></html>`,
    });

    console.log("Patient status email sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
