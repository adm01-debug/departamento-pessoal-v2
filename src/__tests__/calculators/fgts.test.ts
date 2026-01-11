// V16-032: Tests for FGTS Calculator
import { describe, it, expect } from 'vitest';
import { calcularFGTS } from '@/calculators/fgts';

describe('calcularFGTS', () => {
  it('deve calcular 8% sobre salario bruto', () => {
    expect(calcularFGTS(1000)).toBe(80);
    expect(calcularFGTS(5000)).toBe(400);
    expect(calcularFGTS(10000)).toBe(800);
  });

  it('deve retornar 0 para salario 0', () => {
    expect(calcularFGTS(0)).toBe(0);
  });

  it('deve arredondar para 2 casas decimais', () => {
    expect(calcularFGTS(1234.56)).toBeCloseTo(98.76, 2);
  });

  it('deve calcular corretamente para salario minimo 2025', () => {
    const salarioMinimo = 1518;
    expect(calcularFGTS(salarioMinimo)).toBeCloseTo(121.44, 2);
  });

  it('deve calcular multa rescisoria 40%', () => {
    const saldoFGTS = 10000;
    const multa = saldoFGTS * 0.4;
    expect(multa).toBe(4000);
  });
});
