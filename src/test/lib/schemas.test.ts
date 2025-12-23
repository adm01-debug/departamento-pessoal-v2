import { describe, it, expect } from 'vitest';
import { colaboradorSchema, feriasSchema, empresaSchema, cpfSchema, cnpjSchema } from '@/lib/schemas';

describe('schemas', () => {
  describe('cpfSchema', () => {
    it('deve aceitar CPF válido', () => {
      expect(() => cpfSchema.parse('12345678901')).not.toThrow();
    });
    it('deve rejeitar CPF inválido', () => {
      expect(() => cpfSchema.parse('123')).toThrow();
    });
  });
  describe('cnpjSchema', () => {
    it('deve aceitar CNPJ válido', () => {
      expect(() => cnpjSchema.parse('12345678000199')).not.toThrow();
    });
    it('deve rejeitar CNPJ inválido', () => {
      expect(() => cnpjSchema.parse('123')).toThrow();
    });
  });
  describe('colaboradorSchema', () => {
    it('deve validar colaborador completo', () => {
      const data = { nome: 'João Silva', cpf: '12345678901', data_admissao: '2024-01-01', cargo: 'Analista', salario: 5000 };
      expect(() => colaboradorSchema.parse(data)).not.toThrow();
    });
    it('deve rejeitar nome muito curto', () => {
      const data = { nome: 'Jo', cpf: '12345678901', data_admissao: '2024-01-01', cargo: 'Analista', salario: 5000 };
      expect(() => colaboradorSchema.parse(data)).toThrow();
    });
  });
  describe('feriasSchema', () => {
    it('deve validar férias', () => {
      const data = { colaborador_id: '123e4567-e89b-12d3-a456-426614174000', data_inicio: '2024-01-01', data_fim: '2024-01-30', dias_gozo: 30 };
      expect(() => feriasSchema.parse(data)).not.toThrow();
    });
  });
  describe('empresaSchema', () => {
    it('deve validar empresa', () => {
      const data = { razao_social: 'Empresa Teste LTDA', cnpj: '12345678000199' };
      expect(() => empresaSchema.parse(data)).not.toThrow();
    });
  });
});
