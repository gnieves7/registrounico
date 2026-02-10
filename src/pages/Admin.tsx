import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Search, 
  Smile,
  FileText,
  ChevronRight,
  Calendar,
  Clock,
  FolderOpen,
  Moon,
  Brain
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PatientEmotionalView } from "@/components/admin/PatientEmotionalView";
import { PatientPsychobiographyView } from "@/components/admin/PatientPsychobiographyView";
import { PatientDocumentsView } from "@/components/admin/PatientDocumentsView";
import { PatientSessionsView } from "@/components/admin/PatientSessionsView";
import { PatientDreamsView } from "@/components/admin/PatientDreamsView";
import { PatientPsychodiagnosticView } from "@/components/admin/PatientPsychodiagnosticView";

interface Patient {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface PatientStats {
  emotionalRecords: number;
  psychobiographyProgress: number;
  sessionsCount: number;
  lastActivity: string | null;
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientStats, setPatientStats] = useState<Record<string, PatientStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("emotional");

  useEffect(() => {
    if (isAdmin) {
      fetchPatients();
    }
  }, [isAdmin]);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all profiles (admin has RLS access)
      const { data: profilesData, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPatients(profilesData || []);

      // Fetch stats for each patient
      if (profilesData && profilesData.length > 0) {
        await fetchAllStats(profilesData);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllStats = async (patientsList: Patient[]) => {
    const statsMap: Record<string, PatientStats> = {};

    for (const patient of patientsList) {
      try {
        // Fetch emotional records count
        const { count: emotionalCount } = await supabase
          .from("emotional_records")
          .select("*", { count: "exact", head: true })
          .eq("user_id", patient.user_id);

        // Fetch psychobiography
        const { data: psycho } = await supabase
          .from("psychobiographies")
          .select("*")
          .eq("user_id", patient.user_id)
          .maybeSingle();

        // Fetch sessions count
        const { count: sessionsCount } = await supabase
          .from("sessions")
          .select("*", { count: "exact", head: true })
          .eq("patient_id", patient.user_id);

        // Calculate psychobiography progress
        const progress = calculatePsychobiographyProgress(psycho);

        // Get last activity
        const { data: lastRecord } = await supabase
          .from("emotional_records")
          .select("created_at")
          .eq("user_id", patient.user_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        statsMap[patient.user_id] = {
          emotionalRecords: emotionalCount || 0,
          psychobiographyProgress: progress,
          sessionsCount: sessionsCount || 0,
          lastActivity: lastRecord?.created_at || null,
        };
      } catch (error) {
        console.error(`Error fetching stats for patient ${patient.user_id}:`, error);
        statsMap[patient.user_id] = {
          emotionalRecords: 0,
          psychobiographyProgress: 0,
          sessionsCount: 0,
          lastActivity: null,
        };
      }
    }

    setPatientStats(statsMap);
  };

  const calculatePsychobiographyProgress = (data: unknown): number => {
    if (!data) return 0;
    const psycho = data as Record<string, unknown>;

    const sections = [
      !!(psycho.birth_date || psycho.birth_place || psycho.nationality || psycho.address || psycho.education_level || psycho.occupation || psycho.marital_status),
      !!(psycho.family_data && Object.keys(psycho.family_data as object).length > 0),
      !!(psycho.medical_history && Object.keys(psycho.medical_history as object).length > 0),
      !!(psycho.psychological_history && Object.keys(psycho.psychological_history as object).length > 0),
      !!(psycho.social_data && Object.keys(psycho.social_data as object).length > 0) ||
        !!(psycho.work_history && (psycho.work_history as unknown[]).length > 0),
      !!(psycho.lifestyle_data && Object.keys(psycho.lifestyle_data as object).length > 0),
      !!(psycho.traumatic_events && (psycho.traumatic_events as unknown[]).length > 0) ||
        !!(psycho.legal_history && Object.keys(psycho.legal_history as object).length > 0) ||
        !!(psycho.personal_values && Object.keys(psycho.personal_values as object).length > 0),
    ];

    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.full_name?.toLowerCase().includes(query) ||
      patient.email?.toLowerCase().includes(query)
    );
  });

  if (authLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-primary">Verificando permisos...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Panel de Administración</h1>
        </div>
        <p className="text-muted-foreground">
          Gestiona tus pacientes y revisa sus registros emocionales y psicobiografías
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{patients.length}</p>
                <p className="text-sm text-muted-foreground">Pacientes totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Smile className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(patientStats).reduce((sum, s) => sum + s.emotionalRecords, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Registros emocionales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(patientStats).reduce((sum, s) => sum + s.sessionsCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Sesiones registradas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Pacientes</CardTitle>
          <CardDescription>
            Haz clic en un paciente para ver sus registros detallados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No se encontraron pacientes con esa búsqueda" : "No hay pacientes registrados"}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPatients.map((patient) => {
                const stats = patientStats[patient.user_id];
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={patient.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(patient.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {patient.full_name || "Sin nombre"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {patient.email}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{stats?.emotionalRecords || 0}</p>
                        <p className="text-xs text-muted-foreground">Registros</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{stats?.psychobiographyProgress || 0}%</p>
                        <p className="text-xs text-muted-foreground">Psicobiografía</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-foreground">{stats?.sessionsCount || 0}</p>
                        <p className="text-xs text-muted-foreground">Sesiones</p>
                      </div>
                    </div>
                    {stats?.lastActivity && (
                      <Badge variant="outline" className="hidden md:flex gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(stats.lastActivity), "dd MMM", { locale: es })}
                      </Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedPatient && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedPatient.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(selectedPatient.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-xl">
                      {selectedPatient.full_name || "Sin nombre"}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedPatient.email}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-6 flex-wrap h-auto gap-1">
                  <TabsTrigger value="emotional" className="flex-1 gap-1">
                    <Smile className="h-4 w-4" />
                    <span className="hidden sm:inline">Emocional</span>
                  </TabsTrigger>
                  <TabsTrigger value="dreams" className="flex-1 gap-1">
                    <Moon className="h-4 w-4" />
                    <span className="hidden sm:inline">Sueños</span>
                  </TabsTrigger>
                  <TabsTrigger value="psychodiagnostic" className="flex-1 gap-1">
                    <Brain className="h-4 w-4" />
                    <span className="hidden sm:inline">Tests</span>
                  </TabsTrigger>
                  <TabsTrigger value="psychobiography" className="flex-1 gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Psicobio</span>
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="flex-1 gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Sesiones</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1 gap-1">
                    <FolderOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Docs</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="emotional">
                  <PatientEmotionalView userId={selectedPatient.user_id} />
                </TabsContent>

                <TabsContent value="dreams">
                  <PatientDreamsView 
                    userId={selectedPatient.user_id} 
                    patientName={selectedPatient.full_name || "el paciente"} 
                  />
                </TabsContent>

                <TabsContent value="psychodiagnostic">
                  <PatientPsychodiagnosticView patientId={selectedPatient.user_id} patientName={selectedPatient.full_name || undefined} />
                </TabsContent>

                <TabsContent value="psychobiography">
                  <PatientPsychobiographyView userId={selectedPatient.user_id} />
                </TabsContent>

                <TabsContent value="sessions">
                  <PatientSessionsView 
                    userId={selectedPatient.user_id} 
                    patientName={selectedPatient.full_name || "el paciente"} 
                  />
                </TabsContent>

                <TabsContent value="documents">
                  <PatientDocumentsView 
                    userId={selectedPatient.user_id} 
                    patientName={selectedPatient.full_name || "el paciente"} 
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
