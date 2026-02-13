import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Building2, 
  Scale, 
  Users, 
  ShieldCheck, 
  HeartPulse, 
  BookOpen,
  ExternalLink,
  Star,
  Pencil,
  Plus,
  Trash2,
  Save,
  X
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

interface EducationItem {
  title: string;
  institution: string;
  type: string;
}

const initialServices = [
  {
    title: "Pericias Psicológicas",
    subtitle: "Civil & Penal",
    icon: Scale,
    description: "Elaboración de informes psicológicos forenses para procesos judiciales en ámbitos civil (capacidad, cuidado personal) y penal (imputabilidad, credibilidad testimonial).",
    features: ["Evaluación integral con técnicas validadas", "Informe técnico detallado con argumentos, teorías y normativas", "Ratificación en audiencia judicial"],
    popular: true,
  },
  {
    title: "Cámara Gesell",
    subtitle: "Especializado",
    icon: Users,
    description: "Participación como perito psicológico en entrevistas a menores y adultos en casos de violencia de género, abuso sexual y delitos contra la integridad personal.",
    features: ["Protocolos especializados validados", "Análisis psicolingüístico del relato", "Informe pericial completo y fundamentado"],
  },
  {
    title: "Psicodiagnóstico",
    subtitle: "Clínico & Forense",
    icon: BookOpen,
    description: "Evaluaciones psicológicas integrales utilizando técnicas proyectivas (Rorschach, TAT), psicométricas (MMPI-2, MMCI III) y entrevistas estructuradas.",
    features: ["Técnicas proyectivas especializadas", "Evaluación psicométrica estandarizada", "Diagnóstico diferencial fundamentado"],
  },
  {
    title: "Daño Psíquico",
    subtitle: "Evaluación",
    icon: HeartPulse,
    description: "Análisis exhaustivo de secuelas psicológicas por accidentes, delitos o situaciones traumáticas para procesos indemnizatorios y de reparación.",
    features: ["Evaluación multiaxial completa", "Diagnóstico con perfil de personalidad", "Informe completo para juicio"],
  },
  {
    title: "Competencias Parentales",
    subtitle: "Familia",
    icon: Users,
    description: "Valoración de competencias parentales en procesos de familia, adopción, tutelas y regímenes de visita para determinar capacidades de cuidado.",
    features: ["Evaluación integral de capacidades", "Observación directa de interacciones", "Recomendaciones específicas fundamentadas"],
  },
  {
    title: "Asesoría Técnica",
    subtitle: "Abogados",
    icon: Briefcase,
    description: "Acompañamiento profesional para la construcción de estrategias, análisis de pruebas periciales y asesoramiento en procesos judiciales.",
    features: ["Análisis crítico de pericias", "Elaboración de estrategias procesales", "Asesoramiento en audiencias"],
  },
];

const initialEducation: EducationItem[] = [
  { title: "Licenciado en Psicología", institution: "Universidad Católica de Santa Fe", type: "Título de Grado" },
  { title: "Especialista en Psicología Forense", institution: "Universidad Nacional de Rosario", type: "Posgrado" },
  { title: "Diplomatura en Psicodiagnóstico Rorschach", institution: "Universidad Católica de Santa Fe", type: "Formación Especializada" },
  { title: "Diplomado en Pericias Judiciales", institution: "Centro de Capacitación del Poder Judicial de Santa Fe", type: "Certificación Oficial" },
  { title: "Diplomatura en Criminología", institution: "Asociación Argentina de Salud Mental", type: "Formación Complementaria" },
  { title: "Diplomatura en Violencia de Género", institution: "Intervención interdisciplinaria en el sistema penal", type: "Especialización" },
];

const expertise = [
  "Pericias Psicológicas Forenses",
  "Evaluación en Cámara Gesell",
  "Psicodiagnóstico Rorschach",
  "Evaluación de Competencias Parentales",
  "Análisis de Daño Psíquico",
  "Asesoría Técnica a Abogados",
];

const affiliations = [
  "Colegio de Psicólogos de Santa Fe",
  "APFRA - Asociación de Psicólogos Forenses de la República Argentina",
  "ALPJF - Asociación Latinoamericana de Psicología Jurídica y Forense",
];

