import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatDate, formatCPF, formatCNPJ, formatPhone, sleep } from '../utils';

describe('utils', () => {
  describe('cn', () => {
    it('deve combinar classes', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('deve lidar com condicionais', () => {
      expect(cn('base', true && 'active')).toBe('base active');
      expect(cn('base', false && 'active')).toBe('base');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valor em reais', () => {
      expect(formatCurrency(1000)).toContain('1.000');
    });

    it('deve formatar valores decimais', () => {
      expect(formatCurrency(1234.56)).toContain('1.234,56');
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF', () => {
      expect(formatCPF('12345678901')).toBe('123.456.789-01');
    });

    it('deve retornar vazio para CPF inválido', () => {
      expect(formatCPF('')).toBe('');
    });
  });

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ', () => {
      expect(formatCNPJ('12345678000190')).toBe('12.345.678/0001-90');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefone celular', () => {
      expect(formatPhone('11999998888')).toBe('(11) 99999-8888');
    });

    it('deve formatar telefone fixo', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });
  });

  describe('sleep', () => {
    it('deve aguardar o tempo especificado', async () => {
      const start = Date.now();
      await sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95);
    });
  });
});
