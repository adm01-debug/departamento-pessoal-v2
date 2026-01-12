// V18-T013: Testes Banco de Horas
import { describe, it, expect } from "vitest";
import { calcularSaldoBancoHoras, compensarHoras } from "../bancoHoras";
describe("Calculadora Banco Horas", () => {
  it("deve calcular saldo positivo", () => {
    expect(calcularSaldoBancoHoras(50, 30)).toBe(20);
  });
  it("deve calcular saldo negativo", () => {
    expect(calcularSaldoBancoHoras(30, 50)).toBe(-20);
  });
  it("deve compensar horas corretamente", () => {
    const resultado = compensarHoras(100, 40);
    expect(resultado.saldoRestante).toBe(60);
  });
});
