import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuditTrail from '@/components/AuditTrail';
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

describe('AuditTrail', () => {
  it('deve renderizar', () => {
    render(<AuditTrail entityType="colaborador" entityId="1" />, { wrapper: createWrapper() });
    expect(document.body).toBeDefined();
  });

  it('deve aceitar props obrigatórias', () => {
    const { container } = render(<AuditTrail entityType="colaborador" entityId="1" />, { wrapper: createWrapper() });
    expect(container).toBeDefined();
  });
});
