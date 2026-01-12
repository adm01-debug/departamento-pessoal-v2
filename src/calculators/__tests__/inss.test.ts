// V18-T001: Testes Calculadora INSS 2026
import { describe, it, expect } from "vitest";
import { calcularINSS, calcularINSSDetalhado, calcularAliquotaEfetivaINSS, getTetoINSS } from "../inss";

describe("Calculadora INSS 2026", () => {
  describe("calcularINSS", () => {
    it("deve retornar 0 para salário zero ou negativo", () => {
      expect(calcularINSS(0)).toBe(0);
      expect(calcularINSS(-1000)).toBe(0);
    });

    it("deve calcular corretamente para salário mínimo R$ 1.621,00", () => {
      const resultado = calcularINSS(1621);
      expect(resultado).toBeCloseTo(121.58, 2);
    });

    it("deve calcular corretamente para R$ 2.000,00 (2ª faixa)", () => {
      const resultado = calcularINSS(2000);
      expect(resultado).toBeCloseTo(155.69, 2);
    });

    it("deve calcular corretamente para R$ 3.000,00 (3ª faixa)", () => {
      const resultado = calcularINSS(3000);
      expect(resultado).toBeCloseTo(248.60, 2);
    });

    it("deve calcular corretamente para R$ 5.000,00 (4ª faixa)", () => {
      const resultado = calcularINSS(5000);
      expect(resultado).toBeCloseTo(501.51, 2);
    });

    it("deve respeitar o teto INSS R$ 8.475,55", () => {
      const resultado = calcularINSS(8475.55);
      expect(resultado).toBeCloseTo(988.10, 2);
    });

    it("deve limitar ao teto para salários acima de R$ 8.475,55", () => {
      const resultado = calcularINSS(15000);
      expect(resultado).toBeCloseTo(988.10, 2);
    });

    it("deve calcular progressivamente por faixas", () => {
      const faixa1 = calcularINSS(1621);
      const faixa2 = calcularINSS(2902.84);
      const faixa3 = calcularINSS(4354.27);
      expect(faixa1).toBeLessThan(faixa2);
      expect(faixa2).toBeLessThan(faixa3);
    });
  });

  describe("calcularINSSDetalhado", () => {
    it("deve retornar objeto com todas propriedades", () => {
      const resultado = calcularINSSDetalhado(3000);
      expect(resultado).toHaveProperty("valor");
      expect(resultado).toHaveProperty("aliquotaEfetiva");
      expect(resultado).toHaveProperty("baseCalculo");
      expect(resultado).toHaveProperty("faixasAplicadas");
    });

    it("deve detalhar faixas aplicadas corretamente", () => {
      const resultado = calcularINSSDetalhado(3000);
      expect(resultado.faixasAplicadas.length).toBeGreaterThan(0);
      expect(resultado.faixasAplicadas[0]).toHaveProperty("faixa");
      expect(resultado.faixasAplicadas[0]).toHaveProperty("base");
      expect(resultado.faixasAplicadas[0]).toHaveProperty("aliquota");
      expect(resultado.faixasAplicadas[0]).toHaveProperty("valor");
    });
  });

  describe("calcularAliquotaEfetivaINSS", () => {
    it("deve calcular alíquota efetiva corretamente", () => {
      const aliquota = calcularAliquotaEfetivaINSS(1621);
      expect(aliquota).toBeCloseTo(7.5, 1);
    });

    it("deve ter alíquota efetiva menor que 14% mesmo no teto", () => {
      const aliquota = calcularAliquotaEfetivaINSS(8475.55);
      expect(aliquota).toBeLessThan(14);
    });
  });

  describe("getTetoINSS", () => {
    it("deve retornar o teto INSS 2026", () => {
      expect(getTetoINSS()).toBe(8475.55);
    });
  });
});
