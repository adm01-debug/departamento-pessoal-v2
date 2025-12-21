import { describe, it, expect } from 'vitest';
import { 
  validateCPF, 
  validatePIS, 
  colaboradorSchema, 
  feriasSchema, 
  afastamentoSchema,
  desligamentoSchema,
  validateForm 
} from '@/lib/validationSchemas';

describe('Validadores de Documentos', () => {
  describe('validateCPF', () => {
    it('deve validar CPF válido', () => {
      expect(validateCPF('529.982.247-25')).toBe(true);
      expect(validateCPF('52998224725')).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('123.456.789-00')).toBe(false);
      expect(validateCPF('12345')).toBe(false);
    });

    it('deve rejeitar CPF com sequência repetida', () => {
      expect(validateCPF('000.000.000-00')).toBe(false);
      expect(validateCPF('999.999.999-99')).toBe(false);
    });
  });

  describe('validatePIS', () => {
    it('deve validar PIS válido', () => {
      expect(validatePIS('123.45678.90-1')).toBe(true);
    });

    it('deve rejeitar PIS inválido', () => {
      expect(validatePIS('111.11111.11-1')).toBe(false);
      expect(validatePIS('12345')).toBe(false);
    });
  });
});

describe('colaboradorSchema', () => {
  const dadosValidos = {
    nome_completo: 'João da Silva',
    cpf: '529.982.247-25',
    data_nascimento: '1990-05-15',
    sexo: 'M' as const,
    pis: '12345678901',
    cargo: 'Analista',
    departamento: 'TI',
    data_admissao: '2024-01-15',
    salario_base: 5000,
  };

  it('deve validar dados completos', () => {
    const result = colaboradorSchema.safeParse(dadosValidos);
    expect(result.success).toBe(true);
  });

  it('deve rejeitar nome muito curto', () => {
    const result = colaboradorSchema.safeParse({
      ...dadosValidos,
      nome_completo: 'Jo',
    });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar salário abaixo do mínimo', () => {
    const result = colaboradorSchema.safeParse({
      ...dadosValidos,
      salario_base: 1000,
    });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar CPF inválido', () => {
    const result = colaboradorSchema.safeParse({
      ...dadosValidos,
      cpf: '111.111.111-11',
    });
    expect(result.success).toBe(false);
  });
});

describe('feriasSchema', () => {
  it('deve validar férias válidas', () => {
    const result = feriasSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      data_inicio: '2025-06-01',
      dias_gozo: 30,
      dias_abono: 10,
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar abono maior que 1/3', () => {
    const result = feriasSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      data_inicio: '2025-06-01',
      dias_gozo: 15,
      dias_abono: 10, // Mais que 1/3 de 15 (5 dias)
    });
    expect(result.success).toBe(false);
  });

  it('deve rejeitar dias de gozo abaixo do mínimo', () => {
    const result = feriasSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      data_inicio: '2025-06-01',
      dias_gozo: 3,
    });
    expect(result.success).toBe(false);
  });
});

describe('afastamentoSchema', () => {
  it('deve validar afastamento válido', () => {
    const result = afastamentoSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      tipo: 'atestado_medico',
      data_inicio: '2024-03-01',
      dias: 5,
      cid: 'J11',
    });
    expect(result.success).toBe(true);
  });

  it('deve validar CID com ponto', () => {
    const result = afastamentoSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      tipo: 'atestado_medico',
      data_inicio: '2024-03-01',
      dias: 5,
      cid: 'J11.0',
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar CID inválido', () => {
    const result = afastamentoSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      tipo: 'atestado_medico',
      data_inicio: '2024-03-01',
      dias: 5,
      cid: 'INVALIDO',
    });
    expect(result.success).toBe(false);
  });
});

describe('desligamentoSchema', () => {
  it('deve validar desligamento válido', () => {
    const result = desligamentoSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      tipo: 'pedido_demissao',
      data_desligamento: '2024-12-31',
      motivo: 'Oportunidade melhor em outra empresa',
    });
    expect(result.success).toBe(true);
  });

  it('deve rejeitar motivo muito curto', () => {
    const result = desligamentoSchema.safeParse({
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      tipo: 'pedido_demissao',
      data_desligamento: '2024-12-31',
      motivo: 'curto',
    });
    expect(result.success).toBe(false);
  });
});

describe('validateForm helper', () => {
  it('deve retornar sucesso para dados válidos', () => {
    const result = validateForm(feriasSchema, {
      colaborador_id: '123e4567-e89b-12d3-a456-426614174000',
      data_inicio: '2025-06-01',
      dias_gozo: 30,
    });
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('deve retornar erros formatados para dados inválidos', () => {
    const result = validateForm(feriasSchema, {
      colaborador_id: 'invalido',
      dias_gozo: 2,
    });
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(Object.keys(result.errors!).length).toBeGreaterThan(0);
  });
});
