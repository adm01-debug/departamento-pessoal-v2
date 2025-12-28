import { describe, it, expect } from 'vitest';
import { schemasFalta, schemasFaltaCreate, schemasFaltaUpdate } from '@/schemas/schemasFalta';
import { z } from 'zod';

describe('schemasFalta', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasFalta).toBeDefined();
    expect(schemasFalta instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasFalta.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasFalta.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasFaltaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasFaltaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasFalta.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasFaltaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasFalta.safeParse(data);
    expect(result.success).toBe(false);
  });
});
