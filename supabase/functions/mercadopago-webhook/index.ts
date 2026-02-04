import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse webhook data
    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    // MercadoPago sends different notification types
    // We're interested in "payment" notifications
    if (body.type === "payment" || body.action === "payment.updated" || body.action === "payment.created") {
      const paymentId = body.data?.id || body.id;
      
      if (!paymentId) {
        console.log("No payment ID in webhook");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get payment details from MercadoPago
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error("Error fetching payment:", paymentResponse.status);
        return new Response(JSON.stringify({ error: "Could not fetch payment" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const payment = await paymentResponse.json();
      console.log("Payment details:", JSON.stringify(payment));

      // Check if payment is approved
      if (payment.status === "approved") {
        const documentId = payment.external_reference;
        
        if (documentId) {
          // Update document as paid
          const { error: updateError } = await supabase
            .from("documents")
            .update({
              is_paid: true,
              payment_date: new Date().toISOString(),
              payment_id: paymentId.toString(),
            })
            .eq("id", documentId);

          if (updateError) {
            console.error("Error updating document:", updateError);
            throw new Error(`Error updating document: ${updateError.message}`);
          }

          console.log(`Document ${documentId} marked as paid`);
        }
      }
    }

    // Always respond with 200 to acknowledge receipt
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Still return 200 to prevent MercadoPago from retrying
    return new Response(
      JSON.stringify({ error: errorMessage, received: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
