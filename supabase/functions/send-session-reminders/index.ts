import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Session {
  id: string;
  session_date: string;
  topic: string | null;
  patient_id: string;
}

interface Profile {
  email: string | null;
  full_name: string | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication: validate caller via Authorization header or shared cron secret
    const authHeader = req.headers.get("Authorization");
    const cronSecret = Deno.env.get("CRON_SECRET");

    // Option 1: Cron job calls with the anon key via pg_net (Authorization: Bearer <anon_key>)
    // Option 2: Validate a custom cron secret header
    const providedCronSecret = req.headers.get("x-cron-secret");

    let isAuthorized = false;

    // Check cron secret first (for direct HTTP invocations)
    if (cronSecret && providedCronSecret === cronSecret) {
      isAuthorized = true;
    }

    // If no cron secret match, validate JWT to ensure it's at least an authenticated caller
    if (!isAuthorized && authHeader?.startsWith("Bearer ")) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const token = authHeader.replace("Bearer ", "");
      const { data, error } = await supabaseAuth.auth.getClaims(token);
      if (!error && data?.claims) {
        // Verify caller is admin
        const supabaseService = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        const { data: roleData } = await supabaseService
          .from("user_roles")
          .select("role")
          .eq("user_id", data.claims.sub)
          .eq("role", "admin")
          .maybeSingle();
        if (roleData) {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      console.error("Unauthorized cron/reminder attempt");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate the time window: 12 hours from now (with a 30-minute buffer)
    const now = new Date();
    const twelveHoursFromNow = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    const bufferStart = new Date(twelveHoursFromNow.getTime() - 30 * 60 * 1000);
    const bufferEnd = new Date(twelveHoursFromNow.getTime() + 30 * 60 * 1000);

    console.log(`Checking for sessions between ${bufferStart.toISOString()} and ${bufferEnd.toISOString()}`);

    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id, session_date, topic, patient_id")
      .gte("session_date", bufferStart.toISOString())
      .lte("session_date", bufferEnd.toISOString());

    if (sessionsError) {
      console.error("Error fetching sessions:", sessionsError);
      throw sessionsError;
    }

    if (!sessions || sessions.length === 0) {
      console.log("No sessions found in the 12-hour window");
      return new Response(
        JSON.stringify({ message: "No sessions to remind", count: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${sessions.length} sessions to process`);

    const emailResults = [];

    for (const session of sessions as Session[]) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", session.patient_id)
        .single();

      if (profileError || !profile?.email) {
        console.error(`Could not find email for patient ${session.patient_id}:`, profileError);
        emailResults.push({ sessionId: session.id, success: false, error: "No email found" });
        continue;
      }

      const patientProfile = profile as Profile;
      const sessionDate = new Date(session.session_date);
      const formattedDate = sessionDate.toLocaleDateString("es-ES", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
      const formattedTime = sessionDate.toLocaleTimeString("es-ES", {
        hour: "2-digit", minute: "2-digit",
      });

      const patientName = patientProfile.full_name || "Paciente";
      const topicText = session.topic ? `<p><strong>Tema:</strong> ${session.topic}</p>` : "";

      try {
        const emailResponse = await resend.emails.send({
          from: "Recordatorios <noreply@tudominio.com>",
          to: [patientProfile.email],
          subject: `Recordatorio: Tu sesión es mañana - ${formattedDate}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #1a1a2e; margin: 0; font-size: 24px;">📅 Recordatorio de Sesión</h1>
                </div>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Hola <strong>${patientName}</strong>,</p>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Te recordamos que tienes una sesión programada para mañana:</p>
                <div style="background-color: #f0f4f8; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #4a90d9;">
                  <p style="margin: 0 0 8px 0; color: #1a1a2e;"><strong>📆 Fecha:</strong> ${formattedDate}</p>
                  <p style="margin: 0 0 8px 0; color: #1a1a2e;"><strong>🕐 Hora:</strong> ${formattedTime}</p>
                  ${topicText}
                </div>
                <p style="color: #333; font-size: 16px; line-height: 1.6;">Te recomendamos preparar tus preguntas o temas que quieras tratar durante la sesión.</p>
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 32px;">Si necesitas reprogramar tu cita, por favor contáctanos con anticipación.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
                <p style="color: #999; font-size: 12px; text-align: center;">Este es un mensaje automático. Por favor no respondas a este correo.</p>
              </div>
            </body>
            </html>
          `,
        });

        console.log(`Email sent successfully to ${patientProfile.email}:`, emailResponse);
        emailResults.push({ sessionId: session.id, email: patientProfile.email, success: true, messageId: emailResponse.id });
      } catch (emailError: any) {
        console.error(`Failed to send email to ${patientProfile.email}:`, emailError);
        emailResults.push({ sessionId: session.id, email: patientProfile.email, success: false, error: emailError.message });
      }
    }

    const successCount = emailResults.filter(r => r.success).length;
    console.log(`Sent ${successCount}/${sessions.length} reminder emails`);

    return new Response(
      JSON.stringify({ message: "Reminder emails processed", total: sessions.length, sent: successCount, results: emailResults }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-session-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
