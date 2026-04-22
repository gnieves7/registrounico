import { Navigate, Outlet } from "react-router-dom";
import { useProfessionalAccess } from "@/hooks/useProfessionalAccess";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Bloquea rutas exclusivas del paciente para que el profesional no acceda
 * a vistas o datos sensibles que no le corresponden.
 * - Pacientes y admins: pasan
 * - Profesionales: redirigen a su dashboard
 */
export const PatientOnlyRoute = ({ children }: { children?: React.ReactNode }) => {
  const { loading, isProfessional } = useProfessionalAccess();
  const { isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isProfessional && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children ?? <Outlet />}</>;
};
