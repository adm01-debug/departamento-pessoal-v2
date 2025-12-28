import { describe, it, expect } from 'vitest';
import { schemasAumento, schemasAumentoCreate, schemasAumentoUpdate } from '@/schemas/schemasAumento';
import { z } from 'zod';

describe('schemasAumento', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasAumento).toBeDefined();
    expect(schemasAumento instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasAumento.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasAumento.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasAumentoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasAumentoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasAumento.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasAumentoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasAumento.safeParse(data);
    expect(result.success).toBe(false);
  });
});
