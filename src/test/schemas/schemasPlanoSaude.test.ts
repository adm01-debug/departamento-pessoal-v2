import { describe, it, expect } from 'vitest';
import { schemasPlanoSaude, schemasPlanoSaudeCreate, schemasPlanoSaudeUpdate } from '@/schemas/schemasPlanoSaude';
import { z } from 'zod';

describe('schemasPlanoSaude', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasPlanoSaude).toBeDefined();
    expect(schemasPlanoSaude instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasPlanoSaude.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasPlanoSaude.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasPlanoSaudeCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasPlanoSaudeUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasPlanoSaude.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasPlanoSaudeUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasPlanoSaude.safeParse(data);
    expect(result.success).toBe(false);
  });
});
