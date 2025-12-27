import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useColaboradores } from '@/hooks/useColaboradores';
vi.mock('@/services/colaboradoresService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useColaboradores', () => {
  it('retorna colaboradores', () => { const { result } = renderHook(() => useColaboradores()); expect(result.current.colaboradores).toBeDefined(); });
});
