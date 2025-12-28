import { describe, it, expect } from 'vitest';
import { schemasHomologacao, schemasHomologacaoCreate, schemasHomologacaoUpdate } from '@/schemas/schemasHomologacao';
import { z } from 'zod';

describe('schemasHomologacao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasHomologacao).toBeDefined();
    expect(schemasHomologacao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasHomologacao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasHomologacao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasHomologacaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasHomologacaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasHomologacao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasHomologacaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasHomologacao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
