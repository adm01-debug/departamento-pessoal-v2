import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAfastamentos } from '@/hooks/useAfastamentos';
vi.mock('@/services/afastamentosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useAfastamentos', () => {
  it('retorna afastamentos', () => { const { result } = renderHook(() => useAfastamentos()); expect(result.current.afastamentos).toBeDefined(); });
});
