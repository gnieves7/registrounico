import { useState, useEffect } from "react";
import { 
  Home, 
  User, 
  Smile, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Settings,
  LogOut,
  Moon,
  Brain,
  UserCheck,
  Scale,
  Briefcase,
  ShieldCheck
} from "lucide-react";
import { ClinicLogo } from "@/components/ui/ClinicLogo";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const allPatientMenuItems = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Mi Psicobiografía", url: "/psychobiography", icon: User },
  { title: "Registro Psicodiagnóstico", url: "/psychodiagnostic", icon: Brain },
  { title: "Expediente Forense", url: "/forensic", icon: Scale },
  { title: "Registro de la Ansiedad", url: "/anxiety-record", icon: Brain },
  { title: "Registro Emocional", url: "/emotional-record", icon: Smile },
  { title: "Registro Inconsciente", url: "/dream-record", icon: Moon },
  { title: "Junta Médica Laboral", url: "/junta-medica", icon: Briefcase },
  { title: "Apto Psicológico", url: "/apto-psicologico", icon: ShieldCheck },
  { title: "Mis Turnos", url: "/sessions", icon: Calendar },
  { title: "Asistente Virtual", url: "/laura", icon: MessageCircle },
  { title: "Documentos", url: "/documents", icon: FileText },
  { title: "Perfil del Profesional", url: "/professional-profile", icon: UserCheck },
];

// URLs to hide per area
const hiddenByArea: Record<string, string[]> = {
  clinica: ["/psychodiagnostic", "/forensic", "/junta-medica", "/apto-psicologico"],
  psicodiagnostico: ["/forensic", "/emotional-record", "/dream-record", "/anxiety-record"],
  forense: ["/psychodiagnostic", "/emotional-record", "/dream-record", "/anxiety-record", "/junta-medica", "/apto-psicologico"],
};

const getFilteredMenuItems = () => {
  const area = sessionStorage.getItem("user_area") || "";
  const hidden = hiddenByArea[area] || [];
  return allPatientMenuItems.filter((item) => !hidden.includes(item.url));
};

const adminMenuItems = [
  { title: "Panel Admin", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAdmin, signOut } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  // Fetch pending patients count for admin
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchPending = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false);
      setPendingCount(count || 0);
    };

    fetchPending();

    // Listen for profile changes (new registrations or status updates)
    const channel = supabase
      .channel('sidebar-pending-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchPending();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <ClinicLogo size="sm" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-sm font-semibold text-sidebar-foreground">
                Registro Clínico
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Personalizado
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getFilteredMenuItems().map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent/70"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                    <NavLink 
                        to={item.url} 
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent/70"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {pendingCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1 text-[10px] font-bold">
                            {pendingCount}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {getInitials(profile?.full_name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">
                {profile?.full_name || "Usuario"}
              </span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {profile?.email || ""}
              </span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSignOut}
            className="h-8 w-8 shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
