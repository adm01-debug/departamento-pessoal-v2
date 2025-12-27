import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useEmpresas } from '@/hooks/useEmpresas';
vi.mock('@/services/empresasService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useEmpresas', () => { it('retorna empresas', () => { const { result } = renderHook(() => useEmpresas()); expect(result.current.empresas).toBeDefined(); }); });
