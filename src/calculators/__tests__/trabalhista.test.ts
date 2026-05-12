import { describe, it, expect } from 'vitest';
import { calcularHorasExtras, calcularDSR, calcular13Salario } from '../trabalhista';

describe('Calculators: Trabalhista', () => {
  describe('calcularHorasExtras', () => {
    it('should return 0 if no hours provided', () => {
      expect(calcularHorasExtras(3000, 220, 0)).toBe(0);
    });

    it('should calculate 50% extra hours correctly', () => {
      // 2200 / 220 = 10 per hour
      // 10 * 1.5 = 15 per extra hour
      // 15 * 10 hours = 150
      expect(calcularHorasExtras(2200, 220, 10, 0.5)).toBe(150);
    });

    it('should calculate 100% extra hours correctly', () => {
      // 2200 / 220 = 10 per hour
      // 10 * 2.0 = 20 per extra hour
      // 20 * 5 hours = 100
      expect(calcularHorasExtras(2200, 220, 5, 1.0)).toBe(100);
    });
  });

  describe('calcularDSR', () => {
    it('should calculate DSR correctly', () => {
      // (1000 / 25) * 5 = 40 * 5 = 200
      expect(calcularDSR(1000, 25, 5)).toBe(200);
    });

    it('should return 0 if total variable is 0', () => {
      expect(calcularDSR(0)).toBe(0);
    });
  });

  describe('calcular13Salario', () => {
    it('should calculate full 13th salary correctly', () => {
      expect(calcular13Salario(3000, 12)).toBe(3000);
    });

    it('should calculate proportional 13th salary', () => {
      // (3000 / 12) * 6 = 1500
      expect(calcular13Salario(3000, 6)).toBe(1500);
    });

    it('should calculate 1st installment (50%)', () => {
      // (3000 / 12) * 12 = 3000
      // 3000 / 2 = 1500
      expect(calcular13Salario(3000, 12, 1)).toBe(1500);
    });
  });
});
