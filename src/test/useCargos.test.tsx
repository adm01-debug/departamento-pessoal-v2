import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCargos } from '@/hooks/useCargos';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
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
            { id: '1', nome: 'Desenvolvedor', departamento_id: 'dep1', salario_base: 5000 },
            { id: '2', nome: 'Analista', departamento_id: 'dep1', salario_base: 4000 },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { id: '3', nome: 'Novo Cargo', departamento_id: 'dep1', salario_base: 6000 },
            error: null,
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              data: { id: '1', nome: 'Cargo Atualizado' },
              error: null,
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  },
}));

describe('useCargos', () => {
  it('deve retornar lista de cargos', async () => {
    const { result } = renderHook(() => useCargos(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.cargos).toBeDefined();
  });

  it('deve ter função de criar cargo', () => {
    const { result } = renderHook(() => useCargos(), { wrapper: createWrapper() });
    expect(result.current.createCargo).toBeDefined();
  });

  it('deve ter função de atualizar cargo', () => {
    const { result } = renderHook(() => useCargos(), { wrapper: createWrapper() });
    expect(result.current.updateCargo).toBeDefined();
  });

  it('deve ter função de deletar cargo', () => {
    const { result } = renderHook(() => useCargos(), { wrapper: createWrapper() });
    expect(result.current.deleteCargo).toBeDefined();
  });
});
