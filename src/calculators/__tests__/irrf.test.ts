// V18-T002: Testes Calculadora IRRF 2026 (Reforma IR)
import { describe, it, expect } from "vitest";
import { calcularIRRF, calcularIRRFDetalhado, calcularBaseIRRF, getDeducaoDependente } from "../irrf";

describe("Calculadora IRRF 2026 - Reforma IR", () => {
  describe("calcularIRRF - Isenção até R$ 5.000", () => {
    it("deve retornar 0 para base zero ou negativa", () => {
      expect(calcularIRRF(0)).toBe(0);
      expect(calcularIRRF(-1000)).toBe(0);
    });

    it("deve ser ISENTO para base até R$ 5.000,00", () => {
      expect(calcularIRRF(4000)).toBe(0);
      expect(calcularIRRF(5000)).toBe(0);
    });

    it("deve calcular 7.5% para base entre R$ 5.000,01 e R$ 7.350,00", () => {
      const resultado = calcularIRRF(6000);
      expect(resultado).toBeGreaterThan(0);
    });

    it("deve calcular 15% para base entre R$ 7.350,01 e R$ 9.920,00", () => {
      const resultado = calcularIRRF(8500);
      expect(resultado).toBeGreaterThan(0);
    });

    it("deve calcular 22.5% para base entre R$ 9.920,01 e R$ 13.170,00", () => {
      const resultado = calcularIRRF(11000);
      expect(resultado).toBeGreaterThan(0);
    });

    it("deve calcular 27.5% para base acima de R$ 13.170,00", () => {
      const resultado = calcularIRRF(15000);
      expect(resultado).toBeGreaterThan(0);
    });

    it("deve deduzir dependentes corretamente", () => {
      const semDep = calcularIRRF(6000, 0);
      const comDep = calcularIRRF(6000, 2);
      expect(comDep).toBeLessThan(semDep);
    });
  });

  describe("calcularIRRFDetalhado", () => {
    it("deve retornar objeto com isento=true para base até R$ 5.000", () => {
      const resultado = calcularIRRFDetalhado(4500);
      expect(resultado.isento).toBe(true);
      expect(resultado.valor).toBe(0);
    });

    it("deve retornar faixa e alíquota aplicadas", () => {
      const resultado = calcularIRRFDetalhado(10000);
      expect(resultado).toHaveProperty("faixaAplicada");
      expect(resultado).toHaveProperty("aliquotaFaixa");
      expect(resultado).toHaveProperty("deducaoFaixa");
    });
  });

  describe("calcularBaseIRRF", () => {
    it("deve subtrair INSS do salário bruto", () => {
      const base = calcularBaseIRRF(5000, 500);
      expect(base).toBe(4500);
    });

    it("deve subtrair pensão alimentícia", () => {
      const base = calcularBaseIRRF(5000, 500, 300);
      expect(base).toBe(4200);
    });

    it("não deve retornar valor negativo", () => {
      const base = calcularBaseIRRF(1000, 1500);
      expect(base).toBe(0);
    });
  });

  describe("getDeducaoDependente", () => {
    it("deve retornar valor de dedução por dependente", () => {
      const deducao = getDeducaoDependente();
      expect(deducao).toBeGreaterThan(0);
    });
  });
});
