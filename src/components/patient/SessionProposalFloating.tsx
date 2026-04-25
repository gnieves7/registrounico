import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, X } from "lucide-react";
import { SessionProposalWidget } from "./SessionProposalWidget";

/**
 * Mapea rutas del paciente a (sectionKey, sectionLabel) para que el psicólogo
 * pueda agrupar las propuestas por sección. Cubre Reflexionar, Evaluar y otras
 * vistas informativas. Las rutas de Acompañar (/forensic/*) se manejan dentro
 * de la propia página Forensic, por lo que se excluyen aquí para evitar duplicar
 * el widget.
 */
const ROUTE_TO_SECTION: Array<{
  match: (path: string) => boolean;
  sectionKey: string;
  sectionLabel: string;
}> = [
  { match: (p) => p === "/psychobiography", sectionKey: "psychobiography", sectionLabel: "Reflexionar · Mi Psicobiografía" },
  { match: (p) => p === "/psychodiagnostic", sectionKey: "psychodiagnostic", sectionLabel: "Evaluar · Personalidad" },
  { match: (p) => p === "/emotional-thermometer", sectionKey: "emotional_thermometer", sectionLabel: "Reflexionar · Termómetro Emocional" },
  { match: (p) => p === "/dream-record", sectionKey: "dream_record", sectionLabel: "Reflexionar · Registro Inconsciente" },
  { match: (p) => p === "/anxiety-record", sectionKey: "anxiety_record", sectionLabel: "Reflexionar · Entrenamiento Cognitivo" },
  { match: (p) => p === "/therapeutic-alliance", sectionKey: "therapeutic_alliance", sectionLabel: "Reflexionar · Alianza Terapéutica" },
  { match: (p) => p === "/life-timeline", sectionKey: "life_timeline", sectionLabel: "Reflexionar · Línea de Vida" },
  { match: (p) => p === "/micro-tasks", sectionKey: "micro_tasks", sectionLabel: "Reflexionar · Micro-Tareas" },
  { match: (p) => p === "/outcome-monitoring", sectionKey: "outcome_monitoring", sectionLabel: "Evaluar · Monitoreo de Resultados" },
  { match: (p) => p === "/symbolic-awards", sectionKey: "symbolic_awards", sectionLabel: "Reflexionar · Premios Simbólicos" },
  { match: (p) => p === "/notebook", sectionKey: "notebook", sectionLabel: "Reflexionar · Mi Cuaderno" },
  { match: (p) => p === "/camara-gesell", sectionKey: "camara_gesell", sectionLabel: "Acompañar · Cámara Gesell" },
];

/**
 * Botón flotante (solo paciente) que despliega el widget para proponer
 * un tema o una pregunta vinculada a la sección informativa actual.
 */
export function SessionProposalFloating() {
  const location = useLocation();
  const { isPatient, loading } = useUserRole();
  const { isDemoMode } = useDemoMode();
  const [open, setOpen] = useState(false);

  const target = useMemo(
    () => ROUTE_TO_SECTION.find((r) => r.match(location.pathname)),
    [location.pathname]
  );

  if (loading || !isPatient || isDemoMode || !target) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[min(420px,calc(100vw-2rem))] flex-col items-end gap-2">
      {open && (
        <div className="pointer-events-auto w-full animate-fade-in">
          <div className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 z-10 h-7 w-7"
              onClick={() => setOpen(false)}
              aria-label="Cerrar panel"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <SessionProposalWidget
              sectionKey={target.sectionKey}
              sectionLabel={target.sectionLabel}
              compact
            />
          </div>
        </div>
      )}
      {!open && (
        <Button
          size="sm"
          onClick={() => setOpen(true)}
          className="pointer-events-auto gap-1.5 shadow-lg"
          aria-label="Proponer tema o pregunta para la próxima sesión"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Proponer para mi sesión
        </Button>
      )}
    </div>
  );
}