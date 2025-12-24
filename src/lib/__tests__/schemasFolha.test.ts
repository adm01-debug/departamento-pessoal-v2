import { folhaSchema, folhaItemSchema, statusFolhaSchema } from '../schemasFolha';

describe('schemasFolha', () => {
  describe('statusFolhaSchema', () => {
    it('should validate valid status', () => {
      expect(() => statusFolhaSchema.parse('aberta')).not.toThrow();
      expect(() => statusFolhaSchema.parse('processando')).not.toThrow();
      expect(() => statusFolhaSchema.parse('fechada')).not.toThrow();
    });

    it('should reject invalid status', () => {
      expect(() => statusFolhaSchema.parse('invalid')).toThrow();
    });
  });

  describe('folhaItemSchema', () => {
    const validItem = {
      colaborador_id: '123',
      salario_base: 5000,
      horas_extras: 10,
      valor_horas_extras: 500,
      descontos: 200,
      inss: 550,
      irrf: 300,
      salario_liquido: 4450,
    };

    it('should validate valid item', () => {
      expect(() => folhaItemSchema.parse(validItem)).not.toThrow();
    });

    it('should reject negative salario', () => {
      expect(() => folhaItemSchema.parse({
        ...validItem,
        salario_base: -1000
      })).toThrow();
    });

    it('should reject negative horas_extras', () => {
      expect(() => folhaItemSchema.parse({
        ...validItem,
        horas_extras: -5
      })).toThrow();
    });
  });

  describe('folhaSchema', () => {
    const validFolha = {
      mes: 1,
      ano: 2024,
      status: 'aberta',
      itens: [],
    };

    it('should validate valid folha', () => {
      expect(() => folhaSchema.parse(validFolha)).not.toThrow();
    });

    it('should reject invalid month', () => {
      expect(() => folhaSchema.parse({
        ...validFolha,
        mes: 0
      })).toThrow();
    });
  });
});
