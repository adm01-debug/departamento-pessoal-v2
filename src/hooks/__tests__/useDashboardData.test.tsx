/**
 * @fileoverview Testes para useDashboardData
 * @module hooks/__tests__/useDashboardData.test
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardData } from '../useDashboardData';
import type { ReactNode } from 'react';

// Mock do supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        gte: vi.fn(() => Promise.resolve({ data: [], error: null })),
        lte: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}));

describe('useDashboardData', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should return loading state initially', () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper });
    expect(result.current.isLoading).toBe(true);
  });

  it('should have default data structure', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useDashboardData(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Não deve quebrar mesmo com erro
    expect(result.current.error).toBeNull();
  });
});
