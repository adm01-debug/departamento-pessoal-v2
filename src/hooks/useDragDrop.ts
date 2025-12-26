import { useState, useCallback } from 'react';
export function useDragDrop<T extends { id: string }>(initialItems: T[]) {
  const [items, setItems] = useState(initialItems);
  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  const onDragStart = useCallback((item: T) => setDraggedItem(item), []);
  const onDragEnd = useCallback(() => setDraggedItem(null), []);
  const onDrop = useCallback((targetIndex: number) => { if (!draggedItem) return; const newItems = items.filter(i => i.id !== draggedItem.id); newItems.splice(targetIndex, 0, draggedItem); setItems(newItems); setDraggedItem(null); }, [draggedItem, items]);
  return { items, draggedItem, onDragStart, onDragEnd, onDrop };
}
