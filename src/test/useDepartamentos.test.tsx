import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDepartamentos } from '@/hooks/useDepartamentos';
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
            { id: 'dep1', nome: 'TI', empresa_id: 'emp1', gestor_id: 'gest1' },
            { id: 'dep2', nome: 'RH', empresa_id: 'emp1', gestor_id: 'gest2' },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })) })),
      delete: vi.fn(() => ({ eq: vi.fn() })),
    })),
  },
}));

describe('useDepartamentos', () => {
  it('deve retornar lista de departamentos', async () => {
    const { result } = renderHook(() => useDepartamentos(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.departamentos).toBeDefined();
  });

  it('deve ter função de criar departamento', () => {
    const { result } = renderHook(() => useDepartamentos(), { wrapper: createWrapper() });
    expect(result.current.createDepartamento).toBeDefined();
  });

  it('deve ter função de atualizar departamento', () => {
    const { result } = renderHook(() => useDepartamentos(), { wrapper: createWrapper() });
    expect(result.current.updateDepartamento).toBeDefined();
  });

  it('deve ter função de deletar departamento', () => {
    const { result } = renderHook(() => useDepartamentos(), { wrapper: createWrapper() });
    expect(result.current.deleteDepartamento).toBeDefined();
  });
});
