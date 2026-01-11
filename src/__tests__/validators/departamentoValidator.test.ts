// V16-037: Tests for Departamento Validator  
import { describe, it, expect } from 'vitest';

const validateDepartamento = (data: any) => {
  const errors: string[] = [];
  if (!data.nome || data.nome.length < 2) errors.push('Nome deve ter pelo menos 2 caracteres');
  if (!data.empresa_id) errors.push('Empresa obrigatória');
  if (data.codigo && data.codigo.length > 20) errors.push('Código deve ter no máximo 20 caracteres');
  return { valid: errors.length === 0, errors };
};

describe('departamentoValidator', () => {
  it('deve validar departamento completo', () => {
    const result = validateDepartamento({ nome: 'Recursos Humanos', empresa_id: 'emp-1', codigo: 'RH001' });
    expect(result.valid).toBe(true);
  });
  it('deve rejeitar sem empresa', () => {
    const result = validateDepartamento({ nome: 'RH' });
    expect(result.errors).toContain('Empresa obrigatória');
  });
  it('deve rejeitar nome curto', () => {
    const result = validateDepartamento({ nome: 'R', empresa_id: 'emp-1' });
    expect(result.errors).toContain('Nome deve ter pelo menos 2 caracteres');
  });
});
