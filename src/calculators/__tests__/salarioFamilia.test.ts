// V18-T024: Testes Salario Familia 2026
import { describe, it, expect } from 'vitest';
import { calcularSalarioFamilia, calcularSalarioFamiliaDetalhado, getLimiteSalarioFamilia, getValorCotaSalarioFamilia } from '../salarioFamilia';

describe('Calculadora Salario Familia 2026', () => {
  describe('calcularSalarioFamilia', () => {
    it('deve calcular valor por dependente', () => {
      expect(calcularSalarioFamilia(1500, 2)).toBeCloseTo(135.08, 1);
    });
    it('deve retornar 0 se acima do limite', () => {
      expect(calcularSalarioFamilia(3000, 2)).toBe(0);
    });
    it('deve retornar 0 sem dependentes', () => {
      expect(calcularSalarioFamilia(1500, 0)).toBe(0);
    });
  });

  describe('Constantes 2026', () => {
    it('limite 1980.38', () => {
      expect(getLimiteSalarioFamilia()).toBe(1980.38);
    });
    it('cota 67.54', () => {
      expect(getValorCotaSalarioFamilia()).toBe(67.54);
    });
  });
});
