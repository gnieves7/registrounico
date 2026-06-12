import { ReactNode, useState } from "react";
import { TrafficLights } from "./TrafficLights";
import { cn } from "@/lib/utils";

interface WindowProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function MacWindow({ title, icon, children, className }: WindowProps) {
  const [maximized, setMaximized] = useState(false);

  return (
    <div
      className={cn(
        "mac-window mac-window-in flex flex-col",
        maximized
          ? "fixed inset-0 z-30 rounded-none"
          : "mx-auto my-3 w-[calc(100%-1.5rem)] max-w-[1400px] h-[calc(100vh-7rem)] md:my-4 md:w-[calc(100%-2rem)] md:h-[calc(100vh-9rem)]",
        className,
      )}
    >
      <div className="mac-titlebar relative flex h-9 shrink-0 items-center px-3">
        <TrafficLights onMaximize={() => setMaximized((v) => !v)} />
        <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2 text-[12px] font-medium text-foreground/75">
          {icon}
          <span className="truncate max-w-[60vw]">{title}</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-background/85">
        {children}
      </div>
    </div>
  );
}