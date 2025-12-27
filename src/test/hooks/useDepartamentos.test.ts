import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDepartamentos } from '@/hooks/useDepartamentos';
vi.mock('@/services/departamentosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useDepartamentos', () => { it('retorna departamentos', () => { const { result } = renderHook(() => useDepartamentos()); expect(result.current.departamentos).toBeDefined(); }); });
