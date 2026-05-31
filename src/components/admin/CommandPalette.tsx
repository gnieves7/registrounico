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
  NotebookPen,
  CalendarClock,
  Sparkles,
  Calendar,
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
      <CommandInput placeholder="Buscar pacientes o secciones…" />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>

        <CommandGroup heading="Workspace clínico">
          <CommandItem onSelect={() => section("dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Inicio
          </CommandItem>
          <CommandItem onSelect={() => section("clinical_notes")}>
            <NotebookPen className="mr-2 h-4 w-4" />
            Notas clínicas
          </CommandItem>
          <CommandItem onSelect={() => section("booking")}>
            <CalendarClock className="mr-2 h-4 w-4" />
            Reserva de turnos
          </CommandItem>
          <CommandItem onSelect={() => section("symbolic")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Recursos simbólicos
          </CommandItem>
          <CommandItem onSelect={() => go(() => window.open("https://calendar.app.google/4Locar4CbcTB45zv9", "_blank"))}>
            <Calendar className="mr-2 h-4 w-4" />
            Abrir Google Calendar
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pacientes">
          {patients.slice(0, 40).map((p) => (
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
      </CommandList>
    </CommandDialog>
  );
}
