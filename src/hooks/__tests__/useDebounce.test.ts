import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useDebounce, useDebouncedCallback, useThrottledCallback } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('useDebounce hook', () => {
    it('deve retornar o valor inicial imediatamente', () => {
      const { result } = renderHook(() => useDebounce('test', 300));
      expect(result.current).toBe('test');
    });

    it('deve atualizar o valor após o delay', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      );

      expect(result.current).toBe('initial');

      rerender({ value: 'updated' });
      expect(result.current).toBe('initial');

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('updated');
    });

    it('deve cancelar o timer anterior quando valor muda', async () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'first' } }
      );

      rerender({ value: 'second' });
      act(() => {
        vi.advanceTimersByTime(100);
      });

      rerender({ value: 'third' });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current).toBe('third');
    });

    it('deve usar delay padrão de 300ms', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value),
        { initialProps: { value: 'test' } }
      );

      rerender({ value: 'updated' });

      act(() => {
        vi.advanceTimersByTime(299);
      });
      expect(result.current).toBe('test');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current).toBe('updated');
    });
  });

  describe('useDebouncedCallback hook', () => {
    it('deve chamar callback após delay', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('arg1');
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledWith('arg1');
    });

    it('deve cancelar chamadas anteriores', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useDebouncedCallback(callback, 300));

      act(() => {
        result.current('first');
        result.current('second');
        result.current('third');
      });

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('third');
    });
  });

  describe('useThrottledCallback hook', () => {
    it('deve chamar callback imediatamente na primeira vez', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottledCallback(callback, 500));

      act(() => {
        result.current('arg1');
      });

      expect(callback).toHaveBeenCalledWith('arg1');
    });

    it('deve limitar chamadas dentro do período', () => {
      const callback = vi.fn();
      const { result } = renderHook(() => useThrottledCallback(callback, 500));

      act(() => {
        result.current('first');
        result.current('second');
        result.current('third');
      });

      expect(callback).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });
});
