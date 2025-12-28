import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/tiposRescisao';
describe('tiposRescisao', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
