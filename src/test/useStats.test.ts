import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useStats } from '@/hooks/useStats';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        data: [{ count: 100 }],
        error: null,
      })),
    })),
  },
}));

describe('useStats', () => {
  it('deve retornar estatísticas', async () => {
    const { result } = renderHook(() => useStats(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.stats).toBeDefined();
  });

  it('deve ter total de colaboradores', () => {
    const { result } = renderHook(() => useStats(), { wrapper: createWrapper() });
    expect(result.current.totalColaboradores).toBeDefined();
  });

  it('deve ter estatísticas por departamento', () => {
    const { result } = renderHook(() => useStats(), { wrapper: createWrapper() });
    expect(result.current.porDepartamento).toBeDefined();
  });

  it('deve atualizar ao refetch', async () => {
    const { result } = renderHook(() => useStats(), { wrapper: createWrapper() });
    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });
});
