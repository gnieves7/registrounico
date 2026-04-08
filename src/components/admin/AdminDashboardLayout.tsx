import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, ClipboardList, FileText, Bell, Settings,
  ChevronLeft, ChevronRight, LogOut, Home, ArrowLeft, Menu, X, Search, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import logoPsi from "@/assets/logo_psi.png";
import { useIsMobile } from "@/hooks/use-mobile";

export type AdminSection = "dashboard" | "users" | "tests" | "reports" | "notifications" | "settings";

interface AdminDashboardLayoutProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  children: React.ReactNode;
  notificationCount?: number;
}

const sidebarItems: { key: AdminSection; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Resumen General", icon: LayoutDashboard },
  { key: "users", label: "Usuarios Activos", icon: Users },
  { key: "tests", label: "Tests", icon: ClipboardList },
  { key: "reports", label: "Informes PDF", icon: FileText },
  { key: "notifications", label: "Notificaciones", icon: Bell },
  { key: "settings", label: "Configuración", icon: Settings },
];

export function AdminDashboardLayout({
  activeSection,
  onSectionChange,
  children,
  notificationCount = 0,
}: AdminDashboardLayoutProps) {
  const { isAdmin, isLoading, profile, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; email: string }[]>([]);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Supabase connection indicator
  useEffect(() => {
    const channel = supabase.channel("admin-conn-check")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {})
      .subscribe((status) => {
        setSupabaseConnected(status === "SUBSCRIBED");
      });
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Global search
  useEffect(() => {
    if (globalSearch.length < 2) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email")
        .or(`full_name.ilike.%${globalSearch}%,email.ilike.%${globalSearch}%`)
        .limit(5);
      setSearchResults((data || []).map((p) => ({ name: p.full_name || "Sin nombre", email: p.email || "" })));
    }, 300);
    return () => clearTimeout(timeout);
  }, [globalSearch]);

  const handleSectionChange = (section: AdminSection) => {
    onSectionChange(section);
    if (isMobile) setMobileOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Verificando permisos…</div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const sidebarContent = (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-4">
        <img src={logoPsi} alt=".PSI." className="h-8 w-8 rounded-full object-cover" />
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold text-foreground">Panel Admin</span>
            <span className="text-[10px] text-muted-foreground">Mi Práctica · PSI</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleSectionChange(item.key)}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              activeSection === item.key
                ? "bg-primary text-primary-foreground font-medium"
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
          </button>
        ))}
      </nav>

      {/* User + collapse + connection */}
      <div className="border-t border-border p-3 space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {profile?.full_name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{profile?.full_name || "Admin"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{profile?.email}</p>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => signOut()}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
        {/* Connection indicator */}
        <div className={cn("flex items-center justify-center gap-1.5 px-2 py-1 rounded-md text-[10px]", collapsed && "px-0")}>
          <span className={cn("h-2 w-2 rounded-full shrink-0", supabaseConnected ? "bg-green-500 animate-pulse" : "bg-red-500")} />
          {!collapsed && (
            <span className="text-muted-foreground">
              {supabaseConnected ? "Conectado" : "Sin conexión"}
            </span>
          )}
        </div>
        {!isMobile && (
          <Button size="sm" variant="ghost" className="w-full justify-center" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside
          className={cn(
            "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300",
            collapsed ? "w-16" : "w-[220px] lg:w-[260px]"
          )}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-[260px] p-0 flex flex-col">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      )}

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 md:px-6 backdrop-blur">
          {isMobile && (
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 md:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0 hidden md:flex" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-bold text-foreground truncate">
            {sidebarItems.find((i) => i.key === activeSection)?.label}
          </h1>

          <div className="flex-1" />

          {/* Global Search */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar paciente…"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                {searchResults.map((r, i) => (
                  <button
                    key={i}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors"
                    onClick={() => {
                      handleSectionChange("users");
                      setGlobalSearch("");
                    }}
                  >
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-muted-foreground">{r.email}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button size="sm" variant="outline" className="gap-1.5 text-xs hidden md:flex" onClick={() => navigate("/dashboard")}>
            <Home className="h-3.5 w-3.5" /> Inicio
          </Button>

          {/* Avatar dropdown */}
          <Avatar className="h-8 w-8 cursor-pointer" onClick={() => handleSectionChange("settings")}>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {profile?.full_name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
        </header>

        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
