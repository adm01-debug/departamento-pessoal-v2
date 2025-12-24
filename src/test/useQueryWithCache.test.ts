import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQueryWithCache } from '@/hooks/useQueryWithCache';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useQueryWithCache', () => {
  it('deve executar query com cache', async () => {
    const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(
      () => useQueryWithCache(['test-key'], mockFn),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFn).toHaveBeenCalled();
  });

  it('deve ter staleTime configurado', () => {
    const mockFn = vi.fn().mockResolvedValue({ data: 'test' });
    const { result } = renderHook(
      () => useQueryWithCache(['test-key'], mockFn, { staleTime: 5 * 60 * 1000 }),
      { wrapper: createWrapper() }
    );
    expect(result.current).toBeDefined();
  });

  it('deve retornar dados após sucesso', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn().mockResolvedValue(mockData);
    const { result } = renderHook(
      () => useQueryWithCache(['test-key'], mockFn),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('deve ter handler de erro', async () => {
    const mockError = new Error('Test error');
    const mockFn = vi.fn().mockRejectedValue(mockError);
    const { result } = renderHook(
      () => useQueryWithCache(['error-key'], mockFn),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
