import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useESocial } from '@/hooks/useESocial';
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
            { id: '1', tipo: 'S-2200', status: 'enviado', data_envio: '2024-01-15' },
            { id: '2', tipo: 'S-2206', status: 'pendente', data_envio: null },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    functions: {
      invoke: vi.fn(() => ({ data: { success: true }, error: null })),
    },
  },
}));

describe('useESocial', () => {
  it('deve retornar eventos do eSocial', async () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.eventos).toBeDefined();
  });

  it('deve ter função de enviar evento', () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    expect(result.current.enviarEvento).toBeDefined();
  });

  it('deve ter função de validar evento', () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    expect(result.current.validarEvento).toBeDefined();
  });

  it('deve ter estatísticas de eventos', () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    expect(result.current.estatisticas).toBeDefined();
  });

  it('deve filtrar por tipo de evento', () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    expect(result.current.filtrarPorTipo).toBeDefined();
  });

  it('deve ter eventos pendentes', () => {
    const { result } = renderHook(() => useESocial(), { wrapper: createWrapper() });
    expect(result.current.eventosPendentes).toBeDefined();
  });
});
