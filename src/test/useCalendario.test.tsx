import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCalendario } from '@/hooks/useCalendario';
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
        gte: vi.fn(() => ({
          lte: vi.fn(() => ({
            data: [
              { id: '1', tipo: 'ferias', data_inicio: '2024-01-15', data_fim: '2024-01-30' },
              { id: '2', tipo: 'afastamento', data_inicio: '2024-02-01', data_fim: '2024-02-05' },
            ],
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('useCalendario', () => {
  it('deve retornar eventos do calendário', async () => {
    const { result } = renderHook(() => useCalendario(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.eventos).toBeDefined();
  });

  it('deve ter função para filtrar por mês', () => {
    const { result } = renderHook(() => useCalendario(), { wrapper: createWrapper() });
    expect(result.current.setMes).toBeDefined();
  });

  it('deve ter função para filtrar por ano', () => {
    const { result } = renderHook(() => useCalendario(), { wrapper: createWrapper() });
    expect(result.current.setAno).toBeDefined();
  });

  it('deve ter eventos de férias e afastamentos', async () => {
    const { result } = renderHook(() => useCalendario(), { wrapper: createWrapper() });
    expect(result.current.eventosPorTipo).toBeDefined();
  });
});
