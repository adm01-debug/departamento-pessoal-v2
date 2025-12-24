import { z } from 'zod';
import { beneficioSchema, beneficioFormSchema, tipoBeneficioSchema } from '../schemasBeneficio';

describe('schemasBeneficio', () => {
  describe('tipoBeneficioSchema', () => {
    it('should validate valid types', () => {
      expect(() => tipoBeneficioSchema.parse('vale_transporte')).not.toThrow();
      expect(() => tipoBeneficioSchema.parse('vale_alimentacao')).not.toThrow();
      expect(() => tipoBeneficioSchema.parse('plano_saude')).not.toThrow();
    });

    it('should reject invalid types', () => {
      expect(() => tipoBeneficioSchema.parse('invalid')).toThrow();
    });
  });

  describe('beneficioSchema', () => {
    const validBeneficio = {
      colaborador_id: '123',
      tipo: 'vale_transporte',
      valor: 200,
      data_inicio: '2024-01-01',
    };

    it('should validate valid beneficio', () => {
      expect(() => beneficioSchema.parse(validBeneficio)).not.toThrow();
    });

    it('should reject negative values', () => {
      expect(() => beneficioSchema.parse({
        ...validBeneficio,
        valor: -100
      })).toThrow();
    });

    it('should accept optional data_fim', () => {
      const withDataFim = { ...validBeneficio, data_fim: '2024-12-31' };
      expect(() => beneficioSchema.parse(withDataFim)).not.toThrow();
    });
  });

  describe('beneficioFormSchema', () => {
    it('should validate form data', () => {
      const formData = {
        colaborador_id: '123',
        tipo: 'vale_alimentacao',
        valor: 500,
        data_inicio: new Date('2024-01-01'),
      };
      expect(() => beneficioFormSchema.parse(formData)).not.toThrow();
    });
  });
});
