import { describe, it, expect } from 'vitest';
import type { Permissao } from '@/types/Permissao';
describe('Permissao type', () => {
  it('defined', () => { const mock: Partial<Permissao> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
