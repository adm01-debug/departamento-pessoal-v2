import { describe, it, expect, vi } from 'vitest';
import { cepValidator } from '@/utils/cepValidator';

describe('cepValidator', () => {
  it('should be defined', () => {
    expect(cepValidator).toBeDefined();
  });

  it('should handle valid input', () => {
    const result = cepValidator({ valor: 1000 });
    expect(result).toBeDefined();
  });

  it('should handle null input', () => {
    expect(() => cepValidator(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => cepValidator(undefined)).not.toThrow();
  });

  it('should return correct type', () => {
    const result = cepValidator({ valor: 100 });
    expect(typeof result).toBe('object');
  });

  it('should handle edge cases', () => {
    const result = cepValidator({ valor: 0 });
    expect(result).toBeDefined();
  });

  it('should handle negative values', () => {
    const result = cepValidator({ valor: -100 });
    expect(result).toBeDefined();
  });

  it('should handle large values', () => {
    const result = cepValidator({ valor: 999999999 });
    expect(result).toBeDefined();
  });
});
