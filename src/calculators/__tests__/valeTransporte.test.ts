// V18-T012: Testes Vale Transporte
import { describe, it, expect } from "vitest";
import { calcularDescontoVT, calcularValeTransporte } from "../valeTransporte";
describe("Calculadora Vale Transporte", () => {
  it("deve descontar máximo 6% do salário", () => {
    expect(calcularDescontoVT(3000)).toBe(180);
  });
  it("não deve descontar mais que o VT concedido", () => {
    expect(calcularDescontoVT(3000, 100)).toBe(100);
  });
});
