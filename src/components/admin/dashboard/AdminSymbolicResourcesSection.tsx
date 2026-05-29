import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ListChecks, HeartHandshake, Library, ArrowRight } from "lucide-react";

const items = [
  {
    title: "Premios simbólicos",
    description: "Pasaporte terapéutico, logros y categorías de los pacientes.",
    href: "/symbolic-awards",
    icon: Award,
  },
  {
    title: "Micro-tareas entre sesiones",
    description: "Asignación, seguimiento y respuestas del paciente.",
    href: "/micro-tasks",
    icon: ListChecks,
  },
  {
    title: "Alianza terapéutica",
    description: "Doble calificación, rupturas y reparación del vínculo.",
    href: "/therapeutic-alliance",
    icon: HeartHandshake,
  },
  {
    title: "Recursos profesionales",
    description: "Materiales clínicos, protocolos y bibliotecas internas.",
    href: "/professional-profile",
    icon: Library,
  },
];

export function AdminSymbolicResourcesSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Recursos simbólicos</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Herramientas clínicas que sostienen el proceso terapéutico más allá de la sesión.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
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