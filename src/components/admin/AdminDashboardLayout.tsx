import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeft,
  LogOut,
  Command as CommandIcon,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { SchoolSwitcher } from "@/components/SchoolSwitcher";

export type AdminSection =
  | "dashboard"
  | "clinical_notes"
  | "booking"
  | "symbolic"
  | "interview_models"
  | "profile"
  | "monitoring"
  | "users"
  | "professionals"
  | "authorizations"
  | "allowlist"
  | "activity"
  | "audit_consents"
  | "audit_reports"
  | "tests"
  | "reports"
  | "notifications"
  | "patient_proposals"
  | "suggestions"
  | "settings";

interface AdminDashboardLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
  notificationCount?: number;
  pendingAuthCount?: number;
}

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Inicio",
  clinical_notes: "Notas clínicas",
  booking: "Reserva de turnos",
  symbolic: "Recursos simbólicos",
  interview_models: "Modelos de entrevista e informes",
  authorizations: "Autorizaciones",
};

export function AdminDashboardLayout({
  activeSection,
  onSectionChange,
  children,
  notificationCount = 0,
  pendingAuthCount = 0,
}: AdminDashboardLayoutProps) {
  const { isAdmin, isLoading, profile, signOut } = useAuth();
  const { isDemoMode, demoProfile } = useDemoMode();
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Apply pro workspace theme to body while mounted
  useEffect(() => {
    const prev = document.body.getAttribute("data-area");
    document.body.setAttribute("data-area", "pro");
    return () => {
      if (prev) document.body.setAttribute("data-area", prev);
      else document.body.removeAttribute("data-area");
    };
  }, []);

  // Cmd+K / Ctrl+K opens the command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!isDemoMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Verificando permisos…</div>
      </div>
    );
  }

  if (!isDemoMode && !isAdmin) return <Navigate to="/dashboard" replace />;

  const activeLabel = SECTION_LABELS[activeSection] ?? "Panel";
  const isHome = activeSection === "dashboard";

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSectionChange={onSectionChange}
      />

      {/* Top bar — replaces the sidebar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-2 md:gap-3 border-b border-border bg-background/90 px-3 md:px-5 backdrop-blur">
        <button
          onClick={() => onSectionChange("dashboard")}
          className="flex items-center gap-2 mr-1"
          aria-label="Inicio"
        >
          <PsiLogo size="sm" />
          <div className="hidden md:flex flex-col leading-none">
            <span className="text-[13px] font-semibold tracking-tight">Workspace clínico</span>
            <span className="text-[10px] text-muted-foreground">.PSI. · Mi Práctica</span>
          </div>
        </button>

        {!isHome && (
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 h-8 px-2 text-xs"
            onClick={() => onSectionChange("dashboard")}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
        )}

        <span className="hidden md:inline text-xs text-muted-foreground/60">/</span>
        <h1 className="text-sm font-semibold truncate">{activeLabel}</h1>

        <div className="flex-1" />

        <SchoolSwitcher compact />

        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs h-8 hidden md:inline-flex"
          onClick={() => setPaletteOpen(true)}
        >
          <CommandIcon className="h-3.5 w-3.5" />
          <span>Buscar</span>
          <kbd className="hidden md:inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="gap-1.5 text-xs h-8"
          onClick={() => onSectionChange("dashboard")}
          aria-label="Inicio"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Inicio</span>
        </Button>

        {pendingAuthCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="relative gap-1.5 text-xs h-8"
            onClick={() => onSectionChange("authorizations")}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Autorizaciones</span>
            <Badge variant="destructive" className="text-[9px] px-1 py-0 h-4">
              {pendingAuthCount}
            </Badge>
          </Button>
        )}

        <div className="hidden lg:flex items-center gap-2 ml-1 pl-2 border-l border-border">
          <Avatar className="h-7 w-7">
            <AvatarImage src={isDemoMode ? undefined : (profile?.avatar_url || undefined)} />
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
              {isDemoMode ? "D" : (profile?.full_name?.charAt(0) || "A")}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-muted-foreground truncate max-w-[120px]">
            {isDemoMode ? demoProfile.full_name : (profile?.full_name || "Admin")}
          </span>
          {!isDemoMode && (
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => signOut()} aria-label="Salir">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
