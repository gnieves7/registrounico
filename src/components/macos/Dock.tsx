import { useLocation, useNavigate } from "react-router-dom";
import {
  Home, NotebookPen, Calendar, MessageCircle, FileText, FolderOpen, Settings,
  Brain, Award, Sparkles, ClipboardList,
} from "lucide-react";
import { useDockPreferences } from "@/hooks/useDockPreferences";
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuCheckboxItem, ContextMenuLabel,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type DockApp = {
  id: string;
  label: string;
  icon: any;
  url: string;
  color?: string;
};

export const DOCK_CATALOG: Record<string, DockApp> = {
  dashboard:      { id: "dashboard",      label: "Inicio",            icon: Home,          url: "/dashboard" },
  clinical_notes: { id: "clinical_notes", label: "Notas Clínicas",    icon: NotebookPen,   url: "/admin/dashboard?section=clinical_notes" },
  sessions:       { id: "sessions",       label: "Agenda",            icon: Calendar,      url: "/sessions" },
  laura:          { id: "laura",          label: "Laura",             icon: MessageCircle, url: "/laura" },
  documents:      { id: "documents",      label: "Informes",          icon: FileText,      url: "/documents" },
  finder:         { id: "finder",         label: "Finder",            icon: FolderOpen,    url: "/finder" },
  settings:       { id: "settings",       label: "Ajustes",           icon: Settings,      url: "/admin/dashboard" },
  psychobiography:{ id: "psychobiography",label: "Psicobiografía",    icon: Brain,         url: "/psychobiography" },
  symbolic:       { id: "symbolic",       label: "Premios simbólicos",icon: Award,         url: "/symbolic-awards" },
  emotional:      { id: "emotional",      label: "Termómetro",        icon: Sparkles,      url: "/emotional-thermometer" },
  micro_tasks:    { id: "micro_tasks",    label: "Micro-tareas",      icon: ClipboardList, url: "/micro-tasks" },
};

export function Dock() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { items, setItems, reset, toggle } = useDockPreferences();

  const currentUrl = pathname + search;

  const handleOpen = (app: DockApp) => navigate(app.url);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="pointer-events-auto fixed inset-x-0 bottom-3 z-40 flex justify-center px-3 md:bottom-4">
          <TooltipProvider delayDuration={150}>
            <div className="mac-dock flex items-end gap-2 px-3 py-2">
              {items.map((id, idx) => {
                if (id === "separator") {
                  return <div key={`sep-${idx}`} className="mx-1 h-12 w-px self-center bg-foreground/15" />;
                }
                const app = DOCK_CATALOG[id];
                if (!app) return null;
                const Icon = app.icon;
                const active = currentUrl.startsWith(app.url) || pathname.startsWith(app.url.split("?")[0]);
                return (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleOpen(app)}
                        className="mac-dock-icon"
                        data-active={active}
                        aria-label={app.label}
                      >
                        <Icon className="h-6 w-6" strokeWidth={2.2} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={12} className="mac-glass text-xs">
                      {app.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuLabel>Personalizar Dock</ContextMenuLabel>
        <ContextMenuSeparator />
        {Object.values(DOCK_CATALOG).map((app) => (
          <ContextMenuCheckboxItem
            key={app.id}
            checked={items.includes(app.id)}
            onCheckedChange={() => toggle(app.id)}
          >
            <app.icon className="mr-2 h-4 w-4" />{app.label}
          </ContextMenuCheckboxItem>
        ))}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={reset}>Restaurar Dock por defecto</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}