import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useRelatorios } from '@/hooks/useRelatorios';
vi.mock('@/services/relatoriosService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useRelatorios', () => { it('retorna relatórios', () => { const { result } = renderHook(() => useRelatorios()); expect(result.current.relatorios).toBeDefined(); }); });
