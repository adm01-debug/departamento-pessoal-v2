// V16-055: Tests for useFolha Hook
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useFolhas, useFolhaById, useFecharFolha } from '@/hooks/useFolha.real';
import { folhaServiceReal } from '@/services/folhaService.real';
import React from 'react';

vi.mock('@/services/folhaService.real');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useFolhas', () => {
  it('should fetch folhas', async () => {
    const mockData = [{ id: '1', competencia: '2025-01' }];
    vi.mocked(folhaServiceReal.getAll).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useFolhas({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useFolhaById', () => {
  it('should fetch single folha with items', async () => {
    const mockData = { id: '1', competencia: '2025-01', itens: [] };
    vi.mocked(folhaServiceReal.getById).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useFolhaById('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.itens).toBeDefined();
  });
});

describe('useFecharFolha', () => {
  it('should close folha', async () => {
    vi.mocked(folhaServiceReal.fechar).mockResolvedValue({ id: '1', status: 'fechada' } as any);

    const { result } = renderHook(() => useFecharFolha(), { wrapper: createWrapper() });

    result.current.mutate('1');
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
