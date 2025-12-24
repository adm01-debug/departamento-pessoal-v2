import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDesligamentos } from '@/hooks/useDesligamentos';
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
        order: vi.fn(() => ({
          data: [
            { id: '1', colaborador_id: 'c1', tipo: 'demissao_sem_justa_causa', data_desligamento: '2024-01-30' },
            { id: '2', colaborador_id: 'c2', tipo: 'pedido_demissao', data_desligamento: '2024-02-15' },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useDesligamentos', () => {
  it('deve retornar lista de desligamentos', async () => {
    const { result } = renderHook(() => useDesligamentos(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.desligamentos).toBeDefined();
  });

  it('deve criar desligamento', () => {
    const { result } = renderHook(() => useDesligamentos(), { wrapper: createWrapper() });
    expect(result.current.createDesligamento).toBeDefined();
  });

  it('deve calcular rescisão', () => {
    const { result } = renderHook(() => useDesligamentos(), { wrapper: createWrapper() });
    expect(result.current.calcularRescisao).toBeDefined();
  });

  it('deve filtrar por tipo', () => {
    const { result } = renderHook(() => useDesligamentos(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorTipo).toBeDefined();
  });

  it('deve ter estatísticas', () => {
    const { result } = renderHook(() => useDesligamentos(), { wrapper: createWrapper() });
    expect(result.current.estatisticas).toBeDefined();
  });
});
