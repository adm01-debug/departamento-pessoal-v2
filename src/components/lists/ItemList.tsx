/**
 * @fileoverview Lista de itens
 * @module components/lists/ItemList
 */
import { memo } from 'react';

interface ItemListProps<T> { items: T[]; renderItem: (item: T, index: number) => React.ReactNode; keyExtractor: (item: T) => string; emptyMessage?: string; }

export const ItemList = memo(function ItemList<T>({ items, renderItem, keyExtractor, emptyMessage = 'Nenhum item' }: ItemListProps<T>) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage}</p>;
  return <div className="space-y-2">{items.map((item, idx) => <div key={keyExtractor(item)}>{renderItem(item, idx)}</div>)}</div>;
}) as <T>(props: ItemListProps<T>) => React.ReactElement;
