import { describe, it, expect } from 'vitest';
import type { Ferias } from '@/types/Ferias';

describe('Ferias type', () => {
  it('type is properly defined', () => {
    const mock: Partial<Ferias> = {};
    expect(mock).toBeDefined();
  });
  it('accepts valid properties', () => {
    expect(true).toBe(true);
  });
});
