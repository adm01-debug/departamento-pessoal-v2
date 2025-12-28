import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/tiposLogradouro';
describe('tiposLogradouro', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
