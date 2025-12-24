import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollPosition } from '@/hooks/useScrollPosition';

describe('useScrollPosition', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
  });

  it('deve retornar a posição inicial do scroll', () => {
    const { result } = renderHook(() => useScrollPosition());
    expect(result.current.x).toBe(0);
    expect(result.current.y).toBe(0);
  });

  it('deve atualizar quando o scroll muda', () => {
    const { result } = renderHook(() => useScrollPosition());

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      Object.defineProperty(window, 'scrollX', { value: 50, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.y).toBe(100);
    expect(result.current.x).toBe(50);
  });

  it('deve fazer cleanup do event listener', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollPosition());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});
