import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/calculationRules';
describe('calculationRules', () => {
  it('is defined', () => { expect(constants).toBeDefined(); });
  it('exports', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
