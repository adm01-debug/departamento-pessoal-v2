import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrevious } from '@/hooks/usePrevious';

describe('usePrevious', () => {
  it('deve retornar undefined na primeira renderização', () => {
    const { result } = renderHook(() => usePrevious('valor1'));
    expect(result.current).toBeUndefined();
  });

  it('deve retornar o valor anterior após re-render', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 'valor1' } }
    );

    expect(result.current).toBeUndefined();

    rerender({ value: 'valor2' });
    expect(result.current).toBe('valor1');

    rerender({ value: 'valor3' });
    expect(result.current).toBe('valor2');
  });

  it('deve funcionar com diferentes tipos', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: 1 } }
    );

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it('deve funcionar com objetos', () => {
    const obj1 = { name: 'teste1' };
    const obj2 = { name: 'teste2' };
    
    const { result, rerender } = renderHook(
      ({ value }) => usePrevious(value),
      { initialProps: { value: obj1 } }
    );

    rerender({ value: obj2 });
    expect(result.current).toBe(obj1);
  });
});
