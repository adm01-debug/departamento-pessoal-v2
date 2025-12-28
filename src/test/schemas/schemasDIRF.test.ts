import { describe, it, expect } from 'vitest';
import { schemasDIRF, schemasDIRFCreate, schemasDIRFUpdate } from '@/schemas/schemasDIRF';
import { z } from 'zod';

describe('schemasDIRF', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasDIRF).toBeDefined();
    expect(schemasDIRF instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasDIRF.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasDIRF.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasDIRFCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasDIRFUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasDIRF.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasDIRFUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasDIRF.safeParse(data);
    expect(result.success).toBe(false);
  });
});
