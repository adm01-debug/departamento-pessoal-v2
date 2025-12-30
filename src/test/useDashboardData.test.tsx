import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardData } from '@/hooks/useDashboardData';
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
        data: [
          { id: '1', nome: 'João', departamento: 'TI', status: 'ativo' },
          { id: '2', nome: 'Maria', departamento: 'RH', status: 'ativo' },
        ],
        error: null,
        count: 10,
      })),
    })),
    rpc: vi.fn(() => ({
      data: { total: 100, ativos: 95, inativos: 5 },
      error: null,
    })),
  },
}));

describe('useDashboardData', () => {
  it('deve retornar dados do dashboard', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
  });

  it('deve ter total de colaboradores', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.totalColaboradores).toBeDefined();
  });

  it('deve ter colaboradores por departamento', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.porDepartamento).toBeDefined();
  });

  it('deve ter admissões recentes', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.admissoesRecentes).toBeDefined();
  });

  it('deve ter desligamentos recentes', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.desligamentosRecentes).toBeDefined();
  });

  it('deve ter indicadores', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.indicadores).toBeDefined();
  });

  it('deve ter função refetch', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper: createWrapper() });
    expect(result.current.refetch).toBeDefined();
  });
});
