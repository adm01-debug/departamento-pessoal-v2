import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAssinaturaDigital } from '@/hooks/useAssinaturaDigital';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [
            { id: '1', documento_id: 'd1', status: 'pendente', hash: 'abc123' },
            { id: '2', documento_id: 'd2', status: 'assinado', hash: 'def456' },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ data: { path: 'assinatura.pdf' }, error: null })),
        download: vi.fn(() => ({ data: new Blob(), error: null })),
      })),
    },
  },
}));

describe('useAssinaturaDigital', () => {
  it('deve retornar assinaturas', async () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.assinaturas).toBeDefined();
  });

  it('deve solicitar assinatura', () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    expect(result.current.solicitarAssinatura).toBeDefined();
  });

  it('deve assinar documento', () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    expect(result.current.assinarDocumento).toBeDefined();
  });

  it('deve validar assinatura', () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    expect(result.current.validarAssinatura).toBeDefined();
  });

  it('deve ter pendentes', () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    expect(result.current.pendentes).toBeDefined();
  });

  it('deve ter histórico', () => {
    const { result } = renderHook(() => useAssinaturaDigital(), { wrapper: createWrapper() });
    expect(result.current.historico).toBeDefined();
  });
});
