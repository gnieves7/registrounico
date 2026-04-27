import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";

interface Props {
  children: React.ReactNode;
}

/**
 * Restringe el acceso a usuarios con rol profesional o admin.
 * Pacientes son redirigidos a /dashboard con aviso.
 */
export function ProfessionalOnlyRoute({ children }: Props) {
  const { isProfessional, loading } = useUserRole();

  useEffect(() => {
    if (!loading && !isProfessional) {
      toast.error("No tenés acceso a esta sección");
    }
  }, [loading, isProfessional]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isProfessional) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
