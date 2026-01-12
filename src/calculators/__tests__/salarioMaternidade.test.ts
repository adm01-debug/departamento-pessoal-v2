// V18-T021: Testes Salário Maternidade
import { describe, it, expect } from "vitest";
import { calcularSalarioMaternidade } from "../salarioMaternidade";
describe("Calculadora Salário Maternidade", () => {
  it("deve calcular 120 dias", () => { const r = calcularSalarioMaternidade(3000, 120); expect(r.totalDias).toBe(120); });
  it("deve respeitar teto INSS", () => { const r = calcularSalarioMaternidade(15000, 120); expect(r.valorDia).toBeLessThanOrEqual(8475.55/30); });
});
