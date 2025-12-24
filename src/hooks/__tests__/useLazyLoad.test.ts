import { renderHook, act, waitFor } from '@testing-library/react';
import { useLazyLoad } from '../useLazyLoad';

describe('useLazyLoad', () => {
  const mockIntersectionObserver = jest.fn();

  beforeEach(() => {
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: () => callback([{ isIntersecting: true }]),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('should initialize with isVisible false', () => {
    mockIntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
    
    const { result } = renderHook(() => useLazyLoad());
    expect(result.current.isVisible).toBe(false);
  });

  it('should set isVisible true when element is in viewport', async () => {
    const { result } = renderHook(() => useLazyLoad());
    
    await waitFor(() => {
      expect(result.current.isVisible).toBe(true);
    });
  });

  it('should cleanup observer on unmount', () => {
    const disconnect = jest.fn();
    mockIntersectionObserver.mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect,
    }));
    
    const { unmount } = renderHook(() => useLazyLoad());
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('should return ref for element attachment', () => {
    const { result } = renderHook(() => useLazyLoad());
    expect(result.current.ref).toBeDefined();
  });
});
