/**
 * @fileoverview Testes para useDesligamentos
 * @module hooks/__tests__/useDesligamentos.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDesligamentos } from '../useDesligamentos';
import type { ReactNode } from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe('useDesligamentos', () => {
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
    const { result } = renderHook(() => useDesligamentos(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});
