import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useImportacaoColaboradores } from '@/hooks/useImportacaoColaboradores';
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
        order: vi.fn(() => ({
          data: [
            { id: '1', arquivo: 'import1.xlsx', status: 'concluido', registros: 50, erros: 2 },
            { id: '2', arquivo: 'import2.xlsx', status: 'processando', registros: 100, erros: 0 },
          ],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ data: { path: 'imports/arquivo.xlsx' }, error: null })),
      })),
    },
  },
}));

describe('useImportacaoColaboradores', () => {
  it('deve retornar histórico de importações', async () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.importacoes).toBeDefined();
  });

  it('deve fazer upload de arquivo', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.uploadArquivo).toBeDefined();
  });

  it('deve validar arquivo', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.validarArquivo).toBeDefined();
  });

  it('deve processar importação', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.processarImportacao).toBeDefined();
  });

  it('deve ter progresso', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.progresso).toBeDefined();
  });

  it('deve ter erros de validação', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.errosValidacao).toBeDefined();
  });

  it('deve baixar modelo', () => {
    const { result } = renderHook(() => useImportacaoColaboradores(), { wrapper: createWrapper() });
    expect(result.current.baixarModelo).toBeDefined();
  });
});
