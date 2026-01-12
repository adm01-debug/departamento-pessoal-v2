// V18-T018: Testes Gratificação
import { describe, it, expect } from "vitest";
import { calcularGratificacao } from "../gratificacao";
describe("Calculadora Gratificação", () => {
  it("deve calcular percentual do salário", () => {
    expect(calcularGratificacao(3000, 10)).toBe(300);
  });
  it("deve calcular valor fixo", () => {
    expect(calcularGratificacao(3000, 500, "fixo")).toBe(500);
  });
});
