import sistemaReflexionarIcon from "@/assets/Sistema_Reflexionar.png";
import sistemaEvaluarIcon from "@/assets/Sistema_Evaluar.png";
import sistemaAcompanharIcon from "@/assets/Sistema_Acompañar.png";

export type SystemArea = "reflexionar" | "evaluar" | "acompanar";

export const systemBranding: Record<SystemArea, {
  label: string;
  subtitle: string;
  logo: string;
}> = {
  reflexionar: {
    label: "Sistema Reflexionar",
    subtitle: "Área Clínica",
    logo: sistemaReflexionarIcon,
  },
  evaluar: {
    label: "Sistema Evaluar",
    subtitle: "Área Psicodiagnóstica",
    logo: sistemaEvaluarIcon,
  },
  acompanar: {
    label: "Sistema Acompañar",
    subtitle: "Área Forense",
    logo: sistemaAcompanharIcon,
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

export const applySystemTheme = (area: SystemArea | null) => {
  if (typeof document === "undefined") return;

  if (area) {
    document.body.dataset.system = area;
    return;
  }

  delete document.body.dataset.system;
};
