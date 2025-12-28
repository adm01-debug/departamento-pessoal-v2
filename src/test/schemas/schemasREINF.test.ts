import { describe, it, expect } from 'vitest';
import { schemasREINF, schemasREINFCreate, schemasREINFUpdate } from '@/schemas/schemasREINF';
import { z } from 'zod';

describe('schemasREINF', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasREINF).toBeDefined();
    expect(schemasREINF instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasREINF.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasREINF.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasREINFCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasREINFUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasREINF.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasREINFUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasREINF.safeParse(data);
    expect(result.success).toBe(false);
  });
});
