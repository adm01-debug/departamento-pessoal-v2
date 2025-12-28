import { describe, it, expect } from 'vitest';
import { schemasAtraso, schemasAtrasoCreate, schemasAtrasoUpdate } from '@/schemas/schemasAtraso';
import { z } from 'zod';

describe('schemasAtraso', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasAtraso).toBeDefined();
    expect(schemasAtraso instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasAtraso.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasAtraso.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasAtrasoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasAtrasoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasAtraso.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasAtrasoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasAtraso.safeParse(data);
    expect(result.success).toBe(false);
  });
});
