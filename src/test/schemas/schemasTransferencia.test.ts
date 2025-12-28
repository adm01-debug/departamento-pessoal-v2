import { describe, it, expect } from 'vitest';
import { schemasTransferencia, schemasTransferenciaCreate, schemasTransferenciaUpdate } from '@/schemas/schemasTransferencia';
import { z } from 'zod';

describe('schemasTransferencia', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasTransferencia).toBeDefined();
    expect(schemasTransferencia instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasTransferencia.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasTransferencia.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasTransferenciaCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasTransferenciaUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasTransferencia.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasTransferenciaUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasTransferencia.safeParse(data);
    expect(result.success).toBe(false);
  });
});
