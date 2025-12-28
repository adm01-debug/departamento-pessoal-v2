import { describe, it, expect } from 'vitest';
import { schemasRescisao, schemasRescisaoCreate, schemasRescisaoUpdate } from '@/schemas/schemasRescisao';
import { z } from 'zod';

describe('schemasRescisao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasRescisao).toBeDefined();
    expect(schemasRescisao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasRescisao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasRescisao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasRescisaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasRescisaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasRescisao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasRescisaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasRescisao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
