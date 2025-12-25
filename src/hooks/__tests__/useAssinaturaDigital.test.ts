/**
 * @fileoverview Testes para useAssinaturaDigital
 * @module hooks/__tests__/useAssinaturaDigital.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssinaturaDigital } from '../useAssinaturaDigital';
import type { ReactNode } from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: [], error: null })),
    })),
  },
}));

describe('useAssinaturaDigital', () => {
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
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper });
    
    await waitFor(() => {
      expect(result.current).toBeDefined();
    });
  });
});
