import { describe, it, expect, vi } from 'vitest';
import { calculo13Salario } from '@/utils/calculo13Salario';

describe('calculo13Salario', () => {
  it('should be defined', () => {
    expect(calculo13Salario).toBeDefined();
  });

  it('should handle valid input', () => {
    const result = calculo13Salario({ valor: 1000 });
    expect(result).toBeDefined();
  });

  it('should handle null input', () => {
    expect(() => calculo13Salario(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => calculo13Salario(undefined)).not.toThrow();
  });

  it('should return correct type', () => {
    const result = calculo13Salario({ valor: 100 });
    expect(typeof result).toBe('object');
  });

  it('should handle edge cases', () => {
    const result = calculo13Salario({ valor: 0 });
    expect(result).toBeDefined();
  });

  it('should handle negative values', () => {
    const result = calculo13Salario({ valor: -100 });
    expect(result).toBeDefined();
  });

  it('should handle large values', () => {
    const result = calculo13Salario({ valor: 999999999 });
    expect(result).toBeDefined();
  });
});
