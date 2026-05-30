import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NotebookPen, User, BookOpen, Handshake, Activity, Thermometer, ArrowRight, Search } from "lucide-react";
import { AdminUsersSection } from "./AdminUsersSection";

const tools = [
  { title: "Psicobiografía", description: "Historia personal estructurada del paciente.", href: "/psychobiography", icon: User },
  { title: "Mi Cuaderno", description: "Notas y reflexiones compartidas por el paciente.", href: "/notebook", icon: BookOpen },
  { title: "Alianza terapéutica", description: "Vínculo, rupturas y reparación clínica.", href: "/therapeutic-alliance", icon: Handshake },
  { title: "Línea de vida", description: "Eventos vitales y ventanas de vulnerabilidad.", href: "/life-timeline", icon: Activity },
  { title: "Termómetro emocional", description: "Registro EMA del estado emocional diario.", href: "/emotional-thermometer", icon: Thermometer },
];

export function AdminClinicalNotesSection() {
  const [showPatients, setShowPatients] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <NotebookPen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Notas clínicas</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Abrí la ficha del paciente para escribir, editar y exportar notas. También accedé a las herramientas de seguimiento clínico.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Card key={t.href} className="border-border hover:border-primary/40 transition-colors">
            <CardContent className="p-4">
              <Link to={t.href} className="flex items-start gap-3 group">
                <div className="rounded-md bg-primary/10 p-2 shrink-0">
                  <t.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold">{t.title}</p>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={() => setShowPatients((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          <Search className="h-4 w-4" />
          {showPatients ? "Ocultar pacientes" : "Ver pacientes y abrir ficha"}
        </button>
        {showPatients && (
          <div className="mt-4">
            <AdminUsersSection />
          </div>
        )}
      </div>
    </div>
  );
}