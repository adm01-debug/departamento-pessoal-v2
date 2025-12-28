import { describe, it, expect } from 'vitest';
import * as constants from '@/constants/estadosCivis';
describe('estadosCivis', () => {
  it('defined', () => { expect(constants).toBeDefined(); });
  it('values', () => { expect(Object.keys(constants).length).toBeGreaterThan(0); });
});
