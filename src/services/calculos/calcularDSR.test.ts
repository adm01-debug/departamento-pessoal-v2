import { describe, it, expect } from "vitest";
import { calcularDSR, calcularDescontoDSR } from "./calcularDSR";
describe("calcularDSR", () => {
  it("calcula DSR sobre horas extras", () => { const result = calcularDSR(600, 22, 4); expect(result).toBeCloseTo(109.09, 1); });
  it("retorna zero sem dias úteis", () => { const result = calcularDSR(600, 0, 4); expect(result).toBe(0); });
});
describe("calcularDescontoDSR", () => {
  it("calcula desconto por faltas", () => { const result = calcularDescontoDSR(3000, 2); expect(result).toBe(200); });
  it("retorna zero sem faltas", () => { const result = calcularDescontoDSR(3000, 0); expect(result).toBe(0); });
});
