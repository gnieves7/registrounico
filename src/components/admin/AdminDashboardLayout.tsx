import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import logoPsi from "@/assets/logo_psi.png";

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
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Verificando permisos…</div>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
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
              onClick={() => onSectionChange(item.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeSection === item.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.key === "notifications" && notificationCount > 0 && (
                <Badge variant="destructive" className="ml-auto text-[10px] px-1.5 py-0">
                  {notificationCount}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* User + collapse */}
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
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-6 backdrop-blur">
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-bold text-foreground">
            {sidebarItems.find((i) => i.key === activeSection)?.label}
          </h1>
          <div className="flex-1" />
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => navigate("/dashboard")}>
            <Home className="h-3.5 w-3.5" />
            Inicio
          </Button>
          <Badge variant="outline" className="text-xs">
            Tiempo real <span className="ml-1 inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </Badge>
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
