/**
 * @fileoverview Testes para useImportacaoColaboradores
 * @module hooks/__tests__/useImportacaoColaboradores.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useImportacaoColaboradores } from '../useImportacaoColaboradores';
import type { ReactNode } from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe('useImportacaoColaboradores', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should initialize correctly', async () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});
