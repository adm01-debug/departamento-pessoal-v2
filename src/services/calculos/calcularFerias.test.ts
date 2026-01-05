import { describe, it, expect } from "vitest";
import { calcularFerias } from "./calcularFerias";
describe("calcularFerias", () => {
  it("calcula 30 dias de férias", () => { const result = calcularFerias(3000, 30, 0); expect(result.valorFerias).toBe(3000); expect(result.tercoFerias).toBe(1000); expect(result.totalBruto).toBe(4000); });
  it("calcula com abono", () => { const result = calcularFerias(3000, 20, 10); expect(result.valorAbono).toBe(1000); expect(result.tercoAbono).toBeCloseTo(333.33, 1); });
  it("inclui média de variáveis", () => { const semMedia = calcularFerias(3000, 30, 0, 0); const comMedia = calcularFerias(3000, 30, 0, 500); expect(comMedia.totalBruto).toBeGreaterThan(semMedia.totalBruto); });
});
