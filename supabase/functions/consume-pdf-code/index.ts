import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code } = await req.json();
    if (!code || !/^\d{6}$/.test(String(code))) {
      return new Response(JSON.stringify({ status: "invalid", message: "Ingresa un código de 6 dígitos." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service role para consumir y firmar la URL aunque el solicitante sea anónimo
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || null;

    const { data, error } = await admin.rpc("consume_pdf_code", {
      _code: String(code),
      _ip: ip,
    });

    if (error) {
      return new Response(JSON.stringify({ status: "error", message: error.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row || row.status !== "ok") {
      return new Response(JSON.stringify({ status: row?.status ?? "error", message: row?.message ?? "Código inválido" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generar URL firmada de descarga (5 min)
    const { data: signed, error: sErr } = await admin
      .storage
      .from(row.storage_bucket)
      .createSignedUrl(row.storage_path, 300);

    if (sErr || !signed) {
      return new Response(JSON.stringify({ status: "error", message: "No se pudo generar la descarga." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      status: "ok",
      message: "Código válido. Descarga lista.",
      download_url: signed.signedUrl,
      resource_type: row.resource_type,
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ status: "error", message: String(e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});