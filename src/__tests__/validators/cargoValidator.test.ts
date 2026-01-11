// V16-036: Tests for Cargo Validator
import { describe, it, expect } from 'vitest';

const validateCargo = (data: any) => {
  const errors: string[] = [];
  if (!data.nome || data.nome.length < 2) errors.push('Nome deve ter pelo menos 2 caracteres');
  if (data.cbo && !/^\d{6}$/.test(data.cbo)) errors.push('CBO deve ter 6 dígitos');
  if (data.salario_base !== undefined && data.salario_base < 0) errors.push('Salário base não pode ser negativo');
  if (data.salario_teto && data.salario_base && data.salario_teto < data.salario_base) {
    errors.push('Salário teto deve ser maior que base');
  }
  return { valid: errors.length === 0, errors };
};

describe('cargoValidator', () => {
  it('deve validar cargo completo', () => {
    const result = validateCargo({ nome: 'Analista de RH', cbo: '252505', salario_base: 3000, salario_teto: 8000 });
    expect(result.valid).toBe(true);
  });
  it('deve rejeitar CBO invalido', () => {
    const result = validateCargo({ nome: 'Cargo', cbo: '123' });
    expect(result.errors).toContain('CBO deve ter 6 dígitos');
  });
  it('deve rejeitar teto menor que base', () => {
    const result = validateCargo({ nome: 'Cargo', salario_base: 5000, salario_teto: 3000 });
    expect(result.errors).toContain('Salário teto deve ser maior que base');
  });
});
