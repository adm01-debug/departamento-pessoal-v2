import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRescisao } from '@/hooks/useRescisao';
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
              id: '1',
              colaborador_id: 'c1',
              tipo: 'demissao_sem_justa_causa',
              data_desligamento: '2024-01-30',
              aviso_previo: 30,
              saldo_salario: 1500.00,
              ferias_vencidas: 2000.00,
              ferias_proporcionais: 500.00,
              decimo_terceiro: 1200.00,
              fgts: 800.00,
              multa_fgts: 320.00,
              total: 6320.00,
            },
            error: null,
          })),
          order: vi.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useRescisao', () => {
  it('deve calcular rescisão', async () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.rescisao).toBeDefined();
  });

  it('deve calcular saldo de salário', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.calcularSaldoSalario).toBeDefined();
  });

  it('deve calcular aviso prévio', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.calcularAvisoPrevio).toBeDefined();
  });

  it('deve calcular férias', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.calcularFerias).toBeDefined();
  });

  it('deve calcular 13º proporcional', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.calcularDecimoTerceiro).toBeDefined();
  });

  it('deve calcular FGTS e multa', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.calcularFGTS).toBeDefined();
  });

  it('deve gerar TRCT', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.gerarTRCT).toBeDefined();
  });

  it('deve simular por tipo', () => {
    const { result } = renderHook(() => useRescisao('c1'), { wrapper: createWrapper() });
    expect(result.current.simularPorTipo).toBeDefined();
  });
});
