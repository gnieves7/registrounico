import { useEffect, useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Footer from "./Footer";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const routeLabels: Record<string, string> = {
  "/dashboard": "Inicio",
  "/psychobiography": "Mi Psicobiografía",
  "/psychodiagnostic": "Registro Psicodiagnóstico",
  "/forensic": "Expediente Forense",
  "/anxiety-record": "Entrenamiento Cognitivo",
  "/emotional-thermometer": "Termómetro Emocional",
  "/dream-record": "Registro Inconsciente",
  "/junta-medica": "Junta Médica Laboral",
  "/apto-psicologico": "Apto Psicológico",
  "/sessions": "Mis Turnos",
  "/laura": "Acompañante Virtual",
  "/documents": "Informes",
  "/notebook": "Mi Cuaderno",
  "/professional-profile": "Perfil del Profesional",
  "/admin": "Panel Admin",
  "/privacy-policy": "Política de Privacidad",
};

export function AppLayout() {
  const { user, isLoading, isApproved, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentLabel = useMemo(() => {
    return routeLabels[location.pathname] || "Página";
  }, [location.pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && !isAdmin && !isApproved) {
      navigate("/pending-approval");
    }
  }, [user, isLoading, isApproved, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header with trigger */}
          <header className="sticky top-0 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:h-14 md:gap-4 md:px-4">
            <SidebarTrigger className="-ml-1 md:bg-transparent bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-8 w-8 md:h-7 md:w-7 md:text-foreground" />

            {/* Breadcrumbs */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Inicio</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {location.pathname !== "/dashboard" && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile: show current section name */}
            <span className="text-sm font-medium text-foreground md:hidden truncate max-w-[180px]">
              {currentLabel}
            </span>

            <div className="flex-1" />
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
          
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
