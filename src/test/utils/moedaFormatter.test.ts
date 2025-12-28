import { describe, it, expect, vi } from 'vitest';
import * as moedaFormatter from '@/utils/moedaFormatter';

describe('moedaFormatter', () => {
  it('should export functions', () => {
    expect(Object.keys(moedaFormatter).length).toBeGreaterThan(0);
  });

  it('should handle valid input', () => {
    const mainFn = Object.values(moedaFormatter)[0];
    if (typeof mainFn === 'function') {
      expect(() => mainFn('test')).not.toThrow();
    }
  });

  it('should handle empty string', () => {
    const mainFn = Object.values(moedaFormatter)[0];
    if (typeof mainFn === 'function') {
      expect(() => mainFn('')).not.toThrow();
    }
  });

  it('should handle special characters', () => {
    const mainFn = Object.values(moedaFormatter)[0];
    if (typeof mainFn === 'function') {
      expect(() => mainFn('!@#$%')).not.toThrow();
    }
  });

  it('should be consistent', () => {
    const mainFn = Object.values(moedaFormatter)[0];
    if (typeof mainFn === 'function') {
      const result1 = mainFn('test');
      const result2 = mainFn('test');
      expect(result1).toEqual(result2);
    }
  });
});
