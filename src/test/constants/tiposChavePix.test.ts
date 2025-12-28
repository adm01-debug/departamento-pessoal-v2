import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/tiposChavePix';
describe('tiposChavePix', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
