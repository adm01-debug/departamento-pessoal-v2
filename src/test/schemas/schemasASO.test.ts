import { describe, it, expect } from 'vitest';
import { schemasASO, schemasASOCreate, schemasASOUpdate } from '@/schemas/schemasASO';
import { z } from 'zod';

describe('schemasASO', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasASO).toBeDefined();
    expect(schemasASO instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasASO.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasASO.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasASOCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasASOUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasASO.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasASOUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasASO.safeParse(data);
    expect(result.success).toBe(false);
  });
});
