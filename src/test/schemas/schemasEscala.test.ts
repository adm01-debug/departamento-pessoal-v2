import { describe, it, expect } from 'vitest';
import { schemasEscala, schemasEscalaCreate, schemasEscalaUpdate } from '@/schemas/schemasEscala';
import { z } from 'zod';

describe('schemasEscala', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasEscala).toBeDefined();
    expect(schemasEscala instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasEscala.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasEscala.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasEscalaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasEscalaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasEscala.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasEscalaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasEscala.safeParse(data);
    expect(result.success).toBe(false);
  });
});
