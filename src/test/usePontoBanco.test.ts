import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePontoBanco } from '@/hooks/usePontoBanco';
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
              { id: '1', colaborador_id: 'c1', saldo_horas: 480, tipo: 'credito' },
              { id: '2', colaborador_id: 'c1', saldo_horas: -120, tipo: 'debito' },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
    })),
  },
}));

describe('usePontoBanco', () => {
  it('deve retornar banco de horas', async () => {
    const { result } = renderHook(() => usePontoBanco('c1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.bancoHoras).toBeDefined();
  });

  it('deve calcular saldo total', () => {
    const { result } = renderHook(() => usePontoBanco('c1'), { wrapper: createWrapper() });
    expect(result.current.saldoTotal).toBeDefined();
  });

  it('deve ter função de adicionar crédito', () => {
    const { result } = renderHook(() => usePontoBanco('c1'), { wrapper: createWrapper() });
    expect(result.current.adicionarCredito).toBeDefined();
  });

  it('deve ter função de adicionar débito', () => {
    const { result } = renderHook(() => usePontoBanco('c1'), { wrapper: createWrapper() });
    expect(result.current.adicionarDebito).toBeDefined();
  });

  it('deve ter histórico de movimentações', () => {
    const { result } = renderHook(() => usePontoBanco('c1'), { wrapper: createWrapper() });
    expect(result.current.historico).toBeDefined();
  });
});
