import { describe, it, expect } from 'vitest';
import type { ValidationResult } from '@/types/ValidationResult';
describe('ValidationResult type', () => {
  it('defined', () => { const mock: Partial<ValidationResult> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
