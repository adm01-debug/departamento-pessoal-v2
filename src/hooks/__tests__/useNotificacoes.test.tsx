import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotificacoes } from '../useNotificacoes';
import type { ReactNode } from 'react';
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: vi.fn(() => ({ select: vi.fn(() => Promise.resolve({ data: [], error: null })) })) } }));
describe('useNotificacoes', () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (<QueryClientProvider client={qc}>{children}</QueryClientProvider>);
  it('should initialize', async () => { const { result } = renderHook(() => useNotificacoes(), { wrapper }); await waitFor(() => { expect(result.current).toBeDefined(); }); });
});
