import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyPress } from '@/hooks/useKeyPress';

describe('useKeyPress', () => {
  it('deve retornar true quando a tecla é pressionada', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });

    expect(result.current).toBe(true);
  });

  it('deve retornar false quando a tecla é solta', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    });
    expect(result.current).toBe(false);
  });

  it('deve ignorar teclas diferentes', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(result.current).toBe(false);
  });

  it('deve fazer cleanup dos event listeners', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useKeyPress('Enter'));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
  });
});
