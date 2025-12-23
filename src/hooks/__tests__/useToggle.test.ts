import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../useToggle';

describe('useToggle', () => {
  it('deve iniciar com valor false por padrão', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('deve iniciar com valor inicial fornecido', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('deve alternar o valor ao chamar toggle', () => {
    const { result } = renderHook(() => useToggle(false));
    
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('deve definir valor específico', () => {
    const { result } = renderHook(() => useToggle(false));
    
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
