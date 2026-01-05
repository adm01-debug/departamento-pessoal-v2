import { describe, it, expect } from "vitest";
import { irrfService } from "./irrfService";
describe("irrfService", () => {
  it("isenta para base abaixo do limite", () => {
    const result = irrfService.calcularIRRF({ baseCalculo: 2000, dependentes: 0, pensaoAlimenticia: 0 });
    expect(result.aliquota).toBe(0);
    expect(result.valorIRRF).toBe(0);
  });
  it("calcula IRRF com dependentes", () => {
    const result = irrfService.calcularIRRF({ baseCalculo: 5000, dependentes: 2, pensaoAlimenticia: 0 });
    expect(result.deducaoDependentes).toBeGreaterThan(0);
  });
  it("deduz pensão alimentícia", () => {
    const result = irrfService.calcularIRRF({ baseCalculo: 5000, dependentes: 0, pensaoAlimenticia: 500 });
    expect(result.baseCalculoFinal).toBe(4500);
  });
});
