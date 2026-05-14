import { folhaCalc } from '../folhaCalc';
import { describe, it, expect } from 'vitest';

describe('folhaCalc Performance and Stress Tests', () => {
  it('should process 1000 calculations in less than 500ms', () => {
    const start = Date.now();
    for (let i = 0; i < 1000; i++) {
      folhaCalc.processar(2000 + i, {
        dependentes: i % 3,
        horasExtras50: i % 10,
        jornada: 220
      });
    }
    const duration = Date.now() - start;
    console.log(`Processed 1000 calculations in ${duration}ms`);
    expect(duration).toBeLessThan(500);
  });

  it('should handle extreme salary values correctly', () => {
    const resultHigh = folhaCalc.processar(1000000); // 1 Million
    expect(resultHigh.inss).toBeCloseTo(1142.04, 0); // Teto
    expect(resultHigh.liquido).toBeLessThan(1000000);
    
    const resultLow = folhaCalc.processar(0);
    expect(resultLow.liquido).toBe(0);
  });

  it('should maintain precision with many decimal additions', () => {
    const result = folhaCalc.processar(2000.55, {
      adicionais: 0.1 + 0.2, // Common floating point issue
      descontosExtras: 0.3
    });
    // With Decimal.js, 0.1 + 0.2 - 0.3 should be exactly 0
    expect(result.proventos).toBe(2000.85);
  });
});
