// V16-034: Tests for Afastamento Validator
import { describe, it, expect } from 'vitest';

const validateAfastamento = (data: any) => {
  const errors: string[] = [];
  if (!data.colaborador_id) errors.push('Colaborador obrigatório');
  if (!data.tipo) errors.push('Tipo obrigatório');
  if (!data.data_inicio) errors.push('Data início obrigatória');
  if (data.data_fim && data.data_inicio && new Date(data.data_fim) < new Date(data.data_inicio)) {
    errors.push('Data fim deve ser maior que data início');
  }
  if (data.tipo === 'doenca' && data.dias_afastamento > 15 && !data.cid) {
    errors.push('CID obrigatório para afastamentos > 15 dias');
  }
  return { valid: errors.length === 0, errors };
};

describe('afastamentoValidator', () => {
  it('deve validar afastamento completo', () => {
    const result = validateAfastamento({
      colaborador_id: '1',
      tipo: 'doenca',
      data_inicio: '2025-01-01',
      data_fim: '2025-01-10',
      dias_afastamento: 10,
    });
    expect(result.valid).toBe(true);
  });

  it('deve rejeitar sem colaborador', () => {
    const result = validateAfastamento({ tipo: 'doenca', data_inicio: '2025-01-01' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Colaborador obrigatório');
  });

  it('deve rejeitar data fim anterior a inicio', () => {
    const result = validateAfastamento({
      colaborador_id: '1',
      tipo: 'doenca',
      data_inicio: '2025-01-10',
      data_fim: '2025-01-01',
    });
    expect(result.valid).toBe(false);
  });

  it('deve exigir CID para afastamentos longos', () => {
    const result = validateAfastamento({
      colaborador_id: '1',
      tipo: 'doenca',
      data_inicio: '2025-01-01',
      dias_afastamento: 20,
    });
    expect(result.errors).toContain('CID obrigatório para afastamentos > 15 dias');
  });
});
