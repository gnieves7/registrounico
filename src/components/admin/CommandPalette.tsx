import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldAlert,
  ShieldCheck,
  ClipboardList,
  FileText,
  Bell,
  Lightbulb,
  Settings,
  Calendar,
  Network,
  Map,
  Activity,
  MessageSquarePlus,
  User,
} from "lucide-react";
import { demoPatients } from "@/data/demoData";
import type { AdminSection } from "@/components/admin/AdminDashboardLayout";

interface PatientLite {
  user_id: string;
  full_name: string | null;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSectionChange?: (section: AdminSection) => void;
}

export function CommandPalette({ open, onOpenChange, onSectionChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { isDemoMode } = useDemoMode();
  const [patients, setPatients] = useState<PatientLite[]>([]);

  useEffect(() => {
    if (!open) return;
    if (isDemoMode) {
      setPatients(
        demoPatients.map((p: any) => ({
          user_id: p.user_id || p.id,
          full_name: p.full_name || p.name || "Paciente",
        })),
      );
      return;
    }
    supabase
      .from("profiles")
      .select("user_id, full_name, account_type, is_approved")
      .neq("account_type", "professional")
      .eq("is_approved", true)
      .order("full_name")
      .limit(80)
      .then(({ data }) => setPatients((data || []) as any));
  }, [open, isDemoMode]);

  const go = (fn: () => void) => {
    onOpenChange(false);
    setTimeout(fn, 50);
  };

  const section = (key: AdminSection) =>
    go(() => {
      onSectionChange?.(key);
      navigate(`/admin/dashboard?section=${key}`);
    });

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar pacientes, secciones o atajos…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>

        <CommandGroup heading="Hoy">
          <CommandItem onSelect={() => section("dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Panel del día
          </CommandItem>
          <CommandItem onSelect={() => section("notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            Notificaciones
          </CommandItem>
          <CommandItem onSelect={() => go(() => window.open("https://calendar.app.google/4Locar4CbcTB45zv9", "_blank"))}>
            <Calendar className="mr-2 h-4 w-4" />
            Abrir Google Calendar
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pacientes">
          <CommandItem onSelect={() => section("users")}>
            <Users className="mr-2 h-4 w-4" />
            Listado de pacientes
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate("/case-formulation"))}>
            <Map className="mr-2 h-4 w-4" />
            Formulación de caso
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate("/life-timeline"))}>
            <Activity className="mr-2 h-4 w-4" />
            Línea de vida
          </CommandItem>
          {patients.slice(0, 30).map((p) => (
            <CommandItem
              key={p.user_id}
              value={`paciente ${p.full_name || ""}`}
              onSelect={() => go(() => navigate(`/admin/patient/${p.user_id}`))}
            >
              <User className="mr-2 h-4 w-4 text-primary" />
              <span className="flex-1">{p.full_name || "Paciente"}</span>
              <span className="text-[10px] text-muted-foreground">abrir ficha</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Evaluar">
          <CommandItem onSelect={() => section("tests")}>
            <ClipboardList className="mr-2 h-4 w-4" />
            Tests psicométricos
          </CommandItem>
          <CommandItem onSelect={() => section("reports")}>
            <FileText className="mr-2 h-4 w-4" />
            Informes PDF
          </CommandItem>
          <CommandItem onSelect={() => section("audit_consents")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Consentimientos
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Seguir">
          <CommandItem onSelect={() => go(() => navigate("/outcome-monitoring"))}>
            <Activity className="mr-2 h-4 w-4" />
            Monitoreo de resultados
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate("/therapeutic-alliance"))}>
            <Network className="mr-2 h-4 w-4" />
            Alianza terapéutica
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate("/symptom-network"))}>
            <Network className="mr-2 h-4 w-4" />
            Red de síntomas
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate("/narrative-analysis"))}>
            <Activity className="mr-2 h-4 w-4" />
            Análisis narrativo
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Gestión">
          <CommandItem onSelect={() => section("professionals")}>
            <Briefcase className="mr-2 h-4 w-4" />
            Profesionales
          </CommandItem>
          <CommandItem onSelect={() => section("authorizations")}>
            <ShieldAlert className="mr-2 h-4 w-4" />
            Autorizaciones pendientes
          </CommandItem>
          <CommandItem onSelect={() => section("allowlist")}>
            <ShieldCheck className="mr-2 h-4 w-4" />
            Emails autorizados
          </CommandItem>
          <CommandItem onSelect={() => section("patient_proposals")}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Solicitudes de pacientes
          </CommandItem>
          <CommandItem onSelect={() => section("suggestions")}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Sugerencias
          </CommandItem>
          <CommandItem onSelect={() => section("settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}