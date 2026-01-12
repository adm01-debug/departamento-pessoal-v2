// V18-T007: Testes Calculadora 13º Salário
import { describe, it, expect } from "vitest";
import { calcularDecimo13, calcularPrimeiraParcela, calcularSegundaParcela } from "../decimo13";

describe("Calculadora 13º Salário", () => {
  describe("calcularDecimo13", () => {
    it("deve calcular integral para 12 meses", () => {
      expect(calcularDecimo13(3000, 12)).toBe(3000);
    });

    it("deve calcular proporcional", () => {
      expect(calcularDecimo13(3000, 6)).toBe(1500);
      expect(calcularDecimo13(3000, 3)).toBe(750);
    });
  });

  describe("calcularPrimeiraParcela", () => {
    it("deve calcular 50% do valor integral", () => {
      expect(calcularPrimeiraParcela(3000, 12)).toBe(1500);
    });
  });

  describe("calcularSegundaParcela", () => {
    it("deve calcular diferença com descontos", () => {
      const resultado = calcularSegundaParcela(3000, 12, 200, 100);
      expect(resultado).toBe(1200);
    });
  });
});
