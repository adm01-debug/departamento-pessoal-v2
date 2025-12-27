import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCalendario } from '@/hooks/useCalendario';
describe('useCalendario', () => {
  it('retorna data atual', () => { const { result } = renderHook(() => useCalendario()); expect(result.current.currentDate).toBeDefined(); });
  it('navega meses', () => { const { result } = renderHook(() => useCalendario()); act(() => { result.current.nextMonth(); }); });
});
