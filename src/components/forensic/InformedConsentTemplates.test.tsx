import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Evita render real del drawer/firma (usan portales y librerías pesadas)
vi.mock("./ConsentDetailDrawer", () => ({
  ConsentDetailDrawer: ({ trigger }: { trigger: React.ReactNode }) => <>{trigger}</>,
}));
vi.mock("./ConsentSignatureDialog", () => ({
  ConsentSignatureDialog: () => null,
}));

import { InformedConsentTemplates } from "./InformedConsentTemplates";
import {
  REFLEXIONAR_MODELS,
  EVALUAR_MODELS,
  ACOMPANAR_MODELS,
} from "@/lib/consentTemplates";

const toTemplate = (m: (typeof REFLEXIONAR_MODELS)[number]) => ({
  id: m.id,
  title: m.title,
  description: m.description,
  file: m.file,
  filename: m.filename,
});

describe("InformedConsentTemplates — sin 'Modelo base'", () => {
  it.each([
    ["Reflexionar", REFLEXIONAR_MODELS],
    ["Evaluar", EVALUAR_MODELS],
    ["Acompañar", ACOMPANAR_MODELS],
  ])("%s NO muestra el botón 'Modelo base' ni descarga genérica", (_label, models) => {
    render(<InformedConsentTemplates templates={models.map(toTemplate)} />);

    // No debe existir ninguna acción/etiqueta llamada "Modelo base"
    expect(screen.queryByRole("button", { name: /modelo base/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /modelo base/i })).toBeNull();
    expect(screen.queryByText(/modelo base/i)).toBeNull();

    // Las únicas acciones permitidas son "Ver detalle" y "Pre-llenar y firmar"
    const verDetalle = screen.getAllByRole("button", { name: /ver detalle/i });
    const prellenar = screen.getAllByRole("button", { name: /pre-?llenar y firmar/i });
    expect(verDetalle.length).toBe(models.length);
    expect(prellenar.length).toBe(models.length);
  });

  it("Evaluar lista exactamente CI-05, CI-06 y CI-07 con sus PDFs", () => {
    render(<InformedConsentTemplates templates={EVALUAR_MODELS.map(toTemplate)} />);

    expect(screen.getByText(/CI-05/)).toBeInTheDocument();
    expect(screen.getByText(/CI-06/)).toBeInTheDocument();
    expect(screen.getByText(/CI-07/)).toBeInTheDocument();

    // No deben aparecer modelos clínicos ni periciales en Evaluar
    expect(screen.queryByText(/CI-01/)).toBeNull();
    expect(screen.queryByText(/CI-02/)).toBeNull();
    expect(screen.queryByText(/CI-03/)).toBeNull();
    expect(screen.queryByText(/CI-04/)).toBeNull();
    expect(screen.queryByText(/CI-08/)).toBeNull();
    expect(screen.queryByText(/CI-09/)).toBeNull();

    // Badge de formato refleja PDF
    expect(screen.getAllByText(/PDF · Editable/i).length).toBe(3);
  });
});
