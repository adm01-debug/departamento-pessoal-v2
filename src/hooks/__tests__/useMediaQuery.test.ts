import { renderHook, act } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';

describe('useMediaQuery', () => {
  const mockMatchMedia = (matches: boolean) => {
    const listeners: Array<(e: { matches: boolean }) => void> = [];
    return jest.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn((cb) => listeners.push(cb)),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_, cb) => listeners.push(cb)),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      _listeners: listeners,
    }));
  };

  it('deve retornar true quando media query corresponde', () => {
    window.matchMedia = mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('deve retornar false quando media query não corresponde', () => {
    window.matchMedia = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });
});
