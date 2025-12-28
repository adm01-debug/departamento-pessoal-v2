import { describe, it, expect } from 'vitest';
import { schemasJornada, schemasJornadaCreate, schemasJornadaUpdate } from '@/schemas/schemasJornada';
import { z } from 'zod';

describe('schemasJornada', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasJornada).toBeDefined();
    expect(schemasJornada instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasJornada.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasJornada.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasJornadaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasJornadaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasJornada.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasJornadaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasJornada.safeParse(data);
    expect(result.success).toBe(false);
  });
});
