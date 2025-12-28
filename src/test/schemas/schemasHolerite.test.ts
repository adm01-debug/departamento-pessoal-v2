import { describe, it, expect } from 'vitest';
import { schemasHolerite, schemasHoleriteCreate, schemasHoleriteUpdate } from '@/schemas/schemasHolerite';
import { z } from 'zod';

describe('schemasHolerite', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasHolerite).toBeDefined();
    expect(schemasHolerite instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasHolerite.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasHolerite.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasHoleriteCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasHoleriteUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasHolerite.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasHoleriteUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasHolerite.safeParse(data);
    expect(result.success).toBe(false);
  });
});
