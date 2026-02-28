import { Clock, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PendingApproval() {
  const { user, signOut, isLoading, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If already approved or admin, redirect to dashboard
  if (!isLoading && user && (isApproved || isAdmin)) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  // If not logged in, redirect to login
  if (!isLoading && !user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3 pb-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-serif text-xl md:text-2xl">
            Acceso Pendiente de Aprobación
          </CardTitle>
          <CardDescription className="text-sm">
            Tu cuenta <span className="font-medium text-foreground">{user?.email}</span> está siendo revisada por el administrador.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Recibirás un email cuando tu acceso sea aprobado. Si tenés alguna consulta, contactá al Lic. German Nieves.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Revisá tu bandeja de entrada para novedades</span>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="mt-2 gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
