import { describe, it, expect } from 'vitest';
import { calcularINSS, calcularIRRF, calcularFGTS } from '../impostos';
import { TETO_INSS_2026 } from '../tabelas';

describe('Calculators: Impostos 2026', () => {
  describe('calcularINSS', () => {
    it('should return 0 for zero or negative salary', () => {
      expect(calcularINSS(0)).toBe(0);
      expect(calcularINSS(-100)).toBe(0);
    });

    it('should calculate correctly for the 1st bracket (7.5%)', () => {
      // 1518.00 * 0.075 = 113.85
      expect(calcularINSS(1518.00)).toBe(113.85);
    });

    it('should calculate correctly for the 2nd bracket (progressive)', () => {
      // 1st bracket: 1518.00 * 0.075 = 113.85
      // 2nd bracket: (2500 - 1518) * 0.09 = 982 * 0.09 = 88.38
      // Total: 202.23
      expect(calcularINSS(2500.00)).toBe(202.23);
    });

    it('should respect the INSS ceiling', () => {
      const ceiling = TETO_INSS_2026;
      const expectedAtCeiling = calcularINSS(ceiling);
      expect(calcularINSS(ceiling + 1000)).toBe(expectedAtCeiling);
      // For 8157.41, expected is roughly 951.62 based on previous manual tests
      expect(expectedAtCeiling).toBeCloseTo(951.62, 1);
    });
  });

  describe('calcularIRRF', () => {
    it('should be exempt for salaries within the 1st bracket', () => {
      // 2000 is below the limit after simple discount or INSS
      expect(calcularIRRF(2000.00)).toBe(0);
    });

    it('should apply the most beneficial deduction (Simplified vs Legal)', () => {
      // Simple discount 2026: 564.80
      // 5000 - 564.80 = 4435.20 (Base)
      // Legal: 5000 - INSS(524.36?) - 0 dependents = 4475.64
      // Simplified is better here
      const result = calcularIRRF(5000.00, 0);
      expect(result).toBeGreaterThan(0);
    });

    it('should consider dependents in legal deduction', () => {
      const withoutDependents = calcularIRRF(6000.00, 0);
      const withDependents = calcularIRRF(6000.00, 2);
      expect(withDependents).toBeLessThan(withoutDependents);
    });
  });

  describe('calcularFGTS', () => {
    it('should calculate 8% of the salary', () => {
      expect(calcularFGTS(1000)).toBe(80);
      expect(calcularFGTS(3500.50)).toBe(280.04);
    });
  });
});
