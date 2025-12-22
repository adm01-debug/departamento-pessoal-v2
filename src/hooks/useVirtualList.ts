import { useState, useMemo, useCallback, RefObject } from 'react';

interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

interface VirtualItem<T> {
  item: T;
  index: number;
  style: { position: 'absolute'; top: number; height: number; width: string };
}

interface UseVirtualListReturn<T> {
  virtualItems: VirtualItem<T>[];
  totalHeight: number;
  scrollTo: (index: number) => void;
  onScroll: (scrollTop: number) => void;
}

/**
 * Hook para virtualização de listas grandes
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
}: UseVirtualListOptions<T>): UseVirtualListReturn<T> {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;

  const virtualItems = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems: VirtualItem<T>[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      visibleItems.push({
        item: items[i],
        index: i,
        style: {
          position: 'absolute',
          top: i * itemHeight,
          height: itemHeight,
          width: '100%',
        },
      });
    }

    return visibleItems;
  }, [items, itemHeight, containerHeight, scrollTop, overscan]);

  const scrollTo = useCallback(
    (index: number) => {
      setScrollTop(index * itemHeight);
    },
    [itemHeight]
  );

  const onScroll = useCallback((newScrollTop: number) => {
    setScrollTop(newScrollTop);
  }, []);

  return { virtualItems, totalHeight, scrollTo, onScroll };
}

export default useVirtualList;
