import { describe, it, expect, vi } from 'vitest';
import { calculoProvisaoFerias } from '@/utils/calculoProvisaoFerias';

describe('calculoProvisaoFerias', () => {
  it('should be defined', () => {
    expect(calculoProvisaoFerias).toBeDefined();
  });

  it('should handle valid input', () => {
    const result = calculoProvisaoFerias({ valor: 1000 });
    expect(result).toBeDefined();
  });

  it('should handle null input', () => {
    expect(() => calculoProvisaoFerias(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => calculoProvisaoFerias(undefined)).not.toThrow();
  });

  it('should return correct type', () => {
    const result = calculoProvisaoFerias({ valor: 100 });
    expect(typeof result).toBe('object');
  });

  it('should handle edge cases', () => {
    const result = calculoProvisaoFerias({ valor: 0 });
    expect(result).toBeDefined();
  });

  it('should handle negative values', () => {
    const result = calculoProvisaoFerias({ valor: -100 });
    expect(result).toBeDefined();
  });

  it('should handle large values', () => {
    const result = calculoProvisaoFerias({ valor: 999999999 });
    expect(result).toBeDefined();
  });
});
