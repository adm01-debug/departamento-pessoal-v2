import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToast } from '@/hooks/use-toast';
describe('useToast', () => {
  it('retorna funções de toast', () => { const { result } = renderHook(() => useToast()); expect(result.current.toast).toBeDefined(); });
  it('adiciona toast', () => { const { result } = renderHook(() => useToast()); act(() => { result.current.toast({ title: 'Test' }); }); });
});
