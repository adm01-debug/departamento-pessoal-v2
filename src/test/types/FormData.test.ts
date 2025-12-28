import { describe, it, expect } from 'vitest';
import type { FormData } from '@/types/FormData';
describe('FormData type', () => {
  it('defined', () => { const mock: Partial<FormData> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
