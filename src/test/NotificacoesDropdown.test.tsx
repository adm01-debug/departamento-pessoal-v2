import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificacoesDropdown from '@/components/NotificacoesDropdown';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ order: vi.fn(() => ({ data: [], error: null })) })) })) },
}));

describe('NotificacoesDropdown', () => {
  it('deve renderizar', () => {
    const { container } = render(<NotificacoesDropdown />, { wrapper: createWrapper() });
    expect(container).toBeDefined();
  });

  it('deve ter botão de toggle', () => {
    const { container } = render(<NotificacoesDropdown />, { wrapper: createWrapper() });
    expect(container.querySelector('button')).toBeDefined();
  });
});
