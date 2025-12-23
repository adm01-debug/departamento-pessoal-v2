import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScrollPosition } from '../useScrollPosition';

describe('useScrollPosition', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollX', { writable: true, value: 0 });
    Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
  });

  it('deve retornar posição inicial de scroll', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('deve atualizar quando scroll muda', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, 'scrollX', { writable: true, value: 100 });
      Object.defineProperty(window, 'scrollY', { writable: true, value: 200 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.x).toBe(100);
    expect(result.current.y).toBe(200);
  });
});
