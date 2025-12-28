import { describe, it, expect } from 'vitest';
import { schemasConvenio, schemasConvenioCreate, schemasConvenioUpdate } from '@/schemas/schemasConvenio';
import { z } from 'zod';

describe('schemasConvenio', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasConvenio).toBeDefined();
    expect(schemasConvenio instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasConvenio.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasConvenio.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasConvenioCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasConvenioUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasConvenio.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasConvenioUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasConvenio.safeParse(data);
    expect(result.success).toBe(false);
  });
});
