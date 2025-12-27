import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCargos } from '@/hooks/useCargos';
vi.mock('@/services/cargosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useCargos', () => {
  it('retorna cargos', () => { const { result } = renderHook(() => useCargos()); expect(result.current.cargos).toBeDefined(); });
});
