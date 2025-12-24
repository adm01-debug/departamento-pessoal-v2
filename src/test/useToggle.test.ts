import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '@/hooks/useToggle';

describe('useToggle', () => {
  it('deve iniciar com valor false por padrão', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('deve iniciar com valor inicial customizado', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('deve alternar o valor com toggle', () => {
    const { result } = renderHook(() => useToggle());
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('deve definir valor específico com setTrue e setFalse', () => {
    const { result } = renderHook(() => useToggle());
    
    act(() => {
      result.current[2](true);
    });
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[2](false);
    });
    expect(result.current[0]).toBe(false);
  });
});
