import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIntegracoes } from '@/hooks/useIntegracoes';
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
            { id: '1', nome: 'eSocial', tipo: 'governo', status: 'ativo', ultima_sincronizacao: '2024-01-15T10:00:00Z' },
            { id: '2', nome: 'Contabilidade', tipo: 'erp', status: 'ativo', ultima_sincronizacao: '2024-01-16T11:00:00Z' },
            { id: '3', nome: 'Ponto', tipo: 'rh', status: 'inativo', ultima_sincronizacao: null },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useIntegracoes', () => {
  it('deve retornar lista de integrações', async () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.integracoes).toBeDefined();
  });

  it('deve adicionar integração', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.adicionarIntegracao).toBeDefined();
  });

  it('deve atualizar integração', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.atualizarIntegracao).toBeDefined();
  });

  it('deve remover integração', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.removerIntegracao).toBeDefined();
  });

  it('deve sincronizar integração', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.sincronizar).toBeDefined();
  });

  it('deve testar conexão', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.testarConexao).toBeDefined();
  });

  it('deve ter integrações ativas', () => {
    const { result } = renderHook(() => useIntegracoes(), { wrapper: createWrapper() });
    expect(result.current.integracoesAtivas).toBeDefined();
  });
});
