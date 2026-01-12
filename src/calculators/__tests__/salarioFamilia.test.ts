// V18-T024: Testes Salário Família 2026
import { describe, it, expect } from "vitest";
import { calcularSalarioFamilia, getLimiteSalarioFamilia, getValorCotaSalarioFamilia } from "../salarioFamilia";
describe("Calculadora Salário Família 2026", () => {
  it("deve pagar cota por dependente", () => { expect(calcularSalarioFamilia(1800, 2)).toBeCloseTo(135.08, 2); });
  it("não deve pagar acima do limite R$ 1.980,38", () => { expect(calcularSalarioFamilia(2500, 2)).toBe(0); });
  it("limite deve ser R$ 1.980,38", () => { expect(getLimiteSalarioFamilia()).toBe(1980.38); });
  it("cota deve ser R$ 67,54", () => { expect(getValorCotaSalarioFamilia()).toBe(67.54); });
});
