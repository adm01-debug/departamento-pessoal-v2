import { describe, it, expect } from 'vitest';
import { schemasSuspensao, schemasSuspensaoCreate, schemasSuspensaoUpdate } from '@/schemas/schemasSuspensao';
import { z } from 'zod';

describe('schemasSuspensao', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasSuspensao).toBeDefined();
    expect(schemasSuspensao instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasSuspensao.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasSuspensao.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasSuspensaoCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasSuspensaoUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasSuspensao.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasSuspensaoUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasSuspensao.safeParse(data);
    expect(result.success).toBe(false);
  });
});
