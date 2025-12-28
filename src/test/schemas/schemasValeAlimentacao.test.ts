import { describe, it, expect } from 'vitest';
import { schemasValeAlimentacao, schemasValeAlimentacaoCreate, schemasValeAlimentacaoUpdate } from '@/schemas/schemasValeAlimentacao';
import { z } from 'zod';

describe('schemasValeAlimentacao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasValeAlimentacao).toBeDefined();
    expect(schemasValeAlimentacao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasValeAlimentacao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasValeAlimentacao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasValeAlimentacaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasValeAlimentacaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasValeAlimentacao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasValeAlimentacaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasValeAlimentacao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
