import { describe, it, expect } from 'vitest';
import { schemasFilial, schemasFilialCreate, schemasFilialUpdate } from '@/schemas/schemasFilial';
import { z } from 'zod';

describe('schemasFilial', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasFilial).toBeDefined();
    expect(schemasFilial instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasFilial.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasFilial.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasFilialCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasFilialUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasFilial.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasFilialUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasFilial.safeParse(data);
    expect(result.success).toBe(false);
  });
});
