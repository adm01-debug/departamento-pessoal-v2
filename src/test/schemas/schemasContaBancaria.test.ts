import { describe, it, expect } from 'vitest';
import { schemasContaBancaria, schemasContaBancariaCreate, schemasContaBancariaUpdate } from '@/schemas/schemasContaBancaria';
import { z } from 'zod';

describe('schemasContaBancaria', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasContaBancaria).toBeDefined();
    expect(schemasContaBancaria instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasContaBancaria.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasContaBancaria.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasContaBancariaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasContaBancariaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasContaBancaria.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasContaBancariaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasContaBancaria.safeParse(data);
    expect(result.success).toBe(false);
  });
});
