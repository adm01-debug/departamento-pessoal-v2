/**
 * @fileoverview Testes para useAuditoriaIntegration
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuditoriaIntegration } from '../useAuditoriaIntegration';
import type { ReactNode } from 'react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => Promise.resolve({ data: [], error: null })) })) },
}));

describe('useAuditoriaIntegration', () => {
  let queryClient: QueryClient;
  beforeEach(() => { queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } }); });
  const wrapper = ({ children }: { children: ReactNode }) => (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);
  it('should initialize', async () => {
    const { result } = renderHook(() => useAuditoriaIntegration(), { wrapper });
    await waitFor(() => { expect(result.current).toBeDefined(); });
  });
});
