// V15-364
import { describe, it, expect } from 'vitest';
import { calcularINSS, calcularAliquotaEfetivaINSS } from '@/calculators/inss';
describe('INSS calculator', () => {
  it('calculates INSS for first bracket', () => { const inss = calcularINSS(1412); expect(inss).toBeCloseTo(105.9, 1); });
  it('calculates INSS for middle bracket', () => { const inss = calcularINSS(3000); expect(inss).toBeCloseTo(281.62, 1); });
  it('respects ceiling', () => { const inss = calcularINSS(10000); expect(inss).toBeLessThanOrEqual(908.85); });
  it('calculates effective rate', () => { const rate = calcularAliquotaEfetivaINSS(5000); expect(rate).toBeGreaterThan(0); expect(rate).toBeLessThan(14); });
});
