import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted mb-6">
          <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h1 className="text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-lg font-medium text-foreground mb-1">Página no encontrada</p>
        <p className="text-sm text-muted-foreground mb-6">
          La ruta <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{location.pathname}</code> no existe en .PSI.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver atrás
          </Button>
          <Link to="/dashboard">
            <Button className="gap-2">
              <Home className="h-4 w-4" /> Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
