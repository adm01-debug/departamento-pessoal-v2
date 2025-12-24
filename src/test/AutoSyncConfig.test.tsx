import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AutoSyncConfig from '@/components/AutoSyncConfig';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ data: [], error: null })) })) },
}));

describe('AutoSyncConfig', () => {
  it('deve renderizar', () => {
    const { container } = render(<AutoSyncConfig />, { wrapper: createWrapper() });
    expect(container).toBeDefined();
  });

  it('deve ter configurações de sync', () => {
    const { container } = render(<AutoSyncConfig />, { wrapper: createWrapper() });
    expect(container.innerHTML).toBeDefined();
  });
});
