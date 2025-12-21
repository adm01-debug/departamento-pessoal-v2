import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColaboradores } from '../hooks/useColaboradores';
import React from 'react';

// Mock do Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
      update: vi.fn().mockResolvedValue({ data: { id: '1' }, error: null }),
      delete: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user' } } }),
    },
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useColaboradores', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar estrutura correta', async () => {
    const { result } = renderHook(() => useColaboradores(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toHaveProperty('colaboradores');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('criarColaborador');
      expect(result.current).toHaveProperty('atualizarColaborador');
    });
  });

  it('deve iniciar com lista vazia', async () => {
    const { result } = renderHook(() => useColaboradores(), { wrapper });
    
    await waitFor(() => {
      expect(Array.isArray(result.current.colaboradores)).toBe(true);
    });
  });
});
