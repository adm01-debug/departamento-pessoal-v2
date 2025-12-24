import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuditoriaIntegration } from '@/hooks/useAuditoriaIntegration';
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
          order: vi.fn(() => ({
            data: [
              { id: '1', integracao: 'esocial', status: 'sucesso', detalhes: {}, created_at: '2024-01-15T10:00:00Z' },
              { id: '2', integracao: 'contabilidade', status: 'erro', detalhes: { erro: 'timeout' }, created_at: '2024-01-16T11:00:00Z' },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
    })),
  },
}));

describe('useAuditoriaIntegration', () => {
  it('deve retornar logs de integração', async () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.logs).toBeDefined();
  });

  it('deve registrar evento de integração', () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    expect(result.current.registrarIntegracao).toBeDefined();
  });

  it('deve filtrar por sistema', () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorSistema).toBeDefined();
  });

  it('deve filtrar por status', () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorStatus).toBeDefined();
  });

  it('deve ter estatísticas', () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    expect(result.current.estatisticas).toBeDefined();
  });

  it('deve reprocessar falhas', () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper: createWrapper() });
    expect(result.current.reprocessarFalhas).toBeDefined();
  });
});
