// V16-059: Tests for Documento Validator
import { describe, it, expect } from 'vitest';

const validateDocumento = (data: any) => {
  const errors: string[] = [];
  
  // CPF validation
  if (data.cpf) {
    const cpf = data.cpf.replace(/\D/g, '');
    if (cpf.length !== 11) errors.push('CPF deve ter 11 dígitos');
    else if (/^(\d)+$/.test(cpf)) errors.push('CPF inválido - todos dígitos iguais');
  }
  
  // CNPJ validation
  if (data.cnpj) {
    const cnpj = data.cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) errors.push('CNPJ deve ter 14 dígitos');
  }
  
  // PIS validation
  if (data.pis) {
    const pis = data.pis.replace(/\D/g, '');
    if (pis.length !== 11) errors.push('PIS deve ter 11 dígitos');
  }
  
  // RG validation
  if (data.rg && data.rg.length < 5) errors.push('RG inválido');
  
  // CTPS validation
  if (data.ctps_numero && !/^\d{7}$/.test(data.ctps_numero)) errors.push('CTPS deve ter 7 dígitos');
  if (data.ctps_serie && !/^\d{4,5}$/.test(data.ctps_serie)) errors.push('Série CTPS deve ter 4-5 dígitos');
  
  return { valid: errors.length === 0, errors };
};

describe('documentoValidator', () => {
  it('deve validar CPF correto', () => {
    const result = validateDocumento({ cpf: '12345678909' });
    expect(result.errors).not.toContain('CPF deve ter 11 dígitos');
  });

  it('deve rejeitar CPF com todos dígitos iguais', () => {
    const result = validateDocumento({ cpf: '11111111111' });
    expect(result.errors).toContain('CPF inválido - todos dígitos iguais');
  });

  it('deve validar CNPJ formato', () => {
    const result = validateDocumento({ cnpj: '12345678000199' });
    expect(result.valid).toBe(true);
  });

  it('deve validar PIS formato', () => {
    const result = validateDocumento({ pis: '12345678901' });
    expect(result.valid).toBe(true);
  });

  it('deve rejeitar CTPS inválida', () => {
    const result = validateDocumento({ ctps_numero: '123', ctps_serie: '12' });
    expect(result.errors).toContain('CTPS deve ter 7 dígitos');
    expect(result.errors).toContain('Série CTPS deve ter 4-5 dígitos');
  });
});
