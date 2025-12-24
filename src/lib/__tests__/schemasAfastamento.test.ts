import { z } from 'zod';
import { afastamentoSchema, afastamentoFormSchema, tipoAfastamentoSchema } from '../schemasAfastamento';

describe('schemasAfastamento', () => {
  describe('tipoAfastamentoSchema', () => {
    it('should validate valid types', () => {
      expect(() => tipoAfastamentoSchema.parse('doenca')).not.toThrow();
      expect(() => tipoAfastamentoSchema.parse('acidente_trabalho')).not.toThrow();
      expect(() => tipoAfastamentoSchema.parse('maternidade')).not.toThrow();
    });

    it('should reject invalid types', () => {
      expect(() => tipoAfastamentoSchema.parse('invalid')).toThrow();
    });
  });

  describe('afastamentoSchema', () => {
    const validAfastamento = {
      colaborador_id: '123',
      tipo: 'doenca',
      data_inicio: '2024-01-15',
      data_fim: '2024-01-20',
      motivo: 'Gripe',
      cid: 'J11',
    };

    it('should validate valid afastamento', () => {
      expect(() => afastamentoSchema.parse(validAfastamento)).not.toThrow();
    });

    it('should reject missing required fields', () => {
      const { colaborador_id, ...invalid } = validAfastamento;
      expect(() => afastamentoSchema.parse(invalid)).toThrow();
    });

    it('should reject invalid dates', () => {
      expect(() => afastamentoSchema.parse({
        ...validAfastamento,
        data_inicio: 'invalid-date'
      })).toThrow();
    });
  });

  describe('afastamentoFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        colaborador_id: '123',
        tipo: 'doenca',
        data_inicio: new Date('2024-01-15'),
        data_fim: new Date('2024-01-20'),
        motivo: 'Gripe',
      };
      expect(() => afastamentoFormSchema.parse(formData)).not.toThrow();
    });
  });
});
