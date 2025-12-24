import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 500));
    expect(result.current).toBe('inicial');
  });

  it('deve fazer debounce do valor após o delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'inicial', delay: 500 } }
    );

    expect(result.current).toBe('inicial');

    rerender({ value: 'atualizado', delay: 500 });
    expect(result.current).toBe('inicial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('atualizado');
  });

  it('deve cancelar timer anterior quando valor muda rapidamente', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'v1', delay: 500 } }
    );

    rerender({ value: 'v2', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ value: 'v3', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('v3');
  });

  it('deve funcionar com diferentes tipos de valores', () => {
    const { result: numberResult } = renderHook(() => useDebounce(42, 100));
    expect(numberResult.current).toBe(42);

    const obj = { name: 'teste' };
    const { result: objectResult } = renderHook(() => useDebounce(obj, 100));
    expect(objectResult.current).toBe(obj);
  });
});
