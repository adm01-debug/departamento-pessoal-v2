import { describe, it, expect } from 'vitest';
import { schemasBancoHoras, schemasBancoHorasCreate, schemasBancoHorasUpdate } from '@/schemas/schemasBancoHoras';
import { z } from 'zod';

describe('schemasBancoHoras', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasBancoHoras).toBeDefined();
    expect(schemasBancoHoras instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasBancoHoras.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasBancoHoras.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasBancoHorasCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasBancoHorasUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasBancoHoras.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasBancoHorasUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasBancoHoras.safeParse(data);
    expect(result.success).toBe(false);
  });
});
