import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfessionalProfile, ProfileItem } from "@/hooks/useProfessionalProfile";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, arrayMove, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/professional/SortableItem";
import { 
  GraduationCap, Briefcase, Award, MapPin, Phone, Mail, Clock, Building2, Scale, 
  Users, ShieldCheck, HeartPulse, BookOpen, ExternalLink, Star, Pencil, Plus, Trash2, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import professionalPhoto from "@/assets/professional-photo.jpg";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale, Users, BookOpen, HeartPulse, Briefcase,
};

const ProfessionalProfile = () => {
  const { isAdmin } = useAuth();
  const {
    education, services, content, loading,
    setEducation, setServices,
    saveItem, deleteItem, reorderItems, saveContent,
  } = useProfessionalProfile();

  // Education dialog
  const [eduDialogOpen, setEduDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Partial<ProfileItem> | null>(null);

  // Service dialog
  const [svcDialogOpen, setSvcDialogOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState<Partial<ProfileItem> | null>(null);
  const [featureInput, setFeatureInput] = useState("");

  // Content editing
  const [editingBio, setEditingBio] = useState(false);
  const [bioParagraphs, setBioParagraphs] = useState<string[]>([]);
  const [editingExpertise, setEditingExpertise] = useState(false);
  const [expertiseItems, setExpertiseItems] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [editingAffiliations, setEditingAffiliations] = useState(false);
  const [affiliationItems, setAffiliationItems] = useState<string[]>([]);
  const [affiliationInput, setAffiliationInput] = useState("");

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEndEdu = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = education.findIndex(i => i.id === active.id);
    const newIndex = education.findIndex(i => i.id === over.id);
    const reordered = arrayMove(education, oldIndex, newIndex);
    setEducation(reordered);
    reorderItems(reordered);
  };

  const handleDragEndSvc = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = services.findIndex(i => i.id === active.id);
    const newIndex = services.findIndex(i => i.id === over.id);
    const reordered = arrayMove(services, oldIndex, newIndex);
    setServices(reordered);
    reorderItems(reordered);
  };

  // Education handlers
  const openAddEdu = () => { setEditingEdu({ title: "", institution: "", subtitle: "" }); setEduDialogOpen(true); };
  const openEditEdu = (item: ProfileItem) => { setEditingEdu({ ...item }); setEduDialogOpen(true); };
  const handleSaveEdu = async () => {
    if (!editingEdu?.title || !editingEdu?.institution || !editingEdu?.subtitle) { toast.error("Completá todos los campos"); return; }
    const ok = await saveItem(editingEdu, "education", education.length);
    if (ok) setEduDialogOpen(false);
  };

  // Service handlers
  const openAddSvc = () => { setEditingSvc({ title: "", subtitle: "", description: "", icon_name: "Briefcase", features: [], is_popular: false }); setSvcDialogOpen(true); };
  const openEditSvc = (item: ProfileItem) => { setEditingSvc({ ...item }); setSvcDialogOpen(true); };
  const handleSaveSvc = async () => {
    if (!editingSvc?.title || !editingSvc?.description) { toast.error("Completá título y descripción"); return; }
    const ok = await saveItem({
      ...editingSvc, features: editingSvc.features || [],
    }, "service", services.length);
    if (ok) setSvcDialogOpen(false);
  };

  const addFeature = () => {
    if (!featureInput.trim() || !editingSvc) return;
    setEditingSvc({ ...editingSvc, features: [...(editingSvc.features || []), featureInput.trim()] });
    setFeatureInput("");
  };
  const removeFeature = (idx: number) => {
    if (!editingSvc) return;
    setEditingSvc({ ...editingSvc, features: (editingSvc.features || []).filter((_, i) => i !== idx) });
  };

  // Content section handlers
  const startEditBio = () => { setBioParagraphs([...content.biography.paragraphs]); setEditingBio(true); };
  const saveBio = async () => {
    const ok = await saveContent("biography", { paragraphs: bioParagraphs });
    if (ok) setEditingBio(false);
  };

  const startEditExpertise = () => { setExpertiseItems([...content.expertise.items]); setEditingExpertise(true); };
  const saveExpertise = async () => {
    const ok = await saveContent("expertise", { items: expertiseItems });
    if (ok) setEditingExpertise(false);
  };

  const startEditAffiliations = () => { setAffiliationItems([...content.affiliations.items]); setEditingAffiliations(true); };
  const saveAffiliations = async () => {
    const ok = await saveContent("affiliations", { items: affiliationItems });
    if (ok) setEditingAffiliations(false);
  };

  return (
    <div className="space-y-8 pb-8 p-4 md:p-6">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={professionalPhoto} alt="Lic. Esp. Germán Nieves" className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">GN</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium text-primary">Especialista Certificado en Psicología Forense</p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Lic. Esp. Germán Nieves</h1>
                <p className="text-muted-foreground mt-1">Psicólogo Forense | Especialista en Psicodiagnóstico</p>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Pericias psicológicas, evaluaciones forenses y análisis del testimonio en modalidad Cámara Gesell. 
                Compromiso, ética y rigor científico al servicio de la Salud Mental.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5"><ShieldCheck className="h-3 w-3" /> Mat. 1889 F89. L11</Badge>
                <Badge variant="outline" className="gap-1.5"><MapPin className="h-3 w-3" /> Santa Fe, Argentina</Badge>
                {isAdmin && <Badge variant="secondary" className="gap-1.5"><Pencil className="h-3 w-3" /> Modo Edición</Badge>}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Biography - Editable */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg"><Briefcase className="h-5 w-5 text-primary" /> Perfil Profesional</CardTitle>
              <CardDescription>Experiencia y compromiso con la Salud Mental, colaborando con la Justicia</CardDescription>
            </div>
            {isAdmin && !editingBio && (
              <Button variant="outline" size="sm" onClick={startEditBio} className="gap-1.5"><Pencil className="h-4 w-4" /> Editar</Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editingBio ? (
            <div className="space-y-3">
              {bioParagraphs.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Textarea value={p} onChange={(e) => { const u = [...bioParagraphs]; u[i] = e.target.value; setBioParagraphs(u); }} rows={3} className="flex-1" />
                  <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => setBioParagraphs(bioParagraphs.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => setBioParagraphs([...bioParagraphs, ""])} className="gap-1.5"><Plus className="h-4 w-4" /> Agregar párrafo</Button>
              <div className="flex gap-2 pt-2">
                <Button onClick={saveBio}>Guardar</Button>
                <Button variant="outline" onClick={() => setEditingBio(false)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              {content.biography.paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expertise & Affiliations - Editable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Star className="h-5 w-5 text-primary" /> Áreas de Expertise</CardTitle>
              {isAdmin && !editingExpertise && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEditExpertise}><Pencil className="h-4 w-4" /></Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingExpertise ? (
              <div className="space-y-2">
                {expertiseItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={item} onChange={(e) => { const u = [...expertiseItems]; u[i] = e.target.value; setExpertiseItems(u); }} className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setExpertiseItems(expertiseItems.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={expertiseInput} onChange={(e) => setExpertiseInput(e.target.value)} placeholder="Nueva área..." onKeyDown={(e) => { if (e.key === "Enter" && expertiseInput.trim()) { setExpertiseItems([...expertiseItems, expertiseInput.trim()]); setExpertiseInput(""); } }} />
                  <Button variant="outline" size="icon" onClick={() => { if (expertiseInput.trim()) { setExpertiseItems([...expertiseItems, expertiseInput.trim()]); setExpertiseInput(""); } }}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={saveExpertise}>Guardar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingExpertise(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                {content.expertise.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg"><Award className="h-5 w-5 text-primary" /> Afiliaciones Profesionales</CardTitle>
              {isAdmin && !editingAffiliations && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={startEditAffiliations}><Pencil className="h-4 w-4" /></Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingAffiliations ? (
              <div className="space-y-2">
                {affiliationItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={item} onChange={(e) => { const u = [...affiliationItems]; u[i] = e.target.value; setAffiliationItems(u); }} className="flex-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setAffiliationItems(affiliationItems.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={affiliationInput} onChange={(e) => setAffiliationInput(e.target.value)} placeholder="Nueva afiliación..." onKeyDown={(e) => { if (e.key === "Enter" && affiliationInput.trim()) { setAffiliationItems([...affiliationItems, affiliationInput.trim()]); setAffiliationInput(""); } }} />
                  <Button variant="outline" size="icon" onClick={() => { if (affiliationInput.trim()) { setAffiliationItems([...affiliationItems, affiliationInput.trim()]); setAffiliationInput(""); } }}><Plus className="h-4 w-4" /></Button>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={saveAffiliations}>Guardar</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingAffiliations(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {content.affiliations.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Education - Sortable */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-primary" /> Formación Académica</CardTitle>
              <CardDescription>Trayectoria de formación continua y especialización</CardDescription>
            </div>
            {isAdmin && <Button variant="outline" size="sm" onClick={openAddEdu} className="gap-1.5"><Plus className="h-4 w-4" /> Agregar</Button>}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Cargando...</p> : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndEdu}>
              <SortableContext items={education.map(i => i.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {education.map((item) => (
                    <SortableItem key={item.id} id={item.id} disabled={!isAdmin}>
                      <div className="rounded-lg border bg-muted/30 p-4 pl-8 space-y-2 relative group">
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditEdu(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteItem(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        )}
                        <Badge variant="secondary" className="text-xs">{item.subtitle}</Badge>
                        <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Building2 className="h-3 w-3" />{item.institution}</p>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Services - Sortable */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /> Servicios Profesionales</h2>
            <p className="text-sm text-muted-foreground mt-1">Soluciones especializadas en Psicología Forense con metodología científica y ética profesional</p>
          </div>
          {isAdmin && <Button variant="outline" size="sm" onClick={openAddSvc} className="gap-1.5"><Plus className="h-4 w-4" /> Agregar</Button>}
        </div>
        {loading ? <p className="text-sm text-muted-foreground">Cargando...</p> : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndSvc}>
            <SortableContext items={services.map(i => i.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => {
                  const IconComp = iconMap[service.icon_name || ""] || Briefcase;
                  return (
                    <SortableItem key={service.id} id={service.id} disabled={!isAdmin}>
                      <Card className="relative overflow-hidden group pl-6">
                        {service.is_popular && <Badge className="absolute top-3 right-3 text-xs">Más Solicitado</Badge>}
                        {isAdmin && (
                          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={service.is_popular ? { top: "2.5rem" } : {}}>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditSvc(service)}><Pencil className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteItem(service.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2"><IconComp className="h-5 w-5 text-primary" /></div>
                            <div>
                              <CardTitle className="text-base">{service.title}</CardTitle>
                              <CardDescription className="text-xs">{service.subtitle}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                          <Separator />
                          <ul className="space-y-1.5">
                            {service.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <div className="h-1 w-1 rounded-full bg-primary shrink-0 mt-1.5" />{f}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Phone className="h-5 w-5 text-primary" /> Contacto Profesional</CardTitle>
          <CardDescription>Canales de comunicación para consultas profesionales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 space-y-2"><Phone className="h-5 w-5 text-primary" /><h4 className="text-sm font-medium text-foreground">WhatsApp</h4><p className="text-xs text-muted-foreground">+54 9 342 627-2158</p></div>
            <div className="rounded-lg border p-4 space-y-2"><Mail className="h-5 w-5 text-primary" /><h4 className="text-sm font-medium text-foreground">Email</h4><p className="text-xs text-muted-foreground">pdf.consultas@gmail.com</p></div>
            <div className="rounded-lg border p-4 space-y-2"><MapPin className="h-5 w-5 text-primary" /><h4 className="text-sm font-medium text-foreground">Consultorio</h4><p className="text-xs text-muted-foreground">Obispo Gelabert 2478, Santa Fe</p></div>
            <div className="rounded-lg border p-4 space-y-2"><Clock className="h-5 w-5 text-primary" /><h4 className="text-sm font-medium text-foreground">Horarios</h4><p className="text-xs text-muted-foreground">Lun a Vie: 14:30 - 19:30 hs</p><p className="text-xs text-muted-foreground">Sáb: Videollamada</p></div>
          </div>
          <div className="mt-4 text-center">
            <a href="https://www.psicodiagnostico-forense.com.ar" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
              <ExternalLink className="h-3.5 w-3.5" /> Visitar sitio web profesional
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Education Dialog */}
      <Dialog open={eduDialogOpen} onOpenChange={setEduDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingEdu?.id ? "Editar" : "Agregar"} Formación</DialogTitle></DialogHeader>
          {editingEdu && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Título</Label><Input value={editingEdu.title || ""} onChange={(e) => setEditingEdu({ ...editingEdu, title: e.target.value })} placeholder="Ej: Diplomatura en..." /></div>
              <div className="space-y-2"><Label>Institución</Label><Input value={editingEdu.institution || ""} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} placeholder="Ej: Universidad Nacional de..." /></div>
              <div className="space-y-2"><Label>Tipo</Label><Input value={editingEdu.subtitle || ""} onChange={(e) => setEditingEdu({ ...editingEdu, subtitle: e.target.value })} placeholder="Ej: Posgrado, Especialización..." /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEduDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdu}>{editingEdu?.id ? "Guardar" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={svcDialogOpen} onOpenChange={setSvcDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingSvc?.id ? "Editar" : "Agregar"} Servicio</DialogTitle></DialogHeader>
          {editingSvc && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2"><Label>Título</Label><Input value={editingSvc.title || ""} onChange={(e) => setEditingSvc({ ...editingSvc, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Subtítulo</Label><Input value={editingSvc.subtitle || ""} onChange={(e) => setEditingSvc({ ...editingSvc, subtitle: e.target.value })} /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea value={editingSvc.description || ""} onChange={(e) => setEditingSvc({ ...editingSvc, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2">
                <Label>Ícono</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(iconMap).map((name) => {
                    const Icon = iconMap[name];
                    return (
                      <Button key={name} variant={editingSvc.icon_name === name ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setEditingSvc({ ...editingSvc, icon_name: name })}>
                        <Icon className="h-4 w-4" /> {name}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_popular" checked={editingSvc.is_popular || false} onChange={(e) => setEditingSvc({ ...editingSvc, is_popular: e.target.checked })} className="rounded" />
                <Label htmlFor="is_popular">Más Solicitado</Label>
              </div>
              <div className="space-y-2">
                <Label>Características</Label>
                {(editingSvc.features || []).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground flex-1">{f}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFeature(i)}><X className="h-3 w-3" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Nueva característica..." onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
                  <Button variant="outline" size="sm" onClick={addFeature}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSvcDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveSvc}>{editingSvc?.id ? "Guardar" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalProfile;
