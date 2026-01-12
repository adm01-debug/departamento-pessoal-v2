// V18-T015: Testes Provisões
import { describe, it, expect } from "vitest";
import { calcularProvisaoFerias, calcularProvisao13, calcularProvisaoTotal } from "../provisoes";
describe("Calculadora Provisões", () => {
  it("deve calcular provisão férias (1/12)", () => {
    expect(calcularProvisaoFerias(3000)).toBeCloseTo(333.33, 2);
  });
  it("deve calcular provisão 13º (1/12)", () => {
    expect(calcularProvisao13(3000)).toBeCloseTo(250, 2);
  });
});
