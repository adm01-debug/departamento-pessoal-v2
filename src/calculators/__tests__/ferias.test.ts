// V18-T004: Testes Calculadora Férias
import { describe, it, expect } from "vitest";
import { calcularFerias, calcularTercoConstitucional, calcularFeriasVencidas } from "../ferias";

describe("Calculadora Férias", () => {
  describe("calcularFerias", () => {
    it("deve calcular férias de 30 dias", () => {
      const resultado = calcularFerias(3000, 30);
      expect(resultado.ferias).toBe(3000);
      expect(resultado.tercoConstitucional).toBe(1000);
      expect(resultado.total).toBe(4000);
    });

    it("deve calcular férias proporcionais", () => {
      const resultado = calcularFerias(3000, 15);
      expect(resultado.ferias).toBe(1500);
      expect(resultado.tercoConstitucional).toBe(500);
    });

    it("deve incluir abono pecuniário quando solicitado", () => {
      const resultado = calcularFerias(3000, 30, true);
      expect(resultado.abonoPecuniario).toBe(1000);
      expect(resultado.tercoAbono).toBeCloseTo(333.33, 2);
    });
  });

  describe("calcularTercoConstitucional", () => {
    it("deve calcular 1/3 do valor", () => {
      expect(calcularTercoConstitucional(3000)).toBe(1000);
      expect(calcularTercoConstitucional(1500)).toBe(500);
    });
  });

  describe("calcularFeriasVencidas", () => {
    it("deve dobrar valor para férias vencidas", () => {
      const resultado = calcularFeriasVencidas(3000);
      expect(resultado.ferias).toBe(6000);
    });
  });
});
