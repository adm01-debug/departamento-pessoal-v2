import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFeriados } from '@/hooks/useFeriados';
vi.mock('@/services/feriadosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useFeriados', () => { it('retorna feriados', () => { const { result } = renderHook(() => useFeriados()); expect(result.current.feriados).toBeDefined(); }); });
