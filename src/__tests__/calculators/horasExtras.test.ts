// V16-033: Tests for Horas Extras Calculator
import { describe, it, expect } from 'vitest';
import { calcularHorasExtras } from '@/calculators/horasExtras';

describe('calcularHorasExtras', () => {
  const salarioBase = 3000;
  const horasMes = 220;
  const valorHora = salarioBase / horasMes;

  it('deve calcular hora extra 50% (dias uteis)', () => {
    const result = calcularHorasExtras(salarioBase, 10, 50);
    const expected = valorHora * 1.5 * 10;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('deve calcular hora extra 100% (domingos/feriados)', () => {
    const result = calcularHorasExtras(salarioBase, 8, 100);
    const expected = valorHora * 2 * 8;
    expect(result).toBeCloseTo(expected, 2);
  });

  it('deve retornar 0 para 0 horas', () => {
    expect(calcularHorasExtras(salarioBase, 0, 50)).toBe(0);
  });

  it('deve calcular corretamente para salario minimo', () => {
    const result = calcularHorasExtras(1518, 10, 50);
    const valorHoraMin = 1518 / 220;
    const expected = valorHoraMin * 1.5 * 10;
    expect(result).toBeCloseTo(expected, 2);
  });
});
