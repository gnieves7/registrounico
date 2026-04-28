import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock toast
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// Mock controlable de useUserRole
const roleMock = vi.fn();
vi.mock("@/hooks/useUserRole", () => ({
  useUserRole: () => roleMock(),
}));

import { ProfessionalOnlyRoute } from "./ProfessionalOnlyRoute";

const ProtectedView = () => <div>Contenido profesional</div>;
const DashboardView = () => <div>Dashboard del paciente</div>;

function renderWith(initial = "/protegida") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route
          path="/protegida"
          element={
            <ProfessionalOnlyRoute>
              <ProtectedView />
            </ProfessionalOnlyRoute>
          }
        />
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProfessionalOnlyRoute (guard de Consentimiento Informado)", () => {
  beforeEach(() => {
    roleMock.mockReset();
  });

  it("muestra spinner mientras se resuelve el rol", () => {
    roleMock.mockReturnValue({ isProfessional: false, loading: true });
    renderWith();
    // ni paciente ni profesional view visibles aún
    expect(screen.queryByText("Contenido profesional")).toBeNull();
    expect(screen.queryByText("Dashboard del paciente")).toBeNull();
  });

  it("PERMITE el acceso a un PROFESIONAL aprobado", async () => {
    roleMock.mockReturnValue({ isProfessional: true, loading: false });
    renderWith();
    await waitFor(() =>
      expect(screen.getByText("Contenido profesional")).toBeInTheDocument(),
    );
  });

  it("PERMITE el acceso a un ADMIN (cubierto por isProfessional=true)", async () => {
    roleMock.mockReturnValue({ isProfessional: true, loading: false });
    renderWith();
    await waitFor(() =>
      expect(screen.getByText("Contenido profesional")).toBeInTheDocument(),
    );
  });

  it("REDIRIGE al dashboard a un PACIENTE", async () => {
    roleMock.mockReturnValue({ isProfessional: false, loading: false });
    renderWith();
    await waitFor(() =>
      expect(screen.getByText("Dashboard del paciente")).toBeInTheDocument(),
    );
    expect(screen.queryByText("Contenido profesional")).toBeNull();
  });

  it("REDIRIGE al dashboard a un usuario sin sesión (rol nulo → no profesional)", async () => {
    roleMock.mockReturnValue({ isProfessional: false, loading: false });
    renderWith();
    await waitFor(() =>
      expect(screen.getByText("Dashboard del paciente")).toBeInTheDocument(),
    );
  });
});
