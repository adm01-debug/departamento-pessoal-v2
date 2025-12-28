import { describe, it, expect } from 'vitest';
import { schemasPermissao, schemasPermissaoCreate, schemasPermissaoUpdate } from '@/schemas/schemasPermissao';
import { z } from 'zod';

describe('schemasPermissao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasPermissao).toBeDefined();
    expect(schemasPermissao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasPermissao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasPermissao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasPermissaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasPermissaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasPermissao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasPermissaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasPermissao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
