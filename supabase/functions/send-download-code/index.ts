import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DownloadCodeRequest {
  patientId: string;
  documentId: string;
  documentTitle: string;
  downloadCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId, documentId, documentTitle, downloadCode }: DownloadCodeRequest = await req.json();

    // Validate required fields
    if (!patientId || !documentId || !documentTitle || !downloadCode) {
      throw new Error("Missing required fields");
    }

    // Get patient email from profiles
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", patientId)
      .single();

    if (profileError || !profile?.email) {
      console.log("Could not find patient email, skipping notification");
      return new Response(
        JSON.stringify({ success: true, message: "No email found, notification skipped" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const patientName = profile.full_name || "Paciente";

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "Clínica Psicológica <noreply@psicologiaclinica.app>",
      to: [profile.email],
      subject: `Tu documento "${documentTitle}" está listo para descargar`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F59E0B, #3B82F6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .code-box { background: white; border: 2px dashed #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3B82F6; font-family: monospace; }
            .document-title { background: #e0f2fe; padding: 12px; border-radius: 8px; margin: 15px 0; }
            .instructions { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📄 Documento Disponible</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${patientName}</strong>,</p>
            <p>Tu documento ha sido procesado y está listo para descargar:</p>
            
            <div class="document-title">
              <strong>📋 ${documentTitle}</strong>
            </div>
            
            <p>Para descargarlo, utiliza el siguiente código:</p>
            
            <div class="code-box">
              <div class="code">${downloadCode}</div>
            </div>
            
            <div class="instructions">
              <strong>📌 Instrucciones:</strong>
              <ol>
                <li>Ingresa a la sección "Mis Documentos" en la aplicación</li>
                <li>Busca el documento "${documentTitle}"</li>
                <li>Haz clic en "Ingresar Código" e introduce el código de arriba</li>
                <li>Tu documento se descargará automáticamente</li>
              </ol>
            </div>
            
            <p style="margin-top: 20px;">Si tienes alguna duda, no dudes en consultarme en tu próxima sesión.</p>
            
            <p>Un saludo,<br><strong>Tu terapeuta</strong></p>
          </div>
          <div class="footer">
            <p>Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.</p>
            <p>© ${new Date().getFullYear()} Clínica Psicológica</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Download code email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-download-code function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
