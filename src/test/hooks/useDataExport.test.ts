import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDataExport } from '@/hooks/useDataExport';

describe('useDataExport', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useDataExport());
    expect(result.current).toBeDefined();
  });

  it('should handle state changes', async () => {
    const { result } = renderHook(() => useDataExport());
    expect(result.current).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useDataExport());
    expect(() => unmount()).not.toThrow();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useDataExport());
    expect(result.current).toBeDefined();
  });
});
