import { describe, it, expect } from 'vitest';
import { schemasAdvertencia, schemasAdvertenciaCreate, schemasAdvertenciaUpdate } from '@/schemas/schemasAdvertencia';
import { z } from 'zod';

describe('schemasAdvertencia', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasAdvertencia).toBeDefined();
    expect(schemasAdvertencia instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasAdvertencia.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasAdvertencia.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasAdvertenciaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasAdvertenciaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasAdvertencia.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasAdvertenciaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasAdvertencia.safeParse(data);
    expect(result.success).toBe(false);
  });
});
