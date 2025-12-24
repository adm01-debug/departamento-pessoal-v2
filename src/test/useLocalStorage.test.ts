import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve retornar valor inicial quando localStorage está vazio', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    expect(result.current[0]).toBe('valorInicial');
  });

  it('deve retornar valor do localStorage se existir', () => {
    localStorage.setItem('testKey', JSON.stringify('valorExistente'));
    const { result } = renderHook(() => useLocalStorage('testKey', 'valorInicial'));
    expect(result.current[0]).toBe('valorExistente');
  });

  it('deve atualizar localStorage quando valor muda', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'inicial'));
    
    act(() => {
      result.current[1]('novoValor');
    });
    
    expect(result.current[0]).toBe('novoValor');
    expect(JSON.parse(localStorage.getItem('testKey') || '')).toBe('novoValor');
  });

  it('deve funcionar com objetos complexos', () => {
    const valorInicial = { nome: 'teste', count: 0 };
    const { result } = renderHook(() => useLocalStorage('testKey', valorInicial));
    
    expect(result.current[0]).toEqual(valorInicial);
    
    act(() => {
      result.current[1]({ nome: 'atualizado', count: 1 });
    });
    
    expect(result.current[0]).toEqual({ nome: 'atualizado', count: 1 });
  });

  it('deve aceitar função como valor', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 0));
    
    act(() => {
      result.current[1]((prev: number) => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
  });
});
