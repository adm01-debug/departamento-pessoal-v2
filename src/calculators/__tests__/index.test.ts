// V18-T025: Testes Index Integração
import { describe, it, expect } from "vitest";
import * as calculators from "../index";
describe("Index Calculadoras - Integração", () => {
  it("deve exportar calcularINSS", () => { expect(calculators.calcularINSS).toBeDefined(); });
  it("deve exportar calcularIRRF", () => { expect(calculators.calcularIRRF).toBeDefined(); });
  it("deve exportar calcularFGTS", () => { expect(calculators.calcularFGTS).toBeDefined(); });
  it("deve exportar calcularFerias", () => { expect(calculators.calcularFerias).toBeDefined(); });
  it("deve exportar todas as calculadoras", () => { expect(Object.keys(calculators).length).toBeGreaterThan(15); });
});
