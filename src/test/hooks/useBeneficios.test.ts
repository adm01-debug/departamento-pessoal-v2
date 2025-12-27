import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useBeneficios } from '@/hooks/useBeneficios';
vi.mock('@/services/beneficiosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useBeneficios', () => {
  it('retorna benefícios', () => { const { result } = renderHook(() => useBeneficios()); expect(result.current.beneficios).toBeDefined(); });
});
