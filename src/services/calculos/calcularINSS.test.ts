import { describe, it, expect } from "vitest";
import { calcularINSS } from "./calcularINSS";
describe("calcularINSS", () => {
  it("calcula primeira faixa 7.5%", () => { const result = calcularINSS(1518); expect(result.valor).toBe(113.85); expect(result.faixa).toBe(1); });
  it("calcula valor progressivo", () => { const result = calcularINSS(3000); expect(result.valor).toBeGreaterThan(250); expect(result.faixa).toBe(3); });
  it("respeita teto", () => { const result = calcularINSS(10000); expect(result.valor).toBeLessThanOrEqual(951.63); });
  it("retorna zero para salário zero", () => { const result = calcularINSS(0); expect(result.valor).toBe(0); });
});
