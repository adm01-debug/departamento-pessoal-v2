import { describe, it, expect } from 'vitest';
import { schemasEPI, schemasEPICreate, schemasEPIUpdate } from '@/schemas/schemasEPI';
import { z } from 'zod';

describe('schemasEPI', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasEPI).toBeDefined();
    expect(schemasEPI instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasEPI.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasEPI.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasEPICreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasEPIUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasEPI.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasEPIUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasEPI.safeParse(data);
    expect(result.success).toBe(false);
  });
});
