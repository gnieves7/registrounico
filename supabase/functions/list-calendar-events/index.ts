import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/google_calendar/calendar/v3';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Require authenticated user (admin or professional context)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: authErr } = await supabase.auth.getClaims(token);
    if (authErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get('GOOGLE_CALENDAR_API_KEY');

    if (!LOVABLE_API_KEY || !GOOGLE_CALENDAR_API_KEY) {
      return new Response(
        JSON.stringify({
          connected: false,
          error: 'Google Calendar no está conectado. Conectalo desde Lovable Cloud.',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const url = new URL(req.url);
    const calendarId = url.searchParams.get('calendarId') || 'primary';
    const days = Number(url.searchParams.get('days') || '14');
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const qs = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '50',
    });

    const res = await fetch(
      `${GATEWAY_URL}/calendars/${encodeURIComponent(calendarId)}/events?${qs}`,
      {
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'X-Connection-Api-Key': GOOGLE_CALENDAR_API_KEY,
        },
      },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`Calendar API ${res.status}: ${JSON.stringify(data)}`);
    }

    // Sanitización: solo devolvemos campos no sensibles
    const events = (data.items || []).map((e: any) => ({
      id: e.id,
      summary: e.summary || '(sin título)',
      start: e.start?.dateTime || e.start?.date,
      end: e.end?.dateTime || e.end?.date,
      location: e.location ?? null,
      hangoutLink: e.hangoutLink ?? null,
      status: e.status,
    }));

    return new Response(JSON.stringify({ connected: true, events }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    console.error('list-calendar-events error:', msg);
    return new Response(JSON.stringify({ connected: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});