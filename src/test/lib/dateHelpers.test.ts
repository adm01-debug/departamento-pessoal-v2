import { describe, it, expect } from 'vitest';
import { formatarData, formatarDataHora, diasEntre, calcularIdade, tempoEmpresa, isDiaUtil, diasUteis } from '@/lib/dateHelpers';

describe('dateHelpers', () => {
  describe('formatarData', () => {
    it('deve formatar data ISO para dd/MM/yyyy', () => {
      expect(formatarData('2024-01-15')).toBe('15/01/2024');
    });
    it('deve retornar string vazia para data inválida', () => {
      expect(formatarData('')).toBe('');
    });
  });
  describe('formatarDataHora', () => {
    it('deve formatar com hora', () => {
      const result = formatarDataHora('2024-01-15T14:30:00');
      expect(result).toContain('15/01/2024');
    });
  });
  describe('diasEntre', () => {
    it('deve calcular diferença em dias', () => {
      expect(diasEntre('2024-01-01', '2024-01-11')).toBe(10);
    });
  });
  describe('calcularIdade', () => {
    it('deve calcular idade em anos', () => {
      const idade = calcularIdade('1990-01-01');
      expect(idade).toBeGreaterThanOrEqual(34);
    });
  });
  describe('tempoEmpresa', () => {
    it('deve retornar anos e meses', () => {
      const tempo = tempoEmpresa('2020-01-01');
      expect(tempo.anos).toBeGreaterThanOrEqual(4);
    });
  });
  describe('isDiaUtil', () => {
    it('deve identificar dia útil', () => {
      expect(isDiaUtil(new Date('2024-01-15'))).toBe(true); // Segunda
    });
    it('deve identificar fim de semana', () => {
      expect(isDiaUtil(new Date('2024-01-13'))).toBe(false); // Sábado
    });
  });
  describe('diasUteis', () => {
    it('deve contar dias úteis entre datas', () => {
      const dias = diasUteis(new Date('2024-01-01'), new Date('2024-01-07'));
      expect(dias).toBe(5);
    });
  });
});
