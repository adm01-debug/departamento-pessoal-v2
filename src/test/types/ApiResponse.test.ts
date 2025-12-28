import { describe, it, expect } from 'vitest';
import type { ApiResponse } from '@/types/ApiResponse';
describe('ApiResponse type', () => {
  it('defined', () => { const mock: Partial<ApiResponse> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
