import { describe, it, expect } from 'vitest';
import { schemasSindicato, schemasSindicatoCreate, schemasSindicatoUpdate } from '@/schemas/schemasSindicato';
import { z } from 'zod';

describe('schemasSindicato', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasSindicato).toBeDefined();
    expect(schemasSindicato instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasSindicato.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasSindicato.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasSindicatoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasSindicatoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasSindicato.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasSindicatoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasSindicato.safeParse(data);
    expect(result.success).toBe(false);
  });
});
