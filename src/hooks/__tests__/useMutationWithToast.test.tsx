import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutationWithToast } from '../useMutationWithToast';
import { toast } from 'sonner';
import React from 'react';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMutationWithToast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show success toast on successful mutation', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: 'success' });
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { successMessage: 'Sucesso!' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutateAsync({});
    });

    expect(toast.success).toHaveBeenCalledWith('Sucesso!');
  });

  it('should show error toast on failed mutation', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Erro'));
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { errorMessage: 'Erro!' }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync({});
      } catch {}
    });

    expect(toast.error).toHaveBeenCalledWith('Erro!');
  });

  it('should invalidate queries on success', async () => {
    const mockFn = jest.fn().mockResolvedValue({ data: 'success' });
    const { result } = renderHook(
      () => useMutationWithToast(mockFn, { invalidateKeys: ['test-key'] }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutateAsync({});
    });

    expect(mockFn).toHaveBeenCalled();
  });
});
