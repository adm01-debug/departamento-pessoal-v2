import { describe, it, expect } from "vitest";
import { calcularFGTS, calcularMultaFGTS } from "./calcularFGTS";
describe("calcularFGTS", () => {
  it("calcula 8% do salário", () => { const result = calcularFGTS(5000); expect(result.valor).toBe(400); expect(result.aliquota).toBe(8); });
  it("retorna zero para salário zero", () => { const result = calcularFGTS(0); expect(result.valor).toBe(0); });
});
describe("calcularMultaFGTS", () => {
  it("calcula 40% sem justa causa", () => { const result = calcularMultaFGTS(10000, "SEM_JUSTA_CAUSA"); expect(result).toBe(4000); });
  it("calcula 20% acordo", () => { const result = calcularMultaFGTS(10000, "ACORDO"); expect(result).toBe(2000); });
  it("zero para justa causa", () => { const result = calcularMultaFGTS(10000, "JUSTA_CAUSA"); expect(result).toBe(0); });
});
