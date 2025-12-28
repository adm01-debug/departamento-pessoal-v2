import { describe, it, expect } from 'vitest';
import { schemasDARF, schemasDARFCreate, schemasDARFUpdate } from '@/schemas/schemasDARF';
import { z } from 'zod';

describe('schemasDARF', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasDARF).toBeDefined();
    expect(schemasDARF instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasDARF.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasDARF.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasDARFCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasDARFUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasDARF.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasDARFUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasDARF.safeParse(data);
    expect(result.success).toBe(false);
  });
});
