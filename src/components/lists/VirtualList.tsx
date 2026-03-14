/**
 * @fileoverview Lista virtualizada
 * @module components/lists/VirtualList
 */
import { memo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface VirtualListProps<T> { items: T[]; height: number; renderItem: (item: T, index: number) => React.ReactNode; }

export const VirtualList = memo(function VirtualList<T>({ items, height, renderItem }: VirtualListProps<T>) {
  return (
    <ScrollArea style={{ height }}>
      <div className="space-y-1">{items.map((item, idx) => <div key={idx}>{renderItem(item, idx)}</div>)}</div>
    </ScrollArea>
  );
}) as <T>(props: VirtualListProps<T>) => React.ReactElement;
