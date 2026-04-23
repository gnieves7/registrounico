import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLANS = {
  monthly: { title: "Suscripción Profesional .PSI. — Mensual", usd: 5, months: 1 },
};

// Approximate USD→ARS rate (will be quoted in ARS by MercadoPago)
// In production this should come from a real-time rate provider
const USD_TO_ARS = 1100;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const MP_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!MP_TOKEN) throw new Error("MERCADOPAGO_ACCESS_TOKEN missing");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization required" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY") || "", {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: uErr } = await supabaseUser.auth.getUser();
    if (uErr || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const plan = (body.plan ?? "monthly") as "monthly";
    if (!PLANS[plan]) {
      return new Response(JSON.stringify({ error: "Invalid plan" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name, license_jurisdiction, account_type")
      .eq("user_id", user.id)
      .single();

    // Santa Fe = acceso gratuito, no debe pagar
    if ((profile?.license_jurisdiction || "").trim().toLowerCase() === "santa fe") {
      return new Response(JSON.stringify({
        error: "Los psicólogos matriculados en Santa Fe tienen acceso gratuito.",
      }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const planConfig = PLANS[plan];
    const priceArs = Math.round(planConfig.usd * USD_TO_ARS);

    const origin = req.headers.get("origin") || "https://psi-gnieves.lovable.app";
    const preference = {
      items: [{
        id: `prof-sub-${plan}`,
        title: planConfig.title,
        description: `Acceso profesional a .PSI. — ${planConfig.months} ${planConfig.months === 1 ? "mes" : "meses"}`,
        quantity: 1,
        currency_id: "ARS",
        unit_price: priceArs,
      }],
      payer: { email: profile?.email || user.email, name: profile?.full_name || "" },
      external_reference: `prof_sub:${user.id}:${plan}`,
      back_urls: {
        success: `${origin}/dashboard?subscription=success`,
        failure: `${origin}/profesional/suscripcion?subscription=failure`,
        pending: `${origin}/profesional/suscripcion?subscription=pending`,
      },
      auto_return: "approved",
      notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
      metadata: { user_id: user.id, plan, type: "professional_subscription", usd_amount: planConfig.usd },
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${MP_TOKEN}` },
      body: JSON.stringify(preference),
    });

    if (!mpRes.ok) {
      const t = await mpRes.text();
      console.error("MP error:", t);
      throw new Error(`MercadoPago: ${mpRes.status}`);
    }

    const mpData = await mpRes.json();
    return new Response(JSON.stringify({
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
      preference_id: mpData.id,
      price_ars: priceArs,
      price_usd: planConfig.usd,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
