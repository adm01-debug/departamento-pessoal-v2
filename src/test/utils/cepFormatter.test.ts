import { describe, it, expect, vi } from 'vitest';
import { cepFormatter } from '@/utils/cepFormatter';

describe('cepFormatter', () => {
  it('should be defined', () => {
    expect(cepFormatter).toBeDefined();
  });

  it('should handle valid input', () => {
    const result = cepFormatter({ valor: 1000 });
    expect(result).toBeDefined();
  });

  it('should handle null input', () => {
    expect(() => cepFormatter(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => cepFormatter(undefined)).not.toThrow();
  });

  it('should return correct type', () => {
    const result = cepFormatter({ valor: 100 });
    expect(typeof result).toBe('object');
  });

  it('should handle edge cases', () => {
    const result = cepFormatter({ valor: 0 });
    expect(result).toBeDefined();
  });

  it('should handle negative values', () => {
    const result = cepFormatter({ valor: -100 });
    expect(result).toBeDefined();
  });

  it('should handle large values', () => {
    const result = cepFormatter({ valor: 999999999 });
    expect(result).toBeDefined();
  });
});
