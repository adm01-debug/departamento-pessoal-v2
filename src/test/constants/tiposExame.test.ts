import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/tiposExame';
describe('tiposExame', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
