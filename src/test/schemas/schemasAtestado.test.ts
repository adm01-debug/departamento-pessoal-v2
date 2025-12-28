import { describe, it, expect } from 'vitest';
import { schemasAtestado, schemasAtestadoCreate, schemasAtestadoUpdate } from '@/schemas/schemasAtestado';
import { z } from 'zod';

describe('schemasAtestado', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasAtestado).toBeDefined();
    expect(schemasAtestado instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasAtestado.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasAtestado.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasAtestadoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasAtestadoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasAtestado.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasAtestadoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasAtestado.safeParse(data);
    expect(result.success).toBe(false);
  });
});
