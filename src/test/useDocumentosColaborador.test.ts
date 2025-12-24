import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocumentosColaborador } from '@/hooks/useDocumentosColaborador';
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
          order: vi.fn(() => ({
            data: [
              { id: '1', colaborador_id: 'c1', tipo: 'rg', arquivo: 'rg.pdf', status: 'valido' },
              { id: '2', colaborador_id: 'c1', tipo: 'cpf', arquivo: 'cpf.pdf', status: 'valido' },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ data: { path: 'documentos/doc.pdf' }, error: null })),
        download: vi.fn(() => ({ data: new Blob(), error: null })),
        remove: vi.fn(() => ({ data: null, error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://storage.com/doc.pdf' } })),
      })),
    },
  },
}));

describe('useDocumentosColaborador', () => {
  it('deve retornar documentos do colaborador', async () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.documentos).toBeDefined();
  });

  it('deve fazer upload de documento', () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    expect(result.current.uploadDocumento).toBeDefined();
  });

  it('deve baixar documento', () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    expect(result.current.downloadDocumento).toBeDefined();
  });

  it('deve deletar documento', () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    expect(result.current.deletarDocumento).toBeDefined();
  });

  it('deve validar documento', () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    expect(result.current.validarDocumento).toBeDefined();
  });

  it('deve ter documentos pendentes', () => {
    const { result } = renderHook(() => useDocumentosColaborador('c1'), { wrapper: createWrapper() });
    expect(result.current.documentosPendentes).toBeDefined();
  });
});
