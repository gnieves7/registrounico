import { useEffect, useMemo, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { applySystemTheme, getStoredSystemArea, systemBranding } from "@/lib/systemBranding";
import { toast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DemoBanner } from "./DemoBanner";
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
import { NotificationCenter } from "./NotificationCenter";

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
  "/camara-gesell": "Cámara Gesell",
  "/notebook": "Mi Cuaderno",
  "/professional-profile": "Perfil del Profesional",
  "/symbolic-awards": "Premios Simbólicos",
  "/telegram": "Telegram",
  "/admin": "Panel Admin",
  "/admin/dashboard": "Dashboard Admin",
  "/privacy-policy": "Política de Privacidad",
};

export function AppLayout() {
  const { user, isLoading, isApproved, isAdmin, profile } = useAuth();
  const { isDemoMode } = useDemoMode();
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstRender = useRef(true);

  const currentArea = getStoredSystemArea();
  const currentSystem = currentArea ? systemBranding[currentArea] : null;
  const currentLabel = useMemo(() => {
    return routeLabels[location.pathname] || "Página";
  }, [location.pathname]);

  useEffect(() => {
    if (isDemoMode) return; // skip auth redirects in demo
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && !isAdmin && !isApproved) {
      navigate("/pending-approval");
    }
  }, [user, isLoading, isApproved, isAdmin, navigate, isDemoMode]);

  // Welcome toast — once per session
  useEffect(() => {
    if (isDemoMode) return;
    if (!user || !profile?.full_name) return;
    const key = "psi_welcome_shown";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const firstName = profile.full_name.split(" ")[0];
    toast({
      title: `¡Un gusto saludarte, ${firstName}!`,
      description: "Bienvenido/a a Mi Práctica · PSI",
    });
  }, [user, profile, isDemoMode]);

  // Apply theme: instant on first render, smooth on route changes
  useEffect(() => {
    const area = getStoredSystemArea();
    if (isFirstRender.current) {
      applySystemTheme(area, false);
      isFirstRender.current = false;
    } else {
      applySystemTheme(area, true);
    }
  }, [location.pathname]);

  if (!isDemoMode && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  if (!isDemoMode && !user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full animate-fade-in">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="system-header sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border px-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:h-16 md:gap-4 md:px-4">
            <SidebarTrigger className="system-header-trigger -ml-1 h-9 w-9 rounded-xl md:h-10 md:w-10" />

            {currentSystem && (
              <div className="system-header-badge hidden items-center gap-2 rounded-full px-3 py-1.5 md:flex">
                <div className="system-header-icon flex h-8 w-8 items-center justify-center rounded-full">
                  <currentSystem.icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-xs font-semibold text-foreground">{currentSystem.label}</span>
                  <span className="text-[10px] text-muted-foreground">{currentSystem.subtitle}</span>
                </div>
              </div>
            )}

            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="flex items-center gap-1.5 text-foreground/80 hover:text-foreground">
                    <Home className="h-3.5 w-3.5" />
                    <span>Inicio</span>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {location.pathname !== "/dashboard" && (
                  <>
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            <span className="max-w-[180px] truncate text-sm font-semibold text-foreground md:hidden">
              {currentLabel}
            </span>

            <div className="flex-1" />
            <NotificationCenter />
          </header>

          <main className="system-main flex-1 overflow-auto">
            <Outlet />
          </main>

          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
