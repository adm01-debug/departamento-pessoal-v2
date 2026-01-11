// V15-452
import { useState, useCallback } from 'react';
export function useSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const select = useCallback((id: string) => setSelectedIds(prev => new Set(prev).add(id)), []);
  const deselect = useCallback((id: string) => { setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; }); }, []);
  const toggle = useCallback((id: string) => { setSelectedIds(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; }); }, []);
  const selectAll = useCallback(() => setSelectedIds(new Set(items.map(i => i.id))), [items]);
  const deselectAll = useCallback(() => setSelectedIds(new Set()), []);
  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);
  const selectedItems = items.filter(i => selectedIds.has(i.id));
  return { selectedIds, selectedItems, select, deselect, toggle, selectAll, deselectAll, isSelected, hasSelection: selectedIds.size > 0, allSelected: selectedIds.size === items.length && items.length > 0 };
}
