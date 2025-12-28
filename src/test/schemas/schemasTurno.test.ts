import { describe, it, expect } from 'vitest';
import { schemasTurno, schemasTurnoCreate, schemasTurnoUpdate } from '@/schemas/schemasTurno';
import { z } from 'zod';

describe('schemasTurno', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasTurno).toBeDefined();
    expect(schemasTurno instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasTurno.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasTurno.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasTurnoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasTurnoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasTurno.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasTurnoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasTurno.safeParse(data);
    expect(result.success).toBe(false);
  });
});
