// V18-T020: Testes PLR
import { describe, it, expect } from "vitest";
import { calcularPLR, calcularIRPLR } from "../plr";
describe("Calculadora PLR", () => {
  it("deve calcular PLR proporcional", () => { expect(calcularPLR(3000, 1, 12)).toBe(3000); });
  it("deve calcular PLR parcial", () => { expect(calcularPLR(3000, 1, 6)).toBe(1500); });
});
