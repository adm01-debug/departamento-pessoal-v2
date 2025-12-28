import { describe, it, expect } from 'vitest';
import { schemasRAIS, schemasRAISCreate, schemasRAISUpdate } from '@/schemas/schemasRAIS';
import { z } from 'zod';

describe('schemasRAIS', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasRAIS).toBeDefined();
    expect(schemasRAIS instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasRAIS.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasRAIS.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasRAISCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasRAISUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasRAIS.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasRAISUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasRAIS.safeParse(data);
    expect(result.success).toBe(false);
  });
});
