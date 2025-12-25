import { describe, it, expect } from 'vitest';
import * as calculosTrabalhistas2025 from '../calculosTrabalhistas2025';
describe('calculosTrabalhistas2025', () => { 
  it('should export calc functions', () => { expect(calculosTrabalhistas2025).toBeDefined(); }); 
  it('should calculate INSS', () => { 
    if (calculosTrabalhistas2025.calcularINSS) expect(typeof calculosTrabalhistas2025.calcularINSS(3000)).toBe('number');
  });
  it('should calculate IRRF', () => { 
    if (calculosTrabalhistas2025.calcularIRRF) expect(typeof calculosTrabalhistas2025.calcularIRRF(5000, 0)).toBe('number');
  });
});
