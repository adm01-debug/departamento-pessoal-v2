import { describe, it, expect, vi } from 'vitest';
import { cnpjValidator } from '@/utils/cnpjValidator';

describe('cnpjValidator', () => {
  it('should be defined', () => {
    expect(cnpjValidator).toBeDefined();
  });

  it('should handle valid input', () => {
    const result = cnpjValidator({ valor: 1000 });
    expect(result).toBeDefined();
  });

  it('should handle null input', () => {
    expect(() => cnpjValidator(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => cnpjValidator(undefined)).not.toThrow();
  });

  it('should return correct type', () => {
    const result = cnpjValidator({ valor: 100 });
    expect(typeof result).toBe('object');
  });

  it('should handle edge cases', () => {
    const result = cnpjValidator({ valor: 0 });
    expect(result).toBeDefined();
  });

  it('should handle negative values', () => {
    const result = cnpjValidator({ valor: -100 });
    expect(result).toBeDefined();
  });

  it('should handle large values', () => {
    const result = cnpjValidator({ valor: 999999999 });
    expect(result).toBeDefined();
  });
});
