import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Protege rutas administrativas.
 * - Mientras verifica el rol: muestra loading (evita flash de redirección).
 * - Sin sesión activa: redirige a /login.
 * - Con sesión pero sin rol admin en user_roles: redirige a /dashboard.
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isChecking } = useIsAdmin();

  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verificando permisos de administrador…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}