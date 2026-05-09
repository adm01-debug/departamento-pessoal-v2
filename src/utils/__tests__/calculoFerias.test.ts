import { describe, it, expect } from 'vitest';
import { calculoFerias } from '../calculoFerias';

describe('calculoFerias', () => {
  it('deve calcular corretamente férias de 30 dias sem abono', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 30,
      diasAbono: 0
    };

    const result = calculoFerias.calcular(params);

    expect(result.valorFerias).toBe(3000);
    expect(result.tercoConstitucional).toBe(1000);
    expect(result.bruto).toBe(4000);
    // INSS 2026 sobre 4000:
    // 1518 * 0.075 = 113.85
    // (2793.88 - 1518) * 0.09 = 114.83
    // (4000 - 2793.88) * 0.12 = 144.73
    // Total = 373.41
    expect(result.inss).toBe(373.41);
    expect(result.liquido).toBeGreaterThan(3000);
  });

  it('deve calcular corretamente férias de 20 dias com 10 dias de abono', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 20,
      diasAbono: 10
    };

    const result = calculoFerias.calcular(params);

    // 20 dias de ferias = 2000
    // 1/3 de 2000 = 666.67
    // 10 dias de abono = 1000
    // 1/3 de 1000 = 333.33
    expect(result.valorFerias).toBe(2000);
    expect(result.tercoConstitucional).toBe(666.67);
    expect(result.valorAbono).toBe(1000);
    expect(result.tercoAbono).toBe(333.33);
    expect(result.bruto).toBe(4000);
  });

  it('deve limitar abono pecuniário a 1/3 dos dias de férias', () => {
    const params = {
      salarioBase: 3000,
      diasFerias: 15,
      diasAbono: 10 // Deveria ser limitado a 5 (1/3 de 15)
    };

    const result = calculoFerias.calcular(params);
    expect(result.valorAbono).toBe(500); // 5 dias (3000 / 30 * 5)
  });
});
