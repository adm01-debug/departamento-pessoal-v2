// V18-T019: Testes Comissão
import { describe, it, expect } from "vitest";
import { calcularComissao } from "../comissao";
describe("Calculadora Comissão", () => {
  it("deve calcular % sobre vendas", () => { expect(calcularComissao(10000, 5)).toBe(500); });
  it("deve calcular escalonada", () => { expect(calcularComissao(50000, 5, { acima30k: 7 })).toBeGreaterThan(2500); });
});
