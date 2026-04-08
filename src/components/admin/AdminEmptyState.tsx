import { type LucideIcon, FileText, Users, ClipboardList, Bell, Inbox, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const sectionDefaults: Record<string, { icon: LucideIcon; title: string; description: string; actionLabel?: string }> = {
  users: {
    icon: Users,
    title: "Sin pacientes registrados",
    description: "Los pacientes aparecerán aquí cuando se registren en la plataforma.",
  },
  tests: {
    icon: ClipboardList,
    title: "Sin tests registrados",
    description: "Los tests aparecerán aquí cuando los pacientes los inicien.",
  },
  reports: {
    icon: FileText,
    title: "Sin informes PDF generados",
    description: "Los informes se generan desde la sección de Tests completados.",
    actionLabel: "Ir a Tests",
  },
  notifications: {
    icon: Bell,
    title: "Sin notificaciones",
    description: "Las notificaciones aparecerán aquí cuando haya actividad relevante.",
  },
  activity: {
    icon: Inbox,
    title: "Sin actividad reciente",
    description: "La actividad de los pacientes se registrará automáticamente.",
  },
  generic: {
    icon: FolderOpen,
    title: "Sin datos disponibles",
    description: "No hay información para mostrar en este momento.",
  },
};

export function AdminEmptyState({ icon, title, description, actionLabel, onAction }: AdminEmptyStateProps) {
  const Icon = icon || FolderOpen;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" className="mt-4 text-xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export { sectionDefaults };
