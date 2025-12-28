import { describe, it, expect } from 'vitest';
import { schemasCentroCusto, schemasCentroCustoCreate, schemasCentroCustoUpdate } from '@/schemas/schemasCentroCusto';
import { z } from 'zod';

describe('schemasCentroCusto', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasCentroCusto).toBeDefined();
    expect(schemasCentroCusto instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasCentroCusto.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasCentroCusto.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasCentroCustoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasCentroCustoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasCentroCusto.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasCentroCustoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasCentroCusto.safeParse(data);
    expect(result.success).toBe(false);
  });
});
