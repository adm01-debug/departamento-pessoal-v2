import { describe, it, expect } from "vitest";
import { inssService } from "./inssService";
describe("inssService", () => {
  it("calcula INSS faixa 1 (7.5%)", () => {
    const result = inssService.calcularINSS(1000);
    expect(result.aliquotaEfetiva).toBeCloseTo(7.5, 1);
    expect(result.valorINSS).toBe(75);
  });
  it("calcula INSS progressivo", () => {
    const result = inssService.calcularINSS(3000);
    expect(result.valorINSS).toBeGreaterThan(0);
    expect(result.faixas.length).toBeGreaterThan(0);
  });
  it("aplica teto do INSS", () => {
    const result = inssService.calcularINSS(20000);
    expect(result.valorINSS).toBeLessThanOrEqual(908.85);
  });
});
