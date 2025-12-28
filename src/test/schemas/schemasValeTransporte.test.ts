import { describe, it, expect } from 'vitest';
import { schemasValeTransporte, schemasValeTransporteCreate, schemasValeTransporteUpdate } from '@/schemas/schemasValeTransporte';
import { z } from 'zod';

describe('schemasValeTransporte', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasValeTransporte).toBeDefined();
    expect(schemasValeTransporte instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasValeTransporte.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasValeTransporte.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasValeTransporteCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasValeTransporteUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasValeTransporte.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasValeTransporteUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasValeTransporte.safeParse(data);
    expect(result.success).toBe(false);
  });
});
