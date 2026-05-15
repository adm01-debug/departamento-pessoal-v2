import { describe, it, expect } from 'vitest';
import { calcularINSS, calcularIRRF, calcularFGTS } from '../impostos';
import { TETO_INSS_2026 } from '../tabelas';

describe('Calculadora de Impostos (Folha 2026)', () => {
  describe('INSS', () => {
    it('deve calcular corretamente para a primeira faixa (7.5%)', () => {
      // Salário: 1518.00 -> 1518 * 0.075 = 113.85
      expect(calcularINSS(1518.00)).toBe(113.85);
    });

    it('deve calcular corretamente para a segunda faixa (9%)', () => {
      // Base: 2500.00
      // 1ª faixa: 1518.00 * 0.075 = 113.85
      // 2ª faixa: (2500 - 1518) * 0.09 = 982 * 0.09 = 88.38
      // Total: 113.85 + 88.38 = 202.23
      expect(calcularINSS(2500.00)).toBe(202.23);
    });

    it('deve respeitar o teto do INSS', () => {
      const acimaDoTeto = TETO_INSS_2026 + 1000;
      const valorTeto = calcularINSS(TETO_INSS_2026);
      expect(calcularINSS(acimaDoTeto)).toBe(valorTeto);
    });
  });

  describe('IRRF', () => {
    it('deve ser isento para salários baixos', () => {
      expect(calcularIRRF(2200.00)).toBe(0);
    });

    it('deve calcular IRRF considerando o melhor cenário (Legal vs Simplificado)', () => {
      // Teste com um salário que entra na primeira faixa tributável
      const imposto = calcularIRRF(3500.00);
      expect(imposto).toBeGreaterThan(0);
    });
  });

  describe('FGTS', () => {
    it('deve calcular 8% do salário bruto', () => {
      expect(calcularFGTS(2000.00)).toBe(160.00);
      expect(calcularFGTS(5000.00)).toBe(400.00);
    });
  });
});
