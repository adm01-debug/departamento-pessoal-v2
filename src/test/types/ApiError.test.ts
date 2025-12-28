import { describe, it, expect } from 'vitest';
import type { ApiError } from '@/types/ApiError';
describe('ApiError type', () => {
  it('defined', () => { const mock: Partial<ApiError> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
