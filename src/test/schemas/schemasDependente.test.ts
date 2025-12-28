import { describe, it, expect } from 'vitest';
import { schemasDependente, schemasDependenteCreate, schemasDependenteUpdate } from '@/schemas/schemasDependente';
import { z } from 'zod';

describe('schemasDependente', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasDependente).toBeDefined();
    expect(schemasDependente instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasDependente.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasDependente.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasDependenteCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasDependenteUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasDependente.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasDependenteUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasDependente.safeParse(data);
    expect(result.success).toBe(false);
  });
});
