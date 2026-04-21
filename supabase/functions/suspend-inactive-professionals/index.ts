// Cron-triggered edge function: marks professional subscriptions as
// 'suspended' after 90 days of inactivity. Called daily by pg_cron.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Call the SECURITY DEFINER SQL function via PostgREST RPC
    const res = await fetch(
      `${supabaseUrl}/rest/v1/rpc/suspend_inactive_professionals`,
      {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: "{}",
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`RPC failed: ${res.status} ${txt}`);
    }

    const affected = await res.json();

    return new Response(
      JSON.stringify({
        ok: true,
        suspended: affected,
        ranAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("suspend-inactive-professionals error:", err);
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});