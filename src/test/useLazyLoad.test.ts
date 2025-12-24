import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLazyLoad } from '@/hooks/useLazyLoad';

describe('useLazyLoad', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  it('deve retornar ref e estado de visibilidade', () => {
    const { result } = renderHook(() => useLazyLoad());
    expect(result.current.ref).toBeDefined();
    expect(result.current.isVisible).toBeDefined();
  });

  it('deve iniciar como não visível', () => {
    const { result } = renderHook(() => useLazyLoad());
    expect(result.current.isVisible).toBe(false);
  });

  it('deve ter opções configuráveis', () => {
    const { result } = renderHook(() => useLazyLoad({
      threshold: 0.5,
      rootMargin: '100px',
    }));
    expect(result.current).toBeDefined();
  });

  it('deve aceitar callback onVisible', () => {
    const onVisible = vi.fn();
    const { result } = renderHook(() => useLazyLoad({ onVisible }));
    expect(result.current).toBeDefined();
  });
});
