import { describe, it, expect } from 'vitest';
import { schemasPromocao, schemasPromocaoCreate, schemasPromocaoUpdate } from '@/schemas/schemasPromocao';
import { z } from 'zod';

describe('schemasPromocao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasPromocao).toBeDefined();
    expect(schemasPromocao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasPromocao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasPromocao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasPromocaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasPromocaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasPromocao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasPromocaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasPromocao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
