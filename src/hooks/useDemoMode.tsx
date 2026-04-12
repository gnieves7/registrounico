import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface DemoContextType {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  /** Call before any write operation — shows a toast and returns false */
  guardWrite: (action?: string) => boolean;
  demoProfile: {
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const demoProfile = {
    full_name: "Profesional Demo",
    email: "demo@psi.app",
    avatar_url: null,
  };

  const enterDemoMode = useCallback(() => {
    setIsDemoMode(true);
    sessionStorage.setItem("psi_demo_mode", "1");
  }, []);

  const exitDemoMode = useCallback(() => {
    setIsDemoMode(false);
    sessionStorage.removeItem("psi_demo_mode");
  }, []);

  const guardWrite = useCallback((action?: string) => {
    toast.info(
      action
        ? `"${action}" no disponible en modo demostración`
        : "Esta acción no está disponible en modo demostración",
      { description: "Solicitá acceso profesional para usar todas las funciones." }
    );
    return false;
  }, []);

  return (
    <DemoContext.Provider
      value={{ isDemoMode, enterDemoMode, exitDemoMode, guardWrite, demoProfile }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemoMode must be used within DemoProvider");
  return context;
};
