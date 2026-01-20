// V18-T023: Testes da Calculadora DSR
import { describe, it, expect } from 'vitest';
import { calcularDSR, calcularDSRHorasExtras, calcularDSRComissoes, ParamsDSR } from '../dsr';

describe('Calculadora DSR', () => {
  describe('calcularDSR', () => {
    it('deve calcular DSR corretamente', () => {
      const resultado = calcularDSR({ valorVariaveis: 600, diasUteis: 24, domingosFeriados: 6 });
      expect(resultado).toBe(150); // (600/24) * 6
    });

    it('deve retornar 0 para dias úteis zero', () => {
      const resultado = calcularDSR({ valorVariaveis: 600, diasUteis: 0, domingosFeriados: 6 });
      expect(resultado).toBe(0);
    });

    it('deve arredondar para 2 casas decimais', () => {
      const resultado = calcularDSR({ valorVariaveis: 500, diasUteis: 22, domingosFeriados: 8 });
      expect(resultado.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });

    it('deve calcular para valores fracionados', () => {
      const resultado = calcularDSR({ valorVariaveis: 333.33, diasUteis: 22, domingosFeriados: 8 });
      expect(resultado).toBeGreaterThan(0);
    });
  });

  describe('calcularDSRHorasExtras', () => {
    it('deve calcular DSR sobre horas extras', () => {
      const resultado = calcularDSRHorasExtras(440, 22, 8);
      expect(resultado).toBe(160); // (440/22) * 8
    });
  });

  describe('calcularDSRComissoes', () => {
    it('deve calcular DSR sobre comissões', () => {
      const resultado = calcularDSRComissoes(1100, 22, 8);
      expect(resultado).toBe(400); // (1100/22) * 8
    });
  });
});
