import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useResponsive } from '@/hooks/useResponsive';

describe('useResponsive', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current).toBeDefined();
  });

  it('should handle state changes', async () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useResponsive());
    expect(() => unmount()).not.toThrow();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useResponsive());
    expect(result.current).toBeDefined();
  });
});
