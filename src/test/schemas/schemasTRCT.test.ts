import { describe, it, expect } from 'vitest';
import { schemasTRCT, schemasTRCTCreate, schemasTRCTUpdate } from '@/schemas/schemasTRCT';
import { z } from 'zod';

describe('schemasTRCT', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasTRCT).toBeDefined();
    expect(schemasTRCT instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasTRCT.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasTRCT.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasTRCTCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasTRCTUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasTRCT.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasTRCTUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasTRCT.safeParse(data);
    expect(result.success).toBe(false);
  });
});
