import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSelection } from '@/hooks/useSelection';
describe('useSelection', () => { it('gerencia seleção', () => { const { result } = renderHook(() => useSelection()); expect(result.current.selected).toEqual([]); act(() => { result.current.select('1'); }); expect(result.current.selected).toContain('1'); }); });
