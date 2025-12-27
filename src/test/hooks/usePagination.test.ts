import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '@/hooks/usePagination';
describe('usePagination', () => { it('gerencia paginação', () => { const { result } = renderHook(() => usePagination({ total: 100, pageSize: 10 })); expect(result.current.currentPage).toBe(1); act(() => { result.current.goToPage(2); }); expect(result.current.currentPage).toBe(2); }); });
