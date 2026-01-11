// V15-366
import { describe, it, expect } from 'vitest';
import { calcularFerias, calcularDiasFerias } from '@/calculators/ferias';
describe('Ferias calculator', () => {
  it('calculates vacation correctly', () => { const result = calcularFerias(3000, 30, 0); expect(result.valorFerias).toBe(3000); expect(result.tercoConstitucional).toBe(1000); expect(result.total).toBe(4000); });
  it('calculates with abono', () => { const result = calcularFerias(3000, 20, 10); expect(result.valorAbono).toBe(1000); expect(result.tercoAbono).toBeCloseTo(333.33, 1); });
  it('calculates days correctly', () => { const days = calcularDiasFerias(new Date('2025-01-01'), new Date('2025-01-30')); expect(days).toBe(30); });
});
