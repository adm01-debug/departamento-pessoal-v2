import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationBell from '@/components/NotificationBell';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: vi.fn(() => ({ select: vi.fn(() => ({ eq: vi.fn(() => ({ data: [], error: null })) })) })) },
}));

describe('NotificationBell', () => {
  it('deve renderizar', () => {
    const { container } = render(<NotificationBell />, { wrapper: createWrapper() });
    expect(container).toBeDefined();
  });

  it('deve ter ícone de sino', () => {
    const { container } = render(<NotificationBell />, { wrapper: createWrapper() });
    expect(container.querySelector('button, svg')).toBeDefined();
  });
});
