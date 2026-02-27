import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Brain,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PatientEmotionalView } from "@/components/admin/PatientEmotionalView";
import { PatientPsychobiographyView } from "@/components/admin/PatientPsychobiographyView";
import { PatientDocumentsView } from "@/components/admin/PatientDocumentsView";
import { PatientSessionsView } from "@/components/admin/PatientSessionsView";
import { PatientDreamsView } from "@/components/admin/PatientDreamsView";
import { PatientPsychodiagnosticView } from "@/components/admin/PatientPsychodiagnosticView";
import { PaymentSettingsEditor } from "@/components/admin/PaymentSettingsEditor";
import ProfessionalStatsEditor from "@/components/admin/ProfessionalStatsEditor";

interface Patient {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
}

interface PatientStats {
  emotionalRecords: number;
  psychobiographyProgress: number;
  sessionsCount: number;
  lastActivity: string | null;
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading, user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientStats, setPatientStats] = useState<Record<string, PatientStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState("emotional");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

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

  const { toast } = useToast();

  const updatePatientStatus = async (patientId: string, userId: string, approve: boolean) => {
    try {
      setUpdatingStatus(userId);
      
      const { data, error } = await supabase.functions.invoke("notify-patient-status", {
        body: { patientUserId: userId, approved: approve },
      });

      if (error) throw error;

      setPatients(prev => prev.map(p => p.user_id === userId ? { ...p, is_approved: approve } : p));
      toast({
        title: approve ? "Paciente aprobado" : "Paciente suspendido",
        description: `Se envió una notificación por email al paciente.`,
      });
    } catch (error) {
      console.error("Error updating patient status:", error);
      toast({ title: "Error", description: "No se pudo actualizar el estado del paciente.", variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    // Exclude the admin's own profile from the patient list
    if (patient.user_id === user?.id) return false;
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
    <div className="container mx-auto px-3 py-4 max-w-6xl md:px-4 md:py-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex items-center gap-2 mb-1 md:gap-3 md:mb-2">
          <Users className="h-6 w-6 text-primary md:h-8 md:w-8" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl md:text-3xl">Panel de Administración</h1>
        </div>
        <p className="text-sm text-muted-foreground md:text-base">
          Gestiona tus pacientes y revisa sus registros
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 mb-6 sm:gap-4 md:mb-8">
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

      {/* Payment Settings & Stats Editor */}
      <div className="grid gap-4 mb-4 md:gap-6 md:mb-6 lg:grid-cols-2">
        <Card>
          <CardContent className="py-4">
            <PaymentSettingsEditor />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <ProfessionalStatsEditor />
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
                const isUpdating = updatingStatus === patient.user_id;
                return (
                  <div
                    key={patient.id}
                    className="flex flex-wrap items-center gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors sm:flex-nowrap sm:gap-4 sm:p-4"
                  >
                    <Avatar className="h-12 w-12 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                      <AvatarImage src={patient.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(patient.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedPatient(patient)}>
                      <p className="font-medium text-foreground truncate">
                        {patient.full_name || "Sin nombre"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {patient.email}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <Badge
                      variant={patient.is_approved ? "default" : "secondary"}
                      className={patient.is_approved 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"}
                    >
                      {patient.is_approved ? "Aprobado" : "Pendiente"}
                    </Badge>

                    {/* Stats (desktop) */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">
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

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      {!patient.is_approved ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={(e) => { e.stopPropagation(); updatePatientStatus(patient.id, patient.user_id, true); }}
                          className="gap-1 text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="hidden lg:inline">Aprobar</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isUpdating}
                          onClick={(e) => { e.stopPropagation(); updatePatientStatus(patient.id, patient.user_id, false); }}
                          className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="hidden lg:inline">Suspender</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <SheetContent className="w-[95vw] max-w-2xl overflow-y-auto p-4 sm:p-6"  side="right">
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
                <TabsList className="w-full mb-4 grid grid-cols-3 h-auto gap-1 sm:flex sm:mb-6">
                  <TabsTrigger value="emotional" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <Smile className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Emocional
                  </TabsTrigger>
                  <TabsTrigger value="dreams" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Sueños
                  </TabsTrigger>
                  <TabsTrigger value="psychodiagnostic" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Tests
                  </TabsTrigger>
                  <TabsTrigger value="psychobiography" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Psicobio
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Sesiones
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="gap-1 text-xs sm:text-sm sm:flex-1">
                    <FolderOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Docs
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
