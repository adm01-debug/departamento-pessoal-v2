import { useState, useRef, useCallback, useMemo } from 'react';
interface VirtualListProps<T> { items: T[]; itemHeight: number; containerHeight: number; renderItem: (item: T, index: number) => React.ReactNode; overscan?: number; }
export function VirtualList<T>({ items, itemHeight, containerHeight, renderItem, overscan = 3 }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startIndex = useMemo(() => Math.max(0, Math.floor(scrollTop / itemHeight) - overscan), [scrollTop, itemHeight, overscan]);
  const endIndex = useMemo(() => Math.min(items.length - 1, Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan), [scrollTop, containerHeight, itemHeight, items.length, overscan]);
  const visibleItems = useMemo(() => items.slice(startIndex, endIndex + 1), [items, startIndex, endIndex]);
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => setScrollTop(e.currentTarget.scrollTop), []);
  return (<div ref={containerRef} style={{ height: containerHeight, overflow: 'auto' }} onScroll={onScroll}><div style={{ height: items.length * itemHeight, position: 'relative' }}><div style={{ transform: `translateY(${startIndex * itemHeight}px)` }}>{visibleItems.map((item, i) => <div key={startIndex + i} style={{ height: itemHeight }}>{renderItem(item, startIndex + i)}</div>)}</div></div></div>);
}
