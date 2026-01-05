import { describe, it, expect } from "vitest";
import { calcularIRRF } from "./calcularIRRF";
describe("calcularIRRF", () => {
  it("isento para base até 2259.20", () => { const result = calcularIRRF(2500, 187.50, 0); expect(result.valor).toBe(0); });
  it("calcula com dependentes", () => { const semDep = calcularIRRF(5000, 400, 0); const comDep = calcularIRRF(5000, 400, 2); expect(comDep.valor).toBeLessThan(semDep.valor); });
  it("deduz pensão da base", () => { const semPensao = calcularIRRF(6000, 500, 0, 0); const comPensao = calcularIRRF(6000, 500, 0, 500); expect(comPensao.valor).toBeLessThan(semPensao.valor); });
});
