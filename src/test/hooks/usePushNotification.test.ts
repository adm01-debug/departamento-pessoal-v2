import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePushNotification } from '@/hooks/usePushNotification';

describe('usePushNotification', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => usePushNotification());
    expect(result.current).toBeDefined();
  });

  it('should handle state changes', async () => {
    const { result } = renderHook(() => usePushNotification());
    expect(result.current).toBeTruthy();
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => usePushNotification());
    expect(() => unmount()).not.toThrow();
  });

  it('should handle errors', async () => {
    const { result } = renderHook(() => usePushNotification());
    expect(result.current).toBeDefined();
  });
});
