import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useAriaExpanded } from '@/hooks/useAriaExpanded';
describe('useAriaExpanded', () => {
  it('inicializa fechado', () => { const { result } = renderHook(() => useAriaExpanded()); expect(result.current.isExpanded).toBe(false); });
  it('alterna estado', () => { const { result } = renderHook(() => useAriaExpanded()); act(() => { result.current.toggle(); }); expect(result.current.isExpanded).toBe(true); });
});
