import { renderHook } from '@testing-library/react';
import { useVirtualList } from '../useVirtualList';

describe('useVirtualList', () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));

  it('should return virtualized items', () => {
    const { result } = renderHook(() => useVirtualList({
      items,
      itemHeight: 50,
      containerHeight: 500,
    }));
    
    expect(result.current.virtualItems).toBeDefined();
    expect(result.current.virtualItems.length).toBeLessThan(items.length);
  });

  it('should calculate total height', () => {
    const { result } = renderHook(() => useVirtualList({
      items,
      itemHeight: 50,
      containerHeight: 500,
    }));
    
    expect(result.current.totalHeight).toBe(items.length * 50);
  });

  it('should return container props', () => {
    const { result } = renderHook(() => useVirtualList({
      items,
      itemHeight: 50,
      containerHeight: 500,
    }));
    
    expect(result.current.containerProps).toBeDefined();
    expect(result.current.containerProps.style).toBeDefined();
  });

  it('should handle empty items array', () => {
    const { result } = renderHook(() => useVirtualList({
      items: [],
      itemHeight: 50,
      containerHeight: 500,
    }));
    
    expect(result.current.virtualItems).toEqual([]);
    expect(result.current.totalHeight).toBe(0);
  });

  it('should handle overscan correctly', () => {
    const { result } = renderHook(() => useVirtualList({
      items,
      itemHeight: 50,
      containerHeight: 500,
      overscan: 5,
    }));
    
    expect(result.current.virtualItems.length).toBeGreaterThan(500 / 50);
  });
});
