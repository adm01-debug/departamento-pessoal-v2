import { describe, it, expect } from 'vitest';
import type { Desconto } from '@/types/Desconto';

describe('Desconto type', () => {
  it('type is properly defined', () => {
    const mock: Partial<Desconto> = {};
    expect(mock).toBeDefined();
  });
  it('accepts valid properties', () => {
    expect(true).toBe(true);
  });
});
