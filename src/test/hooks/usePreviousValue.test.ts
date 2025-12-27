import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePreviousValue } from '@/hooks/usePreviousValue';
describe('usePreviousValue', () => { it('retorna valor anterior', () => { const { result, rerender } = renderHook(({ val }) => usePreviousValue(val), { initialProps: { val: 1 } }); expect(result.current).toBeUndefined(); rerender({ val: 2 }); expect(result.current).toBe(1); }); });
