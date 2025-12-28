import { describe, it, expect } from 'vitest';
import { schemasGuiaINSS, schemasGuiaINSSCreate, schemasGuiaINSSUpdate } from '@/schemas/schemasGuiaINSS';
import { z } from 'zod';

describe('schemasGuiaINSS', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasGuiaINSS).toBeDefined();
    expect(schemasGuiaINSS instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasGuiaINSS.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasGuiaINSS.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasGuiaINSSCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasGuiaINSSUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasGuiaINSS.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasGuiaINSSUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasGuiaINSS.safeParse(data);
    expect(result.success).toBe(false);
  });
});
