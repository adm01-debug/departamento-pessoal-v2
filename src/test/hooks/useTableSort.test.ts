import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTableSort } from '@/hooks/useTableSort';
describe('useTableSort', () => { it('ordena tabela', () => { const { result } = renderHook(() => useTableSort()); expect(result.current.sortColumn).toBeDefined(); act(() => { result.current.setSortColumn('nome'); }); }); });
