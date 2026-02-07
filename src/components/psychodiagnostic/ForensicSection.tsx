import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, 
  Plus, 
  FileUp, 
  Trash2, 
  Calendar, 
  User, 
  Phone, 
  Mail,
  Shield,
  AlertTriangle,
  FileText,
  Building2,
  Users,
  Edit
} from "lucide-react";
import { usePsychodiagnostic, type ForensicCase, type ForensicDocument } from "@/hooks/usePsychodiagnostic";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

interface ForensicSectionProps {
  onCaseSelect?: (caseId: string) => void;
}

export const ForensicSection = ({ onCaseSelect }: ForensicSectionProps) => {
  const {
    forensicCases,
    forensicCasesLoading,
    createForensicCase,
    updateForensicCase,
    deleteForensicCase,
    uploadForensicDocument,
    deleteForensicDocument,
  } = usePsychodiagnostic();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ForensicCase | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<ForensicCase>>({});
  const [newActor, setNewActor] = useState({ name: "", role: "" });

  // Query for documents of selected case
  const documentsQuery = useQuery({
    queryKey: ["forensic-documents", selectedCase?.id],
    queryFn: async () => {
      if (!selectedCase?.id) return [];
      const { data, error } = await supabase
        .from("forensic_documents")
        .select("*")
        .eq("case_id", selectedCase.id)
        .order("upload_date", { ascending: false });
      if (error) throw error;
      return data as ForensicDocument[];
    },
    enabled: !!selectedCase?.id,
  });

  const handleCreateCase = async () => {
    await createForensicCase.mutateAsync(formData);
    setIsCreateDialogOpen(false);
    setFormData({});
  };

  const handleUpdateCase = async () => {
    if (!selectedCase) return;
    await updateForensicCase.mutateAsync({ id: selectedCase.id, ...formData });
    setSelectedCase({ ...selectedCase, ...formData } as ForensicCase);
    setIsEditMode(false);
  };

  const handleDeleteCase = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este caso? Esta acción no se puede deshacer.")) {
      await deleteForensicCase.mutateAsync(id);
      setSelectedCase(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCase || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    await uploadForensicDocument.mutateAsync({
      caseId: selectedCase.id,
      file,
      documentType: "legajo",
      description: file.name,
    });
  };

  const handleAddActor = () => {
    if (!newActor.name || !newActor.role) return;
    const currentActors = formData.intervening_actors || selectedCase?.intervening_actors || [];
    setFormData({
      ...formData,
      intervening_actors: [...currentActors, newActor],
    });
    setNewActor({ name: "", role: "" });
  };

  const handleRemoveActor = (index: number) => {
    const currentActors = formData.intervening_actors || selectedCase?.intervening_actors || [];
    setFormData({
      ...formData,
      intervening_actors: currentActors.filter((_, i) => i !== index),
    });
  };

  const openCaseDetail = (forensicCase: ForensicCase) => {
    setSelectedCase(forensicCase);
    setFormData(forensicCase);
    setIsEditMode(false);
    onCaseSelect?.(forensicCase.id);
  };

  if (selectedCase) {
    const actors = formData.intervening_actors || selectedCase.intervening_actors || [];
    const documents = documentsQuery.data || [];

    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-destructive" />
              <CardTitle>Caso Forense</CardTitle>
              <Badge variant={selectedCase.case_status === "activo" ? "default" : "secondary"}>
                {selectedCase.case_status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCase(null)}>
                Volver
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditMode(!isEditMode)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditMode ? "Cancelar" : "Editar"}
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDeleteCase(selectedCase.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Confidentiality Notice */}
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Información Confidencial</AlertTitle>
            <AlertDescription className="text-xs">
              {selectedCase.confidentiality_notice}
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Case Data */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Datos del Expediente
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Número de Expediente</Label>
                  {isEditMode ? (
                    <Input
                      value={formData.case_number || ""}
                      onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedCase.case_number || "No especificado"}</p>
                  )}
                </div>

                <div>
                  <Label>Juzgado/Tribunal</Label>
                  {isEditMode ? (
                    <Input
                      value={formData.court_name || ""}
                      onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedCase.court_name || "No especificado"}</p>
                  )}
                </div>

                <div>
                  <Label>Fecha de Audiencia</Label>
                  {isEditMode ? (
                    <Input
                      type="datetime-local"
                      value={formData.hearing_date?.slice(0, 16) || ""}
                      onChange={(e) => setFormData({ ...formData, hearing_date: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.hearing_date 
                        ? format(new Date(selectedCase.hearing_date), "PPpp", { locale: es })
                        : "No programada"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Próxima Audiencia</Label>
                  {isEditMode ? (
                    <Input
                      type="datetime-local"
                      value={formData.next_hearing_date?.slice(0, 16) || ""}
                      onChange={(e) => setFormData({ ...formData, next_hearing_date: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {selectedCase.next_hearing_date 
                        ? format(new Date(selectedCase.next_hearing_date), "PPpp", { locale: es })
                        : "No programada"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Defense Lawyer */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Abogado Defensor
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Nombre</Label>
                  {isEditMode ? (
                    <Input
                      value={formData.defense_lawyer_name || ""}
                      onChange={(e) => setFormData({ ...formData, defense_lawyer_name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedCase.defense_lawyer_name || "No especificado"}</p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Teléfono
                  </Label>
                  {isEditMode ? (
                    <Input
                      value={formData.defense_lawyer_phone || ""}
                      onChange={(e) => setFormData({ ...formData, defense_lawyer_phone: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedCase.defense_lawyer_phone || "No especificado"}</p>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  {isEditMode ? (
                    <Input
                      type="email"
                      value={formData.defense_lawyer_email || ""}
                      onChange={(e) => setFormData({ ...formData, defense_lawyer_email: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{selectedCase.defense_lawyer_email || "No especificado"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reported Fact */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Hecho Denunciado
            </h4>
            {isEditMode ? (
              <Textarea
                value={formData.reported_fact || ""}
                onChange={(e) => setFormData({ ...formData, reported_fact: e.target.value })}
                rows={4}
                placeholder="Descripción del hecho denunciado..."
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {selectedCase.reported_fact || "No especificado"}
              </p>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Fecha de Denuncia</Label>
                {isEditMode ? (
                  <Input
                    type="date"
                    value={formData.complaint_date || ""}
                    onChange={(e) => setFormData({ ...formData, complaint_date: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {selectedCase.complaint_date 
                      ? format(new Date(selectedCase.complaint_date), "PP", { locale: es })
                      : "No especificada"}
                  </p>
                )}
              </div>

              <div>
                <Label>Denunciante</Label>
                {isEditMode ? (
                  <Input
                    value={formData.complainant_name || ""}
                    onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{selectedCase.complainant_name || "No especificado"}</p>
                )}
              </div>

              <div>
                <Label>Relación con el Paciente</Label>
                {isEditMode ? (
                  <Input
                    value={formData.complainant_relationship || ""}
                    onChange={(e) => setFormData({ ...formData, complainant_relationship: e.target.value })}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{selectedCase.complainant_relationship || "No especificada"}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Intervening Actors */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Actores Intervinientes
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {actors.map((actor, index) => (
                <Badge key={index} variant="secondary" className="gap-2">
                  {actor.name} - {actor.role}
                  {isEditMode && (
                    <button onClick={() => handleRemoveActor(index)} className="hover:text-destructive">
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>

            {isEditMode && (
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre"
                  value={newActor.name}
                  onChange={(e) => setNewActor({ ...newActor, name: e.target.value })}
                  className="flex-1"
                />
                <Input
                  placeholder="Rol (ej: Fiscal, Perito)"
                  value={newActor.role}
                  onChange={(e) => setNewActor({ ...newActor, role: e.target.value })}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleAddActor}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Additional Info */}
          <div className="space-y-3">
            <h4 className="font-medium">Información Adicional</h4>
            {isEditMode ? (
              <Textarea
                value={formData.additional_info || ""}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                rows={3}
                placeholder="Cualquier información relevante del caso..."
              />
            ) : (
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {selectedCase.additional_info || "Sin información adicional"}
              </p>
            )}
          </div>

          {isEditMode && (
            <Button onClick={handleUpdateCase} className="w-full" disabled={updateForensicCase.isPending}>
              Guardar Cambios
            </Button>
          )}

          <Separator />

          {/* Documents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentos del Legajo
              </h4>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <FileUp className="h-4 w-4" />
                  Subir PDF
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </Label>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{doc.document_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(doc.upload_date), "PP", { locale: es })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {doc.file_url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            Ver
                          </a>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteForensicDocument.mutateAsync({ id: doc.id, caseId: selectedCase.id })}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay documentos adjuntos
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-destructive" />
              Sección Forense
            </CardTitle>
            <CardDescription>
              Gestión de casos judiciales y documentación del legajo
            </CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Caso
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Caso Forense</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh]">
                <div className="space-y-4 p-1">
                  <Alert variant="destructive">
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      La información ingresada está protegida por el secreto profesional.
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Número de Expediente</Label>
                      <Input
                        value={formData.case_number || ""}
                        onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                        placeholder="Ej: 12345/2024"
                      />
                    </div>
                    <div>
                      <Label>Juzgado/Tribunal</Label>
                      <Input
                        value={formData.court_name || ""}
                        onChange={(e) => setFormData({ ...formData, court_name: e.target.value })}
                        placeholder="Nombre del juzgado"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Hecho Denunciado</Label>
                    <Textarea
                      value={formData.reported_fact || ""}
                      onChange={(e) => setFormData({ ...formData, reported_fact: e.target.value })}
                      rows={3}
                      placeholder="Descripción del hecho..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Abogado Defensor</Label>
                      <Input
                        value={formData.defense_lawyer_name || ""}
                        onChange={(e) => setFormData({ ...formData, defense_lawyer_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Teléfono del Abogado</Label>
                      <Input
                        value={formData.defense_lawyer_phone || ""}
                        onChange={(e) => setFormData({ ...formData, defense_lawyer_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Fecha de Audiencia</Label>
                    <Input
                      type="datetime-local"
                      value={formData.hearing_date || ""}
                      onChange={(e) => setFormData({ ...formData, hearing_date: e.target.value })}
                    />
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCase} disabled={createForensicCase.isPending}>
                  Crear Caso
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertTitle>Confidencialidad</AlertTitle>
          <AlertDescription className="text-xs">
            Toda la información en esta sección está protegida por el secreto profesional según el 
            Código de Ética del Psicólogo. Los datos no serán publicados ni compartidos sin autorización expresa.
          </AlertDescription>
        </Alert>

        {forensicCasesLoading ? (
          <div className="text-center py-8 text-muted-foreground">Cargando casos...</div>
        ) : forensicCases.length === 0 ? (
          <div className="text-center py-8">
            <Scale className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No hay casos forenses registrados</p>
            <p className="text-sm text-muted-foreground">Crea un nuevo caso para comenzar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {forensicCases.map((forensicCase) => (
              <div
                key={forensicCase.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => openCaseDetail(forensicCase)}
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Expediente: {forensicCase.case_number || "Sin número"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {forensicCase.court_name || "Tribunal no especificado"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={forensicCase.case_status === "activo" ? "default" : "secondary"}>
                    {forensicCase.case_status}
                  </Badge>
                  {forensicCase.hearing_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {format(new Date(forensicCase.hearing_date), "PP", { locale: es })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
