// V15-365
import { describe, it, expect } from 'vitest';
import { calcularIRRF, calcularBaseIRRF } from '@/calculators/irrf';
describe('IRRF calculator', () => {
  it('exempts low income', () => { expect(calcularIRRF(2000)).toBe(0); });
  it('calculates IRRF for taxable income', () => { const irrf = calcularIRRF(4000); expect(irrf).toBeGreaterThan(0); });
  it('calculates base correctly', () => { const base = calcularBaseIRRF(5000, 500, 0); expect(base).toBe(4500); });
  it('reduces with dependents', () => { const irrfNoDep = calcularIRRF(5000, 0); const irrfWithDep = calcularIRRF(5000, 2); expect(irrfWithDep).toBeLessThan(irrfNoDep); });
});
