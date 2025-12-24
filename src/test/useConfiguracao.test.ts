import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConfiguracao } from '@/hooks/useConfiguracao';
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
        single: vi.fn(() => ({
          data: {
            theme: 'dark',
            language: 'pt-BR',
            notifications: true,
          },
          error: null,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  },
}));

describe('useConfiguracao', () => {
  it('deve retornar configurações', async () => {
    const { result } = renderHook(() => useConfiguracao(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.config).toBeDefined();
  });

  it('deve ter função de atualizar configuração', () => {
    const { result } = renderHook(() => useConfiguracao(), { wrapper: createWrapper() });
    expect(result.current.updateConfig).toBeDefined();
  });

  it('deve ter tema atual', () => {
    const { result } = renderHook(() => useConfiguracao(), { wrapper: createWrapper() });
    expect(result.current.theme).toBeDefined();
  });

  it('deve ter idioma atual', () => {
    const { result } = renderHook(() => useConfiguracao(), { wrapper: createWrapper() });
    expect(result.current.language).toBeDefined();
  });

  it('deve resetar para padrão', () => {
    const { result } = renderHook(() => useConfiguracao(), { wrapper: createWrapper() });
    expect(result.current.resetToDefaults).toBeDefined();
  });
});
