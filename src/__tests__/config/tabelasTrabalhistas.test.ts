// V16-FIX: Tests for Tabelas Trabalhistas 2025
import { describe, it, expect } from 'vitest';
import { 
  calcularINSS, 
  calcularIRRF, 
  calcularSalarioFamilia,
  SALARIO_MINIMO_2025,
  TABELA_INSS_2025 
} from '@/config/tabelasTrabalhistas2025';

describe('Tabelas Trabalhistas 2025', () => {
  describe('calcularINSS', () => {
    it('deve calcular INSS para salário mínimo', () => {
      const inss = calcularINSS(SALARIO_MINIMO_2025);
      expect(inss).toBeCloseTo(113.85, 2); // 1518 * 7.5%
    });

    it('deve calcular INSS para salário na 2ª faixa', () => {
      const inss = calcularINSS(2500);
      // Faixa 1: 1518 * 7.5% = 113.85
      // Faixa 2: (2500 - 1518) * 9% = 88.38
      // Total: 202.23
      expect(inss).toBeCloseTo(202.23, 1);
    });

    it('deve calcular INSS para salário no teto', () => {
      const inss = calcularINSS(8157.41);
      expect(inss).toBeGreaterThan(0);
      expect(inss).toBeLessThan(900); // Aproximadamente 876 com tabela progressiva
    });

    it('deve calcular INSS para salário acima do teto', () => {
      const inssTeto = calcularINSS(8157.41);
      const inssAcima = calcularINSS(15000);
      expect(inssAcima).toBeCloseTo(inssTeto, 2);
    });
  });

  describe('calcularIRRF', () => {
    it('deve retornar 0 para base abaixo da isenção', () => {
      expect(calcularIRRF(2000)).toBe(0);
      expect(calcularIRRF(2259.20)).toBe(0);
    });

    it('deve calcular IRRF na 2ª faixa', () => {
      const irrf = calcularIRRF(2700);
      // (2700 * 7.5%) - 169.44 = 33.06
      expect(irrf).toBeCloseTo(33.06, 1);
    });

    it('deve deduzir dependentes', () => {
      const semDep = calcularIRRF(4000, 0);
      const comDep = calcularIRRF(4000, 2);
      expect(comDep).toBeLessThan(semDep);
    });
  });

  describe('calcularSalarioFamilia', () => {
    it('deve calcular salário família para elegíveis', () => {
      const sf = calcularSalarioFamilia(1500, 2);
      expect(sf).toBeCloseTo(124.08, 2); // 62.04 * 2
    });

    it('deve retornar 0 para salário acima do limite', () => {
      const sf = calcularSalarioFamilia(2000, 2);
      expect(sf).toBe(0);
    });
  });
});
