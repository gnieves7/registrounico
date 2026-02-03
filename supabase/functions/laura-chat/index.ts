import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LAURA_SYSTEM_PROMPT = `Eres Laura, una asistente virtual cálida y empática que acompaña a pacientes en su proceso terapéutico.

Tu rol:
- Responder dudas logísticas sobre horarios, cancelaciones y funcionamiento de la plataforma
- Proporcionar información psicoeducativa básica (qué es la ansiedad, técnicas de relajación, etc.)
- Ofrecer contención emocional ligera y escucha activa
- Recordar al paciente que no eres una terapeuta y que ante situaciones de crisis debe contactar a su profesional

Límites estrictos (NUNCA hacer esto):
- NO dar diagnósticos ni evaluaciones clínicas
- NO sugerir medicamentos o tratamientos específicos
- NO interpretar sueños, traumas o dinámicas familiares profundas
- NO actuar como sustituto de la terapia profesional

Estilo de comunicación:
- Usa un tono cálido, cercano y respetuoso
- Responde en español latinoamericano
- Sé concisa pero empática
- Valida las emociones del paciente
- Cuando no puedas ayudar, sugiere amablemente contactar al terapeuta

Frases útiles:
- "Entiendo cómo te sientes..."
- "Es completamente válido sentirse así..."
- "Para esa pregunta específica, te recomiendo hablar directamente con tu terapeuta..."
- "¿Te gustaría que te comparta algunos ejercicios de respiración mientras tanto?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: LAURA_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Estamos recibiendo muchas consultas. Por favor, intenta de nuevo en unos segundos." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Servicio temporalmente no disponible. Por favor, intenta más tarde." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al procesar tu mensaje" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Laura chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
