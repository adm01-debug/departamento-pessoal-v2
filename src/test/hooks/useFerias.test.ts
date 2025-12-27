import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFerias } from '@/hooks/useFerias';
vi.mock('@/services/feriasService', () => ({ getAll: vi.fn().mockResolvedValue([]) }));
describe('useFerias', () => { it('retorna férias', () => { const { result } = renderHook(() => useFerias()); expect(result.current.ferias).toBeDefined(); }); });
