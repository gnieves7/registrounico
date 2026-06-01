import { useEffect, useState } from "react";
import { Clock, Mail, LogOut, XCircle, ShieldOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PendingApproval() {
  const { user, signOut, isLoading, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<{ decision: string; reason: string | null; decided_at: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("get_my_authorization_status" as any).then(({ data }) => {
      const row = Array.isArray(data) ? (data[0] as any) : null;
      if (row) setStatus(row);
    });
  }, [user]);

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

  const isRejected = status && (status.decision === "rejected" || status.decision === "revoked");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="flex flex-col items-center gap-3 pb-2">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isRejected ? "bg-destructive/10" : "bg-accent"}`}>
            {isRejected ? (
              status?.decision === "revoked" ? <ShieldOff className="h-8 w-8 text-destructive" /> : <XCircle className="h-8 w-8 text-destructive" />
            ) : (
              <Clock className="h-8 w-8 text-primary" />
            )}
          </div>
          <CardTitle className="font-serif text-xl md:text-2xl">
            {isRejected
              ? status?.decision === "revoked"
                ? "Acceso revocado"
                : "Solicitud no aprobada"
              : "Acceso Pendiente de Aprobación"}
          </CardTitle>
          <CardDescription className="text-sm">
            Tu cuenta <span className="font-medium text-foreground">{user?.email}</span>{" "}
            {isRejected ? "no tiene acceso activo al panel profesional." : "está siendo revisada por el administrador."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {isRejected ? (
            <>
              {status?.reason && (
                <div className="w-full rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-left text-sm">
                  <p className="font-medium text-destructive mb-1">Motivo</p>
                  <p className="text-muted-foreground">{status.reason}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Decisión registrada el{" "}
                {format(new Date(status!.decided_at), "d 'de' MMMM yyyy, HH:mm", { locale: es })}.
              </p>
              <p className="text-sm text-muted-foreground">
                Si querés revisar esta decisión, contactá al Lic. German Nieves.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Recibirás un email cuando tu acceso sea aprobado. Si tenés alguna consulta, contactá al Lic. German Nieves.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Revisá tu bandeja de entrada para novedades</span>
              </div>
            </>
          )}
          <Button variant="outline" onClick={handleSignOut} className="mt-2 gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
