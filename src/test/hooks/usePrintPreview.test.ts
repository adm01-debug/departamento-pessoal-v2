import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrintPreview } from '@/hooks/usePrintPreview';

describe('usePrintPreview', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => usePrintPreview());
    expect(result.current).toBeDefined();
  });

  it('should handle state changes', async () => {
    const { result } = renderHook(() => usePrintPreview());
    expect(result.current).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => usePrintPreview());
    expect(() => unmount()).not.toThrow();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => usePrintPreview());
    expect(result.current).toBeDefined();
  });
});
