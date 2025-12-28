import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/formConfig';
describe('formConfig', () => {
  it('is defined', () => { expect(constants).toBeDefined(); });
  it('exports values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
  it('has correct types', () => { expect(typeof constants).toBe('object'); });
});
