import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCPF,
  formatCNPJ,
  formatPhone,
  formatCEP,
  formatPercentage,
  formatHours,
  parseCurrency
} from '../lib/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('deve formatar valores monetários', () => {
      expect(formatCurrency(1234.56)).toContain('1.234,56');
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
    });
  });

  describe('formatCNPJ', () => {
    it('deve formatar CNPJ corretamente', () => {
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

  describe('formatCEP', () => {
    it('deve formatar CEP', () => {
      expect(formatCEP('01310100')).toBe('01310-100');
    });
  });

  describe('formatPercentage', () => {
    it('deve formatar porcentagem', () => {
      expect(formatPercentage(75.5)).toBe('75.50%');
    });
  });

  describe('formatHours', () => {
    it('deve formatar minutos em horas:minutos', () => {
      expect(formatHours(150)).toBe('02:30');
    });
  });

  describe('parseCurrency', () => {
    it('deve converter string monetária em número', () => {
      expect(parseCurrency('R$ 1.234,56')).toBe(1234.56);
    });
  });
});
