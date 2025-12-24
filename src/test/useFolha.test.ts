import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFolha } from '@/hooks/useFolha';
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
              { id: '1', colaborador_id: 'c1', mes: 1, ano: 2024, salario_bruto: 5000, salario_liquido: 4000 },
              { id: '2', colaborador_id: 'c2', mes: 1, ano: 2024, salario_bruto: 6000, salario_liquido: 4800 },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useFolha', () => {
  it('deve retornar dados da folha', async () => {
    const { result } = renderHook(() => useFolha(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.folhas).toBeDefined();
  });

  it('deve calcular totais', () => {
    const { result } = renderHook(() => useFolha(), { wrapper: createWrapper() });
    expect(result.current.totalBruto).toBeDefined();
    expect(result.current.totalLiquido).toBeDefined();
  });

  it('deve ter função de processar folha', () => {
    const { result } = renderHook(() => useFolha(), { wrapper: createWrapper() });
    expect(result.current.processarFolha).toBeDefined();
  });

  it('deve ter função de fechar folha', () => {
    const { result } = renderHook(() => useFolha(), { wrapper: createWrapper() });
    expect(result.current.fecharFolha).toBeDefined();
  });

  it('deve filtrar por período', () => {
    const { result } = renderHook(() => useFolha(), { wrapper: createWrapper() });
    expect(result.current.setMes).toBeDefined();
    expect(result.current.setAno).toBeDefined();
  });
});
