// V16-035: Tests for Beneficio Validator
import { describe, it, expect } from 'vitest';

const validateBeneficio = (data: any) => {
  const errors: string[] = [];
  if (!data.nome || data.nome.length < 3) errors.push('Nome deve ter pelo menos 3 caracteres');
  if (!data.tipo) errors.push('Tipo obrigatório');
  if (data.valor_padrao !== undefined && data.valor_padrao < 0) errors.push('Valor não pode ser negativo');
  if (data.desconto_percentual !== undefined && (data.desconto_percentual < 0 || data.desconto_percentual > 100)) {
    errors.push('Desconto deve estar entre 0 e 100%');
  }
  return { valid: errors.length === 0, errors };
};

describe('beneficioValidator', () => {
  it('deve validar beneficio completo', () => {
    const result = validateBeneficio({ nome: 'Vale Refeição', tipo: 'vale_refeicao', valor_padrao: 500 });
    expect(result.valid).toBe(true);
  });
  it('deve rejeitar nome curto', () => {
    const result = validateBeneficio({ nome: 'VR', tipo: 'vale_refeicao' });
    expect(result.valid).toBe(false);
  });
  it('deve rejeitar valor negativo', () => {
    const result = validateBeneficio({ nome: 'Beneficio', tipo: 'outros', valor_padrao: -100 });
    expect(result.errors).toContain('Valor não pode ser negativo');
  });
  it('deve rejeitar desconto invalido', () => {
    const result = validateBeneficio({ nome: 'Beneficio', tipo: 'outros', desconto_percentual: 150 });
    expect(result.errors).toContain('Desconto deve estar entre 0 e 100%');
  });
});
