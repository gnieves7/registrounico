import { useActiveSchool } from "@/hooks/useActiveSchool";
import { SCHOOL_CONFIG, type SchoolType } from "@/config/schools";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  compact?: boolean;
  className?: string;
  /** When provided, overrides the global school setter (per-context use). */
  value?: SchoolType;
  onChange?: (id: SchoolType) => void;
  label?: string;
}

export function SchoolSwitcher({ compact = false, className, value, onChange, label }: Props) {
  const { schoolId, school, setSchool } = useActiveSchool();
  const current = value ?? schoolId;
  const config = SCHOOL_CONFIG[current];

  const handle = (id: string) => {
    const next = id as SchoolType;
    if (onChange) onChange(next);
    else setSchool(next);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-[11px] font-medium text-muted-foreground hidden md:inline">
          {label}
        </span>
      )}
      <Select value={current} onValueChange={handle}>
        <SelectTrigger
          className={cn(
            "gap-2 border-border bg-background/60 text-xs",
            compact ? "h-7 px-2 w-auto min-w-[150px]" : "h-9 min-w-[180px]"
          )}
          style={{ color: config.color }}
        >
          <GraduationCap className="h-3.5 w-3.5 shrink-0" />
          <SelectValue placeholder="Escuela" />
        </SelectTrigger>
        <SelectContent className="max-h-[60vh]">
          {Object.values(SCHOOL_CONFIG).map((s) => (
            <SelectItem key={s.id} value={s.id}>
              <span className="flex items-center gap-2">
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="font-medium">{s.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}