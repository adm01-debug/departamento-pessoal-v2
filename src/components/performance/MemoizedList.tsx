import { memo, useMemo } from 'react';
interface MemoizedListProps<T> { items: T[]; renderItem: (item: T, index: number) => React.ReactNode; keyExtractor: (item: T) => string; className?: string; }
function MemoizedListInner<T>({ items, renderItem, keyExtractor, className }: MemoizedListProps<T>) {
  const renderedItems = useMemo(() => items.map((item, i) => <div key={keyExtractor(item)}>{renderItem(item, i)}</div>), [items, renderItem, keyExtractor]);
  return <div className={className}>{renderedItems}</div>;
}
export const MemoizedList = memo(MemoizedListInner) as typeof MemoizedListInner;
