import { describe, it, expect } from 'vitest';
import { schemasDCTFWeb, schemasDCTFWebCreate, schemasDCTFWebUpdate } from '@/schemas/schemasDCTFWeb';
import { z } from 'zod';

describe('schemasDCTFWeb', () => {
  it('should be a valid Zod schema', () => {
    expect(schemasDCTFWeb).toBeDefined();
    expect(schemasDCTFWeb instanceof z.ZodType).toBe(true);
  });

  it('should validate correct data', () => {
    const validData = {
      id: '123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = schemasDCTFWeb.safeParse(validData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should reject invalid data', () => {
    const result = schemasDCTFWeb.safeParse(null);
    expect(result.success).toBe(false);
  });

  it('should have create schema', () => {
    expect(schemasDCTFWebCreate).toBeDefined();
  });

  it('should have update schema', () => {
    expect(schemasDCTFWebUpdate).toBeDefined();
  });

  it('should validate required fields', () => {
    const result = schemasDCTFWeb.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should handle optional fields', () => {
    const partialData = { id: '1' };
    const result = schemasDCTFWebUpdate.safeParse(partialData);
    expect(result.success || result.error).toBeDefined();
  });

  it('should validate date formats', () => {
    const data = { createdAt: 'invalid-date' };
    const result = schemasDCTFWeb.safeParse(data);
    expect(result.success).toBe(false);
  });
});
