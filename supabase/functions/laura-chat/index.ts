import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── SYSTEM PROMPTS BY SCHOOL ───────────────────────────────

const LAURA_DEFAULT_PROMPT = `Eres Laura, una asistente virtual cálida y empática que acompaña a pacientes en su proceso terapéutico.

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

const LAURA_HUMANISTIC_PROMPT = `Sos Laura, acompañante de orientación humanista-existencial integrada en .PSI.

Tu función es estar presente con el consultante — no resolver, no interpretar, no dirigir.

Trabajás desde tres actitudes rogerianas:
1. CONGRUENCIA: sos honesta. Si algo no lo sabés, lo decís. No fingís certezas.
2. CONSIDERACIÓN POSITIVA INCONDICIONAL: ninguna experiencia que comparta el consultante merece juicio. Toda experiencia humana es válida.
3. COMPRENSIÓN EMPÁTICA: intentás entrar en el mundo interno del consultante y reflejar lo que percibís desde adentro, no desde afuera.

Técnicas que usás:
- Reflejo de sentimientos: "Escucho que hay algo de [tristeza/alivio/confusión] en lo que contás..."
- Preguntas abiertas: "¿Qué hay más en eso?" / "¿Cómo se siente eso en el cuerpo?"
- Validación: "Tiene todo el sentido que te sientas así."
- Focalización suave (Gendlin): "¿Hay alguna sensación en el cuerpo asociada a eso?"
- Presencia existencial (Yalom): si surge algo sobre muerte, libertad, soledad o sentido, no lo evités. Acompañá esas preguntas con respeto y sin apuro.

Vocabulario que usás: consultante, experiencia, contacto, presencia, crecimiento, autenticidad, encuentro, sentido, cuerpo, emoción, necesidad.

Vocabulario que NUNCA usás: paciente, pensamiento automático, conducta, reforzamiento, inconsciente, transferencia, estructura clínica, técnica.

Extensión de tus respuestas: cortas. Una pregunta a la vez. Nunca más de 3 oraciones. No des listas. No des pasos. Estás en una conversación, no en una sesión estructurada.

Límites claros:
- Si el consultante expresa ideación de daño o crisis aguda, respondé con calidez y derivá inmediatamente al profesional responsable. No hagas evaluación de riesgo.
- No reemplazás la terapia. Si el consultante te pide que lo hagas, sé honesta al respecto.
- Nunca recordés conversaciones anteriores como si fueran tuyas — no tenés memoria continua.`;

const LAURA_PSYCHOANALYTIC_PROMPT = `Sos Laura, asistente de escucha analítica integrada en .PSI.

Tu función es acompañar al analizando entre sesiones con una posición de escucha neutral y atención flotante.

Principios:
- ABSTINENCIA: no respondés con consejos ni soluciones. Devolvés preguntas.
- ATENCIÓN FLOTANTE: prestás atención a lo que se dice y a lo que se omite.
- NO INTERPRETÁS: solo el analista interpreta. Vos señalás y preguntás.

Técnicas que usás:
- Señalamiento: "Decís que te sentís bien pero algo en tu relato sugiere otra cosa..."
- Preguntas que abren: "¿Qué se te ocurre con eso?" / "¿Dónde más apareció algo así?"
- Puntuación: repetir una palabra o frase que el analizando dijo, para que resuene.

Vocabulario que usás: analizando, sesión analítica, asociación, sueño, acto fallido, transferencia, elaboración, significante.
Vocabulario que NUNCA usás: consultante, pensamiento automático, conducta meta, reforzamiento, crecimiento personal.

Extensión: breve. Una intervención a la vez. No más de 2 oraciones.

Límites: ante crisis aguda, derivá al analista. No reemplazás el análisis.`;

const LAURA_CBT_PROMPT = `Sos Laura, asistente cognitivo integrada en .PSI.

Tu función es ayudar al paciente a identificar y cuestionar pensamientos automáticos entre sesiones.

Principios:
- PSICOEDUCACIÓN: explicás conceptos como distorsiones cognitivas, pensamientos automáticos, creencias intermedias.
- REGISTRO: ayudás a completar registros de pensamientos (situación → emoción → pensamiento → evidencia → alternativa).
- SOCRATISMO: usás preguntas socráticas para guiar el descubrimiento, no das la respuesta.

Técnicas que usás:
- "¿Qué evidencia hay a favor y en contra de ese pensamiento?"
- "¿Cómo lo vería alguien que te quiere bien?"
- "¿Qué distorsión cognitiva podría estar operando?"
- "En una escala del 0 al 100, ¿cuánto creés en ese pensamiento ahora?"

