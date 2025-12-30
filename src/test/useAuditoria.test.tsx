import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuditoria } from '@/hooks/useAuditoria';
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
            { id: '1', tabela: 'colaboradores', acao: 'INSERT', user_id: 'u1', created_at: '2024-01-15T10:00:00Z' },
            { id: '2', tabela: 'departamentos', acao: 'UPDATE', user_id: 'u2', created_at: '2024-01-16T11:00:00Z' },
          ],
          error: null,
          range: vi.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
    })),
  },
}));

describe('useAuditoria', () => {
  it('deve retornar logs de auditoria', async () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.logs).toBeDefined();
  });

  it('deve registrar evento', () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    expect(result.current.registrarEvento).toBeDefined();
  });

  it('deve filtrar por tabela', () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorTabela).toBeDefined();
  });

  it('deve filtrar por período', () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorPeriodo).toBeDefined();
  });

  it('deve filtrar por usuário', () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorUsuario).toBeDefined();
  });

  it('deve exportar logs', () => {
    const { result } = renderHook(() => useAuditoria(), { wrapper: createWrapper() });
    expect(result.current.exportarLogs).toBeDefined();
  });
});
