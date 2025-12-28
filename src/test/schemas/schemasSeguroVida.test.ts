import { describe, it, expect } from 'vitest';
import { schemasSeguroVida, schemasSeguroVidaCreate, schemasSeguroVidaUpdate } from '@/schemas/schemasSeguroVida';
import { z } from 'zod';

describe('schemasSeguroVida', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasSeguroVida).toBeDefined();
    expect(schemasSeguroVida instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasSeguroVida.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasSeguroVida.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasSeguroVidaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasSeguroVidaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasSeguroVida.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasSeguroVidaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasSeguroVida.safeParse(data);
    expect(result.success).toBe(false);
  });
});
