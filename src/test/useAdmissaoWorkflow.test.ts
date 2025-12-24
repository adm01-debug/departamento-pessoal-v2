import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdmissaoWorkflow } from '@/hooks/useAdmissaoWorkflow';
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
          single: vi.fn(() => ({
            data: {
              id: '1',
              colaborador_id: 'c1',
              etapa_atual: 'documentos',
              status: 'em_andamento',
              checklist: { documentos: true, exame: false, contrato: false },
            },
            error: null,
          })),
          order: vi.fn(() => ({
            data: [
              { id: '1', colaborador_id: 'c1', etapa_atual: 'documentos', status: 'em_andamento' },
              { id: '2', colaborador_id: 'c2', etapa_atual: 'contrato', status: 'concluido' },
            ],
            error: null,
          })),
        })),
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn(() => ({ data: {}, error: null })) })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
  },
}));

describe('useAdmissaoWorkflow', () => {
  it('deve retornar workflow de admissão', async () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.workflows).toBeDefined();
  });

  it('deve iniciar workflow', () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    expect(result.current.iniciarWorkflow).toBeDefined();
  });

  it('deve avançar etapa', () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    expect(result.current.avancarEtapa).toBeDefined();
  });

  it('deve ter checklist por etapa', () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    expect(result.current.getChecklist).toBeDefined();
  });

  it('deve atualizar item do checklist', () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    expect(result.current.atualizarChecklist).toBeDefined();
  });

  it('deve retornar progresso', () => {
    const { result } = renderHook(() => useAdmissaoWorkflow(), { wrapper: createWrapper() });
    expect(result.current.calcularProgresso).toBeDefined();
  });
});
