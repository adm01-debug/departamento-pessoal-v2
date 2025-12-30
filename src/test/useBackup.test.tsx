import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBackup } from '@/hooks/useBackup';
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
            { id: '1', created_at: '2024-01-15', status: 'completed', size: 1024 },
            { id: '2', created_at: '2024-01-10', status: 'completed', size: 2048 },
          ],
          error: null,
        })),
      })),
    })),
    functions: {
      invoke: vi.fn(() => ({ data: { url: 'https://backup.url' }, error: null })),
    },
  },
}));

describe('useBackup', () => {
  it('deve retornar lista de backups', async () => {
    const { result } = renderHook(() => useBackup(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.backups).toBeDefined();
  });

  it('deve ter função de criar backup', () => {
    const { result } = renderHook(() => useBackup(), { wrapper: createWrapper() });
    expect(result.current.createBackup).toBeDefined();
  });

  it('deve ter função de restaurar backup', () => {
    const { result } = renderHook(() => useBackup(), { wrapper: createWrapper() });
    expect(result.current.restoreBackup).toBeDefined();
  });

  it('deve ter função de download', () => {
    const { result } = renderHook(() => useBackup(), { wrapper: createWrapper() });
    expect(result.current.downloadBackup).toBeDefined();
  });

  it('deve ter último backup', () => {
    const { result } = renderHook(() => useBackup(), { wrapper: createWrapper() });
    expect(result.current.lastBackup).toBeDefined();
  });
});
