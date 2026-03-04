import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    // Auth check
    const authHeader = req.headers.get("Authorization");
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader! } },
    });
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error("No autorizado");

    // Check admin role
    const adminClient = createClient(supabaseUrl, supabaseKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Solo el administrador puede realizar análisis narrativos");

    const { sessionText, patientId } = await req.json();
    if (!sessionText || !patientId) throw new Error("Faltan datos requeridos");

    // Call AI
    const systemPrompt = `Sos un psicólogo clínico experto en análisis narrativo de sesiones terapéuticas. 
Analizá el siguiente texto de sesión clínica y devolvé un JSON con exactamente esta estructura (sin markdown, solo JSON puro):
{
  "distortions": ["lista de distorsiones cognitivas detectadas en español"],
  "languageRatio": { "victim": número 0-100, "agent": número 0-100 },
  "themes": ["temas de autoconcepto detectados en español"],
  "emotionalVocabulary": { 
    "count": número de palabras emocionales, 
    "density": "porcentaje como string", 
    "topEmotions": ["emociones más frecuentes"] 
  },
  "summary": "resumen clínico breve en español (3-4 oraciones)"
}

Distorsiones cognitivas a buscar: pensamiento todo-o-nada, catastrofización, personalización, lectura mental, generalización excesiva, filtro mental, descalificación de lo positivo, razonamiento emocional, etiquetado, debería/tendría que.

El ratio víctima/agente mide el porcentaje de lenguaje donde el paciente se posiciona como receptor pasivo (víctima) vs actor con capacidad de acción (agente). Deben sumar 100.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sessionText },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Límite de solicitudes excedido. Intentá más tarde." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("Error en la IA");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "{}";

    // Parse JSON from AI response (may contain markdown fences)
    let analysis;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      analysis = JSON.parse(jsonMatch[1].trim());
    } catch {
      analysis = {
        distortions: [],
        languageRatio: { victim: 50, agent: 50 },
        themes: [],
        emotionalVocabulary: { count: 0, density: "0", topEmotions: [] },
        summary: content,
      };
    }

    // Save to DB
    await adminClient.from("narrative_analyses").insert({
      patient_id: patientId,
      distortions: analysis.distortions || [],
      language_ratio: analysis.languageRatio || {},
      themes: analysis.themes || [],
      emotional_vocabulary: analysis.emotionalVocabulary || {},
      summary: analysis.summary || "",
      source_text: sessionText.substring(0, 5000),
    });

    return new Response(JSON.stringify({ analysis }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("narrative-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
