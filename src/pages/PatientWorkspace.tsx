import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileDown, Mail, Calendar, Stethoscope } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect as useEffectAlias } from "react";

import { PatientPsychobiographyView } from "@/components/admin/PatientPsychobiographyView";
import { PatientSessionsView } from "@/components/admin/PatientSessionsView";
import { PatientDocumentsView } from "@/components/admin/PatientDocumentsView";
import { PatientEmotionalView } from "@/components/admin/PatientEmotionalView";
import { PatientDreamsView } from "@/components/admin/PatientDreamsView";
import { PatientNotebookView } from "@/components/admin/PatientNotebookView";
import { PatientPsychodiagnosticView } from "@/components/admin/PatientPsychodiagnosticView";
import { PatientAbcdeView } from "@/components/admin/PatientAbcdeView";
import { ClinicalHistoryExportButton } from "@/components/admin/ClinicalHistoryExportButton";

interface PatientProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  account_type: string | null;
}

interface SessionRow {
  id: string;
  session_date: string;
  topic: string | null;
}

function PatientWorkspaceInner() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSession, setLastSession] = useState<SessionRow | null>(null);
  const [nextSession, setNextSession] = useState<SessionRow | null>(null);

  // Apply pro theme to body
  useEffectAlias(() => {
    const prev = document.body.getAttribute("data-area");
    document.body.setAttribute("data-area", "pro");
    return () => {
      if (prev) document.body.setAttribute("data-area", prev);
      else document.body.removeAttribute("data-area");
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const [{ data: p }, { data: sessions }] = await Promise.all([
        supabase
          .from("profiles")
          .select("user_id, full_name, email, avatar_url, is_approved, created_at, account_type")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("sessions")
          .select("id, session_date, topic")
          .eq("user_id", userId)
          .order("session_date", { ascending: false })
          .limit(20),
      ]);
      if (cancelled) return;
      setProfile((p as any) || null);
      const now = Date.now();
      const list = (sessions || []) as SessionRow[];
      const past = list.filter((s) => new Date(s.session_date).getTime() < now);
      const upcoming = list.filter((s) => new Date(s.session_date).getTime() >= now);
      setLastSession(past[0] || null);
      setNextSession(upcoming[upcoming.length - 1] || null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) return null;

  const initials = (profile?.full_name || "P")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky patient header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="max-w-[1400px] mx-auto px-5 py-3 flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => navigate("/admin/dashboard?section=users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          {loading || !profile ? (
            <div className="flex items-center gap-3 flex-1">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : (
            <>
              <Avatar className="h-10 w-10 border border-border">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base font-semibold tracking-tight truncate">
                    {profile.full_name || "Paciente"}
                  </h1>
                  <Badge
                    variant={profile.is_approved ? "outline" : "secondary"}
                    className="text-[10px] h-5"
                  >
                    {profile.is_approved ? "Activo" : "Pendiente"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground">
                  {profile.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {profile.email}
                    </span>
                  )}
                  {lastSession && (
                    <span className="inline-flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" />
                      última sesión {format(new Date(lastSession.session_date), "d MMM", { locale: es })}
                    </span>
                  )}
                  {nextSession && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Calendar className="h-3 w-3" />
                      próxima {format(new Date(nextSession.session_date), "d MMM HH:mm", { locale: es })}
                    </span>
                  )}
                </div>
              </div>
              <ClinicalHistoryExportButton
                userId={profile.user_id}
                patientName={profile.full_name || "Paciente"}
              />
            </>
          )}
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 py-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="psychobiography">Psicobiografía</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="emotional">Emocional</TabsTrigger>
            <TabsTrigger value="dreams">Sueños</TabsTrigger>
            <TabsTrigger value="abcde">ABCDE</TabsTrigger>
            <TabsTrigger value="notebook">Cuaderno</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <PatientSummary userId={userId} profile={profile} lastSession={lastSession} nextSession={nextSession} />
          </TabsContent>
          <TabsContent value="sessions" className="mt-6">
            <PatientSessionsView userId={userId} patientName={profile?.full_name || "el paciente"} />
          </TabsContent>
          <TabsContent value="psychobiography" className="mt-6">
            <PatientPsychobiographyView userId={userId} patientName={profile?.full_name || "Paciente"} />
          </TabsContent>
          <TabsContent value="tests" className="mt-6">
            <PatientPsychodiagnosticView patientId={userId} patientName={profile?.full_name || undefined} />
          </TabsContent>
          <TabsContent value="emotional" className="mt-6">
            <PatientEmotionalView userId={userId} />
          </TabsContent>
          <TabsContent value="dreams" className="mt-6">
            <PatientDreamsView userId={userId} patientName={profile?.full_name || "el paciente"} />
          </TabsContent>
          <TabsContent value="abcde" className="mt-6">
            <PatientAbcdeView userId={userId} />
          </TabsContent>
          <TabsContent value="notebook" className="mt-6">
            <PatientNotebookView userId={userId} />
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            <PatientDocumentsView userId={userId} patientName={profile?.full_name || "el paciente"} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PatientSummary({
  userId,
  profile,
  lastSession,
  nextSession,
}: {
  userId: string;
  profile: PatientProfile | null;
  lastSession: SessionRow | null;
  nextSession: SessionRow | null;
}) {
  const [counts, setCounts] = useState({
    sessions: 0,
    documents: 0,
    dreams: 0,
    emotional: 0,
    abcde: 0,
  });
  const [recentEmotional, setRecentEmotional] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const [sess, docs, dreams, emo, abc, emoRecent] = await Promise.all([
        supabase.from("sessions").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("documents").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("dream_records").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("emotional_records").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase.from("anxiety_abcde_records").select("id", { count: "exact", head: true }).eq("user_id", userId),
        supabase
          .from("emotional_records")
          .select("id, emoji, mood_score, reflection, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      setCounts({
        sessions: sess.count || 0,
        documents: docs.count || 0,
        dreams: dreams.count || 0,
        emotional: emo.count || 0,
        abcde: abc.count || 0,
      });
      setRecentEmotional(emoRecent.data || []);
    })();
  }, [userId]);

  const stats = [
    { label: "Sesiones", value: counts.sessions },
    { label: "Registros emocionales", value: counts.emotional },
    { label: "Sueños registrados", value: counts.dreams },
    { label: "ABCDE", value: counts.abcde },
    { label: "Documentos", value: counts.documents },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-5">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3 tracking-tight">Resumen del paciente</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-md border border-border bg-muted/30 p-3">
                  <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3 tracking-tight">
              Estados emocionales recientes
            </h3>
            {recentEmotional.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                El paciente no ha registrado estados emocionales aún.
              </p>
            ) : (
              <div className="space-y-2">
                {recentEmotional.map((r) => {
                  const low = (r.mood_score ?? 5) <= 3;
                  return (
                    <div
                      key={r.id}
                      className={`flex items-start gap-3 rounded-md border p-2.5 text-xs ${
                        low ? "border-destructive/30 bg-destructive/5" : "border-border bg-background/50"
                      }`}
                    >
                      <span className="text-xl leading-none">{r.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-muted-foreground">
                          {format(new Date(r.created_at), "d MMM HH:mm", { locale: es })}
                          {r.mood_score != null && (
                            <span className={`ml-2 ${low ? "text-destructive font-semibold" : ""}`}>
                              · {r.mood_score}/10
                            </span>
                          )}
                        </p>
                        {r.reflection && (
                          <p className="text-foreground mt-0.5 line-clamp-2">{r.reflection}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card>
          <CardContent className="p-5 space-y-3">
            <h3 className="text-sm font-semibold tracking-tight">Acciones rápidas</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/case-formulation">Formulación de caso</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/life-timeline">Línea de vida</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/therapeutic-alliance">Alianza terapéutica</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/outcome-monitoring">Monitoreo de resultados</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start">
                <Link to="/narrative-analysis">Análisis narrativo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-2 tracking-tight">Sesiones</h3>
            <p className="text-xs text-muted-foreground">
              Última: {lastSession ? format(new Date(lastSession.session_date), "PPP", { locale: es }) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              Próxima: {nextSession ? format(new Date(nextSession.session_date), "PPP HH:mm", { locale: es }) : "—"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PatientWorkspace() {
  return (
    <AdminGuard>
      <PatientWorkspaceInner />
    </AdminGuard>
  );
}