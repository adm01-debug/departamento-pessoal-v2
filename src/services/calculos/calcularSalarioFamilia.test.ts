import { describe, it, expect } from "vitest";
import { calcularSalarioFamilia } from "./calcularSalarioFamilia";
describe("calcularSalarioFamilia", () => {
  it("calcula para salário dentro do limite", () => { const result = calcularSalarioFamilia(1500, 2); expect(result.temDireito).toBe(true); expect(result.valor).toBe(130.28); });
  it("não tem direito acima do limite", () => { const result = calcularSalarioFamilia(2000, 2); expect(result.temDireito).toBe(false); expect(result.valor).toBe(0); });
  it("não tem direito sem dependentes", () => { const result = calcularSalarioFamilia(1500, 0); expect(result.temDireito).toBe(false); });
});
