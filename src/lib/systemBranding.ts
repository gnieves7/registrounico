import type { LucideIcon } from "lucide-react";
import { Brain, BookOpen, Scale } from "lucide-react";
import sistemaReflexionarIcon from "@/assets/Sistema_Reflexionar.png";
import sistemaEvaluarIcon from "@/assets/Sistema_Evaluar.png";
import sistemaAcompanharIcon from "@/assets/Sistema_Acompañar.png";

export type SystemArea = "reflexionar" | "evaluar" | "acompanar";

export const systemBranding: Record<SystemArea, {
  label: string;
  subtitle: string;
  logo: string;
  icon: LucideIcon;
}> = {
  reflexionar: {
    label: "Sistema Reflexionar",
    subtitle: "Área Clínica",
    logo: sistemaReflexionarIcon,
    icon: Brain,
  },
  evaluar: {
    label: "Sistema Evaluar",
    subtitle: "Área Psicodiagnóstica",
    logo: sistemaEvaluarIcon,
    icon: BookOpen,
  },
  acompanar: {
    label: "Sistema Acompañar",
    subtitle: "Área Forense",
    logo: sistemaAcompanharIcon,
    icon: Scale,
  },
};

export const getStoredSystemArea = (): SystemArea | null => {
  if (typeof window === "undefined") return null;

  const area = sessionStorage.getItem("user_area");
  if (!area || !(area in systemBranding)) return null;

  return area as SystemArea;
};

export const setStoredSystemArea = (area: SystemArea) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("user_area", area);
};

/**
 * Apply system theme to <body>.
 * @param area   – the system to activate (or null to reset)
 * @param smooth – when true, lets CSS transitions handle the change;
 *                 when false (first render), applies instantly without flash.
 */
export const applySystemTheme = (area: SystemArea | null, smooth = true) => {
  if (typeof document === "undefined") return;

  if (!smooth) {
    // First paint: suppress flash
    document.body.classList.add("system-loading");
  }

  if (area) {
    document.body.dataset.system = area;
  } else {
    delete document.body.dataset.system;
  }

  if (!smooth) {
    // Force a reflow so the theme is painted before we reveal
    void document.body.offsetHeight;
    document.body.classList.remove("system-loading");
    document.body.classList.add("system-ready");
  }
};
