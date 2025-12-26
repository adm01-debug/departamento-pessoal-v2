/**
 * @fileoverview Testes para useConsultaCNPJ
 * @module hooks/__tests__/useConsultaCNPJ.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConsultaCNPJ } from '../useConsultaCNPJ';
import type { ReactNode } from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe('useConsultaCNPJ', () => {
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
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});
