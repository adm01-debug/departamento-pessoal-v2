import { describe, it, expect } from 'vitest';
import { formatarMoeda, formatarNumero, formatarPorcentagem, arredondarCima, arredondarBaixo, calcularPercentual, clamp } from '@/lib/numberHelpers';

describe('numberHelpers', () => {
  describe('formatarMoeda', () => {
    it('deve formatar como BRL', () => {
      expect(formatarMoeda(1234.56)).toContain('1.234,56');
    });
  });
  describe('formatarNumero', () => {
    it('deve formatar com decimais', () => {
      expect(formatarNumero(1234.5, 2)).toBe('1.234,50');
    });
  });
  describe('formatarPorcentagem', () => {
    it('deve formatar porcentagem', () => {
      expect(formatarPorcentagem(25)).toContain('25');
    });
  });
  describe('arredondarCima', () => {
    it('deve arredondar para cima', () => {
      expect(arredondarCima(1.234, 2)).toBe(1.24);
    });
  });
  describe('arredondarBaixo', () => {
    it('deve arredondar para baixo', () => {
      expect(arredondarBaixo(1.239, 2)).toBe(1.23);
    });
  });
  describe('calcularPercentual', () => {
    it('deve calcular percentual', () => {
      expect(calcularPercentual(25, 100)).toBe(25);
    });
    it('deve retornar 0 se total é 0', () => {
      expect(calcularPercentual(25, 0)).toBe(0);
    });
  });
  describe('clamp', () => {
    it('deve limitar valor', () => {
      expect(clamp(150, 0, 100)).toBe(100);
      expect(clamp(-10, 0, 100)).toBe(0);
      expect(clamp(50, 0, 100)).toBe(50);
    });
  });
});
