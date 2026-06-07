import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award, ListChecks, ArrowRight, Brain, Scale, Eye, Briefcase, ShieldCheck,
  FileText, FileSignature, Network, BookOpen, GitBranch, Sparkles,
} from "lucide-react";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import type { SchoolType } from "@/config/schools";
import { onAdminAction } from "@/lib/uiEvents";

interface ResourceItem {
  title: string;
  description: string;
  href: string;
  icon: typeof Brain;
  recommendedFor: SchoolType[] | "all";
}

const items: ResourceItem[] = [
  { title: "Personalidad", description: "Tests psicodiagnósticos (MMPI-2, MCMI-III, SCL-90R, MBTI).", href: "/psychodiagnostic", icon: Brain, recommendedFor: ["cognitive_behavioral", "behavioral"] },
  { title: "Recursos psicoforenses", description: "Expedientes, autopsia psicológica y testimonios.", href: "/forensic", icon: Scale, recommendedFor: "all" },
  { title: "Cámara Gesell", description: "Protocolos NICHD, GEV y SATAC-RATAC.", href: "/camara-gesell", icon: Eye, recommendedFor: "all" },
  { title: "Junta Médica Laboral", description: "Documentación médica para empleados públicos.", href: "/junta-medica", icon: Briefcase, recommendedFor: "all" },
  { title: "Apto Psicológico", description: "Certificados de aptitud psicológica con triple validación.", href: "/apto-psicologico", icon: ShieldCheck, recommendedFor: "all" },
  { title: "Micro-tareas", description: "Asignación y seguimiento entre sesiones.", href: "/micro-tasks", icon: ListChecks, recommendedFor: ["cognitive_behavioral", "behavioral"] },
  { title: "Premios simbólicos", description: "Pasaporte terapéutico y logros del paciente.", href: "/symbolic-awards", icon: Award, recommendedFor: ["behavioral", "humanistic"] },
  { title: "Informes", description: "Generación y descarga de informes clínicos en PDF.", href: "/documents", icon: FileText, recommendedFor: "all" },
  { title: "Consentimiento Informado — Reflexionar", description: "Consentimiento clínico para tratamiento.", href: "/reflexionar/informed-consent", icon: FileSignature, recommendedFor: "all" },
  { title: "Consentimiento Informado — Evaluar", description: "Consentimiento para psicodiagnóstico y evaluación.", href: "/evaluar/informed-consent", icon: FileSignature, recommendedFor: "all" },
  { title: "Red de síntomas", description: "Grafo D3 con cálculo de síntomas puente.", href: "/symptom-network", icon: Network, recommendedFor: ["cognitive_behavioral"] },
  { title: "Análisis narrativo", description: "Detección de patrones narrativos con IA.", href: "/narrative-analysis", icon: BookOpen, recommendedFor: ["psychoanalytic", "humanistic"] },
  { title: "Formulación del caso", description: "Mapa interactivo basado en TCC con React Flow.", href: "/case-formulation", icon: GitBranch, recommendedFor: ["cognitive_behavioral", "systemic"] },
];

function isRecommended(item: ResourceItem, schoolId: SchoolType): boolean {
  return item.recommendedFor === "all" || item.recommendedFor.includes(schoolId);
}

export function AdminSymbolicResourcesSection() {
  const { schoolId, school } = useActiveSchool();

  // Contextual action: scroll the resources list into view
  useEffect(() => {
    return onAdminAction("new-symbolic", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  const recommended = items.filter((i) => isRecommended(i, schoolId) && i.recommendedFor !== "all");
  const generic = items.filter((i) => i.recommendedFor === "all");
  const others = items.filter((i) => !isRecommended(i, schoolId));

  const renderCard = (it: ResourceItem, suggested = false) => (
    <Card key={it.href} className="border-border hover:border-primary/40 transition-colors">
      <CardContent className="p-4">
        <Link to={it.href} className="flex items-start gap-3 group">
          <div className="rounded-md bg-primary/10 p-2 shrink-0">
            <it.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold">{it.title}</p>
              {suggested && (
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-emerald-500/40 text-emerald-700">
                  Sugerido
                </Badge>
              )}
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform ml-auto" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{it.description}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 flex-wrap">
        <div className="rounded-lg bg-emerald-500/10 p-2.5">
          <Sparkles className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold tracking-tight">Recursos simbólicos</h2>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
              style={{ background: `${school.color}15`, color: school.color }}
            >
              Escuela activa · {school.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Herramientas clínicas que sostienen el proceso terapéutico más allá de la sesión.
          </p>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sugeridos para {school.name}
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((it) => renderCard(it, true))}
          </div>
        </section>
      )}

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recursos transversales
        </h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {generic.map((it) => renderCard(it, false))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Otros recursos
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {others.map((it) => renderCard(it, false))}
          </div>
        </section>
      )}
    </div>
  );
}
