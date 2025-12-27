import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAdmissoes } from '@/hooks/useAdmissoes';
vi.mock('@/services/admissoesService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useAdmissoes', () => {
  it('retorna admissões', () => { const { result } = renderHook(() => useAdmissoes()); expect(result.current.admissoes).toBeDefined(); });
});
