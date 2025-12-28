import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/tiposDependente';
describe('tiposDependente', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
