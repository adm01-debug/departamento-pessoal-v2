import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useBackup } from '@/hooks/useBackup';
describe('useBackup', () => {
  it('gerencia backup', () => { const { result } = renderHook(() => useBackup()); expect(result.current.createBackup).toBeDefined(); });
  it('cria backup', async () => { const { result } = renderHook(() => useBackup()); await act(async () => { await result.current.createBackup(); }); });
});
