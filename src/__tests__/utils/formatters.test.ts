// V15-361
import { describe, it, expect } from 'vitest';
import { formatCurrency, parseCurrency, formatPercent } from '@/formatters/currency';
import { formatDate, calcularIdade } from '@/formatters/date';
describe('formatters', () => {
  describe('currency', () => {
    it('formats currency correctly', () => { expect(formatCurrency(1234.56)).toContain('1.234,56'); });
    it('parses currency correctly', () => { expect(parseCurrency('R$ 1.234,56')).toBe(1234.56); });
    it('formats percent correctly', () => { expect(formatPercent(12.5)).toBe('12.50%'); });
  });
  describe('date', () => {
    it('formats date correctly', () => { expect(formatDate('2025-01-15')).toBe('15/01/2025'); });
    it('calculates age correctly', () => { const birth = new Date(); birth.setFullYear(birth.getFullYear() - 30); expect(calcularIdade(birth)).toBe(30); });
  });
});
