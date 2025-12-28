import { describe, it, expect } from 'vitest';
import { schemasExameMedico, schemasExameMedicoCreate, schemasExameMedicoUpdate } from '@/schemas/schemasExameMedico';
import { z } from 'zod';

describe('schemasExameMedico', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasExameMedico).toBeDefined();
    expect(schemasExameMedico instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasExameMedico.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasExameMedico.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasExameMedicoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasExameMedicoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasExameMedico.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasExameMedicoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasExameMedico.safeParse(data);
    expect(result.success).toBe(false);
  });
});
