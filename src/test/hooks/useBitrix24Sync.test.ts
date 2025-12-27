import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useBitrix24Sync } from '@/hooks/useBitrix24Sync';
describe('useBitrix24Sync', () => {
  it('gerencia sync', () => { const { result } = renderHook(() => useBitrix24Sync()); expect(result.current.syncStatus).toBeDefined(); });
  it('inicia sync', async () => { const { result } = renderHook(() => useBitrix24Sync()); await act(async () => { await result.current.startSync(); }); });
});
