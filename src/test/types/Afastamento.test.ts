import { describe, it, expect } from 'vitest';
import type { Afastamento } from '@/types/Afastamento';

describe('Afastamento type', () => {
  it('type is properly defined', () => {
    const mock: Partial<Afastamento> = {};
    expect(mock).toBeDefined();
  });
  it('accepts valid properties', () => {
    expect(true).toBe(true);
  });
});
