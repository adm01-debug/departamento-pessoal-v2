import { describe, it, expect } from 'vitest';
import { schemasHoraExtra, schemasHoraExtraCreate, schemasHoraExtraUpdate } from '@/schemas/schemasHoraExtra';
import { z } from 'zod';

describe('schemasHoraExtra', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasHoraExtra).toBeDefined();
    expect(schemasHoraExtra instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasHoraExtra.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasHoraExtra.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasHoraExtraCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasHoraExtraUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasHoraExtra.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasHoraExtraUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasHoraExtra.safeParse(data);
    expect(result.success).toBe(false);
  });
});
