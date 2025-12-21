import { describe, it, expect } from 'vitest';
import { validateCPF, validateCNPJ, validatePIS, applyMask, unmask } from '../lib/masks';

describe('Validação de CPF', () => {
  it('deve validar CPF correto', () => {
    expect(validateCPF('52998224725')).toBe(true);
    expect(validateCPF('529.982.247-25')).toBe(true);
  });

  it('deve rejeitar CPF inválido', () => {
    expect(validateCPF('11111111111')).toBe(false);
    expect(validateCPF('12345678901')).toBe(false);
    expect(validateCPF('')).toBe(false);
  });
});

describe('Validação de CNPJ', () => {
  it('deve validar CNPJ correto', () => {
    expect(validateCNPJ('11222333000181')).toBe(true);
  });

  it('deve rejeitar CNPJ inválido', () => {
    expect(validateCNPJ('11111111111111')).toBe(false);
    expect(validateCNPJ('')).toBe(false);
  });
});

describe('Validação de PIS', () => {
  it('deve validar PIS correto', () => {
    expect(validatePIS('12345678901')).toBe(true);
  });

  it('deve rejeitar PIS inválido', () => {
    expect(validatePIS('11111111111')).toBe(false);
  });
});

describe('Máscaras', () => {
  it('deve aplicar máscara de CPF', () => {
    expect(applyMask('52998224725', 'cpf')).toBe('529.982.247-25');
  });

  it('deve aplicar máscara de telefone', () => {
    expect(applyMask('11999998888', 'phone')).toBe('(11) 99999-8888');
  });

  it('deve remover máscara', () => {
    expect(unmask('529.982.247-25')).toBe('52998224725');
    expect(unmask('(11) 99999-8888')).toBe('11999998888');
  });
});
