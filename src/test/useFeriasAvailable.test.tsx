import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFeriasAvailable } from '@/hooks/useFeriasAvailable';
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
          single: vi.fn(() => ({
            data: {
              id: 'c1',
              data_admissao: '2022-01-15',
              dias_ferias_disponiveis: 30,
              periodo_aquisitivo_inicio: '2024-01-15',
              periodo_aquisitivo_fim: '2025-01-14',
            },
            error: null,
          })),
        })),
      })),
    })),
    rpc: vi.fn(() => ({
      data: { dias_disponiveis: 30, dias_usados: 0, dias_pendentes: 30 },
      error: null,
    })),
  },
}));

describe('useFeriasAvailable', () => {
  it('deve retornar dias disponíveis', async () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.diasDisponiveis).toBeDefined();
  });

  it('deve calcular período aquisitivo', () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    expect(result.current.periodoAquisitivo).toBeDefined();
  });

  it('deve ter dias já usados', () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    expect(result.current.diasUsados).toBeDefined();
  });

  it('deve verificar elegibilidade', () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    expect(result.current.isElegivel).toBeDefined();
  });

  it('deve ter data limite para gozo', () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    expect(result.current.dataLimiteGozo).toBeDefined();
  });

  it('deve simular férias', () => {
    const { result } = renderHook(() => useFeriasAvailable('c1'), { wrapper: createWrapper() });
    expect(result.current.simularFerias).toBeDefined();
  });
});
