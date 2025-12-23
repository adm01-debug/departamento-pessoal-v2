import { renderHook, act } from '@testing-library/react';
import { useKeyPress } from '../useKeyPress';

describe('useKeyPress', () => {
  it('deve retornar false inicialmente', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));
    expect(result.current).toBe(false);
  });

  it('deve retornar true quando tecla é pressionada', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    
    expect(result.current).toBe(true);
  });

  it('deve retornar false quando tecla é solta', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(result.current).toBe(true);
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    });
    expect(result.current).toBe(false);
  });

  it('não deve reagir a outras teclas', () => {
    const { result } = renderHook(() => useKeyPress('Enter'));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    
    expect(result.current).toBe(false);
  });
});
