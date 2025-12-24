import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePermissoes } from '@/hooks/usePermissoes';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user1', email: 'test@test.com' },
    isAuthenticated: true,
  }),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { roles: ['admin', 'rh'] },
            error: null,
          })),
        })),
      })),
    })),
  },
}));

describe('usePermissoes', () => {
  it('deve retornar permissões do usuário', async () => {
    const { result } = renderHook(() => usePermissoes(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.permissoes).toBeDefined();
  });

  it('deve ter função hasPermission', () => {
    const { result } = renderHook(() => usePermissoes(), { wrapper: createWrapper() });
    expect(result.current.hasPermission).toBeDefined();
  });

  it('deve verificar se é admin', () => {
    const { result } = renderHook(() => usePermissoes(), { wrapper: createWrapper() });
    expect(result.current.isAdmin).toBeDefined();
  });

  it('deve ter lista de roles', async () => {
    const { result } = renderHook(() => usePermissoes(), { wrapper: createWrapper() });
    expect(result.current.roles).toBeDefined();
  });

  it('deve verificar permissão específica', () => {
    const { result } = renderHook(() => usePermissoes(), { wrapper: createWrapper() });
    expect(typeof result.current.canAccess).toBe('function');
  });
});
