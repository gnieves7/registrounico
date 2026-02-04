import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreatePreferenceRequest {
  document_id: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN is not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase credentials not configured");
    }

    // Get the authorization header to identify the user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's token
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUserClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabaseUserClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid user token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { document_id }: CreatePreferenceRequest = await req.json();
    if (!document_id) {
      return new Response(
        JSON.stringify({ error: "document_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get document details - verify the document belongs to the user
    const { data: document, error: docError } = await supabaseClient
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .eq("patient_id", user.id)
      .single();

    if (docError || !document) {
      return new Response(
        JSON.stringify({ error: "Document not found or access denied" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (document.is_paid) {
      return new Response(
        JSON.stringify({ error: "Document already paid" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile for payer info
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("email, full_name")
      .eq("user_id", user.id)
      .single();

    // Create MercadoPago preference
    const preference = {
      items: [
        {
          id: document.id,
          title: document.title,
          description: document.description || `Documento: ${document.document_type}`,
          quantity: 1,
          currency_id: "ARS",
          unit_price: document.price,
        },
      ],
      payer: {
        email: profile?.email || user.email,
        name: profile?.full_name || "",
      },
      external_reference: document.id,
      back_urls: {
        success: `${req.headers.get("origin") || "https://id-preview--f58b174d-2162-4edb-aea2-de76ecb1c4c0.lovable.app"}/documents?payment=success`,
        failure: `${req.headers.get("origin") || "https://id-preview--f58b174d-2162-4edb-aea2-de76ecb1c4c0.lovable.app"}/documents?payment=failure`,
        pending: `${req.headers.get("origin") || "https://id-preview--f58b174d-2162-4edb-aea2-de76ecb1c4c0.lovable.app"}/documents?payment=pending`,
      },
      auto_return: "approved",
      notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!mpResponse.ok) {
      const errorData = await mpResponse.text();
      console.error("MercadoPago API error:", errorData);
      throw new Error(`MercadoPago API error: ${mpResponse.status}`);
    }

    const mpData = await mpResponse.json();

    return new Response(
      JSON.stringify({
        init_point: mpData.init_point,
        sandbox_init_point: mpData.sandbox_init_point,
        preference_id: mpData.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error creating preference:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
