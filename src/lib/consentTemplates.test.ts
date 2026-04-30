import { describe, it, expect } from "vitest";
import {
  EVALUAR_MODELS,
  REFLEXIONAR_MODELS,
  ACOMPANAR_MODELS,
  CONSENT_MODELS,
} from "./consentTemplates";

describe("Catálogo de Consentimientos Informados", () => {
  it("Evaluar expone EXACTAMENTE CI-05, CI-06 y CI-07", () => {
    const ids = EVALUAR_MODELS.map((m) => m.id);
    expect(ids).toEqual(["ci-05", "ci-06", "ci-07"]);
  });

  it("Evaluar NO incluye CI-01, CI-02, CI-03 ni CI-04", () => {
    const ids = EVALUAR_MODELS.map((m) => m.id);
    expect(ids).not.toContain("ci-01");
    expect(ids).not.toContain("ci-02");
    expect(ids).not.toContain("ci-03");
    expect(ids).not.toContain("ci-04");
  });

  it("CI-05/06/07 apuntan a archivos PDF reales bajo /templates", () => {
    expect(CONSENT_MODELS["ci-05"].file).toBe("/templates/CI-05_Psicodiag_NNA.pdf");
    expect(CONSENT_MODELS["ci-06"].file).toBe("/templates/CI-06_Neuropsicologica.pdf");
    expect(CONSENT_MODELS["ci-07"].file).toBe("/templates/CI-07_Arma_Reglamentaria.pdf");
    for (const m of EVALUAR_MODELS) {
      expect(m.file.endsWith(".pdf")).toBe(true);
      expect(m.filename.endsWith(".pdf")).toBe(true);
    }
  });

  it("Reflexionar mantiene CI-01, CI-02 y CI-03", () => {
    expect(REFLEXIONAR_MODELS.map((m) => m.id)).toEqual(["ci-01", "ci-02", "ci-03"]);
  });

  it("Acompañar mantiene CI-08 y CI-09", () => {
    expect(ACOMPANAR_MODELS.map((m) => m.id)).toEqual(["ci-08", "ci-09"]);
  });

  it("Cada modelo tiene metadata clínica completa para el detalle", () => {
    for (const m of [...REFLEXIONAR_MODELS, ...EVALUAR_MODELS, ...ACOMPANAR_MODELS]) {
      expect(m.title).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.includes.length).toBeGreaterThan(0);
      expect(m.adaptationTips.length).toBeGreaterThan(0);
      expect(m.whenToUse.length).toBeGreaterThan(0);
      expect(m.legalFrame.length).toBeGreaterThan(0);
      expect(m.sections.length).toBeGreaterThan(0);
    }
  });
});
