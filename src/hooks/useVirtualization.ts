import { useState, useCallback, useMemo } from 'react';
export function useVirtualization<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0);
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  const visibleItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop), []);
  return { visibleItems, startIndex, totalHeight: items.length * itemHeight, offsetY: startIndex * itemHeight, onScroll };
}
