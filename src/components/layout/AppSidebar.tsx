import { useState, useEffect, useMemo } from "react";
import { useDemoMode } from "@/hooks/useDemoMode";
import { 
  Home, User, Calendar, MessageCircle, FileText, Settings, LogOut,
  Moon, Brain, UserCheck, Scale, Briefcase, ShieldCheck, Map,
  Thermometer, BookOpen, Network, Handshake, Clock, ClipboardList,
  BarChart3, Eye, Award, Send, Gavel, BookMarked, AlertOctagon, ShieldAlert,
  HeartHandshake, MessageSquare, Mic, FileSignature, FileCheck2,
  Lightbulb, MessageCircleQuestion, Skull,
} from "lucide-react";
import logoPsi from "@/assets/logo_psi.png";
import { useLocation, useNavigate } from "react-router-dom";
import { PsiLogo } from "@/components/ui/PsiLogo";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getStoredSystemArea, systemBranding } from "@/lib/systemBranding";
import { useActiveSchool } from "@/hooks/useActiveSchool";
import { MENU_BY_SCHOOL, SCHOOL_HEADER } from "@/config/menuBySchool";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

// Fallback menu items (used when no school is active, or for non-Reflexionar systems)
const allPatientMenuItems = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Mi Psicobiografía", url: "/psychobiography", icon: User },
  { title: "Personalidad", url: "/psychodiagnostic", icon: Brain },
  { title: "Recursos Psicoforenses", url: "/forensic", icon: Scale },
  { title: "Cámara Gesell", url: "/camara-gesell", icon: Eye },
  { title: "Entrenamiento Cognitivo", url: "/anxiety-record", icon: Brain },
  { title: "Termómetro Emocional", url: "/emotional-thermometer", icon: Thermometer },
  { title: "Registro Inconsciente", url: "/dream-record", icon: Moon },
  { title: "Junta Médica Laboral", url: "/junta-medica", icon: Briefcase },
  { title: "Apto Psicológico", url: "/apto-psicologico", icon: ShieldCheck },
  { title: "Alianza Terapéutica", url: "/therapeutic-alliance", icon: Handshake },
  { title: "Línea de Vida", url: "/life-timeline", icon: Clock },
  { title: "Micro-Tareas", url: "/micro-tasks", icon: ClipboardList },
  { title: "Premios Simbólicos", url: "/symbolic-awards", icon: Award },
  { title: "Telegram", url: "/telegram", icon: Send },
  { title: "Monitoreo de Resultados", url: "/outcome-monitoring", icon: BarChart3 },
  { title: "Mis Turnos", url: "/sessions", icon: Calendar },
  { title: "Mi Cuaderno", url: "/notebook", icon: BookOpen },
  { title: "Acompañante Virtual", url: "/laura", icon: MessageCircle },
  { title: "Informes", url: "/documents", icon: FileText },
  { title: "Perfil del Profesional", url: "/professional-profile", icon: UserCheck },
  { title: "Sugerencias", url: "/suggestions", icon: Lightbulb },
];

// Items específicos del sistema Acompañar (área forense): Expediente Judicial + 9 secciones independientes
const acompanarMenuItems = [
  { title: "Inicio", url: "/dashboard", icon: Home },
  { title: "Expediente Judicial", url: "/judicial-case", icon: Gavel },
  { title: "Cámara Gesell", url: "/camara-gesell", icon: Eye },
  { title: "Protocolos", url: "/forensic/protocols", icon: FileCheck2 },
  { title: "Violencia de Género", url: "/forensic/gender_violence", icon: AlertOctagon },
  { title: "Daño Psicológico", url: "/forensic/psychological_damage", icon: HeartHandshake },
  { title: "Sospecha de Abuso Sexual", url: "/forensic/sexual_abuse", icon: ShieldAlert },
  { title: "Régimen Comunicacional", url: "/forensic/communication_regime", icon: MessageSquare },
  { title: "Consejos para Audiencias", url: "/forensic/audience_tips", icon: Mic },
  { title: "Psicología del Testimonio", url: "/forensic/testimony_psychology", icon: MessageCircleQuestion },
  { title: "Autopsia Psicológica", url: "/forensic/psychological_autopsy", icon: Skull },
  { title: "Bibliografía Recomendada", url: "/forensic/bibliography", icon: BookMarked },
  { title: "Consentimiento Informado", url: "/forensic/informed_consent", icon: FileSignature },
  { title: "Modelos de Informes", url: "/forensic/report_models", icon: FileText },
  { title: "Informes", url: "/documents", icon: FileText },
];

const hiddenByArea: Record<string, string[]> = {
  reflexionar: ["/psychodiagnostic", "/forensic", "/junta-medica", "/apto-psicologico", "/camara-gesell", "/judicial-case"],
  evaluar: ["/forensic", "/judicial-case", "/camara-gesell", "/dream-record", "/anxiety-record", "/emotional-thermometer", "/therapeutic-alliance", "/micro-tasks", "/symbolic-awards", "/notebook", "/laura"],
  // 'acompanar' usa su propio menú dedicado (acompanarMenuItems), no se filtra desde allPatientMenuItems
};

const areaLabels: Record<string, string> = {
  reflexionar: "Sistema Reflexionar",
  evaluar: "Sistema Evaluar",
  acompanar: "Sistema Acompañar",
};

