// V15-362
import { describe, it, expect } from 'vitest';
import { validarCPF, formatarCPF } from '@/validators/cpf';
describe('CPF validator', () => {
  it('validates valid CPF', () => { expect(validarCPF('52998224725')).toBe(true); });
  it('rejects invalid CPF', () => { expect(validarCPF('11111111111')).toBe(false); expect(validarCPF('12345678900')).toBe(false); });
  it('rejects wrong length', () => { expect(validarCPF('1234567890')).toBe(false); });
  it('formats CPF correctly', () => { expect(formatarCPF('52998224725')).toBe('529.982.247-25'); });
});
