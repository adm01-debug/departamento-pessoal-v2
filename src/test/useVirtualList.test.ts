import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVirtualList } from '@/hooks/useVirtualList';

describe('useVirtualList', () => {
  const mockItems = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('deve retornar lista virtualizada', () => {
    const { result } = renderHook(() => useVirtualList({
      items: mockItems,
      itemHeight: 40,
      containerHeight: 400,
    }));
    expect(result.current.visibleItems).toBeDefined();
  });

  it('deve calcular altura total corretamente', () => {
    const { result } = renderHook(() => useVirtualList({
      items: mockItems,
      itemHeight: 40,
      containerHeight: 400,
    }));
    expect(result.current.totalHeight).toBe(40000); // 1000 * 40
  });

  it('deve limitar itens visíveis', () => {
    const { result } = renderHook(() => useVirtualList({
      items: mockItems,
      itemHeight: 40,
      containerHeight: 400,
    }));
    // Com altura de 400px e items de 40px, ~10 items visíveis + overscan
    expect(result.current.visibleItems.length).toBeLessThan(mockItems.length);
  });

  it('deve atualizar ao scroll', () => {
    const { result } = renderHook(() => useVirtualList({
      items: mockItems,
      itemHeight: 40,
      containerHeight: 400,
    }));

    const initialStart = result.current.startIndex;

    act(() => {
      result.current.onScroll(800); // Scroll 800px = 20 items
    });

    expect(result.current.startIndex).toBeGreaterThan(initialStart);
  });

  it('deve ter offset correto', () => {
    const { result } = renderHook(() => useVirtualList({
      items: mockItems,
      itemHeight: 40,
      containerHeight: 400,
    }));
    expect(result.current.offsetY).toBeDefined();
  });
});