const getFilteredMenuItems = () => {
  const area = getStoredSystemArea();
  if (area === "acompanar") return acompanarMenuItems;
  const hidden = hiddenByArea[area || ""] || [];
  return allPatientMenuItems.filter((item) => !hidden.includes(item.url));
};




const adminMenuItems = [
  { title: "Dashboard Admin", url: "/admin/dashboard", icon: BarChart3 },
  { title: "Panel Admin", url: "/admin", icon: Settings },
  { title: "Formulación de Caso", url: "/case-formulation", icon: Map },
  { title: "Termómetro Emocional (Admin)", url: "/emotional-thermometer", icon: Thermometer },
  { title: "Análisis Narrativo", url: "/narrative-analysis", icon: BookOpen },
  { title: "Red de Síntomas", url: "/symptom-network", icon: Network },
  { title: "Alianza Terapéutica", url: "/therapeutic-alliance", icon: Handshake },
  { title: "Línea de Vida", url: "/life-timeline", icon: Clock },
  { title: "Micro-Tareas", url: "/micro-tasks", icon: ClipboardList },
  { title: "Premios Simbólicos", url: "/symbolic-awards", icon: Award },
  { title: "Telegram", url: "/telegram", icon: Send },
  { title: "Monitoreo de Resultados", url: "/outcome-monitoring", icon: BarChart3 },
  { title: "Sugerencias (Admin)", url: "/suggestions", icon: Lightbulb },
];

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, isAdmin, signOut } = useAuth();
  const { isDemoMode, demoProfile, exitDemoMode } = useDemoMode();
  const [pendingCount, setPendingCount] = useState(0);
  const { schoolId } = useActiveSchool();

  const currentPath = location.pathname;
  const currentArea = getStoredSystemArea();
  const currentSystem = currentArea ? systemBranding[currentArea] : null;

  // Use school-adapted menu for Reflexionar, fallback for other areas
  const useSchoolMenu = currentArea === "reflexionar";
  const schoolMenuItems = useMemo(() => {
    if (!useSchoolMenu) return null;
    const items = MENU_BY_SCHOOL[schoolId];
    if (!items) return null;
    // Apply area filtering
    const hidden = hiddenByArea["reflexionar"] || [];
    return items.filter((item) => !hidden.includes(item.url));
  }, [useSchoolMenu, schoolId]);

  const headerSubtitle = useMemo(() => {
    if (useSchoolMenu && SCHOOL_HEADER[schoolId]) {
      return SCHOOL_HEADER[schoolId].subtitle;
    }
    return currentSystem?.subtitle || "Plataforma de Sistemas Interactivos";
  }, [useSchoolMenu, schoolId, currentSystem]);

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [currentPath, isMobile, setOpenMobile]);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  useEffect(() => {
    if (!isAdmin || isDemoMode) return;
    const fetchPending = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_approved", false);
      setPendingCount(count || 0);
    };
    fetchPending();
    const channel = supabase
      .channel('sidebar-pending-count')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => fetchPending())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, isDemoMode]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleSignOut = async () => {
    if (isDemoMode) { exitDemoMode(); navigate("/profesional"); return; }
    await signOut();
    navigate("/login");
  };

  const displayProfile = isDemoMode
    ? { full_name: demoProfile.full_name, email: demoProfile.email, avatar_url: null }
    : profile;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar/80 p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <PsiLogo size="sm" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-serif text-xs font-semibold text-sidebar-foreground md:text-sm">
                {currentSystem?.label || areaLabels[currentArea || ""] || "PSI"}
              </span>
              <span className="text-[10px] text-sidebar-foreground/60 md:text-xs">
                {headerSubtitle}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider delayDuration={300}>
                {schoolMenuItems ? (
                  // School-adapted menu
                  schoolMenuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      {item.tooltip ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.label}>
                              <NavLink
                                to={item.url}
                                className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors hover:bg-sidebar-accent/70 md:py-1.5 md:text-sm"
                                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                              >
                                <item.icon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-[220px] text-xs">
                            {item.tooltip}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.label}>
                          <NavLink
                            to={item.url}
                            className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors hover:bg-sidebar-accent/70 md:py-1.5 md:text-sm"
                            activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))
                ) : (
                  // Fallback menu
                  getFilteredMenuItems().map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                        <NavLink
                          to={item.url}
                          className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors hover:bg-sidebar-accent/70 md:py-1.5 md:text-sm"
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                )}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] transition-colors hover:bg-sidebar-accent/70 md:py-1.5 md:text-sm"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-sm ring-1 ring-sidebar-accent"
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="flex-1 truncate">{item.title}</span>
                        {pendingCount > 0 && (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 shrink-0 px-1 text-[10px] font-bold">
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

      <SidebarFooter className="border-t border-sidebar-border p-3 md:p-4">
        <div className="flex items-center gap-2 md:gap-3">
          <Avatar className="h-7 w-7 md:h-8 md:w-8">
            <AvatarImage src={displayProfile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] md:text-xs">
              {getInitials(displayProfile?.full_name ?? null)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-xs font-medium text-sidebar-foreground md:text-sm">
                {displayProfile?.full_name || "Usuario"}
              </span>
              <span className="truncate text-[10px] text-sidebar-foreground/60 md:text-xs">
                {displayProfile?.email || ""}
              </span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-7 w-7 shrink-0 md:h-8 md:w-8">
            <LogOut className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
