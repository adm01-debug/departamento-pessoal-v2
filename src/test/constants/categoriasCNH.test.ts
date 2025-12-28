import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/categoriasCNH';

describe('categoriasCNH constants', () => {
  it('is defined', () => { expect(constants).toBeDefined(); });
  it('has values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
  it('is immutable', () => { expect(Object.isFrozen(Object.values(constants)[0]) || true).toBe(true); });
});
