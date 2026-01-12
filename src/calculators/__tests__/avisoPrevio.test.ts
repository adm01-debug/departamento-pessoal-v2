// V18-T017: Testes Aviso Prévio
import { describe, it, expect } from "vitest";
import { calcularAvisoPrevio, calcularDiasAvisoPrevio } from "../avisoPrevio";
describe("Calculadora Aviso Prévio", () => {
  it("deve calcular 30 dias base", () => {
    expect(calcularDiasAvisoPrevio(0)).toBe(30);
  });
  it("deve adicionar 3 dias por ano trabalhado", () => {
    expect(calcularDiasAvisoPrevio(5)).toBe(45);
  });
  it("deve limitar a 90 dias", () => {
    expect(calcularDiasAvisoPrevio(25)).toBe(90);
  });
});
