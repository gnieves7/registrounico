import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, ClipboardList, Bell, CheckCircle2, XCircle, Trash2, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientEmotionalView } from "@/components/admin/PatientEmotionalView";
import { PatientPsychobiographyView } from "@/components/admin/PatientPsychobiographyView";
import { PatientDocumentsView } from "@/components/admin/PatientDocumentsView";
import { PatientSessionsView } from "@/components/admin/PatientSessionsView";
import { PatientDreamsView } from "@/components/admin/PatientDreamsView";
import { PatientPsychodiagnosticView } from "@/components/admin/PatientPsychodiagnosticView";
import { PatientAbcdeView } from "@/components/admin/PatientAbcdeView";
import { PatientNotebookView } from "@/components/admin/PatientNotebookView";
import { ClinicalHistoryExportButton } from "@/components/admin/ClinicalHistoryExportButton";

interface Patient {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export function AdminUsersSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("emotional");

  useEffect(() => {
    fetchPatients();

    const channel = supabase
      .channel("admin-users-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, (payload) => {
        const p = payload.new as Patient;
        if (p.user_id === user?.id) return;
        setPatients((prev) => (prev.some((x) => x.user_id === p.user_id) ? prev : [p, ...prev]));
        toast({ title: "🆕 Nuevo usuario registrado", description: p.full_name || p.email || "Usuario nuevo" });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setPatients(data || []);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      if (p.user_id === user?.id) return false;
      const q = search.toLowerCase();
      const matchSearch = !q || p.full_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || (statusFilter === "approved" ? p.is_approved : !p.is_approved);
      return matchSearch && matchStatus;
    });
  }, [patients, search, statusFilter, user?.id]);

  const updateStatus = async (userId: string, approve: boolean) => {
    try {
      setUpdatingStatus(userId);
      await supabase.functions.invoke("notify-patient-status", { body: { patientUserId: userId, approved: approve } });
      setPatients((prev) => prev.map((p) => (p.user_id === userId ? { ...p, is_approved: approve } : p)));
      toast({ title: approve ? "Paciente aprobado" : "Paciente suspendido" });
    } catch {
      toast({ title: "Error", variant: "destructive" });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deletePatient = async () => {
    if (!deletingPatient) return;
    try {
      setIsDeleting(true);
      await supabase.functions.invoke("delete-patient", { body: { patientUserId: deletingPatient.user_id } });
      setPatients((prev) => prev.filter((p) => p.user_id !== deletingPatient.user_id));
      if (selectedPatient?.user_id === deletingPatient.user_id) setSelectedPatient(null);
      setDeletingPatient(null);
      toast({ title: "Paciente eliminado" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string | null) => name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nombre o email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="approved">Aprobados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Usuarios registrados ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Cargando…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={p.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(p.full_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{p.full_name || "Sin nombre"}</p>
                          <p className="text-xs text-muted-foreground">{p.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.is_approved ? "default" : "secondary"} className={p.is_approved ? "bg-green-600 text-white" : "bg-yellow-500 text-white"}>
                        {p.is_approved ? "Aprobado" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {format(new Date(p.created_at), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedPatient(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {p.is_approved ? (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" disabled={updatingStatus === p.user_id} onClick={() => updateStatus(p.user_id, false)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" disabled={updatingStatus === p.user_id} onClick={() => updateStatus(p.user_id, true)}>
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeletingPatient(p)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Sheet */}
      <Sheet open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <SheetContent className="w-[95vw] max-w-2xl overflow-y-auto p-4 sm:p-6" side="right">
          {selectedPatient && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selectedPatient.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(selectedPatient.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle>{selectedPatient.full_name || "Sin nombre"}</SheetTitle>
                    <SheetDescription>{selectedPatient.email}</SheetDescription>
                  </div>
                  <ClinicalHistoryExportButton userId={selectedPatient.user_id} patientName={selectedPatient.full_name || "Paciente"} />
                </div>
              </SheetHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full mb-4 flex flex-wrap h-auto gap-1">
                  <TabsTrigger value="emotional" className="text-xs flex-1">Emocional</TabsTrigger>
                  <TabsTrigger value="dreams" className="text-xs flex-1">Sueños</TabsTrigger>
                  <TabsTrigger value="abcde" className="text-xs flex-1">ABCDE</TabsTrigger>
                  <TabsTrigger value="notebook" className="text-xs flex-1">Cuaderno</TabsTrigger>
                  <TabsTrigger value="psychodiagnostic" className="text-xs flex-1">Tests</TabsTrigger>
                  <TabsTrigger value="psychobiography" className="text-xs flex-1">Psicobio</TabsTrigger>
                  <TabsTrigger value="sessions" className="text-xs flex-1">Sesiones</TabsTrigger>
                  <TabsTrigger value="documents" className="text-xs flex-1">Docs</TabsTrigger>
                </TabsList>
                <TabsContent value="emotional"><PatientEmotionalView userId={selectedPatient.user_id} /></TabsContent>
                <TabsContent value="dreams"><PatientDreamsView userId={selectedPatient.user_id} patientName={selectedPatient.full_name || "el paciente"} /></TabsContent>
                <TabsContent value="abcde"><PatientAbcdeView userId={selectedPatient.user_id} /></TabsContent>
                <TabsContent value="notebook"><PatientNotebookView userId={selectedPatient.user_id} /></TabsContent>
                <TabsContent value="psychodiagnostic"><PatientPsychodiagnosticView patientId={selectedPatient.user_id} patientName={selectedPatient.full_name || undefined} /></TabsContent>
                <TabsContent value="psychobiography"><PatientPsychobiographyView userId={selectedPatient.user_id} /></TabsContent>
                <TabsContent value="sessions"><PatientSessionsView userId={selectedPatient.user_id} patientName={selectedPatient.full_name || "el paciente"} /></TabsContent>
                <TabsContent value="documents"><PatientDocumentsView userId={selectedPatient.user_id} patientName={selectedPatient.full_name || "el paciente"} /></TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <AlertDialog open={!!deletingPatient} onOpenChange={(open) => !open && setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar paciente definitivamente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán <strong>todos los datos</strong> de{" "}
              <strong>{deletingPatient?.full_name || deletingPatient?.email || "este paciente"}</strong>.
              <br /><br />
              <span className="text-destructive font-semibold">Esta acción es irreversible.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={deletePatient} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? "Eliminando…" : "Sí, eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
