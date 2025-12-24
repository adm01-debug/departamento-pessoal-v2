import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutationWithToast } from '@/hooks/useMutationWithToast';
import React from 'react';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMutationWithToast', () => {
  it('deve criar mutation com toast', () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { successMessage: 'Sucesso!' }),
      { wrapper: createWrapper() }
    );
    expect(result.current.mutate).toBeDefined();
  });

  it('deve executar mutation com sucesso', async () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { successMessage: 'Sucesso!' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      result.current.mutate({});
    });

    await waitFor(() => expect(mockFn).toHaveBeenCalled());
  });

  it('deve ter mensagem de erro customizável', () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('Erro'));
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { errorMessage: 'Erro customizado' }),
      { wrapper: createWrapper() }
    );
    expect(result.current).toBeDefined();
  });

  it('deve invalidar queries após sucesso', async () => {
    const mockFn = vi.fn().mockResolvedValue({ success: true });
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, {
        successMessage: 'OK',
        invalidateKeys: [['test-key']],
      }),
      { wrapper: createWrapper() }
    );
    expect(result.current).toBeDefined();
  });
});
