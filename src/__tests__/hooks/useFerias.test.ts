// V16-056: Tests for useFerias Hook
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useFerias, useFeriasVencendo, useProgramarFerias } from '@/hooks/useFerias.real';
import { feriasServiceReal } from '@/services/feriasService.real';
import React from 'react';

vi.mock('@/services/feriasService.real');

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useFerias', () => {
  it('should fetch ferias list', async () => {
    const mockData = [{ id: '1', status: 'pendente' }];
    vi.mocked(feriasServiceReal.getAll).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useFerias({}), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe('useFeriasVencendo', () => {
  it('should fetch expiring ferias', async () => {
    const mockData = [{ id: '1', colaborador: { nome: 'Test' } }];
    vi.mocked(feriasServiceReal.getVencendo).mockResolvedValue(mockData as any);

    const { result } = renderHook(() => useFeriasVencendo('emp-1', 60), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useProgramarFerias', () => {
  it('should schedule ferias', async () => {
    vi.mocked(feriasServiceReal.programar).mockResolvedValue({ id: '1', status: 'programada' } as any);

    const { result } = renderHook(() => useProgramarFerias(), { wrapper: createWrapper() });

    result.current.mutate({ id: '1', inicio: '2025-02-01', dias: 30 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
