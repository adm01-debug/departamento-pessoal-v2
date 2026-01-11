// V16-054: Tests for useColaboradores Hook
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useColaboradores, useColaborador } from '@/hooks/useColaboradores.real';
import { colaboradorServiceReal } from '@/services/colaboradorService.real';
import React from 'react';

vi.mock('@/services/colaboradorService.real');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useColaboradores', () => {
  it('should fetch colaboradores', async () => {
    const mockData = [{ id: '1', nome: 'Test' }];
    vi.mocked(colaboradorServiceReal.getAll).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useColaboradores({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('should handle loading state', () => {
    vi.mocked(colaboradorServiceReal.getAll).mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useColaboradores({}), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useColaborador', () => {
  it('should fetch single colaborador', async () => {
    const mockData = { id: '1', nome: 'Test User' };
    vi.mocked(colaboradorServiceReal.getById).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useColaborador('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('should not fetch without id', () => {
    const { result } = renderHook(() => useColaborador(undefined), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
