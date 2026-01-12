// V18-T023: Testes DSR
import { describe, it, expect } from "vitest";
import { calcularDSR } from "../dsr";
describe("Calculadora DSR", () => {
  it("deve calcular reflexo em variáveis", () => { const r = calcularDSR(600, 24, 6); expect(r).toBeCloseTo(150, 2); });
  it("deve retornar 0 sem variáveis", () => { expect(calcularDSR(0, 24, 6)).toBe(0); });
});
