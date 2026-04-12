import { Eye, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Button } from "@/components/ui/button";

export function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useDemoMode();
  const navigate = useNavigate();

  if (!isDemoMode) return null;

  const handleExit = () => {
    exitDemoMode();
    navigate("/profesional");
  };

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-white text-sm shadow-md">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 shrink-0" />
        <span className="font-medium">
          Modo demostración — Explorá la plataforma sin modificar datos
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-7 bg-white/20 text-white hover:bg-white/30 border-0 text-xs"
          onClick={() => {
            exitDemoMode();
            navigate("/profesional");
          }}
        >
          Solicitar acceso
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
        <button onClick={handleExit} className="p-1 hover:bg-white/20 rounded">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
