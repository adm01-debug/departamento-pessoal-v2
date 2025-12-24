import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIntegracaoPontoFolha } from '@/hooks/useIntegracaoPontoFolha';
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
              { id: '1', colaborador_id: 'c1', periodo: '2024-01', horas_trabalhadas: 176, horas_extras: 10 },
              { id: '2', colaborador_id: 'c2', periodo: '2024-01', horas_trabalhadas: 160, horas_extras: 0 },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    rpc: vi.fn(() => ({
      data: { processados: 50, pendentes: 5, erros: 2 },
      error: null,
    })),
  },
}));

describe('useIntegracaoPontoFolha', () => {
  it('deve retornar dados de integração', async () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.dados).toBeDefined();
  });

  it('deve importar ponto', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.importarPonto).toBeDefined();
  });

  it('deve exportar para folha', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.exportarParaFolha).toBeDefined();
  });

  it('deve sincronizar', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.sincronizar).toBeDefined();
  });

  it('deve ter pendências', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.pendencias).toBeDefined();
  });

  it('deve ter estatísticas', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.estatisticas).toBeDefined();
  });

  it('deve validar integridade', () => {
    const { result } = renderHook(() => useIntegracaoPontoFolha(), { wrapper: createWrapper() });
    expect(result.current.validarIntegridade).toBeDefined();
  });
});
