// V15-363
import { describe, it, expect } from 'vitest';
import { validarCNPJ, formatarCNPJ } from '@/validators/cnpj';
describe('CNPJ validator', () => {
  it('validates valid CNPJ', () => { expect(validarCNPJ('11222333000181')).toBe(true); });
  it('rejects invalid CNPJ', () => { expect(validarCNPJ('11111111111111')).toBe(false); expect(validarCNPJ('12345678000199')).toBe(false); });
  it('formats CNPJ correctly', () => { expect(formatarCNPJ('11222333000181')).toBe('11.222.333/0001-81'); });
});
