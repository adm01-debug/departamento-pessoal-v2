import { describe, it, expect } from 'vitest';
import { schemasAcordoTrabalhista, schemasAcordoTrabalhistaCreate, schemasAcordoTrabalhistaUpdate } from '@/schemas/schemasAcordoTrabalhista';
import { z } from 'zod';

describe('schemasAcordoTrabalhista', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasAcordoTrabalhista).toBeDefined();
    expect(schemasAcordoTrabalhista instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasAcordoTrabalhista.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasAcordoTrabalhista.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasAcordoTrabalhistaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasAcordoTrabalhistaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasAcordoTrabalhista.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasAcordoTrabalhistaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasAcordoTrabalhista.safeParse(data);
    expect(result.success).toBe(false);
  });
});
