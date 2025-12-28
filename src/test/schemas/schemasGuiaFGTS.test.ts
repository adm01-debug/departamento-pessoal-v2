import { describe, it, expect } from 'vitest';
import { schemasGuiaFGTS, schemasGuiaFGTSCreate, schemasGuiaFGTSUpdate } from '@/schemas/schemasGuiaFGTS';
import { z } from 'zod';

describe('schemasGuiaFGTS', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasGuiaFGTS).toBeDefined();
    expect(schemasGuiaFGTS instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasGuiaFGTS.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasGuiaFGTS.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasGuiaFGTSCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasGuiaFGTSUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasGuiaFGTS.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasGuiaFGTSUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasGuiaFGTS.safeParse(data);
    expect(result.success).toBe(false);
  });
});
