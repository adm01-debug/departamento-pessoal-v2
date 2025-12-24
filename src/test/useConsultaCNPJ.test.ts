import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConsultaCNPJ } from '@/hooks/useConsultaCNPJ';
import React from 'react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock fetch global
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      razao_social: 'Empresa Teste LTDA',
      nome_fantasia: 'Empresa Teste',
      cnpj: '12345678000190',
      endereco: 'Rua Teste, 123',
      municipio: 'São Paulo',
      uf: 'SP',
      cep: '01310100',
      situacao: 'ATIVA',
    }),
  })
) as vi.Mock;

describe('useConsultaCNPJ', () => {
  it('deve iniciar sem dados', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.dados).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve ter função consultar', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.consultar).toBeDefined();
    expect(typeof result.current.consultar).toBe('function');
  });

  it('deve validar CNPJ', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.validarCNPJ).toBeDefined();
  });

  it('deve formatar CNPJ', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.formatarCNPJ).toBeDefined();
  });

  it('deve limpar dados', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.limpar).toBeDefined();
  });

  it('deve ter estado de erro', () => {
    const { result } = renderHook(() => useConsultaCNPJ(), { wrapper: createWrapper() });
    expect(result.current.error).toBeDefined();
  });
});
