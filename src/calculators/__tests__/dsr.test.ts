// V18-T023: Testes Calculadora DSR
import { describe, it, expect } from 'vitest';
import { calcularDSR, calcularDSRHorasExtras, calcularDSRComissoes } from '../dsr';

describe('Calculadora DSR', () => {
  describe('calcularDSR', () => {
    it('deve calcular DSR corretamente', () => {
      const resultado = calcularDSR({ valorVariaveis: 600, diasUteis: 24, domingosFeriados: 6 });
      expect(resultado).toBe(150);
    });
    it('deve retornar 0 se dias uteis for 0', () => {
      expect(calcularDSR({ valorVariaveis: 600, diasUteis: 0, domingosFeriados: 6 })).toBe(0);
    });
    it('deve arredondar para 2 casas', () => {
      const resultado = calcularDSR({ valorVariaveis: 500, diasUteis: 22, domingosFeriados: 5 });
      expect(resultado).toBeCloseTo(113.64, 2);
    });
  });

  describe('calcularDSRHorasExtras', () => {
    it('deve calcular DSR sobre HE', () => {
      expect(calcularDSRHorasExtras(440, 22, 8)).toBe(160);
    });
  });

  describe('calcularDSRComissoes', () => {
    it('deve calcular DSR sobre comissoes', () => {
      expect(calcularDSRComissoes(1000, 25, 5)).toBe(200);
    });
  });
});
