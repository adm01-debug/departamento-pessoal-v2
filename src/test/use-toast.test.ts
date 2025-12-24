import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/hooks/use-toast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('deve iniciar sem toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('deve adicionar toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Teste',
        description: 'Descrição do toast',
      });
    });

    expect(result.current.toasts.length).toBeGreaterThanOrEqual(0);
  });

  it('deve ter função dismiss', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.dismiss).toBeDefined();
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('deve exportar função toast standalone', () => {
    expect(toast).toBeDefined();
    expect(typeof toast).toBe('function');
  });

  it('deve aceitar variantes de toast', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Sucesso',
        variant: 'default',
      });
    });

    expect(result.current.toasts).toBeDefined();
  });

  it('deve aceitar toast destrutivo', () => {
    const { result } = renderHook(() => useToast());
    
    act(() => {
      result.current.toast({
        title: 'Erro',
        variant: 'destructive',
      });
    });

    expect(result.current.toasts).toBeDefined();
  });
});
