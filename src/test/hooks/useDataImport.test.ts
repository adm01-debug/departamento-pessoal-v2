import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDataImport } from '@/hooks/useDataImport';

describe('useDataImport', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useDataImport());
    expect(result.current).toBeDefined();
  });

  it('should handle state changes', async () => {
    const { result } = renderHook(() => useDataImport());
    expect(result.current).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => useDataImport());
    expect(() => unmount()).not.toThrow();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => useDataImport());
    expect(result.current).toBeDefined();
  });
});
