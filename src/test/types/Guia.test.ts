import { describe, it, expect } from 'vitest';
import type { Guia } from '@/types/Guia';
describe('Guia type', () => {
  it('defined', () => { const mock: Partial<Guia> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
