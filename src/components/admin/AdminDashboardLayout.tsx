import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Command as CommandIcon,
  CalendarClock,
  Sparkles,
  NotebookPen,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { CommandPalette } from "@/components/admin/CommandPalette";

export type AdminSection =
  | "dashboard"
  | "clinical_notes"
  | "booking"
  | "symbolic"
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

type SidebarItem = { key: AdminSection; label: string; icon: React.ElementType };
type SidebarGroup = { id: string; label: string; icon: React.ElementType; items: SidebarItem[] };

const sidebarGroups: SidebarGroup[] = [
  {
    id: "workspace",
    label: "Workspace clínico",
    icon: CalendarClock,
    items: [
      { key: "dashboard", label: "Inicio", icon: LayoutDashboard },
      { key: "clinical_notes", label: "Notas clínicas", icon: NotebookPen },
      { key: "booking", label: "Reserva de turnos", icon: CalendarClock },
      { key: "symbolic", label: "Recursos simbólicos", icon: Sparkles },
    ],
  },
  {
    id: "admin",
    label: "Administración",
    icon: ShieldCheck,
    items: [
      { key: "authorizations", label: "Autorizaciones", icon: ShieldCheck },
    ],
  },
];

const allItems: SidebarItem[] = sidebarGroups.flatMap((g) => g.items);

export function AdminDashboardLayout({
  activeSection,
  onSectionChange,
  children,
  notificationCount = 0,
  pendingAuthCount = 0,
}: AdminDashboardLayoutProps) {
  const { isAdmin, isLoading, profile, signOut } = useAuth();
  const { isDemoMode, demoProfile } = useDemoMode();
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sidebarGroups.forEach((g) => {
      initial[g.id] = g.items.some((i) => i.key === activeSection) || g.id === "workspace";
    });
    return initial;
  });
  // Apply pro workspace theme to body while mounted
  useEffect(() => {
    const prev = document.body.getAttribute("data-area");
    document.body.setAttribute("data-area", "pro");
    return () => {
      if (prev) document.body.setAttribute("data-area", prev);
      else document.body.removeAttribute("data-area");
    };
  }, []);

  // Keep the group containing the active section expanded
  useEffect(() => {
    const group = sidebarGroups.find((g) => g.items.some((i) => i.key === activeSection));
    if (group) setOpenGroups((s) => ({ ...s, [group.id]: true }));
  }, [activeSection]);

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

  const activeLabel =
    allItems.find((i) => i.key === activeSection)?.label ?? "Panel";

  const toggleGroup = (id: string) =>
    setOpenGroups((s) => ({ ...s, [id]: !s[id] }));

  const renderItem = (item: SidebarItem) => (
    <button
      key={item.key}
      onClick={() => onSectionChange(item.key)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
        activeSection === item.key
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.key === "notifications" && notificationCount > 0 && (
        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
          {notificationCount}
        </Badge>
      )}
      {!collapsed && item.key === "authorizations" && pendingAuthCount > 0 && (
        <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
          {pendingAuthCount}
        </Badge>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSectionChange={onSectionChange}
      />
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-3.5">
          <PsiLogo size="sm" noShimmer={collapsed} />
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-semibold text-sidebar-foreground tracking-tight">
                Workspace clínico
              </span>
              <span className="text-[10px] text-muted-foreground">.PSI. · Mi Práctica</span>
            </div>
          )}
        </div>

        {/* Command palette trigger */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex w-full items-center gap-2 rounded-md border border-sidebar-border bg-background/60 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              <CommandIcon className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">Buscar o saltar…</span>
              <kbd className="hidden md:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px]">
                ⌘K
              </kbd>
            </button>
          </div>
        )}

        {/* Navigation — grouped by clinical flow */}
        <nav className="flex-1 space-y-3 p-3 overflow-y-auto">
          {sidebarGroups.map((group) => {
            const isOpen = openGroups[group.id] ?? false;
            const groupHasActive = group.items.some((i) => i.key === activeSection);
            return (
              <div key={group.id}>
                {!collapsed ? (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center gap-2 px-1.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground"
                  >
                    <group.icon className="h-3 w-3" />
                    <span className="flex-1 text-left">{group.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isOpen && "rotate-90"
                      )}
                    />
                  </button>
                ) : (
                  <div className={cn(
                    "h-px mx-auto my-1.5 w-6",
                    groupHasActive ? "bg-primary/40" : "bg-sidebar-border"
                  )} />
                )}
                {(collapsed || isOpen) && (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map(renderItem)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User + collapse */}
        <div className="border-t border-sidebar-border p-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={isDemoMode ? undefined : (profile?.avatar_url || undefined)} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {isDemoMode ? "D" : (profile?.full_name?.charAt(0) || "A")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{isDemoMode ? demoProfile.full_name : (profile?.full_name || "Admin")}</p>
                <p className="text-[10px] text-muted-foreground truncate">{isDemoMode ? demoProfile.email : profile?.email}</p>
              </div>
              {!isDemoMode && (
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => signOut()}>
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b border-border bg-background/85 px-5 backdrop-blur">
          <h1 className="text-sm font-semibold text-foreground tracking-tight">
            {activeLabel}
          </h1>
          <div className="flex-1" />
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7" onClick={() => setPaletteOpen(true)}>
            <CommandIcon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Buscar</span>
            <kbd className="hidden md:inline-flex h-4 items-center rounded border border-border bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7" onClick={() => onSectionChange("dashboard")}>
            <LayoutDashboard className="h-3.5 w-3.5" />
            Inicio
          </Button>
          <Badge variant="outline" className="text-[10px] font-normal h-5 px-1.5 gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Tiempo real
          </Badge>
        </header>
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
