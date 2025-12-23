import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  cpfSchema,
  cnpjSchema,
  emailSchema,
  telefoneSchema,
  cepSchema,
  dateSchema,
  moneySchema
} from '../zodSchemas';

describe('zodSchemas', () => {
  describe('cpfSchema', () => {
    it('deve validar CPF válido', () => {
      expect(cpfSchema.safeParse('123.456.789-01').success).toBe(true);
      expect(cpfSchema.safeParse('12345678901').success).toBe(true);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(cpfSchema.safeParse('123').success).toBe(false);
      expect(cpfSchema.safeParse('abc').success).toBe(false);
    });
  });

  describe('cnpjSchema', () => {
    it('deve validar CNPJ válido', () => {
      expect(cnpjSchema.safeParse('12.345.678/0001-90').success).toBe(true);
      expect(cnpjSchema.safeParse('12345678000190').success).toBe(true);
    });
  });

  describe('emailSchema', () => {
    it('deve validar email válido', () => {
      expect(emailSchema.safeParse('test@example.com').success).toBe(true);
    });

    it('deve rejeitar email inválido', () => {
      expect(emailSchema.safeParse('invalid').success).toBe(false);
    });
  });

  describe('telefoneSchema', () => {
    it('deve validar telefone válido', () => {
      expect(telefoneSchema.safeParse('(11) 99999-8888').success).toBe(true);
      expect(telefoneSchema.safeParse('11999998888').success).toBe(true);
    });
  });

  describe('cepSchema', () => {
    it('deve validar CEP válido', () => {
      expect(cepSchema.safeParse('12345-678').success).toBe(true);
      expect(cepSchema.safeParse('12345678').success).toBe(true);
    });
  });

  describe('dateSchema', () => {
    it('deve validar data válida', () => {
      expect(dateSchema.safeParse('2024-01-01').success).toBe(true);
    });
  });

  describe('moneySchema', () => {
    it('deve validar valor monetário', () => {
      expect(moneySchema.safeParse(1000).success).toBe(true);
      expect(moneySchema.safeParse(0).success).toBe(true);
    });

    it('deve rejeitar valor negativo', () => {
      expect(moneySchema.safeParse(-100).success).toBe(false);
    });
  });
});