const ProfessionalProfile = () => {
  const { isAdmin } = useAuth();
  const [education, setEducation] = useState<EducationItem[]>(initialEducation);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newEdu, setNewEdu] = useState<EducationItem>({ title: "", institution: "", type: "" });
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleEditEdu = (item: EducationItem, index: number) => {
    setEditingEdu({ ...item });
    setEditingIndex(index);
    setEditDialogOpen(true);
  };

  const handleSaveEdu = () => {
    if (editingEdu && editingIndex !== null) {
      const updated = [...education];
      updated[editingIndex] = editingEdu;
      setEducation(updated);
      setEditDialogOpen(false);
      toast.success("Formación actualizada");
    }
  };

  const handleDeleteEdu = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
    toast.success("Formación eliminada");
  };

  const handleAddEdu = () => {
    if (!newEdu.title || !newEdu.institution || !newEdu.type) {
      toast.error("Completá todos los campos");
      return;
    }
    setEducation([...education, newEdu]);
    setNewEdu({ title: "", institution: "", type: "" });
    setAddDialogOpen(false);
    toast.success("Formación agregada");
  };

  return (
    <div className="space-y-8 pb-8 p-4 md:p-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={professionalPhoto} alt="Lic. Esp. Germán Nieves" className="object-cover" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                GN
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-medium text-primary">Especialista Certificado en Psicología Forense</p>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Lic. Esp. Germán Nieves
                </h1>
                <p className="text-muted-foreground mt-1">
                  Psicólogo Forense | Especialista en Psicodiagnóstico
                </p>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Pericias psicológicas, evaluaciones forenses y análisis del testimonio en modalidad Cámara Gesell. 
                Compromiso, ética y rigor científico al servicio de la Salud Mental.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <ShieldCheck className="h-3 w-3" /> Mat. 1889 F89. L11
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <MapPin className="h-3 w-3" /> Santa Fe, Argentina
                </Badge>
                {isAdmin && (
                  <Badge variant="secondary" className="gap-1.5">
                    <Pencil className="h-3 w-3" /> Modo Edición
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="h-5 w-5 text-primary" />
            Perfil Profesional
          </CardTitle>
          <CardDescription>Experiencia y compromiso con la Salud Mental, colaborando con la Justicia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">Licenciado en Psicología</strong> egresado de la Universidad Católica de Santa Fe 
            y <strong className="text-foreground">Especialista en Psicología Forense</strong> por la Universidad Nacional de Rosario.
          </p>
          <p>
            Su práctica profesional se centra en la evaluación psicológica forense con sentido crítico y perspectiva evolutiva, 
            aplicando técnicas especializadas de psicodiagnóstico en contextos judiciales civiles, penales y de familia.
          </p>
          <p>
            Cuenta con formación complementaria en criminología, pericias judiciales y protocolos especializados 
            para la evaluación de víctimas de abuso sexual y violencia de género.
          </p>
        </CardContent>
      </Card>

      {/* Expertise & Affiliations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-primary" />
              Áreas de Expertise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {expertise.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-primary" />
              Afiliaciones Profesionales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {affiliations.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Education */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5 text-primary" />
                Formación Académica
              </CardTitle>
              <CardDescription>Trayectoria de formación continua y especialización</CardDescription>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Agregar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {education.map((item, index) => (
              <div key={item.title + index} className="rounded-lg border bg-muted/30 p-4 space-y-2 relative group">
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditEdu(item, index)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteEdu(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                <h4 className="font-medium text-sm text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {item.institution}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Servicios Profesionales
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Soluciones especializadas en Psicología Forense con metodología científica y ética profesional
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {initialServices.map((service) => (
            <Card key={service.title} className="relative overflow-hidden">
              {service.popular && (
                <Badge className="absolute top-3 right-3 text-xs">Más Solicitado</Badge>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <service.icon className="h-5 w-5 text-primary" />
                  </div>
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
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-primary shrink-0 mt-1.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-primary" />
            Contacto Profesional
          </CardTitle>
          <CardDescription>Canales de comunicación para consultas profesionales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-lg border p-4 space-y-2">
              <Phone className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-medium text-foreground">WhatsApp</h4>
              <p className="text-xs text-muted-foreground">+54 9 342 627-2158</p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <Mail className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Email</h4>
              <p className="text-xs text-muted-foreground">pdf.consultas@gmail.com</p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Consultorio</h4>
              <p className="text-xs text-muted-foreground">Obispo Gelabert 2478, Santa Fe</p>
            </div>
            <div className="rounded-lg border p-4 space-y-2">
              <Clock className="h-5 w-5 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Horarios</h4>
              <p className="text-xs text-muted-foreground">Lun a Vie: 14:30 - 19:30 hs</p>
              <p className="text-xs text-muted-foreground">Sáb: Videollamada</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://www.psicodiagnostico-forense.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Visitar sitio web profesional
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Edit Education Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Formación</DialogTitle>
          </DialogHeader>
          {editingEdu && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={editingEdu.title} onChange={(e) => setEditingEdu({ ...editingEdu, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Institución</Label>
                <Input value={editingEdu.institution} onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input value={editingEdu.type} onChange={(e) => setEditingEdu({ ...editingEdu, type: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveEdu}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Education Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Formación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={newEdu.title} onChange={(e) => setNewEdu({ ...newEdu, title: e.target.value })} placeholder="Ej: Diplomatura en..." />
            </div>
            <div className="space-y-2">
              <Label>Institución</Label>
              <Input value={newEdu.institution} onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="Ej: Universidad Nacional de..." />
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Input value={newEdu.type} onChange={(e) => setNewEdu({ ...newEdu, type: e.target.value })} placeholder="Ej: Posgrado, Especialización..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddEdu}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalProfile;
