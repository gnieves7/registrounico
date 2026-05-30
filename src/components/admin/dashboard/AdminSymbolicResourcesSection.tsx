import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award, ListChecks, ArrowRight, Brain, Scale, Eye, Briefcase, ShieldCheck,
  FileText, FileSignature, Network, BookOpen, GitBranch, Sparkles,
} from "lucide-react";

const items = [
  { title: "Personalidad", description: "Tests psicodiagnósticos (MMPI-2, MCMI-III, SCL-90R, MBTI).", href: "/psychodiagnostic", icon: Brain },
  { title: "Recursos psicoforenses", description: "Expedientes, autopsia psicológica y testimonios.", href: "/forensic", icon: Scale },
  { title: "Cámara Gesell", description: "Protocolos NICHD, GEV y SATAC-RATAC.", href: "/camara-gesell", icon: Eye },
  { title: "Junta Médica Laboral", description: "Documentación médica para empleados públicos.", href: "/junta-medica", icon: Briefcase },
  { title: "Apto Psicológico", description: "Certificados de aptitud psicológica con triple validación.", href: "/apto-psicologico", icon: ShieldCheck },
  { title: "Micro-tareas", description: "Asignación y seguimiento entre sesiones.", href: "/micro-tasks", icon: ListChecks },
  { title: "Premios simbólicos", description: "Pasaporte terapéutico y logros del paciente.", href: "/symbolic-awards", icon: Award },
  { title: "Informes", description: "Generación y descarga de informes clínicos en PDF.", href: "/documents", icon: FileText },
  { title: "Consentimiento Informado — Reflexionar", description: "Consentimiento clínico para tratamiento.", href: "/reflexionar/informed-consent", icon: FileSignature },
  { title: "Consentimiento Informado — Evaluar", description: "Consentimiento para psicodiagnóstico y evaluación.", href: "/evaluar/informed-consent", icon: FileSignature },
  { title: "Red de síntomas", description: "Grafo D3 con cálculo de síntomas puente.", href: "/symptom-network", icon: Network },
  { title: "Análisis narrativo", description: "Detección de patrones narrativos con IA.", href: "/narrative-analysis", icon: BookOpen },
  { title: "Formulación del caso", description: "Mapa interactivo basado en TCC con React Flow.", href: "/case-formulation", icon: GitBranch },
];

export function AdminSymbolicResourcesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-emerald-500/10 p-2.5">
          <Sparkles className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Recursos simbólicos</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Herramientas clínicas que sostienen el proceso terapéutico más allá de la sesión.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Card key={it.href} className="border-border hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <Link to={it.href} className="flex items-start gap-3 group">
                <div className="rounded-md bg-primary/10 p-2 shrink-0">
                  <it.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold">{it.title}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{it.description}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}