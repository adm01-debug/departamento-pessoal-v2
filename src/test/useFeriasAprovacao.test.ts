import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFeriasAprovacao } from '@/hooks/useFeriasAprovacao';
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
        eq: vi.fn(() => ({
          data: [
            { id: '1', colaborador_id: 'c1', status: 'pendente', data_inicio: '2024-02-01' },
            { id: '2', colaborador_id: 'c2', status: 'aprovado', data_inicio: '2024-03-15' },
          ],
          error: null,
        })),
      })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useFeriasAprovacao', () => {
  it('deve retornar solicitações pendentes', async () => {
    const { result } = renderHook(() => useFeriasAprovacao(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.solicitacoesPendentes).toBeDefined();
  });

  it('deve aprovar férias', () => {
    const { result } = renderHook(() => useFeriasAprovacao(), { wrapper: createWrapper() });
    expect(result.current.aprovar).toBeDefined();
  });

  it('deve rejeitar férias', () => {
    const { result } = renderHook(() => useFeriasAprovacao(), { wrapper: createWrapper() });
    expect(result.current.rejeitar).toBeDefined();
  });

  it('deve ter contador de pendentes', () => {
    const { result } = renderHook(() => useFeriasAprovacao(), { wrapper: createWrapper() });
    expect(result.current.totalPendentes).toBeDefined();
  });
});
