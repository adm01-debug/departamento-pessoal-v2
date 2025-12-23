import { describe, it, expect } from 'vitest';
import {
  calcularINSS,
  calcularIRRF,
  calcularFGTS,
  calcularDecimoTerceiro,
  calcularFerias,
  calcularHorasExtras
} from '../calculosTrabalhistas';

describe('calculosTrabalhistas', () => {
  describe('calcularINSS', () => {
    it('deve calcular INSS para salário mínimo', () => {
      const result = calcularINSS(1412);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(1412 * 0.14);
    });

    it('deve respeitar o teto do INSS', () => {
      const result = calcularINSS(20000);
      expect(result).toBeLessThanOrEqual(908.85); // Teto aproximado
    });
  });

  describe('calcularIRRF', () => {
    it('deve retornar 0 para salário isento', () => {
      const result = calcularIRRF(2000, 0);
      expect(result).toBe(0);
    });

    it('deve calcular IRRF para salário tributável', () => {
      const result = calcularIRRF(5000, 0);
      expect(result).toBeGreaterThan(0);
    });
  });

  describe('calcularFGTS', () => {
    it('deve calcular 8% do salário', () => {
      const result = calcularFGTS(3000);
      expect(result).toBe(240);
    });
  });

  describe('calcularDecimoTerceiro', () => {
    it('deve calcular proporcional aos meses', () => {
      const result = calcularDecimoTerceiro(3000, 6);
      expect(result).toBe(1500);
    });

    it('deve retornar salário integral para 12 meses', () => {
      const result = calcularDecimoTerceiro(3000, 12);
      expect(result).toBe(3000);
    });
  });

  describe('calcularFerias', () => {
    it('deve calcular férias com 1/3', () => {
      const result = calcularFerias(3000, 30);
      expect(result).toBe(4000); // 3000 + 1000 (1/3)
    });
  });

  describe('calcularHorasExtras', () => {
    it('deve calcular hora extra 50%', () => {
      const salarioHora = 3000 / 220;
      const result = calcularHorasExtras(salarioHora, 10, 50);
      expect(result).toBeCloseTo(salarioHora * 10 * 1.5, 2);
    });

    it('deve calcular hora extra 100%', () => {
      const salarioHora = 3000 / 220;
      const result = calcularHorasExtras(salarioHora, 10, 100);
      expect(result).toBeCloseTo(salarioHora * 10 * 2, 2);
    });
  });
});
