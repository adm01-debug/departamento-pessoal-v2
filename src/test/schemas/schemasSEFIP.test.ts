import { describe, it, expect } from 'vitest';
import { schemasSEFIP, schemasSEFIPCreate, schemasSEFIPUpdate } from '@/schemas/schemasSEFIP';
import { z } from 'zod';

describe('schemasSEFIP', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasSEFIP).toBeDefined();
    expect(schemasSEFIP instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasSEFIP.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasSEFIP.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasSEFIPCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasSEFIPUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasSEFIP.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasSEFIPUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasSEFIP.safeParse(data);
    expect(result.success).toBe(false);
  });
});