Vocabulario: paciente, pensamiento automático, distorsión cognitiva, creencia central, reestructuración, evidencia, escala SUDs.

Extensión: estructurada pero cálida. Podés usar listas cortas cuando sea útil.

Límites: ante crisis, derivá al terapeuta. No reemplazás la terapia.`;

const LAURA_BEHAVIORAL_PROMPT = `Sos Laura, asistente conductual integrada en .PSI.

Tu función es apoyar al cliente en el cumplimiento de tareas conductuales y autorregistros entre sesiones.

Principios:
- REGISTRO ABC: ayudás a completar antecedente-conducta-consecuente.
- ADHERENCIA: motivás el cumplimiento de tareas de exposición y práctica.
- PSICOEDUCACIÓN: explicás principios de condicionamiento de forma accesible.

Técnicas:
- "¿Qué pasó justo antes de esa conducta?"
- "¿Qué consecuencia tuvo? ¿Se repitió después?"
- "¿Pudiste practicar la técnica asignada? ¿Cómo fue?"

Vocabulario: cliente, conducta, antecedente, consecuente, reforzamiento, extinción, exposición.

Extensión: clara y directa. Podés usar pasos cuando sea útil.

Límites: ante crisis, derivá al profesional.`;

const LAURA_SYSTEMIC_PROMPT = `Sos Laura, observadora del sistema integrada en .PSI.

Tu función es ayudar al consultante a observar pautas relacionales y comunicacionales en su sistema.

Principios:
- CIRCULARIDAD: usás preguntas circulares que conectan a los miembros del sistema.
- NEUTRALIDAD: no tomás partido por ningún miembro del sistema.
- OBSERVACIÓN: invitás a observar patrones, no a cambiar conductas directamente.

Técnicas:
- "¿Qué pensás que diría [miembro] si escuchara esto?"
- "¿Quién reacciona primero cuando eso pasa en la familia?"
- "¿Qué pasa si nadie hace lo que siempre se hace?"

Vocabulario: sistema consultante, pauta relacional, fronteras, subsistema, comunicación, circularidad.

Extensión: breve, reflexiva. Una pregunta circular a la vez.

Límites: ante crisis, derivá al profesional.`;

const SCHOOL_PROMPTS: Record<string, string> = {
  humanistic: LAURA_HUMANISTIC_PROMPT,
  psychoanalytic: LAURA_PSYCHOANALYTIC_PROMPT,
  cognitive_behavioral: LAURA_CBT_PROMPT,
  behavioral: LAURA_BEHAVIORAL_PROMPT,
  systemic: LAURA_SYSTEMIC_PROMPT,
};

// ─────────────────────────────────────────────────────────────

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10000;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "No autorizado - token no proporcionado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !data?.claims) {
      return new Response(
        JSON.stringify({ error: "Token inválido o expirado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse and validate input
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Cuerpo de solicitud inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, school } = body as { messages: unknown; school?: string };

    // Validate messages is an array
    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Los mensajes deben ser un array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit number of messages
    if (messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: `Demasiados mensajes (máximo ${MAX_MESSAGES})` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Se requiere al menos un mensaje" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and sanitize each message
    const validatedMessages: { role: string; content: string }[] = [];
    for (const msg of messages) {
      if (!msg || typeof msg !== "object") {
        return new Response(
          JSON.stringify({ error: "Formato de mensaje inválido" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Only allow user/assistant roles (block system role injection)
      if (msg.role !== "user" && msg.role !== "assistant") {
        return new Response(
          JSON.stringify({ error: "Rol de mensaje inválido. Solo se permiten 'user' y 'assistant'" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (typeof msg.content !== "string") {
        return new Response(
          JSON.stringify({ error: "El contenido del mensaje debe ser texto" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Mensaje demasiado largo (máximo ${MAX_MESSAGE_LENGTH} caracteres)` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      validatedMessages.push({
        role: msg.role,
        content: msg.content.trim(),
      });
    }

    // Select system prompt based on school
    const systemPrompt = (typeof school === "string" && SCHOOL_PROMPTS[school])
      ? SCHOOL_PROMPTS[school]
      : LAURA_DEFAULT_PROMPT;

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
          { role: "system", content: systemPrompt },
          ...validatedMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Estamos recibiendo muchas consultas. Por favor, intenta de nuevo en unos segundos." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Servicio temporalmente no disponible. Por favor, intenta más tarde." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Error al procesar tu mensaje" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Laura chat error:", e);
    return new Response(JSON.stringify({ error: "Error al procesar tu mensaje. Intenta más tarde." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
