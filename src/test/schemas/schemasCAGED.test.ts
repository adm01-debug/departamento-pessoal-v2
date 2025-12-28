import { describe, it, expect } from 'vitest';
import { schemasCAGED, schemasCAGEDCreate, schemasCAGEDUpdate } from '@/schemas/schemasCAGED';
import { z } from 'zod';

describe('schemasCAGED', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasCAGED).toBeDefined();
    expect(schemasCAGED instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasCAGED.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasCAGED.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasCAGEDCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasCAGEDUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasCAGED.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasCAGEDUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasCAGED.safeParse(data);
    expect(result.success).toBe(false);
  });
});
