import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('deve retornar false para desktop', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('deve retornar true para mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('deve atualizar quando media query mudar', () => {
    let changeCallback: ((e: MediaQueryListEvent) => void) | null = null;
    
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event, cb) => {
        if (event === 'change') changeCallback = cb;
      }),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('deve fazer cleanup do event listener', () => {
    const removeEventListener = vi.fn();
    
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener,
    }));

    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    
    expect(removeEventListener).toHaveBeenCalled();
  });
});
