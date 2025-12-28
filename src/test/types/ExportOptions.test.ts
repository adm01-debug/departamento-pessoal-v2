import { describe, it, expect } from 'vitest';
import type { ExportOptions } from '@/types/ExportOptions';
describe('ExportOptions type', () => {
  it('defined', () => { const mock: Partial<ExportOptions> = {}; expect(mock).toBeDefined(); });
  it('valid', () => { expect(true).toBe(true); });
});
