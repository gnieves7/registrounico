import { ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MacMenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { MacWindow } from "./Window";

const routeTitles: Record<string, string> = {
  "/dashboard": "Escritorio",
  "/profesional/escuela": "Selección de Escuela",
  "/psychobiography": "Psicobiografía",
  "/psychodiagnostic": "Personalidad",
  "/forensic": "Recursos Psicoforenses",
  "/anxiety-record": "Entrenamiento Cognitivo",
  "/emotional-thermometer": "Termómetro Emocional",
  "/dream-record": "Registro Inconsciente",
  "/junta-medica": "Junta Médica Laboral",
  "/apto-psicologico": "Apto Psicológico",
  "/sessions": "Agenda",
  "/laura": "Laura · Acompañante Virtual",
  "/documents": "Informes",
  "/camara-gesell": "Cámara Gesell",
  "/notebook": "Mi Cuaderno",
  "/professional-profile": "Perfil del Profesional",
  "/symbolic-awards": "Premios Simbólicos",
  "/telegram": "Telegram",
  "/admin": "Panel Admin",
  "/admin/dashboard": "Panel Admin",
  "/finder": "Finder",
  "/case-formulation": "Formulación de Caso",
  "/narrative-analysis": "Análisis Narrativo",
  "/symptom-network": "Red de Síntomas",
  "/therapeutic-alliance": "Alianza Terapéutica",
  "/life-timeline": "Línea de Vida",
  "/micro-tasks": "Micro-Tareas",
  "/outcome-monitoring": "Monitoreo de Resultados",
  "/judicial-case": "Expediente Judicial",
  "/suggestions": "Sugerencias",
  "/panel": "Panel",
};

interface Props { children: ReactNode }

export function MacShell({ children }: Props) {
  const { pathname } = useLocation();
  const title = useMemo(() => {
    if (routeTitles[pathname]) return routeTitles[pathname];
    const match = Object.keys(routeTitles).find((k) => pathname.startsWith(k + "/") || pathname.startsWith(k));
    return match ? routeTitles[match] : "Mi Práctica · PSI";
  }, [pathname]);

  const isDesktop = pathname === "/dashboard";

  return (
    <div className="mac-wallpaper relative flex min-h-screen flex-col">
      <MacMenuBar />
      <div className="relative flex-1">
        {isDesktop ? (
          // Desktop renders content directly on the wallpaper (with widgets layout)
          <div className="px-4 pb-32 pt-6 md:px-8 md:pb-36">
            {children}
          </div>
        ) : (
          <MacWindow title={title}>{children}</MacWindow>
        )}
      </div>
      <Dock />
    </div>
  );
}