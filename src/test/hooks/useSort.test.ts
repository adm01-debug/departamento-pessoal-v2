import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSort } from '@/hooks/useSort';
describe('useSort', () => { it('ordena dados', () => { const { result } = renderHook(() => useSort([{ id: 2 }, { id: 1 }], 'id')); expect(result.current.sortedData[0].id).toBe(1); }); });
