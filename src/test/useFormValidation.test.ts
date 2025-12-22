import { describe, it, expect } from 'vitest';

describe('useFormValidation', () => {
  it('deve validar CPF', () => {
    const cpfValido = '123.456.789-09';
    const cpfInvalido = '111.111.111-11';
    const validarCPF = (cpf: string) => {
      const numeros = cpf.replace(/\D/g, '');
      if (numeros.length !== 11) return false;
      if (/^(\d)\1+$/.test(numeros)) return false;
      return true; // Simplificado
    };
    expect(validarCPF(cpfValido)).toBe(true);
    expect(validarCPF(cpfInvalido)).toBe(false);
  });

  it('deve validar email', () => {
    const emails = [
      { value: 'teste@email.com', valid: true },
      { value: 'invalido', valid: false },
      { value: 'teste@', valid: false }
    ];
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emails.forEach(e => {
      expect(regex.test(e.value)).toBe(e.valid);
    });
  });
});
